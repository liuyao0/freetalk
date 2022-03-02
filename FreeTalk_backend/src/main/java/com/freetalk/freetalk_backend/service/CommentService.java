package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.entity.Comment;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @Description: 删除回答选项：
 * type1:用户自行删除
 * type2:法律法规或论坛规定, 经管理员审核删除
 * @date: 2021.7.19
 */

public interface CommentService {
    Comment findCommentByCommentId(Integer commentId);

    void saveAComment(Comment comment);


    void likeAComment(String userId,String commentId);

    void starAComment(String userId,String commentId);

    void unlikeAComment(String userId,String commentId);

    void unstarAComment(String userId,String commentId);

    String checkLikeAComment(String userId,String commentId);

    String checkStarAComment(String userId,String commentId);

    void addAComment(Map<String,Object> map);

    List<Comment> findCommentsByTopic(String topicId);

    List<Comment> findCommentsByReply_id(Integer replyId);

    Page<Comment> getCommentsOfATopicByPage(String pageNum, String pageSize, String topicId);

    void changeAComment(Map<String,Object> map);

    void deleteAComment(Integer commentId, Integer type);
}
