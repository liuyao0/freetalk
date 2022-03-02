package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 *
 * @ClassName: UserInfoRepository
 * @author: He Jingkai
 * @date: 2021.7.21
 */

public interface UserInfoRepository extends JpaRepository<UserInfo,Integer> {
    UserInfo findUserInfoByUserId(Integer userId);

    List<UserInfo> findUserInfosByUsernameContains(String username);
}
