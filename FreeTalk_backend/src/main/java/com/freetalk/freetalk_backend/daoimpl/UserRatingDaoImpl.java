package com.freetalk.freetalk_backend.daoimpl;


import com.freetalk.freetalk_backend.dao.UserRatingDao;
import com.freetalk.freetalk_backend.entity.UserRating;
import com.freetalk.freetalk_backend.repository.UserRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @ClassName: UserRatingDaoImpl
 * @author: Liu Yao
 * @Description:
 * @date: 2021.7.23
 */

@Repository
public class UserRatingDaoImpl implements UserRatingDao {
    @Autowired
    private UserRatingRepository userRatingRepository;

    @Override
    public void deleteAll()
    {
        userRatingRepository.deleteAll();
    }

    @Override
    public void saveAllAndFlush(List<UserRating> userRatingList)
    {
        userRatingRepository.saveAllAndFlush(userRatingList);
    }
}
