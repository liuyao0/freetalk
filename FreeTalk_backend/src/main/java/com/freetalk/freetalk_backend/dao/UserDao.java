package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.User;

import java.util.List;


/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @Description: 只写了CommentService用到的函数，请负责同学继续补充:)
 * @date: 2021.7.19
 */

public interface UserDao {
    User findUserByUserId(Integer userId);

    void saveAUser(User user);

    void saveAndFlush(User user);

    List<User> findAll();
}

