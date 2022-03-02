package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.dto.UserViewInAdministrator;
import com.freetalk.freetalk_backend.entity.BanTime;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.service.BanService;
import com.freetalk.freetalk_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private BanService banService;

    @CrossOrigin
    @RequestMapping(value="/register",method = RequestMethod.POST)
    public Integer register(@RequestBody Map<String,Object> map){
        return userService.register(map);
    }

    @CrossOrigin
    @RequestMapping(value="/login",method = RequestMethod.POST)
    public String login(@RequestBody Map<String,Object> map){
        return userService.login(map);
    }


    @CrossOrigin
    @RequestMapping(value="/updateImage")
    public void updateImage(@RequestBody Map<String,Object> map){
        userService.updateImage(map);
    }


    /**
     *
     * @FunctionName: updateUserInfo
     * @Description: 修改用户个人信息
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/Security/updateUserInfo")
    public void updateUserInfo(@RequestBody Map<String,Object> map){
        userService.updateUserInfo(map);
    }
    @CrossOrigin
    @RequestMapping(value="/Security/updatePassword")
    public String updatePassword(@RequestBody Map<String,Object> map){
         return userService.EditPassword(map);
    }

    /**
     *
     * @FunctionName: updateUserInfo
     * @Description: 获取用户个人信息
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/getUserInfo")
    public UserInfo getUserInfo(@RequestParam("userId") Integer userId){
        UserInfo userInfo=userService.getUserInfo(userId);
        Integer follows=userService.findUserByUserId(userId).getTheUsersIFollowing().size();
        Integer fans=userService.findUserByUserId(userId).getAllUsersFollowingMe().size();
        userInfo.setFans(fans);
        userInfo.setFollows(follows);
        return userInfo;
    }

    /**
     *
     * @FunctionName: findAllUserInfo
     * @Description: 获取全部用户个人信息
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/findAllUserInfo")
    public List<UserViewInAdministrator> findAllUserInfo(){
        return userService.findAll();
    }

    /**
     *
     * @FunctionName: banAUser
     * @Description: 禁言某用户
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/banAUser")
    public void banAUser(@RequestParam("userId") Integer userId){
        banService.ban(userId);
    }

    /**
     *
     * @FunctionName: banAUser
     * @Description: 查看某用户是否在禁言中
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/checkBan")
    public BanTime checkBan(@RequestParam("userId") Integer userId){
        return banService.checkBan(userId);
    }

    /**
     *
     * @FunctionName: searchByUserId
     * @Description: 按照id搜索用户
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/searchByUserId")
    public List<UserViewInAdministrator> searchByUserId(@RequestParam("userId") Integer userId){
        List<UserViewInAdministrator> userViewInAdministrators=new ArrayList<>();
        UserInfo userInfo=userService.getUserInfo(userId);
        if(banService.checkBan(userInfo.getUserId())==null)
            userViewInAdministrators.add(new UserViewInAdministrator(userInfo,0));
        else
            userViewInAdministrators.add(new UserViewInAdministrator(userInfo,1));
        return userViewInAdministrators;
    }

    /**
     *
     * @FunctionName: searchByUsername
     * @Description: 按照用户名搜索用户
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/searchByUsername")
    public List<UserViewInAdministrator> searchByUsername(@RequestParam("username") String username){
        List<UserInfo> userInfos=userService.findUserInfosByUsernameContains(username);
        List<UserViewInAdministrator> userViewInAdministrators=new ArrayList<>();
        for(UserInfo userInfo:userInfos)
            if(banService.checkBan(userInfo.getUserId())==null)
                userViewInAdministrators.add(new UserViewInAdministrator(userInfo,0));
            else
                userViewInAdministrators.add(new UserViewInAdministrator(userInfo,1));
        return userViewInAdministrators;
    }

    /**
     *
     * @FunctionName: findAllBanTime
     * @Description: 获取禁言记录
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/findAllBanTime")
    public List<BanTime> findAllBanTime(@RequestParam("userId") Integer userId){
        return banService.findByUserId(userId);
    }

    /**
     *
     * @FunctionName: banAUser
     * @Description: 解禁某用户
     * @author: He Jingkai
     * @date: 2021.7.27
     */
    @CrossOrigin
    @RequestMapping(value="/unbanAUser")
    public void unbanAUser(@RequestParam("userId") Integer userId){
        banService.unbanAUser(userId);
    }
}
