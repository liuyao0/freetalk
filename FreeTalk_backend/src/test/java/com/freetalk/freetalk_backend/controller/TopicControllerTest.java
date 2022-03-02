package com.freetalk.freetalk_backend.controller;

import com.alibaba.fastjson.JSONObject;
import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.dto.TopicView;
import com.freetalk.freetalk_backend.service.TopicService;
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
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class,webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
public class TopicControllerTest {

    @Autowired
    private TestRestTemplate testRestTemplate;

    private MockMvc mockMvc;

    @Mock
    private TopicService topicService=new TopicServiceImpl();

    @InjectMocks
    private TopicController topicController;

    @BeforeEach
    public void beforeEach() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(topicController).build();
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
    public void testGetTopics() throws Exception {
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getTopics/2/2",List.class);
        List result=responseEntity.getBody();
        assertThat(result.size(),equalTo(2));
    }

    @Test
    public void testGetSearchedTopicsByPage() throws Exception{
        ParameterizedTypeReference<List<TopicView>> type=new ParameterizedTypeReference<List<TopicView>>() {};
        ResponseEntity<List<TopicView>> responseEntity=testRestTemplate.exchange("/getSearchedTopics/河童/1/3", HttpMethod.GET,null,type);
        List<TopicView> result=responseEntity.getBody();
        Collection<String> stringCollection=new HashSet<>();
        for(TopicView o:result)
        {
            TopicView topicView=(TopicView) o;
            stringCollection.add(topicView.getTitle());
        }
        assertThat(stringCollection.size(),equalTo(3));
        assertThat(stringCollection.contains("如何看待河童？"),equalTo(true));
        assertThat(stringCollection.contains("河童是嘉心糖吗？"),equalTo(true));
        assertThat(stringCollection.contains("“童河”牌药膏的效果如何？"),equalTo(true));
    }


    @Test
    @Transactional
    @Rollback
    public void testAddATopic() throws Exception{
        Map<String,Object> map=new HashMap<>();
        map.put("title", "如何看待河童是嘉心糖？");
        map.put("topic_description","我们都知道，河童是嘉心糖，那么，如何看待河童是嘉心糖呢？");
        map.put("userId",1);
        String requestBody= JSONObject.toJSONString(map);
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/addATopic")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
                .accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testGetATopicView()
    {
        ResponseEntity<TopicView> responseEntity=testRestTemplate.getForEntity("/getATopicView/1",TopicView.class);
        TopicView topicView=responseEntity.getBody();
        assert topicView != null;
        assertThat(topicView.getTopicId(),equalTo(1));
        assertThat(topicView.getTitle(),equalTo("如何看待河童？"));
        assertThat(topicView.getTopicDescription(),equalTo("<body<p>如何看待河童？</p></body>"));
        assertThat(topicView.getUserId(),equalTo(1));
    }

    @Test
    public void testBrowseATopic() throws Exception {
        RequestBuilder request=MockMvcRequestBuilders.get("/browseATopic/1").accept(MediaType.TEXT_PLAIN);
        ResultActions perform=mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testStarATopic() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/Security/starATopic/3/5").headers(getHttpEntity().getHeaders()).accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }


    @Test
    public void testUndoStarATopic() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/Security/undoStarATopic/1/1").headers(getHttpEntity().getHeaders()).accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }


    @Test
    public void testLikeATopic() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/Security/likeATopic/3/5").headers(getHttpEntity().getHeaders()).accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testUndoLikeATopic() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.get("/Security/undoLikeATopic/3/5").headers(getHttpEntity().getHeaders()).accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testCheckUserStar() throws Exception{
        ResponseEntity<String> responseEntity=testRestTemplate.getForEntity("/checkUserStar/1/1",String.class);
        String response=responseEntity.getBody();
        assertThat(response,equalTo("true"));
        responseEntity=testRestTemplate.getForEntity("/checkUserStar/1/5",String.class);
        response=responseEntity.getBody();
        assertThat(response,equalTo("false"));
    }

    @Test
    public void testCheckUserLike() throws Exception{
        ResponseEntity<String> responseEntity=testRestTemplate.getForEntity("/checkUserLike/1/1",String.class);
        String response=responseEntity.getBody();
        assertThat(response,equalTo("true"));
        responseEntity=testRestTemplate.getForEntity("/checkUserLike/1/5",String.class);
        response=responseEntity.getBody();
        assertThat(response,equalTo("false"));
    }

    @Test
    public void testGetTopHotTopics() throws Exception{
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getHotTopics/20",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
        List response=responseEntity.getBody();
        assertThat(response.size(),equalTo(6));

        responseEntity=testRestTemplate.getForEntity("/getHotTopics/2",List.class);
        response=responseEntity.getBody();
        assertThat(response.size(),equalTo(2));
    }

    @Test
    public void testGetRecommendHotTopics() throws Exception{
        ResponseEntity<List> responseEntity=testRestTemplate.getForEntity("/getRecommendTopics?userId=1&size=20",List.class);
        assertThat(responseEntity.getStatusCode(),equalTo(HttpStatus.OK));
        List response=responseEntity.getBody();
        assertThat(response.size(),equalTo(6));

        responseEntity=testRestTemplate.getForEntity("/getRecommendTopics?userId=1&size=2",List.class);
        response=responseEntity.getBody();
        assertThat(response.size(),equalTo(2));
    }







}
