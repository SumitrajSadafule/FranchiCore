package com.macs.franchise.dto.request;

import com.macs.franchise.model.enums.Rating;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {

	private String customerName;
	private String customerEmail;
	private String customerPhone;
	private String billNumber;
	private Rating rating;
	private String comments;
	private Boolean wouldRecommend;
	private Integer serviceRating;
	private Integer foodRating;
	private Integer cleanlinessRating;
	private Integer valueRating;
	private Long franchiseId;
}