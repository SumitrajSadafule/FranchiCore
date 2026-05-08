package com.macs.franchise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health") // Remove /api from here
public class HealthController {

	@GetMapping("/check")
	public Map<String, String> check() {
		Map<String, String> response = new HashMap<>();
		response.put("status", "UP");
		response.put("message", "Application is running");
		response.put("timestamp", new java.util.Date().toString());
		return response;
	}
}