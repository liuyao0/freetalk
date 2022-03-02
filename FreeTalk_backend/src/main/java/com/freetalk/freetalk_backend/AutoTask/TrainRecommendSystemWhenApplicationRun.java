package com.freetalk.freetalk_backend.AutoTask;

import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.utils.HotList;
import com.freetalk.freetalk_backend.utils.RecommenderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @ClassName: TrainRecommendSystemWhenApplicationRun
 * @Description: 程序启动时自动运行：训练推荐系统
 * @author: 刘尧
 * @date: 2021.8.4
 */


@Component
@Order(value = 2)

public class TrainRecommendSystemWhenApplicationRun implements ApplicationRunner{
    @Autowired
    RecommenderUtil recommenderUtil;
    @Override
    public void run(ApplicationArguments args) {
        recommenderUtil.train();
    }
}
