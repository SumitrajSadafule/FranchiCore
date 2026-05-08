package com.macs.franchise.service;

import com.macs.franchise.dto.request.FeedbackRequest;
import com.macs.franchise.dto.response.FeedbackResponse;
import com.macs.franchise.model.Feedback;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.Rating;
import com.macs.franchise.repository.FeedbackRepository;
import com.macs.franchise.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	private FranchiseRepository franchiseRepository;
	
	@Autowired
	private EmailService emailService;

	// Submit new feedback (Public)
	public FeedbackResponse submitFeedback(FeedbackRequest request) {
		Franchise franchise = franchiseRepository.findById(request.getFranchiseId())
				.orElseThrow(() -> new RuntimeException("Franchise not found with id: " + request.getFranchiseId()));

		Feedback feedback = new Feedback();
		feedback.setCustomerName(request.getCustomerName());
		feedback.setCustomerEmail(request.getCustomerEmail());
		feedback.setCustomerPhone(request.getCustomerPhone());
		feedback.setBillNumber(request.getBillNumber());
		feedback.setRating(request.getRating());
		feedback.setComments(request.getComments());
		feedback.setWouldRecommend(request.getWouldRecommend());
		feedback.setServiceRating(request.getServiceRating());
		feedback.setFoodRating(request.getFoodRating());
		feedback.setCleanlinessRating(request.getCleanlinessRating());
		feedback.setValueRating(request.getValueRating());
		feedback.setFranchise(franchise);
		feedback.setIsPublic(true); // Default to public

		Feedback savedFeedback = feedbackRepository.save(feedback);
		
		// ========== SEND CONFIRMATION EMAIL TO CUSTOMER ==========
		try {
		    Context context = new Context();
		    context.setVariable("customerName", savedFeedback.getCustomerName());
		    context.setVariable("franchiseName", savedFeedback.getFranchise().getFranchiseName());
		    context.setVariable("comments", savedFeedback.getComments());
		    
		    // Convert rating to stars
		    int ratingValue = savedFeedback.getRating().getValue();
		    String stars = "⭐".repeat(ratingValue);
		    context.setVariable("stars", stars);
		    
		    emailService.sendHtmlEmail(
		        savedFeedback.getCustomerEmail(),
		        "Feedback Received - MAC's Franchise",
		        "email/feedback-confirmation",
		        context
		    );
		    System.out.println("Confirmation email sent to: " + savedFeedback.getCustomerEmail());
		} catch (Exception e) {
		    System.err.println("Failed to send confirmation email: " + e.getMessage());
		}

		// ========== SEND NOTIFICATION TO ADMIN ==========
		try {
		    Context adminContext = new Context();
		    adminContext.setVariable("customerName", savedFeedback.getCustomerName());
		    adminContext.setVariable("customerEmail", savedFeedback.getCustomerEmail());
		    adminContext.setVariable("customerPhone", savedFeedback.getCustomerPhone());
		    adminContext.setVariable("franchiseName", savedFeedback.getFranchise().getFranchiseName());
		    adminContext.setVariable("rating", savedFeedback.getRating().getValue() + " Stars");
		    adminContext.setVariable("comments", savedFeedback.getComments());
		    adminContext.setVariable("wouldRecommend", savedFeedback.getWouldRecommend() ? "Yes" : "No");
		    
		    emailService.sendHtmlEmail(
		        "admin@macs.com",  // Change to your admin email
		        "New Feedback Received - MAC's Franchise",
		        "email/feedback-admin-notification",
		        adminContext
		    );
		    System.out.println("Admin notification email sent");
		} catch (Exception e) {
		    System.err.println("Failed to send admin notification: " + e.getMessage());
		}
		return convertToResponse(savedFeedback);
	}

	// Get all feedback (Admin only)
	public List<FeedbackResponse> getAllFeedback() {
		return feedbackRepository.findAllByOrderBySubmittedAtDesc().stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get feedback by ID
	public FeedbackResponse getFeedbackById(Long id) {
		Feedback feedback = feedbackRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
		return convertToResponse(feedback);
	}

	// Get feedback for a specific franchise (Franchise Owner sees only their own)
	public List<FeedbackResponse> getFeedbackByFranchise(Long franchiseId) {
		return feedbackRepository.findByFranchiseId(franchiseId).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get public feedback for a franchise (for website display)
	public List<FeedbackResponse> getPublicFeedbackByFranchise(Long franchiseId) {
		return feedbackRepository.findByFranchiseIdAndIsPublicTrue(franchiseId).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get feedback by rating
	public List<FeedbackResponse> getFeedbackByRating(Rating rating) {
		return feedbackRepository.findByRating(rating).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Search feedback
	public List<FeedbackResponse> searchFeedback(String searchTerm) {
		return feedbackRepository.searchFeedbackIgnoreCase(searchTerm).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get pending feedback (no admin reply)
	public List<FeedbackResponse> getPendingFeedback() {
		return feedbackRepository.findByAdminReplyIsNull().stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get average service rating
	public Double getAverageServiceRating(Long franchiseId) {
		return feedbackRepository.getAverageServiceRating(franchiseId);
	}

	// Get average food rating
	public Double getAverageFoodRating(Long franchiseId) {
		return feedbackRepository.getAverageFoodRating(franchiseId);
	}

	// Get average cleanliness rating
	public Double getAverageCleanlinessRating(Long franchiseId) {
		return feedbackRepository.getAverageCleanlinessRating(franchiseId);
	}

	// Get average value rating
	public Double getAverageValueRating(Long franchiseId) {
		return feedbackRepository.getAverageValueRating(franchiseId);
	}

	public Double getMinRating(Long franchiseId) {
		return feedbackRepository.findByFranchiseId(franchiseId).stream().mapToDouble(f -> f.getRating().getValue())
				.min().orElse(0.0);
	}

	public Double getMaxRating(Long franchiseId) {
		return feedbackRepository.findByFranchiseId(franchiseId).stream().mapToDouble(f -> f.getRating().getValue())
				.max().orElse(0.0);
	}

	public Map<String, Object> getRatingStats(Long franchiseId) {
		Map<String, Object> stats = new HashMap<>();
		stats.put("average", getAverageRatingForFranchise(franchiseId));
		stats.put("minimum", getMinRating(franchiseId));
		stats.put("maximum", getMaxRating(franchiseId));
		stats.put("total", feedbackRepository.findByFranchiseId(franchiseId).size());
		return stats;
	}

	// Get detailed ratings for a franchise
	public Map<String, Object> getDetailedRatings(Long franchiseId) {
		Map<String, Object> ratings = new HashMap<>();
		ratings.put("overall", getAverageRatingForFranchise(franchiseId));
		ratings.put("service", getAverageServiceRating(franchiseId));
		ratings.put("food", getAverageFoodRating(franchiseId));
		ratings.put("cleanliness", getAverageCleanlinessRating(franchiseId));
		ratings.put("value", getAverageValueRating(franchiseId));
		ratings.put("total", feedbackRepository.findByFranchiseId(franchiseId).size());
		return ratings;
	}

	// Reply to feedback (Franchise Owner or Admin)
	public FeedbackResponse replyToFeedback(Long feedbackId, String reply, String repliedBy) {
		Feedback feedback = feedbackRepository.findById(feedbackId)
				.orElseThrow(() -> new RuntimeException("Feedback not found with id: " + feedbackId));

		feedback.setAdminReply(reply);
		feedback.setRepliedAt(LocalDateTime.now());
		feedback.setRepliedBy(repliedBy);

		Feedback updatedFeedback = feedbackRepository.save(feedback);
		
		// ========== SEND REPLY EMAIL TO CUSTOMER ==========
		try {
		    Context context = new Context();
		    context.setVariable("customerName", updatedFeedback.getCustomerName());
		    context.setVariable("originalComments", updatedFeedback.getComments());
		    
		    // Convert rating to stars
		    int ratingValue = updatedFeedback.getRating().getValue();
		    String stars = "⭐".repeat(ratingValue);
		    context.setVariable("rating", stars);
		    
		    context.setVariable("replyText", updatedFeedback.getAdminReply());
		    context.setVariable("repliedBy", updatedFeedback.getRepliedBy());
		    
		    // Format date
		    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
		    String repliedDate = updatedFeedback.getRepliedAt().format(formatter);
		    context.setVariable("repliedDate", repliedDate);
		    
		    emailService.sendHtmlEmail(
		        updatedFeedback.getCustomerEmail(),
		        "Response to Your Feedback - MAC's Franchise",
		        "email/feedback-reply-customer",
		        context
		    );
		    System.out.println("Reply email sent to customer: " + updatedFeedback.getCustomerEmail());
		} catch (Exception e) {
		    System.err.println("Failed to send reply email to customer: " + e.getMessage());
		}
		return convertToResponse(updatedFeedback);
	}

	// Toggle public visibility (Admin only)
	public FeedbackResponse toggleVisibility(Long feedbackId, Boolean isPublic) {
		Feedback feedback = feedbackRepository.findById(feedbackId)
				.orElseThrow(() -> new RuntimeException("Feedback not found with id: " + feedbackId));

		feedback.setIsPublic(isPublic);
		Feedback updatedFeedback = feedbackRepository.save(feedback);
		return convertToResponse(updatedFeedback);
	}

	// Delete feedback (Admin only)
	public void deleteFeedback(Long id) {
		if (!feedbackRepository.existsById(id)) {
			throw new RuntimeException("Feedback not found with id: " + id);
		}
		feedbackRepository.deleteById(id);
	}

	// Get average rating for a franchise
	public Double getAverageRatingForFranchise(Long franchiseId) {
		return feedbackRepository.getAverageRatingForFranchise(franchiseId);
	}

	// Get rating distribution for a franchise
	public Map<Rating, Long> getRatingDistribution(Long franchiseId) {
		List<Object[]> distribution = feedbackRepository.getRatingDistribution(franchiseId);
		Map<Rating, Long> result = new HashMap<>();

		for (Object[] row : distribution) {
			Rating rating = (Rating) row[0];
			Long count = (Long) row[1];
			result.put(rating, count);
		}

		return result;
	}

	// Get recent feedback for a franchise
	public List<FeedbackResponse> getRecentFeedback(Long franchiseId, int limit) {
		return feedbackRepository.findTop10ByFranchiseIdOrderBySubmittedAtDesc(franchiseId).stream().limit(limit)
				.map(this::convertToResponse).collect(Collectors.toList());
	}

	// Helper method to convert Entity to Response DTO
	private FeedbackResponse convertToResponse(Feedback feedback) {
		FeedbackResponse response = new FeedbackResponse();

		response.setId(feedback.getId());
		response.setCustomerName(feedback.getCustomerName());
		response.setCustomerEmail(feedback.getCustomerEmail());
		response.setCustomerPhone(feedback.getCustomerPhone());
		response.setBillNumber(feedback.getBillNumber());
		response.setRating(feedback.getRating());
		response.setComments(feedback.getComments());
		response.setWouldRecommend(feedback.getWouldRecommend());
		response.setServiceRating(feedback.getServiceRating());
		response.setFoodRating(feedback.getFoodRating());
		response.setCleanlinessRating(feedback.getCleanlinessRating());
		response.setValueRating(feedback.getValueRating());
		response.setAdminReply(feedback.getAdminReply());
		response.setRepliedAt(feedback.getRepliedAt());
		response.setRepliedBy(feedback.getRepliedBy());
		response.setIsPublic(feedback.getIsPublic());
		response.setSubmittedAt(feedback.getSubmittedAt());

		if (feedback.getFranchise() != null) {
			response.setFranchiseId(feedback.getFranchise().getId());
			response.setFranchiseName(feedback.getFranchise().getFranchiseName());
			response.setFranchiseCity(feedback.getFranchise().getCity());
		}

		return response;
	}
}