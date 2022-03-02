package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.CommentDao;
import com.freetalk.freetalk_backend.dao.TopicDao;
import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.Topic;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;

import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class CommentDaoImplTest {
    @Autowired
    private CommentDao commentDao;
    @Autowired
    private TopicDao topicDao;
    @Autowired
    private UserDao userDao;
    @Test
    void findCommentByCommentId() {
        Comment comment=commentDao.findCommentByCommentId(8);
        assertThat(comment.getCommentContent(),equalTo("<body><h1>河童最厉害了！！</h1></body>"));
    }

    @Test
    void findCommentsByTopic() {
        List<Comment> comments=commentDao.findCommentsByTopic(topicDao.findTopicByTopicId(1));
        assertThat(comments.size(),equalTo(8));
        assertThat(comments.get(0).getCommentId(),equalTo(8));
    }

    @Test
    void saveAComment() {
        Comment comment=commentDao.findCommentByCommentId(9);
        comment.setCommentContent("测试");
        commentDao.saveAComment(comment);
        assertThat(commentDao.findCommentByCommentId(9).getCommentContent(),equalTo("测试"));
    }

    @Test
    void findCommentsByReply_id() {
        List<Comment> comments=commentDao.findCommentsByReply_id(9);
        assertThat(comments.get(0).getCommentId(),equalTo(10));
    }
//
//    @Test
//    void getCommentsOfATopicByPage() {
//    }
}
