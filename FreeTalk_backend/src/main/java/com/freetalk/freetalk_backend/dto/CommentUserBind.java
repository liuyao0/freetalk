package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.Comment;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class CommentUserBind implements Comparable<CommentUserBind>{
    private String type;
    private Comment comment;
    private Comment commentBeReplied;
    private Timestamp timestamp;

    @Override
    public int compareTo(CommentUserBind commentUserBind){
        return -this.timestamp.compareTo(commentUserBind.getTimestamp());
    }
}
