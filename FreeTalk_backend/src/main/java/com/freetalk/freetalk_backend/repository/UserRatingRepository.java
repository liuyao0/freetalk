package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.UserRating;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 *
 * @ClassName: UserRatingRepository
 * @author: Liu Yao
 * @date: 2021.7.23
 */

public interface UserRatingRepository extends JpaRepository<UserRating,Integer> {
}
