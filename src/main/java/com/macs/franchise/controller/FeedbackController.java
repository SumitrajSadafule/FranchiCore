package com.macs.franchise.controller;

import com.macs.franchise.dto.request.FeedbackRequest;
import com.macs.franchise.dto.response.FeedbackResponse;
import com.macs.franchise.model.enums.Rating;
import com.macs.franchise.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedbackController {

	@Autowired
	private FeedbackService feedbackService;

	// POST submit new feedback (Public)
	@PostMapping("/submit")
	public ResponseEntity<FeedbackResponse> submitFeedback(@RequestBody FeedbackRequest request) {
		FeedbackResponse feedback = feedbackService.submitFeedback(request);
		return new ResponseEntity<>(feedback, HttpStatus.CREATED);
	}

	// GET all feedback (Admin only)
	@GetMapping
	public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
		return ResponseEntity.ok(feedbackService.getAllFeedback());
	}

	// GET feedback by ID
	@GetMapping("/{id}")
	public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable Long id) {
		return ResponseEntity.ok(feedbackService.getFeedbackById(id));
	}

	// GET feedback by franchise (Public - shows only public feedback)
	@GetMapping("/franchise/{franchiseId}/public")
	public ResponseEntity<?> getPublicFeedbackByFranchise(@PathVariable Long franchiseId) {
		try {
			return ResponseEntity.ok(feedbackService.getPublicFeedbackByFranchise(franchiseId));
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}

	// GET all feedback by franchise (Admin/Franchise Owner only - shows all)
	@GetMapping("/franchise/{franchiseId}/all")
	public ResponseEntity<List<FeedbackResponse>> getAllFeedbackByFranchise(@PathVariable Long franchiseId) {
		return ResponseEntity.ok(feedbackService.getFeedbackByFranchise(franchiseId));
	}

	// GET feedback by rating
	@GetMapping("/rating/{rating}")
	public ResponseEntity<List<FeedbackResponse>> getFeedbackByRating(@PathVariable Rating rating) {
		return ResponseEntity.ok(feedbackService.getFeedbackByRating(rating));
	}

	// GET search feedback
	@GetMapping("/search")
	public ResponseEntity<List<FeedbackResponse>> searchFeedback(@RequestParam String q) {
		return ResponseEntity.ok(feedbackService.searchFeedback(q));
	}

	// GET pending feedback (no reply)
	@GetMapping("/pending")
	public ResponseEntity<List<FeedbackResponse>> getPendingFeedback() {
		return ResponseEntity.ok(feedbackService.getPendingFeedback());
	}

	// POST reply to feedback (Franchise Owner/Admin)
	@PostMapping("/{id}/reply")
	public ResponseEntity<FeedbackResponse> replyToFeedback(@PathVariable Long id, @RequestParam String reply,
			@RequestParam String repliedBy) {
		return ResponseEntity.ok(feedbackService.replyToFeedback(id, reply, repliedBy));
	}

	// PATCH toggle visibility (Admin only)
	@PatchMapping("/{id}/visibility")
	public ResponseEntity<FeedbackResponse> toggleVisibility(@PathVariable Long id, @RequestParam Boolean isPublic) {
		return ResponseEntity.ok(feedbackService.toggleVisibility(id, isPublic));
	}

	// GET average rating for franchise
	@GetMapping("/franchise/{franchiseId}/average-rating")
	public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long franchiseId) {
		Double average = feedbackService.getAverageRatingForFranchise(franchiseId);
		Map<String, Object> response = new HashMap<>();
		response.put("franchiseId", franchiseId);
		response.put("averageRating", average != null ? average : 0);
		response.put("totalFeedbacks", feedbackService.getFeedbackByFranchise(franchiseId).size());
		return ResponseEntity.ok(response);
	}

	// GET rating distribution for franchise
	@GetMapping("/franchise/{franchiseId}/rating-distribution")
	public ResponseEntity<Map<Rating, Long>> getRatingDistribution(@PathVariable Long franchiseId) {
		return ResponseEntity.ok(feedbackService.getRatingDistribution(franchiseId));
	}

	// GET recent feedback for franchise
	@GetMapping("/franchise/{franchiseId}/recent")
	public ResponseEntity<List<FeedbackResponse>> getRecentFeedback(@PathVariable Long franchiseId,
			@RequestParam(defaultValue = "5") int limit) {
		return ResponseEntity.ok(feedbackService.getRecentFeedback(franchiseId, limit));
	}

	// DELETE feedback (Admin only)
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Long id) {
		feedbackService.deleteFeedback(id);
		Map<String, String> response = new HashMap<>();
		response.put("message", "Feedback deleted successfully");
		response.put("id", id.toString());
		return ResponseEntity.ok(response);
	}

	// Exception handler
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		error.put("status", "400");
		return ResponseEntity.badRequest().body(error);
	}

	// GET detailed ratings for franchise
	@GetMapping("/franchise/{franchiseId}/detailed-ratings")
	public ResponseEntity<Map<String, Object>> getDetailedRatings(@PathVariable Long franchiseId) {
		return ResponseEntity.ok(feedbackService.getDetailedRatings(franchiseId));
	}

	@GetMapping("/franchise/{franchiseId}/rating-stats")
	public ResponseEntity<Map<String, Object>> getRatingStats(@PathVariable Long franchiseId) {
		return ResponseEntity.ok(feedbackService.getRatingStats(franchiseId));
	}
}