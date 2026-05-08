package com.macs.franchise.dto.response;

import com.macs.franchise.model.enums.FranchiseApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseApplicationResponse {

	private Long id;

	// Personal Information
	private String fullName;
	private Integer age;
	private String address;
	private String phone;
	private String email;

	// Education
	private String qualification;
	private String institution;
	private Integer graduationYear;

	// Financial Information
	private BigDecimal netWorth;
	private BigDecimal liquidCapital;
	private String sourceOfFunds;

	// Business Interest
	private String preferredCity;
	private String reasonForInterest;

	// Commitment
	private Boolean previousOwnership;
	private String ownershipDetails;
	private Boolean willingToTrain;

	// Legal Documents (numbers only)
	private String panNumber;
	private String aadhaarNumber;

	// Status
	private FranchiseApplicationStatus status;
	private String adminNotes;
	private LocalDateTime appliedDate;
	private LocalDateTime reviewedDate;

}