package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 *
 * @ClassName: CommentController
 * @author: He Jingkai
 * @date: 2021.7.19
 */

@RestController
public class CommentController {
    @Autowired
    private CommentService commentservice;

    /**
     * @Description: 给一个回答点赞
     */
    @CrossOrigin
    @RequestMapping("/Security/likeAComment")
    public void likeAComment(@RequestParam("userId") String userId,
                             @RequestParam("commentId") String commentId){
        commentservice.likeAComment(userId,commentId);
    }

    /**
     * @Description: 收藏一个回答
     */
    @CrossOrigin
    @RequestMapping("/Security/starAComment")
    public void starAComment(@RequestParam("userId") String userId,
                             @RequestParam("commentId") String commentId){
        commentservice.starAComment(userId,commentId);
    }

    /**
     * @Description: 给一个回答取消点赞
     */
    @CrossOrigin
    @RequestMapping("/Security/unlikeAComment")
    public void unlikeAComment(@RequestParam("userId") String userId,
                               @RequestParam("commentId") String commentId){
        commentservice.unlikeAComment(userId,commentId);
    }

    /**
     * @Description: 取消收藏一个回答
     */
    @CrossOrigin
    @RequestMapping("/Security/unstarAComment")
    public void unstarAComment(@RequestParam("userId") String userId,
                               @RequestParam("commentId") String commentId){
        commentservice.unstarAComment(userId,commentId);
    }

    /**
     * @Description: 检查一个评论是否被用户点赞, 返回yes表示已被点赞, 返回no表示未被点赞
     */
    @CrossOrigin
    @RequestMapping("/Security/checkLikeAComment")
    public String checkLikeAComment(@RequestParam("userId") String userId,
                                    @RequestParam("commentId") String commentId){
        return commentservice.checkLikeAComment(userId,commentId);
    }

    /**
     * @Description: 检查一个评论是否被用户收藏, 返回yse表示已被收藏, 返回no表示未被收藏
     */
    @CrossOrigin
    @RequestMapping("/Security/checkStarAComment")
    public String checkStarAComment(@RequestParam("userId") String userId,
                                    @RequestParam("commentId") String commentId){
        return commentservice.checkStarAComment(userId,commentId);
    }

    /**
     * @Description: 添加评论
     */
    @CrossOrigin
    @RequestMapping("/Security/addAComment")
    public void addAComment(@RequestBody Map<String,Object> map){
        commentservice.addAComment(map);
    }

    /**
     * @Description: 获取一个话题的所有评论（不分页）
     */
    @CrossOrigin
    @RequestMapping("/allCommentsOfATopic")
    public List<Comment> allComments(@RequestParam("topicId") String topicId){
        return commentservice.findCommentsByTopic(topicId);
    }

    /**
     * @Description: 获取一个话题的所有评论（分页）
     */
//    @CrossOrigin
//    @RequestMapping("allCommentsOfATopicByPage")
//    public Page<Comment> getCommentsOfATopicByPage(@RequestParam("pageNum") String pageNum,
//                                                   @RequestParam("pageSize") String pageSize,
//                                                   @RequestParam("topicId") String topicId){
//        return commentservice.getCommentsOfATopicByPage(pageNum, pageSize, topicId);
//    }

    /**
     * @Description: 获取一个评论的所有评论
     */
    @CrossOrigin
    @RequestMapping("/findCommentsByReplyId")
    public List<Comment> findCommentsByReplyId(@RequestParam("replyId") String replyId){
        return commentservice.findCommentsByReply_id(Integer.valueOf(replyId));
    }

    /**
     * @Description: 修改回答
     */
    @CrossOrigin
    @RequestMapping("/Security/changeAComment")
    void changeAComment(@RequestBody Map<String,Object> map){
        commentservice.changeAComment(map);
    }

    /**
     * @Description: 删除一个回答
     * type1:用户自行删除
     * type2:法律法规或论坛规定, 经管理员审核删除
     */
    @CrossOrigin
    @RequestMapping("/deleteAComment")
    void deleteAComment(@RequestParam("commentId") Integer commentId, @RequestParam("type") Integer type){
        commentservice.deleteAComment(commentId, type);
    }

    @CrossOrigin
    @RequestMapping("/getAComment")
    Comment getAComment(@RequestParam("commentId") Integer commentId){
        return commentservice.findCommentByCommentId(commentId);
    }

}
