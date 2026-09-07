package com.eazypg.Auth_Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class AuthServiceApplication {

	private static final Logger log = LoggerFactory.getLogger(AuthServiceApplication.class);
	public static void main(String[] args) {

		log.info("Starting Auth Service...");
		SpringApplication.run(AuthServiceApplication.class, args);
	}

}
