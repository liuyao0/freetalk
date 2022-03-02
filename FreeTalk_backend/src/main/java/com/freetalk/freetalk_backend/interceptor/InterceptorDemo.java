package com.freetalk.freetalk_backend.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class InterceptorDemo extends HandlerInterceptorAdapter {


    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        System.out.println("前置拦截器1 preHandle： ");
        if(httpServletRequest.getMethod().equals("OPTIONS"))
            return true;
        String token = httpServletRequest.getHeader("token");
        String userId=httpServletRequest.getHeader("userId");
        String decoderStr = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
        if(!decoderStr.equals(userId+"和酮不让我下班"))return false;
        System.out.println(decoderStr);
        return true;
    }
}
