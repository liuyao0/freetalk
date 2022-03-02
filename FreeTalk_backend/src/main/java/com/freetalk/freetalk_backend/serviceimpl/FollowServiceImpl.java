package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.dao.CommentDao;
import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.dao.UserInfoDao;
import com.freetalk.freetalk_backend.dto.CommentUserBind;
import com.freetalk.freetalk_backend.dto.TopicFocusView;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 *
 * @ClassName: FollowService
 * @author: He Jingkai
 * @date: 2021.7.22
 */
@Service
public class FollowServiceImpl implements FollowService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private UserInfoDao userInfoDao;

    @Autowired
    private CommentDao commentDao;

    @Autowired
    private TopicDao topicDao;


    @Override
    public void followAUser(Integer userId,Integer userId_toFollow){
        User user=userDao.findUserByUserId(userId);
        List<UserInfo> userInfos=user.getTheUsersIFollowing();
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId_toFollow);
        if(!userInfos.contains(userInfo))
            userInfos.add(userInfo);
        user.setTheUsersIFollowing(userInfos);
        userDao.saveAUser(user);

        User user_toFollow=userDao.findUserByUserId(userId_toFollow);
        List<UserInfo> userInfos1=user_toFollow.getAllUsersFollowingMe();
        userInfos1.add(userInfoDao.findUserInfoByUserId(userId));
        user_toFollow.setAllUsersFollowingMe(userInfos1);
    }

    @Override
    public void unfollowAUser(Integer userId,Integer userId_toFollow){
        User user=userDao.findUserByUserId(userId);
        List<UserInfo> userInfos=user.getTheUsersIFollowing();
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId_toFollow);
        if(userInfos.contains(userInfo))
            userInfos.removeIf(userInfo1 -> userInfo1.equals(userInfo));
        user.setTheUsersIFollowing(userInfos);
        userDao.saveAUser(user);

        User user_toFollow=userDao.findUserByUserId(userId_toFollow);
        List<UserInfo> userInfos1=user_toFollow.getAllUsersFollowingMe();
        userInfos1.remove(userInfoDao.findUserInfoByUserId(userId));
        user_toFollow.setAllUsersFollowingMe(userInfos1);
    }

    @Override
    public List<UserInfo> getAllUserFollowingMe(Integer userId){
        return userDao.findUserByUserId(userId).getAllUsersFollowingMe();
    }

    @Override
    public List<UserInfo> getAllUserIFollowing(Integer userId){
        return userDao.findUserByUserId(userId).getTheUsersIFollowing();
    }


    @Override
    public boolean checkUserFollow (Integer userId, Integer userId_toFollow){
        List<UserInfo> usersFollowingMe=userDao.findUserByUserId(userId_toFollow).getAllUsersFollowingMe();
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId);
        return usersFollowingMe.contains(userInfo);
    }
    /**
     * @Description: ordered by time
     */
    @Override
    public List<Topic> getTopicOfFollowingUsers(Integer userId){
        List<Topic> topics=new ArrayList<>();
        List<UserInfo> userInfos=userDao.findUserByUserId(userId).getTheUsersIFollowing();
        for(UserInfo userInfo:userInfos)
            topics.addAll(userDao.findUserByUserId(userInfo.getUserId()).getTopics());
        return topics.stream().distinct().sorted().collect(Collectors.toList());
    }

    /**
     * @Description: ordered by time
     */
    @Override
    public List<Comment> getCommentsOfFollowingUsers(Integer userId){
        List<Comment> comments=new ArrayList<>();
        List<UserInfo> userInfos=userDao.findUserByUserId(userId).getTheUsersIFollowing();
        for(UserInfo userInfo:userInfos)
            comments.addAll(userDao.findUserByUserId(userInfo.getUserId()).getComments());
        return comments.stream().distinct().sorted().collect(Collectors.toList());
    }


    /**
     * @Description: ordered by time
     */
    @Override
    public List<CommentUserBind> getUserAnswerMyCommentAndTopic(Integer userId){
        List<CommentUserBind> commentUserBinds=new ArrayList<>();

        /**
         * 获取回复过用户回复的人及其回复
         */
        List<Comment> comments1=userDao.findUserByUserId(userId).getComments();
        for(Comment comment:comments1){
            List<Comment> comments=commentDao.findCommentsByReply_id(comment.getCommentId());
            for(Comment comment1:comments){
                CommentUserBind commentUserBind=new CommentUserBind();
                commentUserBind.setType("xxx reply my answer");
                commentUserBind.setComment(comment1);
                commentUserBind.setCommentBeReplied(comment);
                commentUserBind.setTimestamp(comment1.getSendTime());
                commentUserBinds.add(commentUserBind);
            }
        }

        /**
         * 获取回复过用户话题的人及其回复
         */
        List<Topic> topics=userDao.findUserByUserId(userId).getTopics();
        for(Topic topic:topics){
            List<Comment> comments=topic.getComments();
            for(Comment comment:comments){
                boolean flag=false;
                for (CommentUserBind commentUserBind:commentUserBinds)
                    if(comment.getCommentId().equals(commentUserBind.getComment().getCommentId())){
                        flag=true;
                        break;
                    }
                if (flag)
                    continue;
                CommentUserBind commentUserBind=new CommentUserBind();
                commentUserBind.setType("xxx answer my topic");
                commentUserBind.setComment(comment);
                commentUserBind.setCommentBeReplied(null);
                commentUserBind.setTimestamp(comment.getSendTime());
                commentUserBinds.add(commentUserBind);
            }
        }

        /**
         * 删除自己的回复
         */
        commentUserBinds.removeIf(
                commentUserBind -> commentUserBind.getComment().getUser().equals(
                        userInfoDao.findUserInfoByUserId(userId)
                )
        );

        /**
         * 按照时间排序
         */
        return commentUserBinds.stream().distinct().sorted().collect(Collectors.toList());
    }

    /**
     * @Description: ordered by time
     */
    @Override
    public List<UserInfo> getUserLikeAComment(Integer commentId){
        return commentDao.findCommentByCommentId(commentId).getUserLikeTheComment();
    }

    /**
     * @Description: ordered by time
     */
    @Override
    public List<UserInfo> getUserStarAComment(Integer commentId){
        return commentDao.findCommentByCommentId(commentId).getUserStarTheComment();
    }

    /**
     * @Description: ordered by time
     */
    @Override
    public List<UserInfo> getUserLikeATopic(Integer topicId){
        return topicDao.findTopicByTopicId(topicId).getUserLikeTheTopic();
    }

    /**
     * @Description: ordered by time
     */
    @Override
    public List<UserInfo> getUserStarATopic(Integer topicId){
        return topicDao.findTopicByTopicId(topicId).getUserStarTheTopic();
    }

    @Override
    public List<TopicFocusView> getTopicOfFocusedUsers(Integer userId){
        List<TopicFocusView> topicFocusViews=new ArrayList<>();
        User user=userDao.findUserByUserId(userId);
        List<UserInfo> userInfos=user.getTheUsersIFollowing();
        for(UserInfo userInfo:userInfos){
            List<Topic> topics=userDao.findUserByUserId(userInfo.getUserId()).getTopics();
            for(Topic topic:topics)
                topicFocusViews.add(new TopicFocusView(topic,userInfo));
            List<Comment> comments=userDao.findUserByUserId(userInfo.getUserId()).getComments();
            for(Comment comment:comments)
                topicFocusViews.add(new TopicFocusView(comment,userInfo));
        }
        Set<TopicFocusView> set = new TreeSet<>(Comparator.comparing(TopicFocusView::getTopicId));
        set.addAll(topicFocusViews);
        List<TopicFocusView> topicFocusViewsList=new ArrayList<>(set);
        topicFocusViewsList.sort(Comparator.comparing(TopicFocusView::getTime));
        return topicFocusViewsList;
    }

}
