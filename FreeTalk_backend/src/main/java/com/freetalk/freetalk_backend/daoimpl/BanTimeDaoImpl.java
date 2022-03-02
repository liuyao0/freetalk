package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.BanTimeDao;
import com.freetalk.freetalk_backend.entity.BanTime;
import com.freetalk.freetalk_backend.repository.BanTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @ClassName: BanTimeDaoImpl
 * @author: He Jingkai
 * @date: 2021.8.2
 */

@Repository
public class BanTimeDaoImpl implements BanTimeDao {
    @Autowired
    private BanTimeRepository banTimeRepository;

    @Override
    public List<BanTime> findBanTimesByUserId(Integer userId){
        return banTimeRepository.findBanTimesByUserId(userId);
    }

    @Override
    public void save(BanTime banTime){
        banTimeRepository.save(banTime);
    }

    @Override
    public void delete(BanTime banTime){
        banTimeRepository.delete(banTime);
    }

}
