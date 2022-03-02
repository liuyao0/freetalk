package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 *
 * @ClassName: MessageRepository
 * @author: He Jingkai
 * @date: 2021.7.20
 */

public interface MessageRepository extends JpaRepository<Message,Integer> {

    List<Message> findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(List<Integer> sendUserRange, List<Integer> receiveUserRange);

    List<Message> findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer acceptUserId,Integer sentUserId,Integer isRead);

    List<Message> findMessagesByAcceptUser_UserIdAndIsRead(Integer acceptUserId,Integer isRead);
}
