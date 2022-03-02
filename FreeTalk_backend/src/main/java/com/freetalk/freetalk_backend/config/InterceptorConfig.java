package com.freetalk.freetalk_backend.config;

import com.freetalk.freetalk_backend.interceptor.InterceptorDemo;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Resource
    InterceptorDemo interceptorDemo;
    /**
     * 注册自定义拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(interceptorDemo).addPathPatterns("/Security/**");
    }
}
