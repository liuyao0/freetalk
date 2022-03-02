package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @date: 2021.7.19
 */

public interface CommentRepository extends JpaRepository<Comment,Integer> {
    Comment findCommentByCommentId(Integer commentId);

    List<Comment> findCommentsByTopic(Topic topic);

    List<Comment> findCommentsByReplyId(Integer replyId);

    Page<Comment> findCommentsByTopic_TopicId(PageRequest pageRequest,Integer topicId);
}
