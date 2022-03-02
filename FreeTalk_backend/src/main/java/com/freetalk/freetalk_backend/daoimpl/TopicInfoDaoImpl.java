package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.TopicInfoDao;
import com.freetalk.freetalk_backend.entity.TopicInfo;
import com.freetalk.freetalk_backend.repository.TopicInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TopicInfoDaoImpl implements TopicInfoDao{
    @Autowired
    private TopicInfoRepository topicInfoRepository;

    @Override
    public TopicInfo findTopicInfoByTopic_TopicId(Integer topicId){
        return topicInfoRepository.findTopicInfoByTopicId(topicId);
    }

    @Override
    public void save(TopicInfo topicInfo){
        topicInfoRepository.save(topicInfo);
    }

    @Override
    public void delete(TopicInfo topicInfo){topicInfoRepository.delete(topicInfo);}

}
