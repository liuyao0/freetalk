package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.dao.BanTimeDao;
import com.freetalk.freetalk_backend.entity.BanTime;
import com.freetalk.freetalk_backend.service.BanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class BanServiceImpl implements BanService {
    @Autowired
    private BanTimeDao banTimeDao;

    @Override
    public void ban(Integer userId){
        BanTime banTime=new BanTime();
        Timestamp beginTime=new Timestamp(System.currentTimeMillis());
        int duration=banTimeDao.findBanTimesByUserId(userId).size()+1;

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) + duration);
        Date endDate = calendar.getTime();
        Timestamp endTime=new Timestamp(endDate.getTime());

        banTime.setUserId(userId);
        banTime.setBeginTime(beginTime);
        banTime.setEndTime(endTime);

        banTimeDao.save(banTime);
    }

    @Override
    public BanTime checkBan(Integer userId){
        Timestamp currentTime=new Timestamp(System.currentTimeMillis());
        List<BanTime> banTimes = banTimeDao.findBanTimesByUserId(userId);
        for(BanTime banTime : banTimes){
            if(banTime.getBeginTime().getTime()<=currentTime.getTime()&&banTime.getEndTime().getTime()>=currentTime.getTime())
                return banTime;
        }
        return null;
    }

    @Override
    public List<BanTime> findByUserId(Integer userId){
        return banTimeDao.findBanTimesByUserId(userId);
    }

    @Override
    public void unbanAUser(Integer userId) {
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        List<BanTime> banTimes = banTimeDao.findBanTimesByUserId(userId);
        for (BanTime banTime : banTimes) {
            if (banTime.getBeginTime().getTime() <= currentTime.getTime() && banTime.getEndTime().getTime() >= currentTime.getTime())
                banTimeDao.delete(banTime);
        }
    }
}
