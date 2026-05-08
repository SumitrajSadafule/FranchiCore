package com.macs.franchise.controller;

import com.macs.franchise.model.User;
import com.macs.franchise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test-auth")
public class TestAuthController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	public ResponseEntity<?> testLogin(@RequestBody Map<String, String> loginRequest) {
		String usernameOrEmail = loginRequest.get("usernameOrEmail");
		String password = loginRequest.get("password");

		System.out.println("Login attempt for: " + usernameOrEmail);

		// Find user by username or email
		User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElse(null);

		if (user == null) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
		}

		// Check password
		if (passwordEncoder.matches(password, user.getPassword())) {
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Login successful");
			response.put("userId", user.getId());
			response.put("username", user.getUsername());
			response.put("email", user.getEmail());
			response.put("firstName", user.getFirstName());
			response.put("lastName", user.getLastName());
			response.put("roles", user.getRoles().stream().map(r -> r.getName().name()).toList());

			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid password"));
		}
	}

	@GetMapping("/users")
	public ResponseEntity<?> getAllUsers() {
		return ResponseEntity.ok(userRepository.findAll());
	}
}