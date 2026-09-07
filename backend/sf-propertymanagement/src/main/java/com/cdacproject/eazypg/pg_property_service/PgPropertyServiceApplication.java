package com.cdacproject.eazypg.pg_property_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = "com.cdacproject.eazypg.pg_property_service")
@EnableJpaRepositories(basePackages = "com.cdacproject.eazypg.pg_property_service.repository")
@EntityScan(basePackages = "com.cdacproject.eazypg.pg_property_service.model")
@EnableJpaAuditing
@EnableDiscoveryClient
public class PgPropertyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PgPropertyServiceApplication.class, args);
    }
}
