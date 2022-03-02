package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import com.freetalk.freetalk_backend.repository.TopicInfoRepository;
import com.freetalk.freetalk_backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TopicDaoImpl implements TopicDao {
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private TopicInfoRepository topicInfoRepository;


    @Override
    public List<Topic> getTopics(){
        return topicRepository.findAll();
    }

    @Override
    public Topic findTopicByTopicId(Integer topicId){
        return topicRepository.findTopicByTopicId(topicId);

    }



    @Override
    public Page<Topic> getTopicsByPage(Integer pageNum, Integer pageSize){
        PageRequest pageRequest=PageRequest.of(pageNum-1,pageSize);
        return topicRepository.findAll(pageRequest);
    }

    @Override
    public Topic saveATopic (Topic topic){
        return topicRepository.save(topic);
    }

    @Override
    public TopicInfo saveATopicInfo (TopicInfo topicInfo)
    {return topicInfoRepository.saveAndFlush(topicInfo);}

    /**
     *
     * @FunctionName: getTopicsByPageSortedByHot
     * @Description: 按照热度分页获取话题
     * @author: He Jingkai
     * @date: 2021.7.21
     */
    @Override
    public List<Topic> getTopicsByPageSortedByHot(Integer pageNum, Integer pageSize){
        Sort sort = Sort.by(Sort.Direction.DESC,"hot");
        PageRequest pageRequest=PageRequest.of(pageNum-1,pageSize,sort);
        List<TopicInfo> topicInfos=topicInfoRepository.findAll(pageRequest).getContent();
        List<Topic> topics=new ArrayList<>();
        for(TopicInfo topicInfo:topicInfos)
            topics.add(topicRepository.findTopicByTopicId(topicInfo.getTopicId()));
        return topics;
    }

    @Override
    public Long getTopicNum()
    {
        return topicRepository.count();
    }

    @Override
    public void delete(Topic topic){topicRepository.delete(topic);}

    @Override
    public Boolean checkTopicByTopicId(Integer topicId)
    {
        return topicRepository.existsByTopicId(topicId);
    }

}
