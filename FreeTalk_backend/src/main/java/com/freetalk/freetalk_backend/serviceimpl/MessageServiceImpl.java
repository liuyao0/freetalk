package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.dao.MessageDao;
import com.freetalk.freetalk_backend.dao.UserInfoDao;
import com.freetalk.freetalk_backend.dto.MessageView;
import com.freetalk.freetalk_backend.entity.Message;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 *
 * @ClassName: MessageServiceImpl
 * @author: He Jingkai
 * @date: 2021.7.20
 */

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageDao messageDao;
    @Autowired
    private UserInfoDao userInfoDao;

    @Override
    public List<Message> findMessagesBySendUser_UserIdAndAcceptUser_UserId(List<Integer> sendUserRange, List<Integer> receiveUserRange) {
        return messageDao.findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(sendUserRange,receiveUserRange);
    }

    @Override
    public List<MessageView> findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(List<Integer> sendUserRange, List<Integer> receiveUserRange){
        List<Message> messages=messageDao.findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(sendUserRange,receiveUserRange).stream().distinct().sorted().collect(Collectors.toList());
        Iterator<Message> it=messages.iterator();
        List<MessageView> simpleMessage = new ArrayList<>();
        while (it.hasNext()){
            Message message= it.next();
            simpleMessage.add(new MessageView(message));
        }
        return simpleMessage;
    }

    @Override
    public List<Message> findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer sendUserRange, Integer receiveUserRange, Integer isRead) {
        return messageDao.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(sendUserRange,receiveUserRange,isRead);
    }

    @Override
    public void postAMessage(Map<String,Object> map) {
        Integer sendUserId=(Integer) map.get("sendUserId");
        Integer receiveUserId=(Integer) map.get("receiveUserId");
        String content=(String) map.get("messageContent");
        Message message=new Message();
        message.setMessageText(content);
        message.setAcceptUser(userInfoDao.findUserInfoByUserId(receiveUserId));
        message.setSendUser(userInfoDao.findUserInfoByUserId(sendUserId));
        message.setIsRead(0);
        message.setSendTime(new Timestamp(System.currentTimeMillis()));
        messageDao.save(message);
    }

    @Override
    public void setAllMessageWithAUserHaveRead(String acceptUserId,String receiveUserId){
        List<Message> messages=messageDao.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer.valueOf(acceptUserId),Integer.valueOf(receiveUserId),0);
        for (Message message:messages){
            message.setIsRead(1);
            messageDao.save(message);
        }
    }

    @Override
    public Integer numberOfMessagesUnread(String acceptUserId){
        return messageDao.findMessagesByAcceptUser_UserIdAndIsRead(Integer.valueOf(acceptUserId),0).size();
    }

    @Override
    public Integer numberOfMessagesUnreadWithAUser(String acceptUserId, String sentUserId){
        return messageDao.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer.valueOf(acceptUserId),Integer.valueOf(sentUserId),0).size();
    }

}
