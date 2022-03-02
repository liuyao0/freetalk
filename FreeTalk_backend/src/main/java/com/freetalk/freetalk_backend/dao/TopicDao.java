package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TopicDao {
    List<Topic> getTopics();

    Topic findTopicByTopicId (Integer topicId);

    Page<Topic> getTopicsByPage(Integer pageNum, Integer pageSize);

    Topic saveATopic (Topic topic);

    TopicInfo saveATopicInfo (TopicInfo topicInfo);

    /**
     *
     * @FunctionName: getTopicsByPageSortedByHot
     * @Description: 按照热度分页获取话题
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    List<Topic> getTopicsByPageSortedByHot(Integer pageNum, Integer pageSize);

    Long getTopicNum();

    void delete(Topic topic);

    Boolean checkTopicByTopicId(Integer topicId);

}
