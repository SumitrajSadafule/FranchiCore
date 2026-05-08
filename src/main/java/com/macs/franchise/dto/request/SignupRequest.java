package com.macs.franchise.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration request Used when creating new users (Super Admin
 * can create Franchise Owners)
 * 
 * @author MAC's Franchise
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

	@NotBlank(message = "Username is required")
	@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
	private String username;

	@NotBlank(message = "Email is required")
	@Email(message = "Email should be valid")
	@Size(max = 100, message = "Email must not exceed 100 characters")
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
	private String password;

	@NotBlank(message = "First name is required")
	@Size(max = 50, message = "First name must not exceed 50 characters")
	private String firstName;

	@Size(max = 50, message = "Last name must not exceed 50 characters")
	private String lastName;

	@Size(max = 20, message = "Phone must not exceed 20 characters")
	private String phone;

	private Long franchiseId; // Optional - for assigning to franchise
}