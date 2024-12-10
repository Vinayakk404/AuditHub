package com.tvsmotor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class QcmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(QcmicroserviceApplication.class, args);
	}

}
