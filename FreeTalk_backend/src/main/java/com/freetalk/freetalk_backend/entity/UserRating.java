package com.freetalk.freetalk_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name="ratings")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRating {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="rating_id")
    private Integer ratingId;

    @Column(name="user_id")
    private Integer userId;

    @Column(name="topic_id")
    private Integer topicId;

    @Column(name="rating")
    private Integer rating;

    @Column(name="post_time")
    private Long postTime;

    public UserRating(Integer userId,Integer topicId,Integer rating,Long postTime)
    {
        this.userId=userId;
        this.topicId=topicId;
        this.rating=rating;
        this.postTime=postTime;
        this.ratingId=0;
    }
}
