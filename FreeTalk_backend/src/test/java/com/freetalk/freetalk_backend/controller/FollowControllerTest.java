package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.service.FollowService;
import com.freetalk.freetalk_backend.service.UserService;
import com.freetalk.freetalk_backend.serviceimpl.FollowServiceImpl;
import com.freetalk.freetalk_backend.serviceimpl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class,webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
public class FollowControllerTest {

    @Autowired
    private TestRestTemplate testRestTemplate;

    private MockMvc mockMvc;

    @Mock
    private FollowService topicService=new FollowServiceImpl();

    @Mock
    private UserService userService=new UserServiceImpl();

    @InjectMocks
    private FollowController followController;

    @BeforeEach
    public void beforeEach() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(followController).build();
    }

    private HttpEntity<String> getHttpEntity()
    {
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("userId", "1");
        requestHeaders.add("token", Base64.getEncoder().encodeToString("1和酮不让我下班".getBytes(StandardCharsets.UTF_8)));
        HttpEntity<String> requestEntity = new HttpEntity<String>(null, requestHeaders);
        return requestEntity;
    }


    @Test
    public void followAUser() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/Security/followAUser?userId=3&userId_toFollow=5").headers(getHttpEntity().getHeaders()).accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void unfollowAUser() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/Security/unfollowAUser?userId=2&userId_toFollow=4").headers(getHttpEntity().getHeaders()).accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getAllUserFollowingMe() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getAllUserFollowingMe?userId=4").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getAllUserIFollowing() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getAllUserIFollowing?userId=4").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getTopicOfFollowingUsers() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getTopicOfFollowingUsers?userId=1").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getCommentsOfFollowingUsers() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getCommentsOfFollowingUsers?userId=1").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getUserAnswerMyCommentAndTopic() throws Exception{
        RequestBuilder request = MockMvcRequestBuilders.get("/getUserAnswerMyCommentAndTopic?userId=1").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getUserLikeAComment() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getUserLikeAComment?commentId=1").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getUserStarAComment() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getUserStarAComment?commentId=1").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getUserLikeATopic() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/getUserLikeATopic?topicId=1").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getTopicsUserLike() {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getTopicsUserLike?userId=3",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
    }

    @Test
    void getTopicsUserStar() {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getTopicsUserStar?userId=1",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
    }

    @Test
    void getCommentsUserLike() {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getCommentsUserLike?userId=1",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));

    }

    @Test
    void getCommentsUserStar() {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getCommentsUserStar?userId=1",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
    }

    @Test
    void getCommentsUserCreat() {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getCommentsUserCreat?userId=1",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
    }

    @Test
    void getTopicsUserCreat() {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getTopicsUserCreat?userId=1",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
    }

    @Test
    void checkUserFollow() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/checkUserFollow?userId=1&userId_toFollow=2").accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }
}
