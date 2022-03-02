package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.dto.TopicView;
import com.freetalk.freetalk_backend.service.TopicService;
import com.freetalk.freetalk_backend.utils.HotList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: TopicController
 * @Descrption: 完成了对话题的收藏.点赞以及相应的删除
 * @author: gy
 * @date: 2021.7.20
 */

@RestController
public class TopicController {
    @Autowired
    private TopicService topicService;
    @Autowired
    private HotList hotList;

    @CrossOrigin
    @RequestMapping(value = "/getTopics/{pageNum}/{pageSize}")
    public List<TopicView> getTopics(@PathVariable(name = "pageNum") Integer pageNum,
                                     @PathVariable(name = "pageSize") Integer pageSize){
        System.out.println("getTopics"+pageNum+pageSize);
        return topicService.getTopicViewsByPage(pageNum,pageSize);
    }

    @CrossOrigin
    @RequestMapping(value = "/getSearchedTopics/{search}/{pageNum}/{pageSize}")
    public List<TopicView> getSearchedTopicsByPage(@PathVariable(name = "search") String search,
                                                   @PathVariable(name = "pageNum") Integer pageNum,
                                                   @PathVariable(name = "pageSize") Integer pageSize){
        return topicService.getSearchedTopicViewsByPage(search,pageNum,pageSize);
    }

    @CrossOrigin
    @RequestMapping(value = "/getSearchedTopicSize/{search}")
    public int getSearchedTopicSize(@PathVariable(name = "search") String search){
        System.out.println(topicService.getSearchedTopicSize(search));
        return topicService.getSearchedTopicSize(search);
    }

    @CrossOrigin
    @RequestMapping(value = "/getTopicSize")
    public String getTopicSize(){
        return String.valueOf(topicService.getTopicNum());
    }

    @CrossOrigin
    @RequestMapping(value = "/getATopicView/{topicId}")
    public TopicView getATopicView(@PathVariable(name = "topicId") Integer topicId)
    {
        return topicService.getATopicView(topicId);
    }
    @CrossOrigin
    @RequestMapping(value = "/Security/addATopic")
    public void addATopic(@RequestBody Map<String,Object> map){
        topicService.addATopic(map);
    }

    @CrossOrigin
    @RequestMapping(value = "/browseATopic/{topicId}")
    public void browseATopic(@PathVariable(name = "topicId") Integer topicId){
        topicService.browseATopic(topicId);
    }

    @CrossOrigin
    @RequestMapping(value = "/Security/starATopic/{topicId}/{userId}")
    public void starATopic(@PathVariable(name = "topicId") Integer topicId,
                           @PathVariable(name = "userId") Integer userId){
         topicService.starATopic(topicId,userId);
    }

    @CrossOrigin
    @RequestMapping(value = "/Security/undoStarATopic/{topicId}/{userId}")
    public void undoStarATopic(@PathVariable(name = "topicId") Integer topicId,
                           @PathVariable(name = "userId") Integer userId){
        topicService.undoStarATopic(topicId,userId);
    }

    @CrossOrigin
    @RequestMapping(value = "/Security/likeATopic/{topicId}/{userId}")
    public void likeATopic(@PathVariable(name = "topicId") Integer topicId,
                           @PathVariable(name = "userId") Integer userId){
        topicService.likeATopic(topicId,userId);
    }

    @CrossOrigin
    @RequestMapping(value = "/Security/undoLikeATopic/{topicId}/{userId}")
    public void undoLikeATopic(@PathVariable(name = "topicId") Integer topicId,
                           @PathVariable(name = "userId") Integer userId){
        topicService.undoLikeATopic(topicId,userId);
    }

    @CrossOrigin
    @RequestMapping(value="/checkUserStar/{topicId}/{userId}")
    public String checkUserStar(@PathVariable(name = "topicId") Integer topicId,
                                @PathVariable(name = "userId") Integer userId){
        return String.valueOf(topicService.checkUserStar(topicId,userId));
    }

    @CrossOrigin
    @RequestMapping(value="/checkUserLike/{topicId}/{userId}")
    public String checkUserLike(@PathVariable(name = "topicId") Integer topicId,
                                @PathVariable(name = "userId") Integer userId){
        return String.valueOf(topicService.checkUserLike(topicId,userId));
    }

    /**
     *
     * @FunctionName: getTopHotTopics
     * @Description: 获取热榜
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    @CrossOrigin
    @RequestMapping(value="/getHotTopics/{size}")
    public List<TopicView> getTopHotTopics(@PathVariable(name = "size") String size){
//        return hotList.getHotList();
        return topicService.getTopHotTopics(Integer.valueOf(size));
    }

    @CrossOrigin
    @RequestMapping(value = "/getRecommendTopics")
    public List<TopicView> getRecommendTopics(@RequestParam(name = "userId") Integer userId,@RequestParam(name = "size") Integer size){
        return topicService.getRecommendTopics(userId,size);
    }

    @CrossOrigin
    @RequestMapping(value = "/deleteATopic")
    public void deleteATopic(@RequestParam(name = "topicId") Integer topicId){
        topicService.delete(topicId);
    }

    @CrossOrigin
    @RequestMapping(value = "/changeWeightOfATopic")
    public void changeWeightOfATopic(@RequestParam(name = "topicId") Integer topicId,@RequestParam(name = "weight") double weight){
        topicService.changeWeight(topicId,weight);
    }


}
