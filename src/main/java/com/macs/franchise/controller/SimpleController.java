package com.macs.franchise.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/simple") // Remove /api from here
public class SimpleController {

	private static final Logger logger = LoggerFactory.getLogger(SimpleController.class);

	@GetMapping("/ping")
	public String ping() {
		logger.info("Simple ping endpoint called");
		return "simple pong";
	}
}