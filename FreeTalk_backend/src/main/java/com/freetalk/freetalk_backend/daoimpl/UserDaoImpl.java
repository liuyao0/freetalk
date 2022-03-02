package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @Description: 只写了CommentService用到的函数，请负责同学继续补充:)
 * @date: 2021.7.19
 */

@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserByUserId(Integer userId){
        return userRepository.findUserByUserId(userId);
    }

    @Override
    public void saveAUser(User user){
        userRepository.save(user);
    }

    @Override
    public void saveAndFlush(User user) {
        userRepository.saveAndFlush(user);
    }

    @Override
    public List<User> findAll(){ return userRepository.findAll();}
}
