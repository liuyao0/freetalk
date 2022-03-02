package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic,Long> {
    Topic findTopicByTopicId(Integer topicId);
    Boolean existsByTopicId(Integer topicId);
}
