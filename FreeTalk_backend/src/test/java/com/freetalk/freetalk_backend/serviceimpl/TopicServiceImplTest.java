package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dto.TopicView;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.repository.TopicRepository;
import com.freetalk.freetalk_backend.repository.UserInfoRepository;
import com.freetalk.freetalk_backend.repository.UserRepository;
import com.freetalk.freetalk_backend.service.TopicService;
import com.freetalk.freetalk_backend.utils.RecommenderSet;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
//Warning:测试该类会导致推荐系统的布隆过滤器重置！！
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
public class TopicServiceImplTest {

    @Autowired
    private RecommenderSet recommenderSet;

    @Autowired
    private TopicService topicService;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Test
    void getTopics() {
        List<Topic> topicList=topicService.getTopics();
        List<Topic> topicList1=topicRepository.findAll();
        assertThat(topicList1.size(),equalTo(topicList.size()));
        for(Topic topic:topicList)
            assertThat(topicList1.contains(topic),equalTo(true));
    }


    @ParameterizedTest
    @CsvSource(value = {"1|3|3","1|7|6","3|3|0"},delimiter = '|')
    void getTopicViewsByPage(Integer page,Integer size,Integer expectSize) {
        List<TopicView> topicList=topicService.getTopicViewsByPage(page,size);
        assertThat(topicList.size(),equalTo(expectSize));
    }

    @Test
    void saveATopic() {
        Topic topic=topicRepository.findTopicByTopicId(1);
        topic.setTopicDescription("<body><p>Test</p></body>");
        topicService.saveATopic(topic);
        assertThat(topic,equalTo(topicRepository.findTopicByTopicId(1)));
    }

    @Test
    void getATopicView() {
        TopicView topicView=topicService.getATopicView(1);
        Topic topic=topicRepository.findTopicByTopicId(1);
        TopicView topicView1=new TopicView(topic);
        assertThat(topicView1,equalTo(topicView));
    }

    @Test
    void addATopic() {
        Map<String,Object> map=new HashMap<>();
        String title="恭喜上海交通大学亦可赛艇！";
        String description="<body><p>在刚刚结束的女子四人双桨决赛中，上海小囡陈云霞、张灵搭档吕扬、崔晓桐以6分05秒13的成绩，为中国队摘得本届奥运会第10枚金牌！祝贺姑娘们！</p></body>";
        Integer userId=4;
        map.put("title",title);
        map.put("topic_description",description);
        map.put("userId",userId);
        topicService.addATopic(map);
        assertThat(topicRepository.count(),equalTo(7L));
        List<Topic> topicList=topicRepository.findAll();
        for(Topic topic:topicList)
        {
            if(topic.getTopicId()>17)
            {
                assertThat(topic.getTitle(),equalTo(title));
                assertThat(topic.getUser(),equalTo(userRepository.findUserByUserId(userId)));
                assertThat(topic.getTopicDescription(),equalTo(description));
                assertThat(topic.getUserLikeTheTopic().size(),equalTo(0));
                assertThat(topic.getUserStarTheTopic().size(),equalTo(0));
                assertThat(topic.getComments().size(),equalTo(0));
            }
        }
    }

    @Test
    void starATopic() {
        topicService.starATopic(1,4);
        Topic topic=topicRepository.findTopicByTopicId(1);
        UserInfo userInfo=userInfoRepository.findUserInfoByUserId(4);
        User user=userRepository.findUserByUserId(4);

        List<UserInfo> userInfoList=topic.getUserStarTheTopic();
        assertThat(userInfoList.contains(userInfo),equalTo(true));

        List<Topic> topicList=user.getTopicsStar();
        assertThat(topicList.contains(topic),equalTo(true));

        assertThat(topic.getTopicInfo().getStars(),equalTo(2));
    }

    @Test
    void undoStarATopic() {
        topicService.undoStarATopic(1,1);
        Topic topic=topicRepository.findTopicByTopicId(1);
        UserInfo userInfo=userInfoRepository.findUserInfoByUserId(1);
        User user=userRepository.findUserByUserId(1);

        List<UserInfo> userInfoList=topic.getUserStarTheTopic();
        assertThat(userInfoList.contains(userInfoList),equalTo(false));

        List<Topic> topicList=user.getTopicsStar();
        assertThat(topicList.contains(topic),equalTo(false));

        assertThat(topic.getTopicInfo().getStars(),equalTo(0));
    }


    @Test
    void likeATopic() {
        topicService.likeATopic(2,4);
        Topic topic=topicRepository.findTopicByTopicId(2);
        UserInfo userInfo=userInfoRepository.findUserInfoByUserId(4);
        User user=userRepository.findUserByUserId(4);

        List<UserInfo> userInfoList=topic.getUserLikeTheTopic();
        assertThat(userInfoList.contains(userInfo),equalTo(true));

        List<Topic> topicList=user.getTopicsLike();
        assertThat(topicList.contains(topic),equalTo(true));

        assertThat(topic.getTopicInfo().getLikes(),equalTo(1));
    }

    @Test
    void undoLikeATopic() {
        topicService.undoLikeATopic(1,1);
        Topic topic=topicRepository.findTopicByTopicId(1);
        UserInfo userInfo=userInfoRepository.findUserInfoByUserId(1);
        User user=userRepository.findUserByUserId(1);

        List<UserInfo> userInfoList=topic.getUserLikeTheTopic();
        assertThat(userInfoList.contains(userInfo),equalTo(false));

        List<Topic> topicList=user.getTopicsLike();
        assertThat(topicList.contains(topic),equalTo(false));

        assertThat(topic.getTopicInfo().getLikes(),equalTo(0));
    }

    @Test
    void checkUserStar() {
        assertThat(topicService.checkUserStar(1,1),equalTo(true));
        assertThat(topicService.checkUserStar(1,5),equalTo(false));
    }

    @Test
    void checkUserLike() {
        assertThat(topicService.checkUserLike(1,1),equalTo(true));
        assertThat(topicService.checkUserLike(1,5),equalTo(false));
    }

    @ParameterizedTest
    @CsvSource(value = {"1|5","1|3","2|1","5|1","2|3"},delimiter = '|')
    void getSearchedTopicViewsByPage(Integer page,Integer size) {
        List<TopicView> topicViewList = topicService.getSearchedTopicViewsByPage("河童", page, size);
        Collection<String> stringCollection=new HashSet<>();
        for (TopicView topicView : topicViewList)
            stringCollection.add(topicView.getTitle());
        if(page==1)
        {
            assertThat(stringCollection.size(),equalTo(3));
            assertThat(stringCollection.contains("如何看待河童？"),equalTo(true));
            assertThat(stringCollection.contains("河童是嘉心糖吗？"),equalTo(true));
            assertThat(stringCollection.contains("“童河”牌药膏的效果如何？"),equalTo(true));
        }
        else if(page==2&&size==1)
            assertThat(stringCollection.size(),equalTo(1));
        else if(page==5&&size==1)
            assertThat(stringCollection.size(),equalTo(0));
        else if(page==2&&size==2)
            assertThat(stringCollection.size(),equalTo(1));
    }

    @ParameterizedTest
    @ValueSource(ints = {3,10})
    void getTopHotTopics(Integer size) {
        List<TopicView> topicViews=topicService.getTopHotTopics(size);
        if(size==3)
        {
            assertThat(topicViews.size(),equalTo(3));
        }
        else {
            assertThat(topicViews.size(),equalTo(6));
        }
    }

    @RepeatedTest(value = 20)
    void getRecommendTopics() {
        Integer userId=1;
        Integer size=1;

        recommenderSet.reset();
        List<TopicView> topicViewList= topicService.getRecommendTopics(userId,size);
        assertThat(topicViewList.size(),equalTo(1));
        TopicView topicView0=topicViewList.get(0);

        size=2;
        topicViewList=topicService.getRecommendTopics(userId,size);
        assertThat(topicViewList.size(),equalTo(2));
        assertThat(topicViewList.contains(topicView0),equalTo(false));

        size=3;
        topicViewList=topicService.getRecommendTopics(userId,size);
        assertThat(topicViewList.size(),equalTo(3));

        size=10;
        topicViewList=topicService.getRecommendTopics(userId,size);
        assertThat(topicViewList.size(),equalTo(6));
    }

    @Test
    void browseATopic() {
        topicService.browseATopic(1);
        TopicInfo topicInfo=topicRepository.findTopicByTopicId(1).getTopicInfo();
        assertThat(topicInfo.getViews(),equalTo(24));
    }

}
