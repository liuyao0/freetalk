package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.Message;

import java.util.List;

/**
 *
 * @ClassName: MessageDao
 * @author: He Jingkai
 * @date: 2021.7.20
 */

public interface MessageDao {

    List<Message> findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(List<Integer> sendUserRange, List<Integer> receiveUserRange);

    void save(Message message);

    List<Message> findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer acceptUserId,Integer sentUserId,Integer isRead);

    List<Message> findMessagesByAcceptUser_UserIdAndIsRead(Integer acceptUserId,Integer isRead);

}
