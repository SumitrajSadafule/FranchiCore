package com.macs.franchise.controller;

import com.macs.franchise.dto.request.LoginRequest;
import com.macs.franchise.dto.request.SignupRequest;
import com.macs.franchise.dto.response.JwtResponse;
import com.macs.franchise.dto.response.MessageResponse;
import com.macs.franchise.model.Role;
import com.macs.franchise.model.User;
import com.macs.franchise.model.enums.RoleType;
import com.macs.franchise.repository.RoleRepository;
import com.macs.franchise.repository.UserRepository;
import com.macs.franchise.security.JwtUtils;
import com.macs.franchise.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) { // Removed @Valid
		try {
			System.out.println("=== LOGIN ATTEMPT ===");
			System.out.println("Username/Email: " + loginRequest.getUsernameOrEmail());

			Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
					loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);

			String jwt = jwtUtils.generateJwtToken(authentication);

			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			
			User user = userRepository.findById(userDetails.getId())
		            .orElseThrow(() -> new RuntimeException("User not found"));
		        user.setLastLoginDate(LocalDateTime.now());
		        userRepository.save(user);

			List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
					.collect(Collectors.toList());

			return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
					userDetails.getEmail(), userDetails.getFirstName(), userDetails.getLastName(), roles, null));

		} catch (Exception e) {
			e.printStackTrace(); // Add this to see the actual error
			return ResponseEntity.badRequest()
					.body(MessageResponse.error("Invalid username or password: " + e.getMessage()));
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) { // Removed @Valid
		try {
			System.out.println("=== REGISTRATION ATTEMPT ===");
			System.out.println("Username: " + signUpRequest.getUsername());

			if (userRepository.existsByUsername(signUpRequest.getUsername())) {
				return ResponseEntity.badRequest().body(MessageResponse.error("Username is already taken!"));
			}

			if (userRepository.existsByEmail(signUpRequest.getEmail())) {
				return ResponseEntity.badRequest().body(MessageResponse.error("Email is already in use!"));
			}

			User user = new User();
			user.setUsername(signUpRequest.getUsername());
			user.setEmail(signUpRequest.getEmail());
			user.setFirstName(signUpRequest.getFirstName());
			user.setLastName(signUpRequest.getLastName());
			user.setPhone(signUpRequest.getPhone());
			user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

			Set<Role> roles = new HashSet<>();
			Role customerRole = roleRepository.findByName(RoleType.ROLE_CUSTOMER)
					.orElseThrow(() -> new RuntimeException("Error: Role not found."));
			roles.add(customerRole);
			user.setRoles(roles);

			userRepository.save(user);

			return ResponseEntity.ok(MessageResponse.success("User registered successfully!"));

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(MessageResponse.error("Registration failed: " + e.getMessage()));
		}
	}
}