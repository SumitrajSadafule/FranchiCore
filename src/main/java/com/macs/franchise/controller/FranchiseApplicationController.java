package com.macs.franchise.controller;

import com.macs.franchise.dto.request.FranchiseApplicationRequest;
import com.macs.franchise.dto.response.FranchiseApplicationResponse;
import com.macs.franchise.model.enums.FranchiseApplicationStatus;
import com.macs.franchise.service.FranchiseApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.macs.franchise.dto.request.ApproveApplicationRequest;
import com.macs.franchise.dto.response.ApproveApplicationResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/franchise-applications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FranchiseApplicationController {

	@Autowired
	private FranchiseApplicationService applicationService;

	// POST submit new application (Public)
	@PostMapping("/submit")
	public ResponseEntity<FranchiseApplicationResponse> submitApplication(
			@RequestBody FranchiseApplicationRequest request) {
		FranchiseApplicationResponse application = applicationService.submitApplication(request);
		return new ResponseEntity<>(application, HttpStatus.CREATED);
	}

	// GET all applications (Admin only)
	@GetMapping
	public ResponseEntity<?> getAllApplications() {
		try {
			return ResponseEntity.ok(applicationService.getAllApplications());
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}
	}

	// GET application by ID
	@GetMapping("/{id}")
	public ResponseEntity<FranchiseApplicationResponse> getApplicationById(@PathVariable Long id) {
		return ResponseEntity.ok(applicationService.getApplicationById(id));
	}

	// GET applications by status
	@GetMapping("/status/{status}")
	public ResponseEntity<List<FranchiseApplicationResponse>> getApplicationsByStatus(
			@PathVariable FranchiseApplicationStatus status) {
		return ResponseEntity.ok(applicationService.getApplicationsByStatus(status));
	}

	// GET applications by city
	@GetMapping("/city/{city}")
	public ResponseEntity<List<FranchiseApplicationResponse>> getApplicationsByCity(@PathVariable String city) {
		return ResponseEntity.ok(applicationService.getApplicationsByCity(city));
	}

	// GET search applications
	@GetMapping("/search")
	public ResponseEntity<List<FranchiseApplicationResponse>> searchApplications(@RequestParam String q) {
		return ResponseEntity.ok(applicationService.searchApplications(q));
	}

	// PATCH update application status (Admin only)
	@PatchMapping("/{id}/status")
	public ResponseEntity<FranchiseApplicationResponse> updateApplicationStatus(@PathVariable Long id,
			@RequestParam FranchiseApplicationStatus status, @RequestParam(required = false) String adminNotes,
			@RequestParam String reviewedBy) {
		return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, adminNotes, reviewedBy));
	}

	// GET application statistics
	@GetMapping("/statistics")
	public ResponseEntity<List<Object[]>> getApplicationStatistics() {
		return ResponseEntity.ok(applicationService.getApplicationStatistics());
	}

	// DELETE application
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
		try {
			applicationService.deleteApplication(id);
			Map<String, String> response = new HashMap<>();
			response.put("message", "Application deleted successfully");
			response.put("id", id.toString());
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			Map<String, String> error = new HashMap<>();
			error.put("error", e.getMessage());
			error.put("status", "400");
			return ResponseEntity.badRequest().body(error);
		}
	}

	// Exception handler
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		error.put("status", "400");
		return ResponseEntity.badRequest().body(error);
	}

	/**
	 * Approve a franchise application and automatically create User and Franchise
	 * POST /franchise-applications/{id}/approve
	 * 
	 * @param id      - Application ID
	 * @param request - Contains username and password for the new owner
	 * @return ApproveApplicationResponse with created user and franchise details
	 */
	@PostMapping("/{id}/approve")
	public ResponseEntity<ApproveApplicationResponse> approveApplication(@PathVariable Long id,
			@RequestBody ApproveApplicationRequest request) {

		try {
			ApproveApplicationResponse response = applicationService.approveApplication(id, request.getUsername(),
					request.getPassword());
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			// Return bad request with error message
			ApproveApplicationResponse errorResponse = new ApproveApplicationResponse();
			errorResponse.setMessage(e.getMessage());
			errorResponse.setApplicationId(id);
			return ResponseEntity.badRequest().body(errorResponse);
		}
	}

}