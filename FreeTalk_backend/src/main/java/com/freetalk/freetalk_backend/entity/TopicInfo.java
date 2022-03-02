package com.freetalk.freetalk_backend.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Objects;

/**
 *
 * @ClassName: TopicInfo
 * @Description: 如果遇到循环读取问题请在@JsonIgnoreProperties中添加忽略
 * @Description: get set 无参数构造函数 toString equal函数 已自动生成
 * @Description: 重载了比较函数, 可以按照热度排序
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Entity
@Table(name="topic_info")
@Data
@NoArgsConstructor
public class TopicInfo implements Comparable<TopicInfo> {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="info_id")
    private Integer infoId;

    @Column(name="topic_id")
    private Integer topicId;

    @Column(name = "likes")
    private Integer likes;

    @Column(name = "stars")
    private Integer stars;

    @Column(name = "comments")
    private Integer comments;

    @Column(name = "views")
    private Integer views;

    @Column(name = "weight")
    private double weight;

    @Column(name = "hot")
    private double hot;


    @Override
    public int compareTo(TopicInfo topicInfo) {
        double delta=this.hot-topicInfo.getHot();
        return (delta==0)?
                0:(
                        (delta>0)?1:-1
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(infoId);
    }

}
