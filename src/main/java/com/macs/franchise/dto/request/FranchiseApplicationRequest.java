package com.macs.franchise.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseApplicationRequest {

	// Personal Information
	@NotBlank(message = "Full name is required")
	@Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
	private String fullName;

	@NotNull(message = "Age is required")
	@Min(value = 21, message = "You must be at least 21 years old")
	@Max(value = 65, message = "Age must be less than 65")
	private Integer age;

	@NotBlank(message = "Address is required")
	@Size(max = 500, message = "Address must not exceed 500 characters")
	private String address;

	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Please enter a valid 10-digit mobile number")
	private String phone;

	@NotBlank(message = "Email is required")
	@Email(message = "Please provide a valid email address")
	private String email;

	// Education
	@NotBlank(message = "Qualification is required")
	private String qualification;
	private String institution;

	@Min(value = 1950, message = "Please enter a valid graduation year")
	@Max(value = 2025, message = "Graduation year cannot be in the future")
	private Integer graduationYear;

	// Financial Information
	@NotNull(message = "Net worth is required")
	@DecimalMin(value = "5000000", message = "Minimum net worth required is ₹50 Lakhs")
	private BigDecimal netWorth;
	@NotNull(message = "Liquid capital is required")
	@DecimalMin(value = "2000000", message = "Minimum liquid capital required is ₹20 Lakhs")
	private BigDecimal liquidCapital;
	@NotBlank(message = "Source of funds is required")
	private String sourceOfFunds;

	// Business Interest
	@NotBlank(message = "Preferred city is required")
	private String preferredCity;
	@NotBlank(message = "Reason for interest is required")
	@Size(min = 20, max = 1000, message = "Please provide at least 20 characters explaining your interest")
	private String reasonForInterest;

	// Commitment
	@NotNull(message = "Please specify if you have previous ownership experience")
	private Boolean previousOwnership;
	private String ownershipDetails;
	@NotNull(message = "Please specify if you are willing to complete training")
	private Boolean willingToTrain;

	// Legal Documents (numbers only)
	@NotBlank(message = "PAN number is required")
	@Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Please enter a valid PAN number (e.g., ABCDE1234F)")
	private String panNumber;

	@NotBlank(message = "Aadhaar number is required")
	@Pattern(regexp = "^\\d{12}$", message = "Please enter a valid 12-digit Aadhaar number")
	private String aadhaarNumber;

}