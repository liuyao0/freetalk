package com.freetalk.freetalk_backend.AutoTask;

import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.utils.HotList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 *
 * @ClassName: UpdateHotWhenApplicationRun
 * @Description: 程序启动时自动运行： 在非整点时设置热榜列表，避免程序启动后，热榜更新前热榜为空
 * @author: He Jingkai
 * @date: 2021.7.21
 */


@Component
@Order(value = 1)
public class UpdateHotWhenApplicationRun implements ApplicationRunner {
    @Autowired
    private HotList hotList;
    @Autowired
    private TopicDao topicDao;

    @Override
    public void run(ApplicationArguments args) {
        hotList.setHotList(topicDao.getTopicsByPageSortedByHot(1,50));
    }
}
