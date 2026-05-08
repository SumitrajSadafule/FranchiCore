package com.macs.franchise.dto.response;


import com.macs.franchise.model.enums.FranchiseStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseResponse {
	private Long id;
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
	private FranchiseStatus status;
	private String operatingHours;
	private String managerName;
	private String managerPhone; 
    private String managerEmail; 
	private String fullAddress;

	private Long userId;
	private String userName;

}