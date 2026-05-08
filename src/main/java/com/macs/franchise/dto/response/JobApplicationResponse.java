package com.macs.franchise.dto.response;

import com.macs.franchise.model.enums.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
	private Long id;
	private String fullName;
	private String email;
	private String phone;
	private Integer age;
	private String address;
	private String qualification;
	private Integer experienceYears;
	private String previousEmployer;
	private String coverNote;
	private ApplicationStatus status;
	private Long jobId;
	private String jobTitle;
	private String franchiseName;
	private LocalDateTime appliedDate;

}