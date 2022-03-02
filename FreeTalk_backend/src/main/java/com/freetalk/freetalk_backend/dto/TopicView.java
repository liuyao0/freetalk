package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class TopicView {
    private int topicId;
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

    public TopicView(Topic topic){
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
    }
}
