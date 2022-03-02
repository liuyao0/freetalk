package com.freetalk.freetalk_backend.AutoTask;

import com.freetalk.freetalk_backend.utils.RecommenderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @ClassName: TrainRecommendSystemWhenApplicationRun
 * @Description: 整点时训练推荐系统
 * @author: 刘尧
 * @date: 2021.7.26
 */

@Configuration
@EnableScheduling
public class TrainRecommendSystem{
    @Autowired
    private RecommenderUtil recommenderUtil;

    @Scheduled(cron = "0 0 0/1 * * ?")
    @Transactional
    public void configureTasks(){
        recommenderUtil.train();
    }
}
