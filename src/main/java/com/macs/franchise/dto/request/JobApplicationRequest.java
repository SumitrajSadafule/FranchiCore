package com.macs.franchise.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationRequest {
	private String fullName;
	private String email;
	private String phone;
	private Integer age;
	private String address;
	private String qualification;
	private Integer experienceYears;
	private String previousEmployer;
	private String coverNote;
	private Long jobId;

}