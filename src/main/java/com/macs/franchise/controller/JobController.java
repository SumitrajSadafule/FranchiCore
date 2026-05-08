package com.macs.franchise.controller;

import com.macs.franchise.dto.request.JobRequest;
import com.macs.franchise.dto.request.JobApplicationRequest;
import com.macs.franchise.dto.response.JobResponse;
import com.macs.franchise.dto.response.MessageResponse;
import com.macs.franchise.dto.response.JobApplicationResponse;
import com.macs.franchise.model.enums.JobType;
import com.macs.franchise.security.UserDetailsImpl;
import com.macs.franchise.model.enums.ApplicationStatus;
import com.macs.franchise.model.enums.JobStatus;
import com.macs.franchise.service.OwnerService;
import com.macs.franchise.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobController {
	private final OwnerService ownerService;

	@Autowired
	private JobService jobService;

	JobController(OwnerService ownerService) {
		this.ownerService = ownerService;
	}

	// ========== JOB ENDPOINTS ==========

	// GET all jobs
	@GetMapping
	public ResponseEntity<List<JobResponse>> getAllJobs() {
		return ResponseEntity.ok(jobService.getAllJobs());
	}

	// GET open jobs (public)
	@GetMapping("/open")
	public ResponseEntity<List<JobResponse>> getOpenJobs() {
		return ResponseEntity.ok(jobService.getOpenJobs());
	}

	// GET job by ID
	@GetMapping("/{id}")
	public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
		return ResponseEntity.ok(jobService.getJobById(id));
	}

	// GET jobs by franchise
	@GetMapping("/franchise/{franchiseId}")
	public ResponseEntity<List<JobResponse>> getJobsByFranchise(@PathVariable Long franchiseId) {
		return ResponseEntity.ok(jobService.getJobsByFranchise(franchiseId));
	}

	// GET jobs by type
	@GetMapping("/type/{jobType}")
	public ResponseEntity<?> getJobsByType(@PathVariable String jobType) {
		try {
			JobType type = JobType.valueOf(jobType.toUpperCase());
			return ResponseEntity.ok(jobService.getJobsByType(type));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest()
					.body("Invalid job type. Use: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP");
		}
	}

	/**
	 * Manually trigger auto-close of expired jobs (Admin only)
	 */
	@PostMapping("/auto-close-expired")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<Map<String, Object>> autoCloseExpiredJobs() {
		try {
			jobService.autoCloseExpiredJobs();

			Map<String, Object> response = new HashMap<>();
			response.put("message", "Auto-close process completed");
			response.put("timestamp", LocalDateTime.now());
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
			error.put("error", e.getMessage());
			return ResponseEntity.badRequest().body(error);
		}
	}

	// GET jobs by location
	@GetMapping("/location/{location}")
	public ResponseEntity<List<JobResponse>> getJobsByLocation(@PathVariable String location) {
		return ResponseEntity.ok(jobService.getJobsByLocation(location));
	}

	// GET search jobs
	@GetMapping("/search")
	public ResponseEntity<List<JobResponse>> searchJobs(@RequestParam String q) {
		return ResponseEntity.ok(jobService.searchJobs(q));
	}

	// POST create new job (Franchise Owner/Super Admin only later)
	@PostMapping
	public ResponseEntity<JobResponse> createJob(@RequestBody JobRequest request) {
		JobResponse createdJob = jobService.createJob(request);
		return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
	}

	// PUT update job
	@PutMapping("/{id}")
	public ResponseEntity<JobResponse> updateJob(@PathVariable Long id, @RequestBody JobRequest request) {
		return ResponseEntity.ok(jobService.updateJob(id, request));
	}

	@PatchMapping("/jobs/{jobId}")
	@PreAuthorize("hasRole('FRANCHISE_OWNER')")
	public ResponseEntity<?> updateJobPartial(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Long jobId, @RequestBody JobRequest request) {
		try {
			// Call the existing updateJob method from OwnerService
			return ResponseEntity.ok(ownerService.updateJob(currentUser.getId(), jobId, request));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(MessageResponse.error(e.getMessage()));
		}
	}

	// PATCH close job
	@PatchMapping("/{id}/close")
	public ResponseEntity<JobResponse> closeJob(@PathVariable Long id) {
		return ResponseEntity.ok(jobService.closeJob(id));
	}

	@PatchMapping("/{id}/open")
	public ResponseEntity<JobResponse> openJob(@PathVariable Long id) {
		return ResponseEntity.ok(jobService.openJob(id));
	}

	// DELETE job
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
		jobService.deleteJob(id);
		Map<String, String> response = new HashMap<>();
		response.put("message", "Job deleted successfully");
		response.put("id", id.toString());
		return ResponseEntity.ok(response);
	}

	// ========== APPLICATION ENDPOINTS ==========

	// POST apply for a job (public)
	@PostMapping("/apply")
	public ResponseEntity<JobApplicationResponse> applyForJob(@RequestBody JobApplicationRequest request) {
		JobApplicationResponse application = jobService.applyForJob(request);
		return new ResponseEntity<>(application, HttpStatus.CREATED);
	}

	// GET applications for a job (Franchise Owner/Super Admin only later)
	@GetMapping("/{jobId}/applications")
	public ResponseEntity<List<JobApplicationResponse>> getApplicationsForJob(@PathVariable Long jobId) {
		return ResponseEntity.ok(jobService.getApplicationsForJob(jobId));
	}

	// GET jobs by status
	@GetMapping("/status/{status}")
	public ResponseEntity<List<JobResponse>> getJobsByStatus(@PathVariable JobStatus status) {
		return ResponseEntity.ok(jobService.getJobsByStatus(status));
	}

	// PATCH update application status
	@PatchMapping("/applications/{applicationId}/status")
	public ResponseEntity<JobApplicationResponse> updateApplicationStatus(@PathVariable Long applicationId,
			@RequestParam ApplicationStatus status) {
		return ResponseEntity.ok(jobService.updateApplicationStatus(applicationId, status));
	}

	// Exception handler
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		error.put("status", "400");
		return ResponseEntity.badRequest().body(error);
	}
}