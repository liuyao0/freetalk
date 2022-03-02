package com.freetalk.freetalk_backend.controller;

import com.alibaba.fastjson.JSONObject;
import com.freetalk.freetalk_backend.FreeTalkBackendApplication;
import com.freetalk.freetalk_backend.service.MessageService;
import com.freetalk.freetalk_backend.serviceimpl.MessageServiceImpl;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = FreeTalkBackendApplication.class,webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
class MessageControllerTest {
    @Autowired
    private TestRestTemplate testRestTemplate;

    private MockMvc mockMvc;

    @Mock
    private MessageService messageService=new MessageServiceImpl();

    @InjectMocks
    private MessageController messageController;

    private HttpEntity<String> getHttpEntity()
    {
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("userId", "1");
        requestHeaders.add("token", Base64.getEncoder().encodeToString("1和酮不让我下班".getBytes(StandardCharsets.UTF_8)));
        HttpEntity<String> requestEntity = new HttpEntity<String>(null, requestHeaders);
        return requestEntity;
    }

    @BeforeEach
    public void beforeEach() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(messageController).build();
    }

    @Test
    void getMessagesBetweenTwoUsers() {

        HttpEntity<String> requestEntity = getHttpEntity();
        ResponseEntity<List> response = testRestTemplate.exchange("/Security/getMessagesBetweenTwoUsers?me=2&you=1", HttpMethod.GET, requestEntity, List.class);
        List result=response.getBody();
        assert result != null;
        assertThat(result.size(),equalTo(16));
    }

    @Test
    void getNewMessagesBetweenTwoUsers() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/getNewMessagesBetweenTwoUsers?me=3&you=2")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void getAllUsersHasChattedWithAUser() {
        ResponseEntity<List> responseEntity=testRestTemplate.exchange("/Security/getAllUsersHasChattedWithAUser?userId=2", HttpMethod.GET,getHttpEntity(),List.class);
        List result=responseEntity.getBody();
        assert result != null;
        assertThat(result.size(),equalTo(2));
    }

    @Test
    @Rollback
    void postAMessage() throws Exception {
        Map<String,Object> map=new HashMap<>();
        map.put("sendUserId", 3);
        map.put("receiveUserId",2);
        map.put("messageContent","Hello world");
        String requestBody= JSONObject.toJSONString(map);
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/postAMessage")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
                .accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @Rollback
    void setAllMessageWithAUserHaveRead() throws Exception {
        RequestBuilder request = MockMvcRequestBuilders.post("/Security/setAllMessageWithAUserHaveRead?acceptUserId=3&sentUserId=2")
                .headers(getHttpEntity().getHeaders())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.TEXT_PLAIN);
        ResultActions perform = mockMvc.perform(request);
        perform.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @Rollback
    void numberOfMessagesUnreadWithAUser() {
        ResponseEntity<List> responseEntity=testRestTemplate.exchange("/Security/numberOfMessagesUnreadWithAUser?acceptUserId=3",HttpMethod.GET,getHttpEntity(),List.class);
        List result=responseEntity.getBody();
        assert result != null;
        assertThat(result.get(0),equalTo(1));
    }

    @Test
    @Rollback
    void numberOfMessagesUnread() {
        ResponseEntity<Integer> responseEntity=testRestTemplate.exchange("/Security/numberOfMessagesUnread?acceptUserId=3",HttpMethod.GET,getHttpEntity(),Integer.class);
        Integer result=responseEntity.getBody();
        assertThat(result,equalTo(11));
    }
}
