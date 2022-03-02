package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @Description: getCommentsOfATopicByPage()可能存在问题
 * @date: 2021.7.19
 */

public interface CommentDao {
    Comment findCommentByCommentId(Integer commentId);

    List<Comment> findCommentsByTopic(Topic topic);

    void saveAComment(Comment comment);

    List<Comment> findCommentsByReply_id(Integer replyId);

    Page<Comment> getCommentsOfATopicByPage(Integer pageNum, Integer pageSize, Integer topicId);

    }
