
package com.freetalk.freetalk_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 *
 * @ClassName: UserInfo
 * @Description: 如果遇到循环读取问题请在@JsonIgnoreProperties中添加忽略
 * @Description: get set 无参数构造函数 toString equal函数 已自动生成
 * @author: He Jingkai
 * @date: 2021.7.20
 */

@Entity
@Table(name="users")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
@Data
@NoArgsConstructor
public class UserInfo {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="user_id")
    private Integer userId;

    @Column(name = "username")
    private String username;

    @Column(name = "image")
    private String image;

    @Column(name = "description")
    private String description;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Transient
    private Integer fans;

    @Transient
    private Integer follows;
}
