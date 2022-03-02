package com.freetalk.freetalk_backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 *
 * @ClassName: Message
 * @Description: 如果遇到循环读取问题请在@JsonIgnoreProperties中添加忽略
 * @Description: get set 无参数构造函数 toString equal函数 已自动生成
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Entity
@Table(name="private_message")
@Data
@NoArgsConstructor
public class Message implements Comparable<Message>{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="message_id")
    private Integer messageId;

    @Column(name = "send_time")
    private Timestamp sendTime;

    @Column(name = "message_text")
    private String messageText;

    @Column(name = "is_read")
    private Integer isRead;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="send_user_id", referencedColumnName = "user_id")
    private UserInfo sendUser;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="accept_user_id", referencedColumnName = "user_id")
    private UserInfo acceptUser;

    @Override
    public int compareTo(Message message) {
        return -this.sendTime.compareTo(message.getSendTime());
    }

}
