package com.macs.franchise.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for approving a franchise application Admin provides username and
 * password for the new franchise owner
 * 
 * @author MAC's Franchise
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproveApplicationRequest {

	@NotBlank(message = "Username is required")
	@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
	private String username;

	@NotBlank(message = "Password is required")
	@Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
	private String password;

}