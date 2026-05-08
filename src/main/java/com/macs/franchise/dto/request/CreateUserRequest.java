package com.macs.franchise.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
	private String username;
	private String email;
	private String password;
	private String firstName;
	private String lastName;
	private String phone;
	private String role;
	private boolean enabled;
}