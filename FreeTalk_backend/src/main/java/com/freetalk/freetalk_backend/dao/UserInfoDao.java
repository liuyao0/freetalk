package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.UserInfo;

import java.util.List;

/**
 *
 * @ClassName: UserInfoDao
 * @author: He Jingkai
 * @date: 2021.7.21
 */

public interface UserInfoDao {
    UserInfo findUserInfoByUserId(Integer userId);

    void save(UserInfo userInfo);

    List<UserInfo> findAll();

    List<UserInfo> findUserInfosByUsernameContains(String username);

}
