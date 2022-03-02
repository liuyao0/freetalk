package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.dto.*;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.service.FollowService;
import com.freetalk.freetalk_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class FollowController {
    @Autowired
    private FollowService followService;
    @Autowired
    private UserService userService;


    /**
     * @Description: 关注一个用户
     */
    @CrossOrigin
    @RequestMapping("/Security/followAUser")
    void followAUser(@RequestParam("userId") Integer userId,
                     @RequestParam("userId_toFollow") Integer userId_toFollow){
        followService.followAUser(userId, userId_toFollow);
    }

    /**
     * @Description: 取关一个用户
     */
    @CrossOrigin
    @RequestMapping("/Security/unfollowAUser")
    void unfollowAUser(@RequestParam("userId") Integer userId,
                       @RequestParam("userId_toFollow") Integer userId_toFollow){
        followService.unfollowAUser(userId, userId_toFollow);
    }

    /**
     * @Description: 获取关注我的所有用户
     */
    @CrossOrigin
    @RequestMapping("/getAllUserFollowingMe")
    List<UserView> getAllUserFollowingMe(@RequestParam("userId") Integer userId){
        User me=userService.findUserByUserId(userId);
        List<UserInfo> userInfos = followService.getAllUserFollowingMe(userId);
        List<UserView> userViews=new ArrayList<>();
        for(UserInfo userInfo:userInfos)
            userViews.add(new UserView(userInfo,me));
        return userViews;
    }

    /**
     * @Description: 获取我关注的所有用户
     */
    @CrossOrigin
    @RequestMapping("/getAllUserIFollowing")
    List<UserView> getAllUserIFollowing(@RequestParam("userId") Integer userId){
        User me=userService.findUserByUserId(userId);
        List<UserInfo> userInfos = followService.getAllUserIFollowing(userId);
        List<UserView> userViews=new ArrayList<>();
        for(UserInfo userInfo:userInfos)
            userViews.add(new UserView(userInfo,me));
        return userViews;
    }

//    /**
//     * @Description: 获取我关注的所有用户的所有话题（按照按时间排序）
//     */
//    @CrossOrigin
//    @RequestMapping("/getTopicOfFollowingUsers")
//    List<Topic> getTopicOfFollowingUsers(@RequestParam("userId") Integer userId){
//        return followService.getTopicOfFollowingUsers(userId);
//    }
//
//    /**
//     * @Description: 获取我关注的所有用户的所有评论（按照按时间排序）
//     */
//    @CrossOrigin
//    @RequestMapping("/getCommentsOfFollowingUsers")
//    List<Comment> getCommentsOfFollowingUsers(@RequestParam("userId") Integer userId){
//        return followService.getCommentsOfFollowingUsers(userId);
//    }

    /**
     * @Description: 获取回复我所有话题和评论的所有评论（按照时间排序）
     */
    @CrossOrigin
    @RequestMapping("/getUserAnswerMyCommentAndTopic")
    List<CommentUserBind> getUserAnswerMyCommentAndTopic(@RequestParam("userId") Integer userId){
        return followService.getUserAnswerMyCommentAndTopic(userId);
    }

    /**
     * @Description: 获取喜欢一个评论的所有用户
     */
    @CrossOrigin
    @RequestMapping("/getUserLikeAComment")
    List<UserInfo> getUserLikeAComment(@RequestParam("commentId") Integer commentId){
        return followService.getUserLikeAComment(commentId);
    }

    /**
     * @Description: 获取关注一个话题的所有用户
     */
    @CrossOrigin
    @RequestMapping("/getUserStarAComment")
    List<UserInfo> getUserStarAComment(@RequestParam("commentId") Integer commentId){
        return followService.getUserStarAComment(commentId);
    }

    /**
     * @Description: 获取用户喜欢的话题
     */
    @CrossOrigin
    @RequestMapping("/getUserLikeATopic")
    List<UserInfo> getUserLikeATopic(@RequestParam("topicId") Integer topicId){
        return followService.getUserLikeATopic(topicId);
    }

    /**
     * @Description: 获取用户喜欢的话题
     */
    @CrossOrigin
    @RequestMapping("/getTopicsUserLike")
    List<Topic> getTopicsUserLike(@RequestParam("userId") Integer userId){
        return userService.findUserByUserId(userId).getTopicsLike();
    }

    /**
     * @Description: 获取用户关注的话题
     */
    @CrossOrigin
    @RequestMapping("/getTopicsUserStar")
    List<TopicView> getTopicsUserStar(@RequestParam("userId") Integer userId){
        List<Topic> topics=userService.findUserByUserId(userId).getTopicsStar();
        List<TopicView> topicViews= new ArrayList<>();
        for (Topic topic:topics)
            topicViews.add(new TopicView(topic));
        return topicViews;
    }

    /**
     * @Description: 获取用户喜欢的回答
     */
    @CrossOrigin
    @RequestMapping("/getCommentsUserLike")
    List<TopicBindCommentView> getCommentsUserLike(@RequestParam("userId") Integer userId){
        List<Comment> comments=userService.findUserByUserId(userId).getCommentsLike();
        List<TopicBindCommentView> topicBindCommentViews=new ArrayList<>();
        for (Comment comment:comments)
            topicBindCommentViews.add(new TopicBindCommentView(comment));
        return topicBindCommentViews;
    }

    /**
     * @Description: 获取用户收藏的回答
     */
    @CrossOrigin
    @RequestMapping("/getCommentsUserStar")
    List<TopicBindCommentView> getCommentsUserStar(@RequestParam("userId") Integer userId){
        List<Comment> comments=userService.findUserByUserId(userId).getCommentsStar();
        List<TopicBindCommentView> topicBindCommentViews=new ArrayList<>();
        for (Comment comment:comments)
            topicBindCommentViews.add(new TopicBindCommentView(comment));
        return topicBindCommentViews;
    }

    /**
     * @Description: 获取用户的全部回答
     */
    @CrossOrigin
    @RequestMapping("/getCommentsUserCreat")
    List<TopicBindCommentView> getCommentsUserCreat(@RequestParam("userId") Integer userId){
        List<Comment> comments=userService.findUserByUserId(userId).getComments();
        List<TopicBindCommentView> topicBindCommentViews=new ArrayList<>();
        for (Comment comment:comments)
            topicBindCommentViews.add(new TopicBindCommentView(comment));
        return topicBindCommentViews;
    }

    /**
     * @Description: 获取用户的全部话题
     */
    @CrossOrigin
    @RequestMapping("/getTopicsUserCreat")
    List<TopicView> getTopicsUserCreat(@RequestParam("userId") Integer userId){
        List<Topic> topics=userService.findUserByUserId(userId).getTopics();
        List<TopicView> topicViews= new ArrayList<>();
        for (Topic topic:topics)
            topicViews.add(new TopicView(topic));
        return topicViews;
    }

    @CrossOrigin
    @RequestMapping("/Security/checkUserFollow")
    boolean checkUserFollow(@RequestParam("userId") Integer userId,
                            @RequestParam("userId_toFollow") Integer userId_toFollow){
        return followService.checkUserFollow(userId,userId_toFollow);
    }

    @CrossOrigin
    @RequestMapping("/getTopicOfFocusedUsers")
    List<TopicFocusView> getTopicOfFocusedUsers(@RequestParam("userId") Integer userId){
        return followService.getTopicOfFocusedUsers(userId);
    }

}
