package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.TopicInfo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TopicInfoRepository extends JpaRepository<TopicInfo,Integer> {
    TopicInfo findTopicInfoByTopicId(Integer topicId);

}
