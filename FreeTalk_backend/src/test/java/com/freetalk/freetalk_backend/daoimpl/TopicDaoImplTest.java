package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import com.freetalk.freetalk_backend.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class TopicDaoImplTest {

    @Autowired
    TopicDao topicDao;
    @Autowired
    TopicRepository topicRepository;

    @Test
    void getTopics() {
        List<Topic> topicList=topicDao.getTopics();
        assertThat(topicRepository.findAll().size(),equalTo(topicList.size()));
    }

    @ParameterizedTest
    @ValueSource(ints = {1,2,3,4,5})
    void findTopicByTopicId(Integer topicId) {
        Topic topic= topicDao.findTopicByTopicId(topicId);
        assertThat(topicRepository.findTopicByTopicId(topicId),equalTo(topic));
    }

    @ParameterizedTest
    @CsvSource(value = {"1|3|3","1|7|6","3|3|0"},delimiter = '|')
    void getTopicsByPage(Integer page,Integer size,Integer expectSize) {
        Page<Topic> topics=topicDao.getTopicsByPage(page,size);
        assertThat(topics.getContent().size(),equalTo(expectSize));
    }

    @Test
    void saveATopic() {
        Topic topic=topicRepository.findTopicByTopicId(1);
        topic.setTitle("TEST");
        topicDao.saveATopic(topic);
        assertThat(topicRepository.findTopicByTopicId(1).getTitle(),equalTo("TEST"));
    }

    @Test
    void saveATopicInfo() {
        TopicInfo topicInfo=topicRepository.findTopicByTopicId(1).getTopicInfo();
        topicInfo.setWeight(0.8);
        topicDao.saveATopicInfo(topicInfo);
        assertThat(topicRepository.findTopicByTopicId(1).getTopicInfo().getWeight(),equalTo(0.8));
    }


    @ParameterizedTest
    @CsvSource(value = {"1|10","1|3","8|1","2|3"},delimiter = '|')
    void getTopicsByPageSortedByHot(Integer page,Integer size) {
        List<Topic> topicViews=topicDao.getTopicsByPageSortedByHot(page,size);
        if(page==1)
        {
            assertThat(topicViews.size(),equalTo(size==10?6:3));
        }
        else if(page==8){
            assertThat(topicViews.size(),equalTo(0));
        }
        else {
            assertThat(topicViews.size(),equalTo(3));
        }
    }

    @Test
    void getTopicNum() {
        Long topicNum=topicDao.getTopicNum();
        assertThat(topicRepository.count(),equalTo(topicNum));
    }
}
