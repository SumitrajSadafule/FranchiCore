package com.macs.franchise.controller;

import com.macs.franchise.dto.request.*;
import com.macs.franchise.dto.response.*;
import com.macs.franchise.security.UserDetailsImpl;
import com.macs.franchise.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/owner")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OwnerController {

	@Autowired
	private OwnerService ownerService;

	// ========== PROFILE MANAGEMENT ==========

	@GetMapping("/profile")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getOwnerProfile(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		try {
			return ResponseEntity.ok(ownerService.getOwnerProfile(currentUser.getId()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PutMapping("/profile")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateOwnerProfile(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestBody OwnerProfileRequest request) {
		try {
			return ResponseEntity.ok(ownerService.updateOwnerProfile(currentUser.getId(), request));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PostMapping("/change-password")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestBody Map<String, String> passwordRequest) {
		try {
			String oldPassword = passwordRequest.get("oldPassword");
			String newPassword = passwordRequest.get("newPassword");
			ownerService.changePassword(currentUser.getId(), oldPassword, newPassword);
			return ResponseEntity.ok(MessageResponse.success("Password changed successfully"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// ========== FRANCHISE MANAGEMENT ==========

	@GetMapping("/franchise")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getOwnerFranchise(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		try {
			return ResponseEntity.ok(ownerService.getOwnerFranchise(currentUser.getId()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PutMapping("/franchise")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateFranchise(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestBody FranchiseUpdateRequest request) {
		try {
			return ResponseEntity.ok(ownerService.updateFranchise(currentUser.getId(), request));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// ========== JOB MANAGEMENT WITH PAGINATION ==========

	@GetMapping("/jobs")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getOwnerJobs(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "postedDate") String sortBy,
			@RequestParam(defaultValue = "DESC") String direction) {
		try {
			return ResponseEntity.ok(ownerService.getOwnerJobs(currentUser.getId(), page, size, sortBy, direction));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PostMapping("/jobs")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> createJob(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestBody JobRequest request) {
		try {
			return new ResponseEntity<>(ownerService.createJob(currentUser.getId(), request), HttpStatus.CREATED);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PutMapping("/jobs/{jobId}")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateJob(@AuthenticationPrincipal UserDetailsImpl currentUser, @PathVariable Long jobId,
			@RequestBody JobRequest request) {
		try {
			return ResponseEntity.ok(ownerService.updateJob(currentUser.getId(), jobId, request));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PatchMapping("/jobs/{jobId}/close")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> closeJob(@AuthenticationPrincipal UserDetailsImpl currentUser, @PathVariable Long jobId) {
		try {
			return ResponseEntity.ok(ownerService.closeJob(currentUser.getId(), jobId));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@DeleteMapping("/jobs/{jobId}")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> deleteJob(@AuthenticationPrincipal UserDetailsImpl currentUser, @PathVariable Long jobId) {
		try {
			ownerService.deleteJob(currentUser.getId(), jobId);
			return ResponseEntity.ok(MessageResponse.success("Job deleted successfully"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// ========== JOB APPLICATIONS MANAGEMENT WITH PAGINATION ==========

	@GetMapping("/jobs/applications")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getAllApplications(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "appliedDate") String sortBy,
			@RequestParam(defaultValue = "DESC") String direction) {
		try {
			return ResponseEntity
					.ok(ownerService.getAllApplicationsForOwner(currentUser.getId(), page, size, sortBy, direction));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@GetMapping("/jobs/{jobId}/applications")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getApplicationsForJob(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Long jobId, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "appliedDate") String sortBy,
			@RequestParam(defaultValue = "DESC") String direction) {
		try {
			return ResponseEntity
					.ok(ownerService.getApplicationsForJob(currentUser.getId(), jobId, page, size, sortBy, direction));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PatchMapping("/applications/{applicationId}/status")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateApplicationStatus(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Long applicationId, @RequestParam String status) {
		try {
			return ResponseEntity.ok(ownerService.updateApplicationStatus(currentUser.getId(), applicationId, status));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// ========== FEEDBACK MANAGEMENT WITH PAGINATION ==========

	@GetMapping("/feedback")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getOwnerFeedback(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "submittedAt") String sortBy,
			@RequestParam(defaultValue = "DESC") String direction) {
		try {
			return ResponseEntity.ok(ownerService.getOwnerFeedback(currentUser.getId(), page, size, sortBy, direction));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@GetMapping("/feedback/stats")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getFeedbackStats(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		try {
			return ResponseEntity.ok(ownerService.getFeedbackStats(currentUser.getId()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@GetMapping("/feedback/pending")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getPendingFeedback(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "submittedAt") String sortBy,
			@RequestParam(defaultValue = "DESC") String direction) {
		try {
			return ResponseEntity
					.ok(ownerService.getPendingFeedback(currentUser.getId(), page, size, sortBy, direction));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@GetMapping("/feedback/recent")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getRecentFeedback(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		try {
			return ResponseEntity.ok(ownerService.getRecentFeedback(currentUser.getId(), page, size));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PostMapping("/feedback/{feedbackId}/reply")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> replyToFeedback(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Long feedbackId, @RequestBody FeedbackReplyRequest request) {
		try {
			return ResponseEntity.ok(ownerService.replyToFeedback(currentUser.getId(), feedbackId, request));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// ========== MENU MANAGEMENT WITH PAGINATION ==========

	@GetMapping("/menu")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getOwnerMenu(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "name") String sortBy, @RequestParam(defaultValue = "ASC") String direction) {
		try {
			return ResponseEntity.ok(ownerService.getOwnerMenu(currentUser.getId(), page, size, sortBy, direction));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PatchMapping("/menu/{itemId}/availability")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateMenuItemAvailability(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Long itemId, @RequestParam boolean available) {
		try {
			return ResponseEntity.ok(ownerService.updateMenuItemAvailability(currentUser.getId(), itemId, available));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@PatchMapping("/menu/{itemId}/price")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateMenuItemPrice(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Long itemId, @RequestParam Double price) {
		try {
			return ResponseEntity.ok(ownerService.updateMenuItemPrice(currentUser.getId(), itemId, price));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// ========== DASHBOARD ==========

	@GetMapping("/dashboard")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getDashboard(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		try {
			return ResponseEntity.ok(ownerService.getDashboardStats(currentUser.getId()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@GetMapping("/stats/jobs")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getJobStats(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		try {
			return ResponseEntity.ok(ownerService.getJobStats(currentUser.getId()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	@GetMapping("/stats/feedback")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> getFeedbackStatsSummary(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		try {
			return ResponseEntity.ok(ownerService.getFeedbackStatsSummary(currentUser.getId()));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}
}