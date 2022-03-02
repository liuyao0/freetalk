package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.BanTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 *
 * @ClassName: BanTimeRepository
 * @author: He Jingkai
 * @date: 2021.8.2
 */

public interface BanTimeRepository extends JpaRepository<BanTime,Integer> {
    List<BanTime> findBanTimesByUserId(Integer userId);
}
