package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.BanTime;

import java.util.List;

/**
 *
 * @ClassName: BanTimeDao
 * @author: He Jingkai
 * @date: 2021.8.2
 */

public interface BanTimeDao {
    List<BanTime> findBanTimesByUserId(Integer userId);

    void save(BanTime banTime);

    void delete(BanTime banTime);

}
