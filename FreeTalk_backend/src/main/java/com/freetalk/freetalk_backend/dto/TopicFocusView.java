package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import com.freetalk.freetalk_backend.entity.UserInfo;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class TopicFocusView {
    private Integer topicId;
    private Timestamp postTime;
    private String title;
    private String topicDescription;
    private Integer userId;
    private String username;
    private String userImage;
    private String userDescription;

    private Integer likes;
    private Integer stars;
    private Integer views;
    private Integer replies;
    private Double hot;
    private Double weight;

    private Integer focusUserId;
    private String focusUsername;
    private String focusUserImage;
    private Integer type;

    private Timestamp time;

    public TopicFocusView(Topic topic, UserInfo userInfo){
        this.topicId=topic.getTopicId();
        this.postTime=topic.getPostTime();
        this.title=topic.getTitle();
        this.topicDescription=topic.getTopicDescription();
        this.userId=topic.getUser().getUserId();
        this.username=topic.getUser().getUsername();
        this.userImage=topic.getUser().getImage();
        this.userDescription=topic.getUser().getDescription();
        TopicInfo topicInfo=topic.getTopicInfo();
        if (topicInfo==null) {
            System.out.println(topicId+"null topicInfo");
        }
        assert topicInfo != null;
        this.likes=topicInfo.getLikes();
        this.stars=topicInfo.getStars();
        this.views=topicInfo.getViews();
        this.replies=topicInfo.getComments();
        this.hot=topicInfo.getHot();
        this.weight=topicInfo.getWeight();
        this.focusUserId=userInfo.getUserId();
        this.focusUsername=userInfo.getUsername();
        this.focusUserImage=userInfo.getImage();
        this.type=1;
        this.time=topic.getPostTime();
    }

    public TopicFocusView(Comment comment, UserInfo userInfo){
        Topic topic=comment.getTopic();
        this.topicId=topic.getTopicId();
        this.postTime=topic.getPostTime();
        this.title=topic.getTitle();
        this.topicDescription=topic.getTopicDescription();
        this.userId=topic.getUser().getUserId();
        this.username=topic.getUser().getUsername();
        this.userImage=topic.getUser().getImage();
        this.userDescription=topic.getUser().getDescription();
        TopicInfo topicInfo=topic.getTopicInfo();
        if (topicInfo==null) {
            System.out.println(topicId+"null topicInfo");
        }
        assert topicInfo != null;
        this.likes=topicInfo.getLikes();
        this.stars=topicInfo.getStars();
        this.views=topicInfo.getViews();
        this.replies=topicInfo.getComments();
        this.hot=topicInfo.getHot();
        this.weight=topicInfo.getWeight();
        this.focusUserId=userInfo.getUserId();
        this.focusUsername=userInfo.getUsername();
        this.focusUserImage=userInfo.getImage();
        this.type=2;
        this.time=comment.getSendTime();
    }
}
