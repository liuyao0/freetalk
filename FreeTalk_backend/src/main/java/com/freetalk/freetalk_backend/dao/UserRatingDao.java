package com.freetalk.freetalk_backend.dao;


import com.freetalk.freetalk_backend.entity.UserRating;

import java.util.List;

/**
 *
 * @ClassName: UserRatingDao
 * @author: Liu Yao
 * @date: 2021.7.23
 */
public interface UserRatingDao {
    public void deleteAll();

    public void saveAllAndFlush(List<UserRating> userRatingDaoList);
}
