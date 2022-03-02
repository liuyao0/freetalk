package com.freetalk.freetalk_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;


/**
 *
 * @ClassName: Comment
 * @Description: 如果遇到循环读取问题请在@JsonIgnoreProperties中添加忽略
 * @Description: get set 无参数构造函数 toString equal函数 已自动生成
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Entity
@Table(name="comments")
@Data
@NoArgsConstructor
public class Comment implements Comparable<Comment>{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="comment_id")
    private Integer commentId;

    @Column(name = "post_time")
    private Timestamp sendTime;

    @Column(name = "comment_content")
    private String commentContent;

    @Column(name = "reply_id")
    private Integer replyId;

    @Column(name = "likes")
    private Integer likes;

    @Column(name = "stars")
    private Integer stars;

    @Column(name = "reply_number")
    private Integer replyNumber;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({"email","sex"})
    private UserInfo user;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="topic_id", referencedColumnName = "topic_id")
    @JsonIgnoreProperties({"user","topicInfo","comments","topicDescription","postTime",
            "userLikeTheTopic","userStarTheTopic"})
    private Topic topic;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "comment_like_table", joinColumns = {
            @JoinColumn(name = "comment_id", referencedColumnName = "comment_id")}, inverseJoinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")})
    private List<UserInfo> userLikeTheComment;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "comment_star_table", joinColumns = {
            @JoinColumn(name = "comment_id", referencedColumnName = "comment_id")}, inverseJoinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")})
    private List<UserInfo> userStarTheComment;

    @Override
    public int compareTo(Comment comment) {
        return this.sendTime.compareTo(comment.getSendTime());
    }


}
