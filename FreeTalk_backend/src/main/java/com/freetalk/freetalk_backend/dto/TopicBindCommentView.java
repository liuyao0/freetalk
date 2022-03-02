package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.Comment;
import lombok.Data;

import java.sql.Timestamp;


@Data
public class TopicBindCommentView {
    private String topicTitle;
    private Integer topicId;
    private String commentContent;
    private Integer commentId;

    private Integer likes;
    private Integer stars;
    private Integer replyNumber;
    private Timestamp sendTime;

    private Integer userId;
    private String username;
    private String image;

    public TopicBindCommentView(Comment comment){
        topicTitle=comment.getTopic().getTitle();
        topicId=comment.getTopic().getTopicId();
        commentContent=comment.getCommentContent();
        commentId=comment.getCommentId();
        likes=comment.getLikes();
        stars=comment.getStars();
        replyNumber=comment.getReplyNumber();
        sendTime=comment.getSendTime();

        username=comment.getUser().getUsername();
        userId=comment.getUser().getUserId();
        image=comment.getUser().getImage();
    }

}
