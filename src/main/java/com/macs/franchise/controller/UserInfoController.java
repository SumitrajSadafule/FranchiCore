package com.macs.franchise.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserInfoController {

	@GetMapping("/info")
	public Map<String, Object> getUserInfo() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		Map<String, Object> response = new HashMap<>();
		response.put("authenticated", authentication != null && authentication.isAuthenticated());
		response.put("isAnonymous",
				authentication != null && authentication.getPrincipal().toString().equals("anonymousUser"));

		if (authentication != null && !authentication.getPrincipal().toString().equals("anonymousUser")) {
			response.put("name", authentication.getName());
			response.put("authorities", authentication.getAuthorities());
			response.put("principal", authentication.getPrincipal().toString());
		}

		return response;
	}
}