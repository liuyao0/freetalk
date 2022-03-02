package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.UserInfoDao;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 *
 * @ClassName: UserInfoDaoImpl
 * @author: He Jingkai
 * @date: 2021.7.21
 */

@Repository
public class UserInfoDaoImpl implements UserInfoDao {
    @Autowired
    private UserInfoRepository userInfoRepository;

    @Override
    public UserInfo findUserInfoByUserId(Integer userId){
        return userInfoRepository.findUserInfoByUserId(userId);
    }

    @Override
    public void save(UserInfo userInfo){
        userInfoRepository.save(userInfo);
    }

    @Override
    public List<UserInfo> findAll(){return userInfoRepository.findAll();}

    @Override
    public List<UserInfo> findUserInfosByUsernameContains(String username){
        return userInfoRepository.findUserInfosByUsernameContains(username);
    }
}
