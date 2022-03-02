package com.freetalk.freetalk_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

/**
 *
 * @ClassName: Topic
 * @Description: 如果遇到循环读取问题请在@JsonIgnoreProperties中添加忽略
 * @Description: get set 无参数构造函数 toString equal函数 已自动生成
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Entity
@Table(name="topics")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@Data
@NoArgsConstructor
public class Topic implements Comparable<Topic>{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="topic_id")
    private Integer topicId;

    @Column(name = "post_time")
    private Timestamp postTime;

    @Column(name = "title")
    private String title;

    @Column(name = "topic_description")
    private String topicDescription;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({"comments","password","email"
            ,"sex","topics","messagesSent","messagesReceived",
    "infoOfUsersReceivesMyMessages","infoOfUsersSentMeMessages",
    "topicsLike","topicsStar","commentsLike","commentsStar"})
    private User user;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name="topic_id", referencedColumnName = "topic_id")
    @JsonIgnoreProperties({"topic"})
    private List<Comment> comments;

    @JsonManagedReference
    @OneToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name="topic_id", referencedColumnName = "topic_id")
    @JsonIgnoreProperties({"topic"})
    private TopicInfo topicInfo;


    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "topic_like_table", joinColumns = {
            @JoinColumn(name = "topic_id", referencedColumnName = "topic_id")}, inverseJoinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")})
    private List<UserInfo> userLikeTheTopic;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "topic_star_table", joinColumns = {
            @JoinColumn(name = "topic_id", referencedColumnName = "topic_id")}, inverseJoinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")})
    private List<UserInfo> userStarTheTopic;

    @Override
    public int compareTo(Topic topic) {
        return this.postTime.compareTo(topic.getPostTime());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Topic topic = (Topic) o;
        return topicId.equals(topic.topicId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(topicId);
    }

    @Override
    public String toString() {
        return "Topic{" +
                "topicId=" + topicId +
                ", postTime=" + postTime +
                ", title='" + title + '\'' +
                ", topicDescription='" + topicDescription + '\'' +
                '}';
    }
}


