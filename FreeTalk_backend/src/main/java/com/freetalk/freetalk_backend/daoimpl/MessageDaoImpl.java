package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.MessageDao;
import com.freetalk.freetalk_backend.entity.Message;
import com.freetalk.freetalk_backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @ClassName: MessageDaoImpl
 * @author: He Jingkai
 * @date: 2021.7.20
 */

@Repository
public class MessageDaoImpl implements MessageDao {
    @Autowired
    private MessageRepository messageRepository;

    @Override
    public List<Message> findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(List<Integer> sendUserRange, List<Integer> receiveUserRange){
        return messageRepository.findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(sendUserRange,receiveUserRange);
    }

    @Override
    public void save(Message message){
        messageRepository.save(message);
    }

    @Override
    public List<Message> findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer acceptUserId,Integer sentUserId,Integer isRead){
        return messageRepository.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(acceptUserId, sentUserId, isRead);
    }

    @Override
    public List<Message> findMessagesByAcceptUser_UserIdAndIsRead(Integer acceptUserId,Integer isRead){
        return messageRepository.findMessagesByAcceptUser_UserIdAndIsRead(acceptUserId, isRead);
    }

}
