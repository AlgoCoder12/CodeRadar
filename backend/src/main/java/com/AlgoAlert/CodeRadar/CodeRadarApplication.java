package com.AlgoAlert.CodeRadar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CodeRadarApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodeRadarApplication.class, args);
	}

}
