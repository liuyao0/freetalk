package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.UserInfoDao;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.repository.UserInfoRepository;
import com.freetalk.freetalk_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.*;

import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class UserInfoDaoImplTest {

    @Autowired
    UserInfoDao userInfoDao;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserInfoRepository userInfoRepository;

    @Test
    void findUserInfoByUserId() {
        UserInfo userInfo= userInfoDao.findUserInfoByUserId(1);
        assertThat(userInfo.getUsername(),equalTo("河童"));
        assertThat(userInfoDao.findUserInfoByUserId(6),equalTo(null));
    }

    @Test
    void save() {
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(5);
        userInfo.setUsername("modified");
        userInfoDao.save(userInfo);
        assertThat(userInfoRepository.findUserInfoByUserId(5).getUsername(),equalTo("modified"));
    }
}
