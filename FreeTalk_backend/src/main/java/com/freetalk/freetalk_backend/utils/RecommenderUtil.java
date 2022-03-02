package com.freetalk.freetalk_backend.utils;

import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.dao.UserRatingDao;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserRating;
import com.google.common.hash.BloomFilter;
import lombok.Data;
import net.librec.common.LibrecException;
import net.librec.conf.Configuration;
import net.librec.data.model.TextDataModel;
import net.librec.filter.GenericRecommendedFilter;
import net.librec.recommender.Recommender;
import net.librec.recommender.RecommenderContext;
import net.librec.recommender.cf.UserKNNRecommender;
import net.librec.recommender.item.RecommendedItem;
import net.librec.recommender.item.RecommendedList;
import net.librec.similarity.CosineSimilarity;
import net.librec.similarity.RecommenderSimilarity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.sql.Timestamp;
import java.util.*;

@Component
@Data

public class RecommenderUtil {
    @Value("${spring.datasource.url}")
    String dataSourceUrl;

    @Value("${spring.datasource.username}")
    String dataSourceUserName;

    @Value("${spring.datasource.password}")
    String dataSourcePassword;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RecommenderSet recommenderSet;

    @Autowired
    private UserRatingDao userRatingDao;

    @Autowired
    private TopicDao topicDao;

    private Recommender recommender;

    private Configuration conf;

    private RecommenderUtil recommenderUtil;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Integer likeRating=2;
    private Integer starRating=10;
    private Integer createRating=20;
    private boolean trained=false;

    private Collection<Integer> topicDeletedTopicId;

    public void doConfiguration()
    {
        conf=new Configuration();
//        conf.set("data.convert.jbdc.driverName", "com.mysql.jdbc.Driver");
//        conf.set("data.convert.jbdc.URL", dataSourceUrl);
//        conf.set("data.convert.jbdc.user",dataSourceUserName);
//        conf.set("data.convert.jbdc.password", dataSourcePassword);
//        conf.set("data.convert.jbdc.tableName", "ratings");
//        conf.set("data.convert.jbdc.userColName", "user_id");
//        conf.set("data.convert.jbdc.itemColName", "topic_id");
//        conf.set("data.convert.jbdc.ratingColName", "rating");
//        conf.set("data.convert.jbdc.datetimeColName","post_time");
        conf.set("data.input.path", "ratings.txt");
        conf.set("dfs.data.dir", "./");
        conf.set("data.convertor.binariza.threshold","-1.0");

        conf.set("data.model.splitter", "givenn");
        conf.set("data.splitter.givenn", "user");
        conf.set("data.splitter.givenn.n", "1");
        conf.set("data.column.format","UIRT");
        conf.setBoolean("rec.recommender.isranking", true);

    }

    RecommenderUtil()
    {
        topicDeletedTopicId=new HashSet<>();
    }

    public void addTopicDeletedTopicId(Integer topicId){topicDeletedTopicId.add(topicId);}

    public Boolean checkDeletedByTopicId(Integer topicId){return topicDeletedTopicId.contains(topicId);}

    public void calculateRatings()
    {
        try {
            List<User> userList=userDao.findAll();
            File ratingFile=new File("./ratings.txt");
            if(!ratingFile.exists())
                ratingFile.createNewFile();
            FileWriter fileWriter=new FileWriter(ratingFile);
            BufferedWriter bufferedWriter=new BufferedWriter(fileWriter);

            for(User user:userList)
            {

                Map<Topic,Integer> map=new HashMap<>();
                List<Topic> topicsLikeList=user.getTopicsLike();
                List<Topic> topicsStarList=user.getTopicsStar();
                for(Topic topic:topicsLikeList)
                {
                    if(map.containsKey(topic))
                        map.replace(topic,map.get(topic)+likeRating);
                    else
                        map.put(topic,likeRating);
                }

                for(Topic topic:topicsStarList)
                {
                    if(map.containsKey(topic))
                        map.replace(topic,map.get(topic)+starRating);
                    else
                        map.put(topic,starRating);
                }

                BloomFilter<Integer> bloomFilter=recommenderSet.getBloomFilterByUserId(user.getUserId());
                for(Topic topic:topicsLikeList)
                {
                    if(map.containsKey(topic))
                        map.replace(topic,map.get(topic)+createRating);
                    else
                        map.put(topic,createRating);
                    bloomFilter.put(topic.getTopicId());
                }
                recommenderSet.setBloomFilterByUserId(user.getUserId(),bloomFilter);
                List<UserRating> userRatings=new LinkedList<>();
                for(Map.Entry<Topic,Integer> entry:map.entrySet())
                {
                    Topic topic=entry.getKey();
                    Integer rating=entry.getValue();
                    Integer userId=user.getUserId();
                    Integer topicId=topic.getTopicId();
                    Timestamp postTime=topic.getPostTime();
                    UserRating userRating=new UserRating(userId,topicId,rating,postTime.getTime());
                    System.out.println("user_id:"+userId.toString()+" topic_id"+topicId.toString()+" rating:"+rating.toString());
                    bufferedWriter.write(userId+" "+topicId+" "+rating+" "+postTime.getTime()+"\n");
                }
            }
            bufferedWriter.close();
        }catch (Exception e) {
            e.printStackTrace();
        }

        topicDeletedTopicId.clear();

    }

    @Transactional
    public void train()
    {
        calculateRatings();
        doConfiguration();

        TextDataModel textDataModel = new TextDataModel(conf);
        try {
            textDataModel.buildDataModel();
        } catch (LibrecException librecException) {
            librecException.printStackTrace();
            return;
        }
        RecommenderContext recommenderContext = new RecommenderContext(conf, textDataModel);
        RecommenderSimilarity recommenderSimilarity = new CosineSimilarity();
        recommenderSimilarity.buildSimilarityMatrix(textDataModel);
        recommenderContext.setSimilarity(recommenderSimilarity);

        // training
        conf.set("rec.neighbors.knn.number", "5");
        recommender = new UserKNNRecommender();
        try {
            recommender.train(recommenderContext);
        }
        catch (LibrecException librecException) {
            librecException.printStackTrace();
        }


    }

    public List<Integer> getRecommendedList(Integer userId)
    {
        if(!trained)
        {
            train();
            trained=true;
        }
        List<Integer> recommendTopicIdList=new ArrayList<>();
        RecommendedList recommendedList;
        try
        {
            recommendedList=recommender.recommendRank();
        }
        catch (LibrecException librecException)
        {
            librecException.printStackTrace();
            return new ArrayList<Integer>();
        }

        GenericRecommendedFilter filter=new GenericRecommendedFilter();
        ArrayList userIdList=new ArrayList<>();
        userIdList.add(Integer.toString(userId));
        filter.setUserIdList(userIdList);
        recommendedList.topNRank(topicDao.getTopicNum().intValue());
        List recommendedItemList=recommender.getRecommendedList(recommendedList);
        recommendedItemList=filter.filter(recommendedItemList);
        for(Object o:recommendedItemList)
        {
            RecommendedItem recommendedItem=(RecommendedItem) o;
            System.out.println(recommendedItem.getUserId().toString()+' '+recommendedItem.getItemId().toString());
            recommendTopicIdList.add(Integer.parseInt(recommendedItem.getItemId()));
        }
        return recommendTopicIdList;
    }
}
