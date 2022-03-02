package com.freetalk.freetalk_backend.utils;

import com.freetalk.freetalk_backend.entity.Topic;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 *
 * @ClassName: UpdateHotWhenApplicationRun
 * @Description: 单例模式, 每小时更新一次热榜
 * @author: He Jingkai
 * @date: 2021.7.21
 */

@Component
public class HotList {
    static List<Topic> hotList;
    public void setHotList(List<Topic> hotList){
        HotList.hotList =hotList;
    }

    public List<Topic> getHotList() {
        return hotList;
    }
}
