package com.macs.franchise.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {

	@GetMapping("/public")
	public String publicAccess() {
		return "Public Content - No Login Required";
	}

	@GetMapping("/user")
	public String userAccess() {
		return "User Content - Any Authenticated User (Security Disabled)";
	}

	@GetMapping("/owner")
	public String ownerAccess() {
		return "Franchise Owner Dashboard (Security Disabled)";
	}

	@GetMapping("/admin")
	public String adminAccess() {
		return "Super Admin Board (Security Disabled)";
	}
}