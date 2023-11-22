package com.example.mondaycode;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class QuickstartApplication {

	@Value("${NAME:World}")
  	String name;

  	@RestController
  	class HelloworldController {
    	@GetMapping("/")
    	String hello() {
			Map<String, String> env = System.getenv();
        	for (String envName : env.keySet()) {
            	System.out.format("%s=%s%n", envName, env.get(envName));
        	}
      		return "Hello from Java Spring Boot " + name + "!";
    }
  }

	public static void main(String[] args) {
		SpringApplication.run(QuickstartApplication.class, args);
	}

}
