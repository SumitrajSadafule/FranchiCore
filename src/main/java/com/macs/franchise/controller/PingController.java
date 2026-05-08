package com.macs.franchise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping") // Remove /api from here
public class PingController {

	@GetMapping
	public String ping() {
		return "pong";
	}
}