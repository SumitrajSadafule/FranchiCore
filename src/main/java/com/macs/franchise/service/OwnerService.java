package com.macs.franchise.service;

import com.macs.franchise.dto.request.*;
import com.macs.franchise.dto.response.*;
import com.macs.franchise.model.*;
import com.macs.franchise.model.enums.ApplicationStatus;
import com.macs.franchise.model.enums.JobStatus;
import com.macs.franchise.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OwnerService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private FranchiseRepository franchiseRepository;

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private JobApplicationRepository applicationRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	private MenuRepository menuRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JobService jobService;
	
	@Autowired
	private EmailService emailService;

	// ========== PROFILE MANAGEMENT ==========

	public UserProfileResponse getOwnerProfile(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		UserProfileResponse response = new UserProfileResponse();
		response.setId(user.getId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setPhone(user.getPhone());

		return response;
	}

	public UserProfileResponse updateOwnerProfile(Long userId, OwnerProfileRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhone(request.getPhone());
		if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(request.getEmail())) {
				throw new RuntimeException("Email already in use");
			}
			user.setEmail(request.getEmail());
		}

		User updatedUser = userRepository.save(user);

		UserProfileResponse response = new UserProfileResponse();
		response.setId(updatedUser.getId());
		response.setUsername(updatedUser.getUsername());
		response.setEmail(updatedUser.getEmail());
		response.setFirstName(updatedUser.getFirstName());
		response.setLastName(updatedUser.getLastName());
		response.setPhone(updatedUser.getPhone());

		return response;
	}

	public void changePassword(Long userId, String oldPassword, String newPassword) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new RuntimeException("Old password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}

	// ========== FRANCHISE MANAGEMENT ==========

	// Get franchise from the user, not the first franchise
	public FranchiseResponse getOwnerFranchise(Long userId) {
		// Get the user first
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// Get the franchise from the user's franchise relationship
		// If your User entity has a franchise field, use that
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		return convertToFranchiseResponse(franchise);
	}

	public FranchiseResponse updateFranchise(Long userId, FranchiseUpdateRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// Get franchise from user
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		franchise.setFranchiseName(request.getFranchiseName());
		franchise.setPhone(request.getPhone());
		franchise.setEmail(request.getEmail());
		franchise.setAddressLine1(request.getAddressLine1());
		franchise.setAddressLine2(request.getAddressLine2());
		franchise.setCity(request.getCity());
		franchise.setState(request.getState());
		franchise.setPostalCode(request.getPostalCode());
		franchise.setOperatingHours(request.getOperatingHours());
		franchise.setManagerName(request.getManagerName());
		franchise.setManagerPhone(request.getManagerPhone());
		franchise.setManagerEmail(request.getManagerEmail());

		Franchise updatedFranchise = franchiseRepository.save(franchise);
		return convertToFranchiseResponse(updatedFranchise);
	}

	// ========== JOB MANAGEMENT WITH PAGINATION ==========

	public PageResponse<JobResponse> getOwnerJobs(Long userId, int page, int size, String sortBy, String direction) {
		// a Get user first
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// a Get franchise from user
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		// Get jobs ONLY for this franchise
		Page<Job> jobPage = jobRepository.findByFranchiseId(franchise.getId(), pageable);

		// Use JobService's convertToJobResponse
		Page<JobResponse> responsePage = jobPage.map(job -> jobService.convertToJobResponse(job));

		return PageResponse.fromPage(responsePage);
	}

	public JobResponse createJob(Long userId, JobRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Job job = new Job();
		job.setTitle(request.getTitle());
		job.setDescription(request.getDescription());
		job.setRequirements(request.getRequirements());
		job.setJobType(request.getJobType());
		job.setLocation(request.getLocation());
		job.setSalaryRange(request.getSalaryRange());
		job.setExperienceRequired(request.getExperienceRequired());
		job.setApplicationDeadline(request.getApplicationDeadline());
		job.setPositionsAvailable(request.getPositionsAvailable());
		job.setFranchise(franchise);
		job.setStatus(JobStatus.OPEN);

		Job savedJob = jobRepository.save(job);
		return convertToJobResponse(savedJob);
	}

	public JobResponse updateJob(Long userId, Long jobId, JobRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

		if (!job.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to update this job");
		}

		job.setTitle(request.getTitle());
		job.setDescription(request.getDescription());
		job.setRequirements(request.getRequirements());
		job.setJobType(request.getJobType());
		job.setLocation(request.getLocation());
		job.setSalaryRange(request.getSalaryRange());
		job.setExperienceRequired(request.getExperienceRequired());
		job.setApplicationDeadline(request.getApplicationDeadline());
		job.setPositionsAvailable(request.getPositionsAvailable());

		Job updatedJob = jobRepository.save(job);
		return convertToJobResponse(updatedJob);
	}

	public JobResponse closeJob(Long userId, Long jobId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

		if (!job.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to close this job");
		}

		job.setStatus(JobStatus.CLOSED);
		Job updatedJob = jobRepository.save(job);
		return convertToJobResponse(updatedJob);
	}

	public void deleteJob(Long userId, Long jobId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

		if (!job.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to delete this job");
		}

		// a First check if job has applications
		List<JobApplication> applications = applicationRepository.findByJobId(jobId);
		if (!applications.isEmpty()) {
			// Option A: Delete all applications first
			applicationRepository.deleteAll(applications);
			// Or Option B: Throw error asking to close job instead
			// throw new RuntimeException("Cannot delete job with existing applications.
			// Please close the job instead.");
		}

		jobRepository.deleteById(jobId);
	}

	// ========== APPLICATION MANAGEMENT WITH PAGINATION ==========

	public PageResponse<JobApplicationResponse> getAllApplicationsForOwner(Long userId, int page, int size,
			String sortBy, String direction) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		List<Job> jobs = jobRepository.findByFranchiseId(franchise.getId());
		List<Long> jobIds = jobs.stream().map(Job::getId).collect(Collectors.toList());

		if (jobIds.isEmpty()) {
			return PageResponse.fromPage(Page.empty());
		}

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		// This uses the paginated version
		Page<JobApplication> applicationPage = applicationRepository.findByJobIdIn(jobIds, pageable);
		Page<JobApplicationResponse> responsePage = applicationPage.map(this::convertToApplicationResponse);

		return PageResponse.fromPage(responsePage);
	}

	public PageResponse<JobApplicationResponse> getApplicationsForJob(Long userId, Long jobId, int page, int size,
			String sortBy, String direction) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

		if (!job.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to view these applications");
		}

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<JobApplication> applicationPage = applicationRepository.findByJobId(jobId, pageable);
		Page<JobApplicationResponse> responsePage = applicationPage.map(this::convertToApplicationResponse);

		return PageResponse.fromPage(responsePage);
	}

	public JobApplicationResponse updateApplicationStatus(Long userId, Long applicationId, String status) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		JobApplication application = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new RuntimeException("Application not found"));

		if (!application.getJob().getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to update this application");
		}

		ApplicationStatus newStatus = ApplicationStatus.valueOf(status.toUpperCase());
		application.setStatus(newStatus);

		JobApplication updatedApplication = applicationRepository.save(application);
		return convertToApplicationResponse(updatedApplication);
	}

	// ========== FEEDBACK MANAGEMENT WITH PAGINATION ==========

	public PageResponse<FeedbackResponse> getOwnerFeedback(Long userId, int page, int size, String sortBy,
			String direction) {

		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<Feedback> feedbackPage = feedbackRepository.findByFranchiseId(franchise.getId(), pageable);
		Page<FeedbackResponse> responsePage = feedbackPage.map(this::convertToFeedbackResponse);

		return PageResponse.fromPage(responsePage);
	}

	public Map<String, Object> getFeedbackStats(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		List<Feedback> feedbacks = feedbackRepository.findByFranchiseId(franchise.getId());

		Map<String, Object> stats = new HashMap<>();
		stats.put("total", feedbacks.size());
		stats.put("averageRating", feedbackRepository.getAverageRatingForFranchise(franchise.getId()));
		stats.put("withReply", feedbacks.stream().filter(f -> f.getAdminReply() != null).count());
		stats.put("withoutReply", feedbacks.stream().filter(f -> f.getAdminReply() == null).count());

		return stats;
	}

	public PageResponse<FeedbackResponse> getPendingFeedback(Long userId, int page, int size, String sortBy,
			String direction) {

		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<Feedback> feedbackPage = feedbackRepository.findByFranchiseIdAndAdminReplyIsNull(franchise.getId(),
				pageable);
		Page<FeedbackResponse> responsePage = feedbackPage.map(this::convertToFeedbackResponse);

		return PageResponse.fromPage(responsePage);
	}

	public PageResponse<FeedbackResponse> getRecentFeedback(Long userId, int page, int size) {

		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
		Page<Feedback> feedbackPage = feedbackRepository.findByFranchiseId(franchise.getId(), pageable);
		Page<FeedbackResponse> responsePage = feedbackPage.map(this::convertToFeedbackResponse);

		return PageResponse.fromPage(responsePage);
	}

	public FeedbackResponse replyToFeedback(Long userId, Long feedbackId, FeedbackReplyRequest request) {

		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Feedback feedback = feedbackRepository.findById(feedbackId)
				.orElseThrow(() -> new RuntimeException("Feedback not found"));

		if (!feedback.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to reply to this feedback");
		}

		feedback.setAdminReply(request.getReply());
		feedback.setRepliedAt(LocalDateTime.now());
		feedback.setRepliedBy("owner");

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
		    context.setVariable("repliedBy", "Franchise Owner");
		    
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
		    System.out.println("Reply email sent to customer by Owner: " + updatedFeedback.getCustomerEmail());
		} catch (Exception e) {
		    System.err.println("Failed to send reply email to customer: " + e.getMessage());
		}
		return convertToFeedbackResponse(updatedFeedback);
	}

	// ========== MENU MANAGEMENT WITH PAGINATION ==========

	public PageResponse<MenuItemResponse> getOwnerMenu(Long userId, int page, int size, String sortBy,
			String direction) {
		// a Get user first
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// a Get franchise from user
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.findByFranchiseId(franchise.getId(), pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToMenuItemResponse);

		return PageResponse.fromPage(responsePage);
	}

	public MenuItemResponse updateMenuItemAvailability(Long userId, Long itemId, boolean available) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		MenuItem menuItem = menuRepository.findById(itemId)
				.orElseThrow(() -> new RuntimeException("Menu item not found"));

		// Check if menu item belongs to this franchise
		if (menuItem.getFranchise() != null && !menuItem.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to update this menu item");
		}

		menuItem.setAvailable(available);
		MenuItem updatedItem = menuRepository.save(menuItem);
		return convertToMenuItemResponse(updatedItem);
	}

	public MenuItemResponse updateMenuItemPrice(Long userId, Long itemId, Double price) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Franchise franchise = user.getFranchise();
		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		MenuItem menuItem = menuRepository.findById(itemId)
				.orElseThrow(() -> new RuntimeException("Menu item not found"));

		// Check if menu item belongs to this franchise
		if (menuItem.getFranchise() != null && !menuItem.getFranchise().getId().equals(franchise.getId())) {
			throw new RuntimeException("You don't have permission to update this menu item");
		}

		menuItem.setPrice(BigDecimal.valueOf(price));
		MenuItem updatedItem = menuRepository.save(menuItem);
		return convertToMenuItemResponse(updatedItem);
	}

	// ========== DASHBOARD ==========

	public OwnerDashboardResponse getDashboardStats(Long userId) {
		// a Get user first
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// a Get franchise from user instead of first franchise in database
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		OwnerDashboardResponse response = new OwnerDashboardResponse();

		// Set franchise
		response.setFranchise(convertToFranchiseResponse(franchise));

		// Set profile
		UserProfileResponse profile = new UserProfileResponse();
		profile.setId(user.getId());
		profile.setUsername(user.getUsername());
		profile.setEmail(user.getEmail());
		profile.setFirstName(user.getFirstName());
		profile.setLastName(user.getLastName());
		profile.setPhone(user.getPhone());
		response.setProfile(profile);

		// Set stats
		OwnerDashboardResponse.DashboardStats stats = new OwnerDashboardResponse.DashboardStats();

		List<Job> jobs = jobRepository.findByFranchiseId(franchise.getId());
		stats.setTotalJobs(jobs.size());
		stats.setOpenJobs(jobs.stream().filter(j -> j.getStatus() == JobStatus.OPEN).count());

		// FIXED: Use the correct method name - findByJobId (not findAllByJobId)
		List<JobApplication> allApplications = new java.util.ArrayList<>();
		for (Job job : jobs) {
			allApplications.addAll(applicationRepository.findByJobId(job.getId()));
		}

		stats.setTotalApplications(allApplications.size());
		stats.setNewApplications(allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.NEW).count());

		List<Feedback> feedbacks = feedbackRepository.findByFranchiseId(franchise.getId());
		stats.setTotalFeedback(feedbacks.size());
		stats.setAverageRating(feedbackRepository.getAverageRatingForFranchise(franchise.getId()) != null
				? feedbackRepository.getAverageRatingForFranchise(franchise.getId())
				: 0.0);

		Map<String, Long> appStatusMap = new HashMap<>();
		appStatusMap.put("NEW", allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.NEW).count());
		appStatusMap.put("INTERVIEW_SCHEDULED",
				allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED).count());
		appStatusMap.put("ACCEPTED",
				allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED).count());
		appStatusMap.put("REJECTED",
				allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count());

		stats.setApplicationsByStatus(appStatusMap);
		response.setStats(stats);

		// Set recent jobs
		response.setRecentJobs(
				jobs.stream().sorted((j1, j2) -> j2.getPostedDate().compareTo(j1.getPostedDate())).limit(5).map(job -> {
					JobResponse jobResponse = convertToJobResponse(job);
					// Add this line - set applications count
					jobResponse.setApplicationsCount(applicationRepository.countByJobId(job.getId()));
					return jobResponse;
				}).collect(Collectors.toList()));

		// Set recent feedback
		response.setRecentFeedback(
				feedbacks.stream().sorted((f1, f2) -> f2.getSubmittedAt().compareTo(f1.getSubmittedAt())).limit(5)
						.map(this::convertToFeedbackResponse).collect(Collectors.toList()));

		return response;
	}

	public Map<String, Object> getJobStats(Long userId) {
		// a Get user first
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// a Get franchise from user
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		List<Job> jobs = jobRepository.findByFranchiseId(franchise.getId());

		Map<String, Object> stats = new HashMap<>();
		stats.put("totalJobs", jobs.size());
		stats.put("openJobs", jobs.stream().filter(j -> j.getStatus() == JobStatus.OPEN).count());
		stats.put("closedJobs", jobs.stream().filter(j -> j.getStatus() == JobStatus.CLOSED).count());

		// FIXED: Use countByJobId method
		long totalApplications = 0;
		for (Job job : jobs) {
			totalApplications += applicationRepository.countByJobId(job.getId());
		}

		stats.put("totalApplications", totalApplications);

		return stats;
	}

	public Map<String, Object> getFeedbackStatsSummary(Long userId) {
		// a Get user first
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// a Get franchise from user
		Franchise franchise = user.getFranchise();

		if (franchise == null) {
			throw new RuntimeException("No franchise assigned to this owner");
		}

		List<Feedback> feedbacks = feedbackRepository.findByFranchiseId(franchise.getId());

		Map<String, Object> stats = new HashMap<>();
		stats.put("total", feedbacks.size());
		stats.put("averageRating", feedbackRepository.getAverageRatingForFranchise(franchise.getId()));
		stats.put("fiveStar", feedbacks.stream().filter(f -> f.getRating().getValue() == 5).count());
		stats.put("fourStar", feedbacks.stream().filter(f -> f.getRating().getValue() == 4).count());
		stats.put("threeStar", feedbacks.stream().filter(f -> f.getRating().getValue() == 3).count());
		stats.put("twoStar", feedbacks.stream().filter(f -> f.getRating().getValue() == 2).count());
		stats.put("oneStar", feedbacks.stream().filter(f -> f.getRating().getValue() == 1).count());

		return stats;
	}

	// ========== CONVERSION METHODS ==========

	private FranchiseResponse convertToFranchiseResponse(Franchise franchise) {
		FranchiseResponse response = new FranchiseResponse();
		response.setId(franchise.getId());
		response.setFranchiseName(franchise.getFranchiseName());
		response.setFranchiseCode(franchise.getFranchiseCode());
		response.setAddressLine1(franchise.getAddressLine1());
		response.setAddressLine2(franchise.getAddressLine2());
		response.setCity(franchise.getCity());
		response.setState(franchise.getState());
		response.setPostalCode(franchise.getPostalCode());
		response.setCountry(franchise.getCountry());
		response.setPhone(franchise.getPhone());
		response.setEmail(franchise.getEmail());
		response.setLatitude(franchise.getLatitude());
		response.setLongitude(franchise.getLongitude());
		response.setStatus(franchise.getStatus());
		response.setOperatingHours(franchise.getOperatingHours());
		response.setManagerName(franchise.getManagerName());
		response.setFullAddress(franchise.getFullAddress());
		return response;
	}

	private JobResponse convertToJobResponse(Job job) {
		JobResponse response = new JobResponse();
		response.setId(job.getId());
		response.setTitle(job.getTitle());
		response.setDescription(job.getDescription());
		response.setRequirements(job.getRequirements());
		response.setJobType(job.getJobType());
		response.setStatus(job.getStatus());
		response.setLocation(job.getLocation());
		response.setSalaryRange(job.getSalaryRange());
		response.setExperienceRequired(job.getExperienceRequired());
		response.setApplicationDeadline(job.getApplicationDeadline());
		response.setPositionsAvailable(job.getPositionsAvailable());
		response.setPostedDate(job.getPostedDate());

		if (job.getFranchise() != null) {
			response.setFranchiseId(job.getFranchise().getId());
			response.setFranchiseName(job.getFranchise().getFranchiseName());
			response.setFranchiseCity(job.getFranchise().getCity());
		}

		return response;
	}

	private JobApplicationResponse convertToApplicationResponse(JobApplication application) {
		JobApplicationResponse response = new JobApplicationResponse();
		response.setId(application.getId());
		response.setFullName(application.getFullName());
		response.setEmail(application.getEmail());
		response.setPhone(application.getPhone());
		response.setAge(application.getAge());
		response.setAddress(application.getAddress());
		response.setQualification(application.getQualification());
		response.setExperienceYears(application.getExperienceYears());
		response.setPreviousEmployer(application.getPreviousEmployer());
		response.setCoverNote(application.getCoverNote());
		response.setStatus(application.getStatus());
		response.setAppliedDate(application.getAppliedDate());

		if (application.getJob() != null) {
			response.setJobId(application.getJob().getId());
			response.setJobTitle(application.getJob().getTitle());
			if (application.getJob().getFranchise() != null) {
				response.setFranchiseName(application.getJob().getFranchise().getFranchiseName());
			}
		}

		return response;
	}

	private FeedbackResponse convertToFeedbackResponse(Feedback feedback) {
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

	private MenuItemResponse convertToMenuItemResponse(MenuItem menuItem) {
		MenuItemResponse response = new MenuItemResponse();
		response.setId(menuItem.getId());
		response.setName(menuItem.getName());
		response.setDescription(menuItem.getDescription());
		response.setPrice(menuItem.getPrice());
		response.setCategory(menuItem.getCategory());
		response.setImageUrl(menuItem.getImageUrl());
		response.setAvailable(menuItem.isAvailable());
		response.setVegetarian(menuItem.isVegetarian());
		response.setSpicy(menuItem.isSpicy());
		response.setCalories(menuItem.getCalories());
		response.setPreparationTimeMinutes(menuItem.getPreparationTimeMinutes());
		response.setCreatedAt(menuItem.getCreatedAt());

		if (menuItem.getFranchise() != null) {
			response.setFranchiseId(menuItem.getFranchise().getId());
			response.setFranchiseName(menuItem.getFranchise().getFranchiseName());
		}

		return response;
	}
}