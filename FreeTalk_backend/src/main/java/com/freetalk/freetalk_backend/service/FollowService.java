package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.dto.TopicFocusView;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.dto.CommentUserBind;

import java.util.List;

/**
 *
 * @ClassName: FollowService
 * @author: He Jingkai
 * @date: 2021.7.22
 */
public interface FollowService {
    void followAUser(Integer userId,Integer userId_toFollow);

    void unfollowAUser(Integer userId,Integer userId_toFollow);

    List<UserInfo> getAllUserFollowingMe(Integer userId);

    List<UserInfo> getAllUserIFollowing(Integer userId);

    boolean checkUserFollow (Integer userId, Integer userId_toFollow);
    /**
     * @Description: ordered by time
     */
    List<Topic> getTopicOfFollowingUsers(Integer userId);

    /**
     * @Description: ordered by time
     */
    List<Comment> getCommentsOfFollowingUsers(Integer userId);


    /**
     * @Description: ordered by time
     */
    List<CommentUserBind> getUserAnswerMyCommentAndTopic(Integer userId);

    /**
     * @Description: ordered by time
     */
    List<UserInfo> getUserLikeAComment(Integer commentId);

    /**
     * @Description: ordered by time
     */
    List<UserInfo> getUserStarAComment(Integer commentId);

    /**
     * @Description: ordered by time
     */
    List<UserInfo> getUserLikeATopic(Integer topicId);

    /**
     * @Description: ordered by time
     */
    List<UserInfo> getUserStarATopic(Integer topicId);

    List<TopicFocusView> getTopicOfFocusedUsers(Integer userId);

}
