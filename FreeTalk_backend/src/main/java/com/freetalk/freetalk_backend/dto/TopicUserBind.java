package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.UserInfo;
import lombok.Data;

@Data
public class TopicUserBind {
    private String likeOrStar;
    private UserInfo userInfo;
    private Comment comment;
}
