package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.TopicInfoDao;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import com.freetalk.freetalk_backend.repository.TopicInfoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class TopicInfoDaoImplTest {

    @Autowired
    TopicInfoDao topicInfoDao;
    @Autowired
    TopicInfoRepository topicInfoRepository;
    @Test
    void findTopicInfoByTopic_TopicId() {
        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(1);
        assertThat(topicInfo.getTopicId(),equalTo(1));
        assertThat(topicInfo.getLikes(),equalTo(1));
    }

    @Test
    void save() {
        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(1);
        topicInfo.setComments(10);
        topicInfoDao.save(topicInfo);
        assertThat(topicInfoRepository.findTopicInfoByTopicId(1).getComments(),equalTo(10));
    }
}
