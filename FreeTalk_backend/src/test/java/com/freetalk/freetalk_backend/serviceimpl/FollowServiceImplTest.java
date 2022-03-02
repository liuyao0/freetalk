package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dto.CommentUserBind;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.repository.CommentRepository;
import com.freetalk.freetalk_backend.repository.TopicRepository;
import com.freetalk.freetalk_backend.repository.UserInfoRepository;
import com.freetalk.freetalk_backend.repository.UserRepository;
import com.freetalk.freetalk_backend.service.FollowService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class FollowServiceImplTest {

    @Autowired
    private FollowService followService;

    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Test
    void followAUser() {
        followService.followAUser(3,1);
        User user=userRepository.getById(3);
        User user_toFollow=userRepository.getById(1);
        assertThat(user.getTheUsersIFollowing().contains(userInfoRepository.findUserInfoByUserId(1)),equalTo(true));
        assertThat(user_toFollow.getAllUsersFollowingMe().contains(userInfoRepository.findUserInfoByUserId(3)),equalTo(true));
    }

    @Test
    void unfollowAUser() {
        followService.unfollowAUser(1,3);
        User user=userRepository.getById(1);
        User user_toUnfollow=userRepository.getById(3);
        assertThat(user.getTheUsersIFollowing().contains(userInfoRepository.findUserInfoByUserId(3)),equalTo(false));
        assertThat(user_toUnfollow.getAllUsersFollowingMe().contains(userInfoRepository.findUserInfoByUserId(1)),equalTo(false));
    }

    @Test
    void getAllUserFollowingMe() {
        int size=followService.getAllUserFollowingMe(4).size();
        assertThat(size,equalTo(2));
    }

    @Test
    void getAllUserIFollowing() {
        int size=followService.getAllUserIFollowing(1).size();
        assertThat(size,equalTo(4));
    }

    @Test
    void checkUserFollow() {
        boolean ifFollow=followService.checkUserFollow(1,2);
        assertThat(ifFollow,equalTo(true));
        ifFollow=followService.checkUserFollow(2,3);
        assertThat(ifFollow,equalTo(false));
    }

    @Test
    void getTopicOfFollowingUsers() {
        List<Topic> topics=followService.getTopicOfFollowingUsers(2);
        assertThat(topics.size(),equalTo(2));
        assertThat(topics.get(0),equalTo(topicRepository.findTopicByTopicId(5)));
    }

    @Test
    void getCommentsOfFollowingUsers() {
        List<Comment> comments=followService.getCommentsOfFollowingUsers(1);
        assertThat(comments.size(),equalTo(3));
        assertThat(comments.get(0),equalTo(commentRepository.findCommentByCommentId(8)));

    }

    @Test
    void getUserAnswerMyCommentAndTopic() {
        List<CommentUserBind> commentUserBinds=followService.getUserAnswerMyCommentAndTopic(1);
        assertThat(commentUserBinds.size(),equalTo(1));
        assertThat(commentUserBinds.get(0).getComment(),equalTo(commentRepository.findCommentByCommentId(8)));
    }

    @Test
    void getUserLikeAComment() {
        List<UserInfo> userInfos=followService.getUserLikeAComment(10);
        assertThat(userInfos.size(),equalTo(1));
        assertThat(userInfos.get(0),equalTo(userInfoRepository.findUserInfoByUserId(5)));
        userInfos=followService.getUserLikeAComment(9);
        assertThat(userInfos.size(),equalTo(0));
    }

    @Test
    void getUserStarAComment() {
        List<UserInfo> userInfos=followService.getUserStarAComment(10);
        assertThat(userInfos.size(),equalTo(2));
        userInfos=followService.getUserStarAComment(8);
        assertThat(userInfos.size(),equalTo(0));
    }

    @Test
    void getUserLikeATopic() {
        List <UserInfo> userInfos=followService.getUserLikeATopic(1);
        assertThat(userInfos.size(),equalTo(1));
        userInfos=followService.getUserLikeATopic(2);
        assertThat(userInfos.size(),equalTo(0));
    }

    @Test
    void getUserStarATopic() {
        List <UserInfo> userInfos=followService.getUserStarATopic(1);
        assertThat(userInfos.size(),equalTo(1));
        userInfos=followService.getUserStarATopic(2);
        assertThat(userInfos.size(),equalTo(0));
    }
}
