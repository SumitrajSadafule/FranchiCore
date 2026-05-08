package com.macs.franchise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login request Contains username/email and password for authentication
 * 
 * @author MAC's Franchise
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

	@NotBlank(message = "Username or email is required")
	private String usernameOrEmail;

	@NotBlank(message = "Password is required")
	private String password;
}