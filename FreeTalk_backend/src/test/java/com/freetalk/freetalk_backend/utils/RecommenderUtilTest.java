package com.freetalk.freetalk_backend.utils;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.repository.TopicRepository;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class RecommenderUtilTest {
    @Autowired
    RecommenderUtil recommenderUtil;

    @Autowired
    TopicRepository topicRepository;

    @Test
    void doConfiguration() {
        recommenderUtil.doConfiguration();

    }

    @Test
    void calculateRatings() {
        recommenderUtil.calculateRatings();
    }

    @Test
    void train() {
        recommenderUtil.train();
    }

    @RepeatedTest(value = 20)
    void getRecommendedList() {
        List<Integer> topicIdList=recommenderUtil.getRecommendedList(1);
        assertThat(topicIdList!=null,equalTo(true));
        Collection<Integer> collection=new HashSet<>();
        List<Topic> topicList=topicRepository.findAll();
        for(Integer topicId:topicIdList)
            collection.add(topicId);
        for(Integer topicId:topicIdList)
            assertThat(collection.contains(topicId),equalTo(true));
    }
}
