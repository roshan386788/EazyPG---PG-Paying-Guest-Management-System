package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            HttpServletRequest request = attrs.getRequest();
            String userRole = request.getHeader("X-User-Role");
            String userEmail = request.getHeader("X-User-Email");
            String userId = request.getHeader("X-User-Id");

            if (userRole != null) template.header("X-User-Role", userRole);
            if (userEmail != null) template.header("X-User-Email", userEmail);
            if (userId != null) template.header("X-User-Id", userId);
        }
    }
}

