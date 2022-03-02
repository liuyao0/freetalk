package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.TopicInfo;

public interface TopicInfoDao {
    TopicInfo findTopicInfoByTopic_TopicId(Integer topicId);

    void save(TopicInfo topicInfo);

    void delete(TopicInfo topicInfo);
}
