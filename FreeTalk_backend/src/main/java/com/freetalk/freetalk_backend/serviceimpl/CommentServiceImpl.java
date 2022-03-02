package com.freetalk.freetalk_backend.serviceimpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.freetalk.freetalk_backend.dao.*;
import com.freetalk.freetalk_backend.entity.*;
import com.freetalk.freetalk_backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: CommentDao
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentDao commentDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private UserInfoDao userInfoDao;
    @Autowired
    private TopicDao topicDao;
    @Autowired
    private TopicInfoDao topicInfoDao;
    @Autowired
    private MessageDao messageDao;


    @Override
    public Comment findCommentByCommentId(Integer commentId){
        return commentDao.findCommentByCommentId(commentId);
    }

    @Override
    public void saveAComment(Comment comment){
        commentDao.saveAComment(comment);
    }

    @Override
    public void likeAComment(String userId,String commentId){
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List<Comment> comments=user.getCommentsLike();
        Comment comment=commentDao.findCommentByCommentId(Integer.valueOf(commentId));
        Integer likes=comment.getLikes();

        likes+=1;
        comments.add(comment);

        comment.setLikes(likes);
        user.setCommentsLike(comments);
        commentDao.saveAComment(comment);
        userDao.saveAUser(user);
    }
    @Override
    public void starAComment(String userId,String commentId){
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List<Comment> comments=user.getCommentsStar();
        Comment comment=commentDao.findCommentByCommentId(Integer.valueOf(commentId));
        Integer stars=comment.getStars();

        stars+=1;
        comments.add(comment);

        comment.setStars(stars);
        user.setCommentsStar(comments);
        commentDao.saveAComment(comment);
        userDao.saveAUser(user);
    }

    @Override
    public void addAComment(Map<String,Object> map){
        String content=(String) map.get("content");
        Integer replyId=(Integer)map.get("replyId");
        Integer topicId=(Integer) map.get("topicId");
        Integer userId=(Integer) map.get("userId");
        Topic topic=topicDao.findTopicByTopicId(topicId);
        UserInfo user=userInfoDao.findUserInfoByUserId(userId);
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());

        if(replyId!=0){
            Comment comment=commentDao.findCommentByCommentId(replyId);
            Integer replyNumber=comment.getReplyNumber()+1;
            comment.setReplyNumber(replyNumber);
            commentDao.saveAComment(comment);
        }

        TopicInfo topicInfo=topicInfoDao.findTopicInfoByTopic_TopicId(topicId);
        topicInfo.setComments(topicInfo.getComments()+1);
        topicInfoDao.save(topicInfo);

        Comment comment=new Comment();
        comment.setCommentContent(content);
        comment.setReplyId(replyId);
        comment.setStars(0);
        comment.setReplyNumber(0);
        comment.setSendTime(timestamp);
        comment.setTopic(topic);
        comment.setUser(user);
        comment.setLikes(0);
        comment.setReplyNumber(0);
        commentDao.saveAComment(comment);
    }

    @Override
    public List<Comment> findCommentsByTopic(String topicId){
        Topic topic=topicDao.findTopicByTopicId(Integer.valueOf(topicId));
        return commentDao.findCommentsByTopic(topic);
    }

    @Override
    public List<Comment> findCommentsByReply_id(Integer replyId){
        return commentDao.findCommentsByReply_id(replyId);
    }

    @Override
    public void unlikeAComment(String userId,String commentId){
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List<Comment> comments=user.getCommentsLike();
        Comment comment=commentDao.findCommentByCommentId(Integer.valueOf(commentId));
        Integer likes=comment.getLikes();

        likes-=1;
        comments.removeIf(comment1 -> comment1.equals(comment));

        comment.setLikes(likes);
        user.setCommentsLike(comments);
        commentDao.saveAComment(comment);
        userDao.saveAUser(user);
    }

    @Override
    public void unstarAComment(String userId,String commentId){
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List<Comment> comments=user.getCommentsStar();
        Comment comment=commentDao.findCommentByCommentId(Integer.valueOf(commentId));
        Integer stars=comment.getStars();

        stars-=1;
        comments.removeIf(comment1 -> comment1.equals(comment));

        comment.setStars(stars);
        user.setCommentsStar(comments);
        commentDao.saveAComment(comment);
        userDao.saveAUser(user);
    }

    @Override
    public Page<Comment> getCommentsOfATopicByPage(String pageNum, String pageSize, String topicId){
        return commentDao.getCommentsOfATopicByPage(Integer.valueOf(pageNum),Integer.valueOf(pageSize),Integer.valueOf(topicId));
    }

    @Override
    public String checkLikeAComment(String userId,String commentId){
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List<Comment> comments=user.getCommentsLike();
        Comment comment=commentDao.findCommentByCommentId(Integer.valueOf(commentId));

        if(comments.contains(comment))
            return JSON.toJSONString("yes", SerializerFeature.BrowserCompatible);
        else
            return JSON.toJSONString("no", SerializerFeature.BrowserCompatible);
    }

    @Override
    public String checkStarAComment(String userId,String commentId){
        User user=userDao.findUserByUserId(Integer.valueOf(userId));
        List<Comment> comments=user.getCommentsStar();
        Comment comment=commentDao.findCommentByCommentId(Integer.valueOf(commentId));

        if(comments.contains(comment))
            return JSON.toJSONString("yes", SerializerFeature.BrowserCompatible);
        else
            return JSON.toJSONString("no", SerializerFeature.BrowserCompatible);
    }

    @Override
    public void changeAComment(Map<String,Object> map){
        String content=(String) map.get("content");
        Integer commentId=(Integer) map.get("commentId");
        Comment comment=commentDao.findCommentByCommentId(commentId);
        comment.setCommentContent(content);
        commentDao.saveAComment(comment);
    }

    @Override
    public void deleteAComment(Integer commentId, Integer type){
        Comment comment=commentDao.findCommentByCommentId(commentId);

        if(type!=1){
            Message message=new Message();
            message.setSendUser(userInfoDao.findUserInfoByUserId(1));
            message.setAcceptUser(userInfoDao.findUserInfoByUserId(comment.getUser().getUserId()));
            message.setMessageText("您好。您的回复 “"+comment.getCommentContent()+"” 因违反社区相关规定已被管理员删除。发布过多违规评论会被禁言，请您遵守社区相关规定");
            message.setSendTime(new Timestamp(System.currentTimeMillis()));
            message.setIsRead(0);
            messageDao.save(message);
        }

        String content;
        if(type==1)
            content="<div>本回答已由用户自行删除</div>";
        else
            content="<div>本回答违反相关法律法规或论坛规定，经用户举报和管理员审核后删除</div>";
        comment.setCommentContent(content);
        commentDao.saveAComment(comment);
    }

}
