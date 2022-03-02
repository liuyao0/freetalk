package com.freetalk.freetalk_backend.config;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MyFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        httpServletResponse.setHeader(
                "Baeldung-Example-Filter-Header", "Value-Filter");
        httpServletResponse.setHeader("Access-Control-Allow-Origin","*");
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,POST");
        httpServletResponse.setHeader("Access-Control-Allow-Headers","*");
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
