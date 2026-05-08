package com.macs.franchise.controller;

import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.Role;
import com.macs.franchise.model.User;
import com.macs.franchise.model.enums.RoleType;
import com.macs.franchise.repository.FranchiseRepository;
import com.macs.franchise.repository.RoleRepository;
import com.macs.franchise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private FranchiseRepository franchiseRepository;

	// ===== GET all users (with pagination) =====
	@GetMapping
	public ResponseEntity<Map<String, Object>> getAllUsers(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "ASC") String direction) {

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<User> userPage = userRepository.findAll(pageable);

		List<Map<String, Object>> users = userPage.getContent().stream().map(this::convertToResponseMap)
				.collect(Collectors.toList());

		Map<String, Object> response = new HashMap<>();
		response.put("content", users);
		response.put("pageNumber", userPage.getNumber());
		response.put("pageSize", userPage.getSize());
		response.put("totalElements", userPage.getTotalElements());
		response.put("totalPages", userPage.getTotalPages());

		return ResponseEntity.ok(response);
	}

	// ===== CREATE new user =====
	@PostMapping
	public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> request) {
		String username = (String) request.get("username");
		String email = (String) request.get("email");
		String password = (String) request.get("password");
		String firstName = (String) request.get("firstName");
		String lastName = (String) request.get("lastName");
		String phone = (String) request.get("phone");
		String role = (String) request.get("role");
		Boolean enabled = (Boolean) request.get("enabled");

		Long franchiseId = request.get("franchiseId") != null ? ((Number) request.get("franchiseId")).longValue()
				: null;

		// Check if username exists
		if (userRepository.existsByUsername(username)) {
			Map<String, Object> error = new HashMap<>();
			error.put("message", "Username already exists");
			return ResponseEntity.badRequest().body(error);
		}

		// Check if email exists
		if (userRepository.existsByEmail(email)) {
			Map<String, Object> error = new HashMap<>();
			error.put("message", "Email already exists");
			return ResponseEntity.badRequest().body(error);
		}

		User user = new User();
		user.setUsername(username);
		user.setEmail(email);
		user.setFirstName(firstName);
		user.setLastName(lastName);
		user.setPhone(phone);
		user.setPassword(passwordEncoder.encode(password));
		user.setEnabled(enabled != null ? enabled : true);

		// Assign role
		RoleType roleType = RoleType.valueOf(role);
		Role userRole = roleRepository.findByName(roleType).orElseThrow(() -> new RuntimeException("Role not found"));
		Set<Role> roles = new HashSet<>();
		roles.add(userRole);
		user.setRoles(roles);

		// Save user first to get ID
		User savedUser = userRepository.save(user);

		// Handle franchise assignment
		if (franchiseId != null && role.equals("ROLE_FRANCHISE_OWNER")) {
			Franchise franchise = franchiseRepository.findById(franchiseId)
					.orElseThrow(() -> new RuntimeException("Franchise not found"));

			// Set bidirectional relationship
			savedUser.setFranchise(franchise);
			franchise.setUser(savedUser);

			// Save franchise FIRST
			franchiseRepository.save(franchise);

			// Then save user again with franchise reference
			savedUser = userRepository.save(savedUser);
		}

		return ResponseEntity.ok(convertToResponseMap(savedUser));
	}

	// ===== UPDATE user =====
	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id,
			@RequestBody Map<String, Object> request) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		// Update basic fields
		if (request.containsKey("firstName")) {
			user.setFirstName((String) request.get("firstName"));
		}
		if (request.containsKey("lastName")) {
			user.setLastName((String) request.get("lastName"));
		}
		if (request.containsKey("phone")) {
			user.setPhone((String) request.get("phone"));
		}
		if (request.containsKey("enabled")) {
			user.setEnabled((Boolean) request.get("enabled"));
		}

		// Update role if provided
		if (request.containsKey("role")) {
			String role = (String) request.get("role");
			RoleType roleType = RoleType.valueOf(role);
			Role userRole = roleRepository.findByName(roleType)
					.orElseThrow(() -> new RuntimeException("Role not found"));
			Set<Role> roles = new HashSet<>();
			roles.add(userRole);
			user.setRoles(roles);
		}

		// Handle franchise assignment
		if (request.containsKey("franchiseId")) {
			Long franchiseId = request.get("franchiseId") != null ? ((Number) request.get("franchiseId")).longValue()
					: null;

			// Step 1: Remove old franchise assignment if exists
			Franchise oldFranchise = user.getFranchise();
			if (oldFranchise != null) {
				oldFranchise.setUser(null);
				franchiseRepository.save(oldFranchise);
				System.out.println("Removed old franchise: " + oldFranchise.getId());
			}

			// Step 2: Assign new franchise
			if (franchiseId != null) {
				Franchise newFranchise = franchiseRepository.findById(franchiseId)
						.orElseThrow(() -> new RuntimeException("Franchise not found with id: " + franchiseId));

				// Set bidirectional relationship
				user.setFranchise(newFranchise);
				newFranchise.setUser(user);

				// Step 3: Save franchise FIRST (important!)
				franchiseRepository.save(newFranchise);
				System.out.println("Assigned franchise: " + newFranchise.getId() + " to user: " + user.getId());
			} else {
				user.setFranchise(null);
			}
		}

		// Step 4: Save user LAST
		User updatedUser = userRepository.save(user);

		return ResponseEntity.ok(convertToResponseMap(updatedUser));
	}

	// ===== DELETE user =====
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
		if (!userRepository.existsById(id)) {
			Map<String, String> error = new HashMap<>();
			error.put("error", "User not found");
			return ResponseEntity.badRequest().body(error);
		}
		userRepository.deleteById(id);

		Map<String, String> response = new HashMap<>();
		response.put("message", "User deleted successfully");
		response.put("id", id.toString());
		return ResponseEntity.ok(response);
	}

	// ===== TOGGLE user status (enable/disable) =====
	@PatchMapping("/{id}/toggle")
	public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		user.setEnabled(!user.isEnabled());
		User updatedUser = userRepository.save(user);

		return ResponseEntity.ok(convertToResponseMap(updatedUser));
	}

	// ===== Helper method to convert User to Response Map =====
	private Map<String, Object> convertToResponseMap(User user) {
		Map<String, Object> response = new HashMap<>();
		response.put("id", user.getId());
		response.put("username", user.getUsername());
		response.put("email", user.getEmail());
		response.put("firstName", user.getFirstName());
		response.put("lastName", user.getLastName());
		response.put("phone", user.getPhone());
		response.put("enabled", user.isEnabled());
		response.put("createdAt", user.getCreatedAt());
		response.put("lastLogin", user.getLastLoginDate());

		// Get roles
		List<String> roles = user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toList());
		response.put("roles", roles);

		// Include franchise details
		if (user.getFranchise() != null) {
			response.put("franchiseId", user.getFranchise().getId());
			response.put("franchiseName", user.getFranchise().getFranchiseName());
		} else {
			response.put("franchiseId", null);
			response.put("franchiseName", null);
		}

		return response;
	}
}