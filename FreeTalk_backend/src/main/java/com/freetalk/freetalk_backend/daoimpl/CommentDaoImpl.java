package com.freetalk.freetalk_backend.daoimpl;
import com.freetalk.freetalk_backend.dao.CommentDao;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import com.freetalk.freetalk_backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @ClassName: CommentDaoImpl
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Repository
public class CommentDaoImpl implements CommentDao {
    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Comment findCommentByCommentId(Integer commentId){
        return commentRepository.findCommentByCommentId(commentId);
    }

    @Override
    public List<Comment> findCommentsByTopic(Topic topic){
        return commentRepository.findCommentsByTopic(topic);
    }

    @Override
    public void saveAComment(Comment comment){
        commentRepository.save(comment);
    }

    @Override
    public List<Comment> findCommentsByReply_id(Integer replyId){
        return commentRepository.findCommentsByReplyId(replyId);
    }

    @Override
    public Page<Comment> getCommentsOfATopicByPage(Integer pageNum, Integer pageSize,Integer topicId){
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);
        return commentRepository.findCommentsByTopic_TopicId(pageRequest,topicId);
    }
}
