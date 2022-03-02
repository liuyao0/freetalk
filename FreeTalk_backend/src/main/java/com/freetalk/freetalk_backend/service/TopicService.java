package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.dto.TopicView;

import java.util.List;
import java.util.Map;

public interface TopicService {


    List<Topic> getTopics();

    List<TopicView> getTopicViewsByPage(Integer pageNum, Integer pageSize);

    List<TopicView> getSearchedTopicViewsByPage(String Search,Integer pageNum,Integer pageSize);

    Topic saveATopic(Topic topic);

    void addATopic(Map<String,Object> map);

    TopicView getATopicView (Integer topicId);

    void browseATopic(Integer topicId);

    void starATopic(Integer topicId,Integer userId);

    void undoStarATopic(Integer topicId,Integer userId);

    void likeATopic(Integer topicId,Integer userId);

    void undoLikeATopic(Integer topicId,Integer userId);

    boolean checkUserStar(Integer topicId,Integer userId);

    boolean checkUserLike(Integer topicId,Integer userId);

    /**
     *
     * @FunctionName: getTopHotTopics
     * @Description: 按照热度获取Top话题, 参数为话题数目
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    List<TopicView> getTopHotTopics(Integer size);

    /**
     *
     * @FunctionName: getRecommendTopics
     * @Description: 获取某个用户的推荐话题列表
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    List<TopicView> getRecommendTopics(Integer userId,Integer size);

    void delete(Integer topicId);


    Long getTopicNum();

    int getSearchedTopicSize(String search);

    void changeWeight(Integer topicId,double weight);
}
