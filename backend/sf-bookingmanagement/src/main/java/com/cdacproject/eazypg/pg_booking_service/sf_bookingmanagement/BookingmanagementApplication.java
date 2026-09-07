package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients()
public class BookingmanagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookingmanagementApplication.class, args);
	}
}
