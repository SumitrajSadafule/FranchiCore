package com.macs.franchise.dto.response;

import com.macs.franchise.model.enums.Rating;
import java.time.LocalDateTime;

public class FeedbackResponse {

	private Long id;
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
	private String adminReply;
	private LocalDateTime repliedAt;
	private String repliedBy;
	private Boolean isPublic;
	private Long franchiseId;
	private String franchiseName;
	private String franchiseCity;
	private LocalDateTime submittedAt;

	// Calculated fields
	private Double averageRating;

	// Constructors
	public FeedbackResponse() {
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	public String getBillNumber() {
		return billNumber;
	}

	public void setBillNumber(String billNumber) {
		this.billNumber = billNumber;
	}

	public Rating getRating() {
		return rating;
	}

	public void setRating(Rating rating) {
		this.rating = rating;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Boolean getWouldRecommend() {
		return wouldRecommend;
	}

	public void setWouldRecommend(Boolean wouldRecommend) {
		this.wouldRecommend = wouldRecommend;
	}

	public Integer getServiceRating() {
		return serviceRating;
	}

	public void setServiceRating(Integer serviceRating) {
		this.serviceRating = serviceRating;
	}

	public Integer getFoodRating() {
		return foodRating;
	}

	public void setFoodRating(Integer foodRating) {
		this.foodRating = foodRating;
	}

	public Integer getCleanlinessRating() {
		return cleanlinessRating;
	}

	public void setCleanlinessRating(Integer cleanlinessRating) {
		this.cleanlinessRating = cleanlinessRating;
	}

	public Integer getValueRating() {
		return valueRating;
	}

	public void setValueRating(Integer valueRating) {
		this.valueRating = valueRating;
	}

	public String getAdminReply() {
		return adminReply;
	}

	public void setAdminReply(String adminReply) {
		this.adminReply = adminReply;
	}

	public LocalDateTime getRepliedAt() {
		return repliedAt;
	}

	public void setRepliedAt(LocalDateTime repliedAt) {
		this.repliedAt = repliedAt;
	}

	public String getRepliedBy() {
		return repliedBy;
	}

	public void setRepliedBy(String repliedBy) {
		this.repliedBy = repliedBy;
	}

	public Boolean getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}

	public Long getFranchiseId() {
		return franchiseId;
	}

	public void setFranchiseId(Long franchiseId) {
		this.franchiseId = franchiseId;
	}

	public String getFranchiseName() {
		return franchiseName;
	}

	public void setFranchiseName(String franchiseName) {
		this.franchiseName = franchiseName;
	}

	public String getFranchiseCity() {
		return franchiseCity;
	}

	public void setFranchiseCity(String franchiseCity) {
		this.franchiseCity = franchiseCity;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}

	public Double getAverageRating() {
		if (averageRating == null && serviceRating != null && foodRating != null && cleanlinessRating != null
				&& valueRating != null) {
			averageRating = (serviceRating + foodRating + cleanlinessRating + valueRating) / 4.0;
		}
		return averageRating;
	}

	public void setAverageRating(Double averageRating) {
		this.averageRating = averageRating;
	}
}