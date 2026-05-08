package com.macs.franchise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test") // Add this - remove /api
public class SimpleTestController {

	@GetMapping("/123")
	public String test() {
		return "Test123 works!";
	}

	@GetMapping("/hello")
	public String hello() {
		return "Hello World!";
	}
}