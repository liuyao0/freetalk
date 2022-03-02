package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.dto.MessageView;
import com.freetalk.freetalk_backend.entity.Message;

import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: MessageService
 * @author: He Jingkai
 * @date: 2021.7.20
 */

public interface MessageService {
    List<Message> findMessagesBySendUser_UserIdAndAcceptUser_UserId(List<Integer> sendUserRange, List<Integer> receiveUserRange);
    List<MessageView> findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(List<Integer> sendUserRange, List<Integer> receiveUserRange);

    List<Message> findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer sendUserRange, Integer receiveUserRange,Integer isRead);

    void postAMessage(Map<String,Object> map);

    void setAllMessageWithAUserHaveRead(String acceptUserId,String receiveUserId);

    Integer numberOfMessagesUnread(String acceptUserId);

    Integer numberOfMessagesUnreadWithAUser(String acceptUserId, String sentUserId);

}
