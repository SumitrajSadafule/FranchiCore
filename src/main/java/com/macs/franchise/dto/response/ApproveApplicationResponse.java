package com.macs.franchise.dto.response;

import java.time.LocalDateTime;

import com.macs.franchise.dto.request.FeedbackReplyRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for response after approving a franchise application Returns created user
 * and franchise details
 * 
 * @author MAC's Franchise
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproveApplicationResponse {

	private Long applicationId;
	private String applicationStatus;

	// User details
	private Long userId;
	private String username;
	private String email;
	private String firstName;
	private String lastName;
	private String phone;

	// Franchise details
	private Long franchiseId;
	private String franchiseName;
	private String franchiseCode;
	private String city;
	private String address;
	private String status;

	private LocalDateTime createdAt;
	private String message;

}