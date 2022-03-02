package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dto.MessageView;
import com.freetalk.freetalk_backend.entity.Message;
import com.freetalk.freetalk_backend.service.MessageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class MessageServiceImplTest {
    @Autowired
    private MessageService messageService;

    @Test
    void findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn() {
        List<Integer> integers=new ArrayList<>();
        integers.add(2);
        integers.add(3);
        List<MessageView> messages= messageService.findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(integers,integers);
        assertThat(messages.size(),equalTo(1));
    }

    @Test
    void findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead() {
        List<Message> messages= messageService.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(1,2,1);
        assertThat(messages.size(),equalTo(1));
    }

    @Test
    void postAMessage() {
        Map<String,Object> map=new HashMap<>();
        map.put("sendUserId", 3);
        map.put("receiveUserId",2);
        map.put("messageContent","Hello world");
        messageService.postAMessage(map);
        List<Message> messages=messageService.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(3,2,0);
        assertThat(messages.size(),equalTo(1));
    }

    @Test
    void setAllMessageWithAUserHaveRead() {
        messageService.setAllMessageWithAUserHaveRead("2","3");
        List<Message> messages=messageService.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(2,3,0);
        assertThat(messages.size(),equalTo(0));

    }

    @Test
    void numberOfMessagesUnread() {
        Integer ret=messageService.numberOfMessagesUnread("3");
        assertThat(ret,equalTo(11));
    }

    @Test
    void numberOfMessagesUnreadWithAUser() {
        Integer ret=messageService.numberOfMessagesUnreadWithAUser("3","2");
        assertThat(ret,equalTo(1));
    }
}
