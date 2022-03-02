package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dao.CommentDao;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.service.CommentService;
import com.freetalk.freetalk_backend.service.TopicService;
import com.freetalk.freetalk_backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class)
@Transactional
class CommentServiceImplTest {
    @Autowired
    private CommentService commentService;
    @Autowired
    private TopicService topicService;
    @Autowired
    private UserService userService;
    @Autowired
    private CommentDao commentDao;
    @Test
    void findCommentByCommentId() {
        Comment comment=commentService.findCommentByCommentId(8);
        assertThat(comment.getCommentId(),equalTo(8));
        assertThat(comment.getCommentContent(),equalTo("<body><h1>河童最厉害了！！</h1></body>"));
    }

    @Test
    void saveAComment() {
        Comment comment=commentService.findCommentByCommentId(8);
        comment.setCommentContent("这也太多了");
        comment.setLikes(1);
        comment.setStars(1);
        comment.setReplyId(0);
        commentService.saveAComment(comment);
        assertThat(commentService.findCommentByCommentId(8).getCommentContent(),equalTo("这也太多了"));
    }

    @Test
    void likeAComment() {
        Comment comment=commentService.findCommentByCommentId(8);
        commentService.likeAComment("2","8");
    }

    @Test
    void starAComment() {
        Comment comment=commentService.findCommentByCommentId(8);
        commentService.starAComment("2","8");
    }

    @Test
    void addAComment() {
        Integer number=commentService.findCommentsByTopic("1").size();
        Map<String,Object> map=new HashMap<>();
        map.put("content", "qyc");
        map.put("replyId",0);
        map.put("topicId",1);
        map.put("userId", 2);
        commentService.addAComment(map);
        assertThat(commentService.findCommentsByTopic("1").size(),equalTo(number+1));
        Integer number2=commentService.findCommentsByReply_id(8).size();
        Map<String,Object> map2=new HashMap<>();
        map2.put("content", "qyc");
        map2.put("replyId",8);
        map2.put("topicId",1);
        map2.put("userId", 2);
        commentService.addAComment(map2);
        assertThat(commentService.findCommentsByReply_id(8).size(),equalTo(number2+1));
    }

    @Test
    void findCommentsByTopic() {
        List<Comment> comments=commentService.findCommentsByTopic("1");
        assertThat(comments.size(),equalTo(8));
        assertThat(comments.get(0).getCommentId(),equalTo(8));
    }

    @Test
    void findCommentsByReply_id() {
        List<Comment> comments=commentService.findCommentsByReply_id(9);
        assertThat(comments.size(),equalTo(2));
        assertThat(comments.get(0).getCommentId(),equalTo(10));
    }

    @Test
    void unlikeAComment() {
        Comment comment=commentService.findCommentByCommentId(8);
        Integer number=comment.getLikes();
        commentService.unlikeAComment("2","8");
        assertThat(comment.getLikes(),equalTo(number-1));
    }

    @Test
    void unstarAComment() {
        Comment comment=commentService.findCommentByCommentId(8);
        Integer number=comment.getStars();
        commentService.unstarAComment("2","8");
        assertThat(comment.getStars(),equalTo((number-1)));
    }

    @Test
    void checkLikeAComment() {
        String s=commentService.checkLikeAComment("5","10");
        assertThat(s,equalTo("\"yes\""));
        assertThat(commentService.checkLikeAComment("3","10"),equalTo("\"no\""));
    }

    @Test
    void checkStarAComment() {
        String s=commentService.checkStarAComment("2","10");
        assertThat(s,equalTo("\"yes\""));
        assertThat(commentService.checkStarAComment("5","10"),equalTo("\"no\""));
    }

    @Test
    void changeAComment() {
        Map<String,Object> map=new HashMap<>();
        map.put("content", "abc");
        map.put("commentId",10);
        commentService.changeAComment(map);
        assertThat(commentService.findCommentByCommentId(10).getCommentContent(),equalTo("abc"));
    }

    @Test
    void deleteAComment() {
        commentService.deleteAComment(9,1);
        commentService.deleteAComment(10,0);
        assertThat(commentService.findCommentByCommentId(9).getCommentContent(),equalTo("<div>本回答已由用户自行删除</div>"));
        assertThat(commentService.findCommentByCommentId(10).getCommentContent(),equalTo("<div>本回答违反相关法律法规或论坛规定，经用户举报和管理员审核后删除</div>"));
    }
}
