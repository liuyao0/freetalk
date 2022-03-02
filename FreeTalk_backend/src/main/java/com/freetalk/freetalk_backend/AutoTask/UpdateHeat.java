package com.freetalk.freetalk_backend.AutoTask;

import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.utils.HotList;
import com.freetalk.freetalk_backend.utils.RecommenderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 *
 * @ClassName: UpdateHeat
 * @Description: 定时任务： 每整点执行一次来更新热度
 * @Description: 更新热度的算法（Hacker News算法）：
 * 1.话题评分：浏览数*20+回答数*50+点赞数*30+收藏数*40
 * 2.热度=权重*话题评分/（发布以来经过的时间+1）^1.8
 * 3.权重发布之后默认为1, 管理员可以通过调整权重来调节热榜实现降热度或升热度
 * 4.话题评分分权后期继续调节，亦可以给予管理员调节权力
 * @author: He Jingkai
 * @date: 2021.7.21
 */

@Configuration
@EnableScheduling
public class UpdateHeat {
    @Autowired
    private HotList hotList;
    @Autowired
    private TopicDao topicDao;
    @Autowired
    private RecommenderUtil recommenderUtil;

    @Scheduled(cron = "0 0 0/1 * * ?")
    private void configureTasks(){
         hotList.setHotList(topicDao.getTopicsByPageSortedByHot(1,50));
    }

}
