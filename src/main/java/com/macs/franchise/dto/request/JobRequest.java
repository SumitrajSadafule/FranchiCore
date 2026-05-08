package com.macs.franchise.dto.request;

import com.macs.franchise.model.enums.JobType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {
	private String title;
	private String description;
	private String requirements;
	private JobType jobType;
	private String location;
	private String salaryRange;
	private String experienceRequired;
	private LocalDateTime applicationDeadline;
	private Integer positionsAvailable;
	private Long franchiseId;

}