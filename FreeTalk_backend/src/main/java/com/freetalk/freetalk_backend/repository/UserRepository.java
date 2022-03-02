package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @date: 2021.7.19
 */

public interface UserRepository extends JpaRepository<User,Integer> {
    User findUserByUserId(Integer userId);
}
