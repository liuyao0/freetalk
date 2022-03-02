package com.freetalk.freetalk_backend.controller;

import com.alibaba.fastjson.JSONObject;
import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dto.TopicView;
import com.freetalk.freetalk_backend.entity.Comment;
import com.freetalk.freetalk_backend.service.CommentService;
import com.freetalk.freetalk_backend.service.TopicService;
import com.freetalk.freetalk_backend.serviceimpl.CommentServiceImpl;
import com.freetalk.freetalk_backend.serviceimpl.TopicServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class,webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
class CommentControllerTest {
    @Autowired
    private TestRestTemplate testRestTemplate;

    private MockMvc mockMvc;

    private HttpEntity<String> getHttpEntity()
    {
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("userId", "1");
        requestHeaders.add("token", Base64.getEncoder().encodeToString("1和酮不让我下班".getBytes(StandardCharsets.UTF_8)));
        HttpEntity<String> requestEntity = new HttpEntity<String>(null, requestHeaders);
        return requestEntity;
    }

    @Mock
    private CommentService commentService=new CommentServiceImpl();

    @InjectMocks
    private CommentController commentController;
    @BeforeEach
    public void beforeEach() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(commentController).build();
    }
    @Test
    public void testLikeAComment() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/likeAComment?userId=2&commentId=8")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testStarAComment() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/starAComment?userId=2&commentId=8")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testUnlikeAComment() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/unlikeAComment?userId=2&commentId=8")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testUnStarAComment() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/unstarAComment?userId=2&commentId=8")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testCheckLikeAComment() throws Exception {
        ResponseEntity<String> responseEntity=testRestTemplate.exchange("/Security/checkLikeAComment?userId=5&commentId=10",HttpMethod.GET,getHttpEntity(),String.class);

        String result=responseEntity.getBody();
        assertThat(result,equalTo("\"yes\""));
    }
    @Test
    public void testCheckStarAComment() throws Exception {
        ResponseEntity<String> responseEntity=testRestTemplate.exchange("/Security/checkStarAComment?userId=2&commentId=10",HttpMethod.GET,getHttpEntity(),String.class);
        String result=responseEntity.getBody();
        assertThat(result,equalTo("\"yes\""));
    }
    @Test
    public void testAddAComment() throws Exception{
        Map<String,Object> map=new HashMap<>();
        map.put("content","刘尧");
        map.put("replyId",10);
        map.put("topicId",3);
        map.put("userId",6);
        String requestBody= JSONObject.toJSONString(map);
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/addAComment")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testAllCommentsOfATopic() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/allCommentsOfATopic?topicId=1")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testFindCommentsByReplyId() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/findCommentsByReplyId?replyId=9")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testChangeAComment() throws Exception{
        Map<String,Object> map=new HashMap<>();
        map.put("content","test");
        map.put("commentId",9);
        String requestBody= JSONObject.toJSONString(map);
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/changeAComment")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void deleteAComment() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/deleteAComment?commentId=9&type=1")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    public void testGetAComment() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.post("/getAComment?commentId=9")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.ALL);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
}
