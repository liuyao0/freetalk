package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.Message;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.criteria.CriteriaBuilder;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class MessageView {
    private Integer messageId;
    private Timestamp sendTime;
    private String messageText;
    private Integer sendId;
    private Integer acceptId;

    public MessageView(Message message){
        this.messageId=message.getMessageId();
        this.sendTime=message.getSendTime();
        this.messageText=message.getMessageText();
        this.sendId=message.getSendUser().getUserId();
        this.acceptId=message.getAcceptUser().getUserId();
    }
    public int compareTo(MessageView message) {
        return -this.sendTime.compareTo(message.getSendTime());
    }
}
