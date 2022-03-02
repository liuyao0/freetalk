package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.dto.MessageView;
import com.freetalk.freetalk_backend.entity.Message;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.service.MessageService;
import com.freetalk.freetalk_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 *
 * @ClassName: MessageController
 * @author: He Jingkai
 * @date: 2021.7.20
 */

@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;

    /**
     * @Description: 获取两个用户之间的全部私信 Messages
     */
    @CrossOrigin
    @RequestMapping("/Security/getMessagesBetweenTwoUsers")
    public List<MessageView> getMessagesBetweenTwoUsers(@RequestParam("me") String userIdMe, @RequestParam("you") String userIdYou){
        List<Integer> userRange= new ArrayList<>();
        userRange.add(Integer.valueOf(userIdMe));
        userRange.add(Integer.valueOf(userIdYou));
        return messageService.findMessagesBySendUser_UserIdInAndAcceptUser_UserIdIn(userRange,userRange);
    }
    /**
     * @Description: 获取两个用户之间的未读私信 Messages
     */
    @CrossOrigin
    @RequestMapping("/Security/getNewMessagesBetweenTwoUsers")
    public List<Message> getNewMessagesBetweenTwoUsers(@RequestParam("me") String userIdMe, @RequestParam("you") String userIdYou){
        List<Message> messages=messageService.findMessagesByAcceptUser_UserIdAndSendUser_UserIdAndIsRead(Integer.parseInt(userIdMe),Integer.parseInt(userIdYou),0);
        messageService.setAllMessageWithAUserHaveRead(userIdMe,userIdYou);
        return messages.stream().distinct().sorted().collect(Collectors.toList());
    }
    /**
     * @Description: 获取与某用户进行过私信的所有人
     */
    @CrossOrigin
    @RequestMapping("/Security/getAllUsersHasChattedWithAUser")
    public List<Message> getAllUsersHasChattedWithAUser(@RequestParam("userId") String userId){
        List<UserInfo> userInfosReceived=userService.findUserByUserId(Integer.valueOf(userId)).getInfoOfUsersReceivesMyMessages();
        List<UserInfo> userInfosSent=userService.findUserByUserId(Integer.valueOf(userId)).getInfoOfUsersSentMeMessages();
        userInfosReceived.addAll(userInfosSent);
        List<UserInfo> changed=userInfosReceived.stream().distinct().collect(Collectors.toList());
        Iterator<UserInfo> it=changed.iterator();
        List<Message> simpleMessage = new ArrayList<>();
        while (it.hasNext()){
            UserInfo userInfo= it.next();
            List<Integer> userRange= new ArrayList<>();
            userRange.add(Integer.valueOf(userId));
            userRange.add(userInfo.getUserId());
            List<Message> messages=messageService.findMessagesBySendUser_UserIdAndAcceptUser_UserId(userRange,userRange);
            simpleMessage.add(messages.stream().distinct().sorted().collect(Collectors.toList()).get(0));
        }
        return simpleMessage;
    }

//    @CrossOrigin
//    @RequestMapping(value = "/getAllUsersHasChattedWithAUser",method = RequestMethod.OPTIONS)
    /**
     * @Description: 存入一个私信
     */
    @CrossOrigin
    @RequestMapping("/Security/postAMessage")
    public void postAMessage(@RequestBody Map<String,Object> map){
        messageService.postAMessage(map);
    }
    /**
     * @Description: 将一个用户收到的另一个用户发送的全部私信标为已读
     */
    @CrossOrigin
    @RequestMapping("/Security/setAllMessageWithAUserHaveRead")
    public void setAllMessageWithAUserHaveRead(@RequestParam("acceptUserId") String acceptUserId, @RequestParam("sentUserId") String sentUserId){
        messageService.setAllMessageWithAUserHaveRead(acceptUserId, sentUserId);
    }

    /**
     * @Description: 统计一个用户收到的另一个用户发送的全部未读私信数目
     */
    @CrossOrigin
    @RequestMapping(value ="/Security/numberOfMessagesUnreadWithAUser")
    public List<Integer> numberOfMessagesUnreadWithAUser(@RequestParam("acceptUserId") String acceptUserId){
        List<UserInfo> userInfosReceived=userService.findUserByUserId(Integer.valueOf(acceptUserId)).getInfoOfUsersReceivesMyMessages();
        List<UserInfo> userInfosSent=userService.findUserByUserId(Integer.valueOf(acceptUserId)).getInfoOfUsersSentMeMessages();
        userInfosReceived.addAll(userInfosSent);
        List<UserInfo> changed=userInfosReceived.stream().distinct().collect(Collectors.toList());
        Iterator<UserInfo> it=changed.iterator();
        List<Integer> userNumber=new ArrayList<>();
        while (it.hasNext()) {
            UserInfo userInfo = it.next();
            userNumber.add(messageService.numberOfMessagesUnreadWithAUser(acceptUserId, Integer.toString(userInfo.getUserId())));
        }
        return userNumber;
    }

    /**
     * @Description: 统计一个用户的全部未读私信
     */
    @CrossOrigin
    @RequestMapping("/Security/numberOfMessagesUnread")
    public Integer numberOfMessagesUnread(@RequestParam("acceptUserId") String acceptUserId){
        return messageService.numberOfMessagesUnread(acceptUserId);
    }


}
