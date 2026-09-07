package com.eazypg.apigateway.config;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class MultipartLoggingFilter implements WebFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String contentType = exchange.getRequest().getHeaders().getContentType() != null
                ? exchange.getRequest().getHeaders().getContentType().toString()
                : "null";
        System.out.println(">> Incoming content-type: " + contentType);
        return chain.filter(exchange);
    }
}