package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;

import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class UserDaoImplTest {
    @Autowired
    private UserDao userDao;
    @Test
    void findUserByUserId() {
        User user=userDao.findUserByUserId(2);
        assertThat(user.getUsername(),equalTo("和酮"));
    }

    @Test
    void saveAUser() {
        User user=userDao.findUserByUserId(1);
        user.setUsername("abc");
        user.setEmail("abc@sjtu.edu.cn");
        user.setImage("");
        userDao.saveAUser(user);
        assertThat(userDao.findUserByUserId(1).getUsername(),equalTo("abc"));
        assertThat(userDao.findUserByUserId(1).getEmail(),equalTo("abc@sjtu.edu.cn"));
        assertThat(userDao.findUserByUserId(1).getImage(),equalTo(""));
    }

    @Test
    void saveAndFlush() {
        User user=userDao.findUserByUserId(1);
        user.setUsername("abc");
        userDao.saveAndFlush(user);
        assertThat(userDao.findUserByUserId(1).getUsername(),equalTo("abc"));
    }

    @Test
    void findAll() {
        List<User> users=userDao.findAll();
        assertThat(users.size(),equalTo(6));
        assertThat(users.get(0).getUserId(),equalTo(1));
    }
}
