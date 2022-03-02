package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.dao.*;
import com.freetalk.freetalk_backend.dto.TopicView;
import com.freetalk.freetalk_backend.entity.*;
import com.freetalk.freetalk_backend.service.TopicService;
import com.freetalk.freetalk_backend.utils.RecommenderSet;
import com.freetalk.freetalk_backend.utils.RecommenderUtil;
import com.freetalk.freetalk_backend.utils.SearchBase;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;


@Service
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicDao topicDao;

    @Autowired
    private  RecommenderUtil recommenderUtil;

    @Autowired
    private CommentDao commentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RecommenderSet recommenderSet;

    @Autowired
    private UserInfoDao userInfoDao;

    @Autowired
    private TopicInfoDao topicInfoDao;

    @Autowired
    private MessageDao messageDao;

    /**
     *
     * @FunctionName: calculateHot
     * @Description: 输入一个话题, 返回新的热度 需要在views likes stars 更新时调用以更新热度
     * @Description: 更新热度的算法（Hacker News算法）：
      * 1.话题评分：浏览数*20+回答数*50+点赞数*30+收藏数*40
      * 2.热度=权重*话题评分/（发布以来经过的时间+1）^1.8
      * 3.权重发布之后默认为1, 管理员可以通过调整权重来调节热榜实现降热度或升热度
      * 4.话题评分分权后期继续调节，亦可以给予管理员调节权力
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    private double calculateHot(TopicInfo topicInfo){
        double weight=topicInfo.getWeight();
        Integer views=topicInfo.getViews();
        Integer likes=topicInfo.getLikes();
        Integer stars=topicInfo.getStars();
        Integer comments=topicInfo.getComments();
        long score=views*20+likes*30+stars*40+comments*50;

        Timestamp postTime=topicDao.findTopicByTopicId(topicInfo.getTopicId()).getPostTime();
        Timestamp nowTime = new Timestamp(System.currentTimeMillis());
        long deltaHour=((nowTime.getTime()-postTime.getTime())/(1000*60*60)+1);

        return weight*score/(Math.pow(deltaHour,2));

    }

    @Override
    public List<Topic> getTopics() {
        return topicDao.getTopics();
    }


    @Override
    public Topic saveATopic(Topic topic) {
        return topicDao.saveATopic(topic);
    }

    @Override
    public TopicView getATopicView (Integer topicId){
        Topic topic=topicDao.findTopicByTopicId(topicId);
        return new TopicView(topic);
    }

    @Override
    public void addATopic(Map<String, Object> map) {
        String title = (String) map.get("title");
        String description = (String) map.get("topic_description");
        Integer userId = (Integer) map.get("userId");
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        String sql="insert into topics (post_time, title, topic_description, user_id)\n" +
                "values ('" +
                timestamp +
                "','"+title+"'" +
                ",'"+description+"'" +
                ","+userId +
                ");";
        jdbcTemplate.update(sql);
        AtomicInteger k = new AtomicInteger();
        jdbcTemplate.query("select last_insert_id()",
                rs -> {
                    k.set(rs.getInt(1));
                }
        );

        sql="insert into topic_info (topic_id,likes,stars,comments,views,hot,weight) \n" +
                "values (" +
                k +
                "," +
                "0,0,0,0,0,1)";
        jdbcTemplate.update(sql);

        System.out.println("add a topic");
    }

    @Override
    public void starATopic(Integer topicId, Integer userId) {
        /*
            2021.7.28 15:33
            修复bug：关注时topic与user中只更新了一方的表。
        */
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List <Topic> topics =user.getTopicsStar();
        Topic topic=topicDao.findTopicByTopicId(topicId);
        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(topicId);
        Integer stars=topicInfo.getStars();

        stars+=1;

        topics.add(topic);

        topicInfo.setStars(stars);
        topic.setTopicInfo(topicInfo);

        user.setTopicsStar(topics);
        topicDao.saveATopic(topic);
        userDao.saveAUser(user);
    }

    @Override
    public void undoStarATopic(Integer topicId, Integer userId) {
        /*
            2021.7.28 15:44
            修复bug：取消关注时topic与user中只更新数量，未更新表。
        */
        Topic topic = topicDao.findTopicByTopicId(topicId);
        User user = userDao.findUserByUserId(userId);
        List<Topic> topicStarList = user.getTopicsStar();
        topicStarList.removeIf(topic1 -> topic1.getTopicId().equals(topicId));//要注意的是要先删除列表中的topic 再更新topic信息
        user.setTopicsStar(topicStarList);

        List<UserInfo> userInfoList=topic.getUserStarTheTopic();
        TopicInfo topicInfo = topic.getTopicInfo();
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId);
        userInfoList.remove(userInfo);
        topic.setUserStarTheTopic(userInfoList);

        topicInfo.setStars(topicInfo.getStars() - 1);//star-1
        topicInfo.setHot(calculateHot(topicInfo));
        topic.setTopicInfo(topicInfo);

        topicDao.saveATopic(topic);//更新topic的信息
        userDao.saveAUser(user);//更新user的信息
    }

    @Override
    public void likeATopic(Integer topicId, Integer userId) {
         /*
            2021.7.28 15:44
            修复bug：点赞时topic与user中只更新了一方的表。
        */
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List <Topic> topics =user.getTopicsLike();
        Topic topic=topicDao.findTopicByTopicId(topicId);
        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(topicId);
        Integer likes=topicInfo.getLikes();

        likes+=1;

        topics.add(topic);

        topicInfo.setLikes(likes);
        topic.setTopicInfo(topicInfo);

        user.setTopicsLike(topics);
        topicDao.saveATopic(topic);
        userDao.saveAUser(user);
    }

    @Override
    public void undoLikeATopic(Integer topicId, Integer userId) {
        Topic topic = topicDao.findTopicByTopicId(topicId);
        User user = userDao.findUserByUserId(userId);
        List<Topic> topicLikeList = user.getTopicsLike();
        topicLikeList.removeIf(topic1 -> topic1.getTopicId().equals(topicId));//要注意的是要先删除列表中的topic 再更新topic信息
        user.setTopicsLike(topicLikeList);

        List<UserInfo> userInfoList=topic.getUserLikeTheTopic();
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId);
        userInfoList.remove(userInfo);
        topic.setUserLikeTheTopic(userInfoList);

        TopicInfo topicInfo = topic.getTopicInfo();
        topicInfo.setLikes(topicInfo.getLikes() - 1);//like-1
        topic.setTopicInfo(topicInfo);

        topicDao.saveATopic(topic);//更新topic的信息
        userDao.saveAUser(user);//更新user的信息
    }

    @Override
    public boolean checkUserStar(Integer topicId, Integer userId) {//已收藏->true 未收藏->false
        User user = userDao.findUserByUserId(userId);
        Topic topic = topicDao.findTopicByTopicId(topicId);
        List<Topic> topicStarList = user.getTopicsStar();
        return topicStarList.contains(topic);
    }

    @Override
    public boolean checkUserLike(Integer topicId, Integer userId) {//已点赞->true 未点赞->false
        User user = userDao.findUserByUserId(userId);
        Topic topic = topicDao.findTopicByTopicId(topicId);
        List<Topic> topicLikeList = user.getTopicsLike();
        return topicLikeList.contains(topic);
    }
    @Override
    public void browseATopic(Integer topicId){
        Topic topic=topicDao.findTopicByTopicId(topicId);
        TopicInfo topicInfo=topic.getTopicInfo();
        topicInfo.setViews(topicInfo.getViews()+1);//views+1
        topicInfo.setHot(calculateHot(topicInfo));
        topic.setTopicInfo(topicInfo);

        topicDao.saveATopic(topic);//更新topic
    }

    @Override
    public List<TopicView> getTopicViewsByPage(Integer pageNum, Integer pageSize){
        List<Topic> TopicList =topicDao.getTopicsByPage(pageNum,pageSize).getContent();
        List <TopicView> TopicViewList= new ArrayList<>();
        for (Topic topic : TopicList) {
            TopicView topicView = new TopicView(topic);
            TopicViewList.add(topicView);
        }
        return TopicViewList;
    }

    /**
     *
     * @FunctionName: getSearchedTopicViewsByPage
     * @Description: 按照搜索获得话题 获得分页的规则暂时是把所有的topic拿出来
     *               需要对拿出来的topic进行范围限制
     * @author: geyu
     * @date: 2021.7.21
     */
    @Override
    public List<TopicView> getSearchedTopicViewsByPage(
            String search,Integer pageNum,Integer pageSize){
        SearchBase searchBase =SearchBase.getSearchBase();
        List<Topic> TopicList =topicDao.getTopics();//所有topic
        System.out.println(TopicList.size());
        Integer a=1;
        for (Topic topic : TopicList) {
            TopicView topicView = new TopicView(topic);
            searchBase.add(String.valueOf(a),
                    topicView.getTitle(), topicView);
            a++;
        }
        String ids=searchBase.getIds(search);
        System.out.println(ids);
        List <TopicView> topicViews=new ArrayList<>();
        List <Object> objects=searchBase.getObjects(ids);

        if (objects==null) return topicViews;


        int maxPage = objects.size();//分页 // 第一页 0,pageSize
        pageNum=pageNum-1;
        int left=pageNum*pageSize;
        int right=(pageNum+1)*pageSize;
        if (maxPage<= left) return topicViews;
        if (maxPage<= right) right=maxPage;
        objects=objects.subList(left,right);

        System.out.println(objects.size());
        for (Object object : objects) {
            topicViews.add((TopicView) object);
        }
        return topicViews;
    }

    @Override
    public int getSearchedTopicSize(String search){
        SearchBase searchBase =SearchBase.getSearchBase();
        List<Topic> TopicList =topicDao.getTopics();//所有topic
        System.out.println(TopicList.size());
        Integer a=1;
        for (Topic topic : TopicList) {
            TopicView topicView = new TopicView(topic);
            searchBase.add(String.valueOf(a),
                    topicView.getTitle(), topicView);
            a++;
        }
        String ids=searchBase.getIds(search);
        List <Object> objects=searchBase.getObjects(ids);
        return objects.size();
    }

    /**
     *
     * @FunctionName: getTopHotTopics
     * @Description: 按照热度获取Top话题, 参数为话题数目 （此方法已弃用，仅用于调试）
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    @Override
    public  List<TopicView> getTopHotTopics(Integer size){
        List<Topic> topicList= topicDao.getTopicsByPageSortedByHot(1,size);
        List <TopicView> TopicViewList= new ArrayList<>();
        for (Topic topic : topicList) {
            TopicView topicView = new TopicView(topic);
            TopicViewList.add(topicView);
        }
        return TopicViewList;
    }

    /**
     *
     * @FunctionName: getTopHotTopics
     * @Description: 获取推荐列表
     * @author: Liu Yao
     * @date: 2021.7.26
     */
    @Override
    public List<TopicView> getRecommendTopics(Integer userId, Integer size) {
        if(size>topicDao.getTopicNum())
            size=topicDao.getTopicNum().intValue();
        List<TopicView> topicViews=new ArrayList<>();
        List<Integer> recommendResult= recommenderUtil.getRecommendedList(userId);
        int i=0;
        for(Integer topicId:recommendResult)
        {
            int topicFromRecommend=0;
            topicFromRecommend++;
            if(i==size)
                break;
            if(recommenderSet.find(userId,topicId))
                continue;
            System.out.println("recommend:"+topicId);
            if(!topicDao.checkTopicByTopicId(topicId))
            {
                System.out.println("The topic was deleted");
                continue;
            }
            if(topicFromRecommend>recommendResult.size()/2)
                break;
            recommenderSet.put(userId,topicId);
            TopicView topicView=new TopicView(topicDao.findTopicByTopicId(topicId));
            topicViews.add(topicView);
            i++;
        }
        List<TopicView> hotTopicViews=getTopHotTopics(topicDao.getTopicNum().intValue());
        for(TopicView topicView:hotTopicViews)
        {
            if(i==size)
                break;
            if(recommenderSet.find(userId,topicView.getTopicId()))
                continue;
            recommenderSet.put(userId,topicView.getTopicId());
            topicViews.add(topicView);
            i++;
        }

        if(i<size)
        {
            recommenderSet.clearFilterByUserId(userId);
            for(TopicView topicView:hotTopicViews)
            {
                if(i==size)
                    break;
                if(topicViews.contains(topicView))
                    continue;
                if(recommenderSet.find(userId,topicView.getTopicId()))
                    continue;
                recommenderSet.put(userId,topicView.getTopicId());
                topicViews.add(topicView);
                i++;
            }
        }
        return topicViews;
    }
    @Override
    public Long getTopicNum(){
        return topicDao.getTopicNum();
    }

    @Override
    public void delete(Integer topicId){
        Topic topic=topicDao.findTopicByTopicId(topicId);
        Message message=new Message();
        message.setSendUser(userInfoDao.findUserInfoByUserId(1));
        message.setAcceptUser(userInfoDao.findUserInfoByUserId(topic.getUser().getUserId()));
        message.setMessageText("您好。您的话题 “"+topic.getTitle()+"” 因违反社区相关规定已被管理员删除。发布过多违规话题会被禁言，请您遵守社区相关规定");
        message.setSendTime(new Timestamp(System.currentTimeMillis()));
        message.setIsRead(0);
        messageDao.save(message);

        List<UserInfo> userInfoList=topic.getUserLikeTheTopic();
        for(UserInfo userInfo:userInfoList){
            User user=userDao.findUserByUserId(userInfo.getUserId());
            List<Topic> topicList=user.getTopicsLike();
            topicList.removeIf(topic1 -> topic1.equals(topic));
            user.setTopicsLike(topicList);
            userDao.saveAUser(user);
        }
        userInfoList.clear();
        topic.setUserLikeTheTopic(userInfoList);

        List<Comment> commentList=topic.getComments();
        for(Comment comment:commentList)
        {
            List<UserInfo> userInfoList1=new ArrayList<>();
            comment.setUserLikeTheComment(userInfoList1);
            comment.setUserStarTheComment(userInfoList1);
            commentDao.saveAComment(comment);
        }

        List<UserInfo> userInfoList1=topic.getUserStarTheTopic();
        for(UserInfo userInfo:userInfoList1){
            User user=userDao.findUserByUserId(userInfo.getUserId());
            List<Topic> topicList=user.getTopicsStar();
            topicList.removeIf(topic1 -> topic1.equals(topic));
            user.setTopicsStar(topicList);
            userDao.saveAUser(user);
        }
        userInfoList1.clear();
        topic.setUserStarTheTopic(userInfoList1);

        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(topicId);
        topicInfoDao.delete(topicInfo);
        recommenderUtil.addTopicDeletedTopicId(topicId);
        topicDao.delete(topic);
    }

    @Override
    public void changeWeight(Integer topicId,double weight){
        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(topicId);
        topicInfo.setWeight(weight);
        topicInfoDao.save(topicInfo);
    }


}
