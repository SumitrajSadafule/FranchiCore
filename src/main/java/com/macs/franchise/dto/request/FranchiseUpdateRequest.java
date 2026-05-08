package com.macs.franchise.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseUpdateRequest {
	private String franchiseName;
	private String franchiseCode;
	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String postalCode;
	private String country;
	private String phone;
	private String email;
	private Double latitude;
	private Double longitude;
	private String status;
	private String operatingHours;
	private String managerName;
	private String managerPhone;
	private String managerEmail;

}