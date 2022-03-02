package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.dto.UserViewInAdministrator;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;

import java.util.List;
import java.util.Map;


public interface UserService {
    User findUserByUserId(Integer UserId);

    Integer register(Map<String,Object> map);

    String login(Map<String,Object> map);

    void updateImage(Map<String,Object> map);

    void updateUserInfo(Map<String,Object> map);

    UserInfo getUserInfo(Integer userId);

    List<UserViewInAdministrator> findAll();

    List<UserInfo> findUserInfosByUsernameContains(String username);

    String EditPassword(Map<String,Object> map);
}
