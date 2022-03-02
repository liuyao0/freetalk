package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.MessageDao;
import com.freetalk.freetalk_backend.dao.UserInfoDao;
import com.freetalk.freetalk_backend.entity.Message;
import com.freetalk.freetalk_backend.entity.UserInfo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;


@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class MessageDaoImplTest {

    @Autowired
    private MessageDao messageDao;
    @Autowired
    private UserInfoDao userInfoDao;

    @Test
    void findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn() {
        List<Integer> integers=new ArrayList<>();
        integers.add(2);
        integers.add(3);
        List<Message> messages= messageDao.findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(integers,integers);
        assertThat(messages.size(),equalTo(1));
    }

    @Test
    void save() {
        UserInfo userInfo= userInfoDao.findUserInfoByUserId(3);
        UserInfo userInfo1= userInfoDao.findUserInfoByUserId(1);
        Message message=new Message();
        message.setMessageText("test");
        message.setIsRead(0);
        message.setAcceptUser(userInfo);
        message.setSendUser(userInfo1);
        message.setSendTime(new Timestamp(System.currentTimeMillis()));
        messageDao.save(message);
        List<Message> messages=messageDao.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(3,1,0);
        assertThat(messages.size(),equalTo(11));
    }

    @Test
    void findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead() {
        List<Message> messages= messageDao.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(1,2,1);
        assertThat(messages.size(),equalTo(1));
    }

    @Test
    void findMessagesByAcceptUser_UserIdAndIsRead() {
        List<Message> messages= messageDao.findMessagesByAcceptUser_UserIdAndIsRead(1,1);
        assertThat(messages.size(),equalTo(1));
    }

}
