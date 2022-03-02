package com.freetalk.freetalk_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DiscriminatorOptions;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

/**
 *
 * @ClassName: User
 * @Description: 如果遇到循环读取问题请在@JsonIgnoreProperties中添加忽略
 * @Description: get set 无参数构造函数 toString equal函数 已自动生成
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Entity
@Table(name="users")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="user_id")
    private Integer userId;

    @Column(name="password")
    private String password;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "image")
    private String image;

    @Column(name = "description")
    private String description;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name="user_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({"topic"})
    private List<Comment> comments;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name="user_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({"user"})
    private List<Topic> topics;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name="send_user_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({"sendUser"})
    private List<Message> messagesSent;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name="accept_user_id", referencedColumnName = "user_id")
    @JsonIgnoreProperties({"acceptUser"})
    private List<Message> messagesReceived;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "private_message", joinColumns = {
            @JoinColumn(name = "send_user_id", referencedColumnName = "user_id")}, inverseJoinColumns = {
            @JoinColumn(name = "accept_user_id", referencedColumnName = "user_id")})
    private List<UserInfo> infoOfUsersReceivesMyMessages;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "private_message", joinColumns = {
            @JoinColumn(name = "accept_user_id", referencedColumnName = "user_id")}, inverseJoinColumns = {
            @JoinColumn(name = "send_user_id", referencedColumnName = "user_id")})
    private List<UserInfo> infoOfUsersSentMeMessages;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "topic_like_table", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")}, inverseJoinColumns = {
            @JoinColumn(name = "topic_id", referencedColumnName = "topic_id")})
    @JsonIgnoreProperties({"user"})
    private List<Topic> topicsLike;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "topic_star_table", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")}, inverseJoinColumns = {
            @JoinColumn(name = "topic_id", referencedColumnName = "topic_id")})
    @JsonIgnoreProperties({"user"})
    private List<Topic> topicsStar;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "comment_like_table", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")}, inverseJoinColumns = {
            @JoinColumn(name = "comment_id", referencedColumnName = "comment_id")})
    @JsonIgnoreProperties({"user"})
    private List<Comment> commentsLike;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "comment_star_table", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")}, inverseJoinColumns = {
            @JoinColumn(name = "comment_id", referencedColumnName = "comment_id")})
    @JsonIgnoreProperties({"user"})
    private List<Comment> commentsStar;

    /**
     * @Description: 本Entity用户的所有关注者
     * @date: 2021.7.22
     */
    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "follows", joinColumns = {
            @JoinColumn(name = "follower_id", referencedColumnName = "user_id")},
            inverseJoinColumns = {
            @JoinColumn(name = "followed_id", referencedColumnName = "user_id")})
    private List<UserInfo> theUsersIFollowing;

    /**
     * @Description: 关注本Entity用户的所有人
     * @date: 2021.7.22

     * 上面两个联表的顺序有可能是反的
     */
    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinTable(name = "follows", joinColumns = {
            @JoinColumn(name = "followed_id", referencedColumnName = "user_id")},
            inverseJoinColumns = {
            @JoinColumn(name = "follower_id", referencedColumnName = "user_id")})
    private List<UserInfo> allUsersFollowingMe;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
