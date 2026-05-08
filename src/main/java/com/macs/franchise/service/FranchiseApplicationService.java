package com.macs.franchise.service;

import com.macs.franchise.dto.request.FranchiseApplicationRequest;
import com.macs.franchise.dto.response.ApproveApplicationResponse;
import com.macs.franchise.dto.response.FranchiseApplicationResponse;
import com.macs.franchise.model.FranchiseApplication;
import com.macs.franchise.model.Role;
import com.macs.franchise.model.enums.FranchiseApplicationStatus;
import com.macs.franchise.repository.FeedbackRepository;
import com.macs.franchise.repository.FranchiseApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import com.macs.franchise.model.User;
import com.macs.franchise.model.Feedback;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.RoleType;
import com.macs.franchise.model.enums.FranchiseStatus;
import com.macs.franchise.repository.UserRepository;
import com.macs.franchise.repository.FranchiseRepository;
import com.macs.franchise.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.macs.franchise.model.Job;
import com.macs.franchise.model.JobApplication;
import com.macs.franchise.model.MenuItem;
import com.macs.franchise.repository.JobRepository;
import com.macs.franchise.repository.JobApplicationRepository;
import com.macs.franchise.repository.MenuRepository;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.thymeleaf.context.Context;
import com.macs.franchise.service.EmailService;
import org.thymeleaf.context.Context;

@Service
public class FranchiseApplicationService {

	@Autowired
	private FranchiseApplicationRepository applicationRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private FranchiseRepository franchiseRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private JobApplicationRepository jobApplicationRepository;

	@Autowired
	private MenuRepository menuRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private EmailService emailService;

	@Autowired
	private FeedbackRepository feedbackRepository;

	// Submit new application
	public FranchiseApplicationResponse submitApplication(FranchiseApplicationRequest request) {
		// Check if already applied with same email
		if (applicationRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("An application with this email already exists");
		}

		FranchiseApplication application = new FranchiseApplication();

		// Personal Information
		application.setFullName(request.getFullName());
		application.setAge(request.getAge());
		application.setAddress(request.getAddress());
		application.setPhone(request.getPhone());
		application.setEmail(request.getEmail());

		// Education
		application.setQualification(request.getQualification());
		application.setInstitution(request.getInstitution());
		application.setGraduationYear(request.getGraduationYear());

		// Financial Information
		application.setNetWorth(request.getNetWorth());
		application.setLiquidCapital(request.getLiquidCapital());
		application.setSourceOfFunds(request.getSourceOfFunds());

		// Business Interest
		application.setPreferredCity(request.getPreferredCity());
		application.setReasonForInterest(request.getReasonForInterest());

		// Commitment
		application.setPreviousOwnership(request.getPreviousOwnership());
		application.setOwnershipDetails(request.getOwnershipDetails());
		application.setWillingToTrain(request.getWillingToTrain());

		// Legal Documents
		application.setPanNumber(request.getPanNumber());
		application.setAadhaarNumber(request.getAadhaarNumber());

		// Status
		application.setStatus(FranchiseApplicationStatus.NEW);

		FranchiseApplication savedApplication = applicationRepository.save(application);

		// Send confirmation email
		try {
			sendApplicationConfirmationEmail(savedApplication);
		} catch (Exception e) {
			// Log error but don't block the application submission
			System.err.println("Failed to send confirmation email: " + e.getMessage());
		}

		return convertToResponse(savedApplication);
	}

	// Send confirmation email when application is submitted
	private void sendApplicationConfirmationEmail(FranchiseApplication application) {
		try {
			Context context = new Context();
			context.setVariable("name", application.getFullName());
			context.setVariable("applicationId", application.getId());
			context.setVariable("preferredCity", application.getPreferredCity());
			context.setVariable("status", application.getStatus().getDescription());

			emailService.sendHtmlEmail(application.getEmail(), "Franchise Application Received - MAC's Franchise",
					"email/franchise-application-confirmation", context);
			System.out.println("Confirmation email sent to: " + application.getEmail());
		} catch (Exception e) {
			System.err.println("Failed to send confirmation email: " + e.getMessage());
		}
	}

	// Send welcome email with login credentials to new franchise owner
	private void sendOwnerCredentialsEmail(FranchiseApplication application, User user, Franchise franchise,
			String plainPassword) {
		try {
			Context context = new Context();
			context.setVariable("name", application.getFullName());
			context.setVariable("username", user.getUsername());
			context.setVariable("password", plainPassword);
			context.setVariable("franchiseName", franchise.getFranchiseName());
			context.setVariable("franchiseCode", franchise.getFranchiseCode());
			context.setVariable("city", franchise.getCity());
			context.setVariable("franchiseStatus", franchise.getStatus().getDescription());

			emailService.sendHtmlEmail(application.getEmail(), "Welcome to MAC's Franchise - Your Account Credentials",
					"email/franchise-owner-credentials", context);
			System.out.println("Welcome email sent to: " + application.getEmail());
		} catch (Exception e) {
			System.err.println("Failed to send welcome email: " + e.getMessage());
		}
	}

	// Get all applications (Admin only)
	public List<FranchiseApplicationResponse> getAllApplications() {
		return applicationRepository.findAllByOrderByAppliedDateDesc().stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get application by ID
	public FranchiseApplicationResponse getApplicationById(Long id) {
		FranchiseApplication application = applicationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
		return convertToResponse(application);
	}

	// Get applications by status
	public List<FranchiseApplicationResponse> getApplicationsByStatus(FranchiseApplicationStatus status) {
		return applicationRepository.findByStatus(status).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get applications by preferred city (case insensitive)
	public List<FranchiseApplicationResponse> getApplicationsByCity(String city) {
		return applicationRepository.findByPreferredCityIgnoreCase(city).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Search applications (case insensitive)
	public List<FranchiseApplicationResponse> searchApplications(String searchTerm) {
		return applicationRepository.searchApplicationsIgnoreCase(searchTerm).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Update application status (Admin only)
	public FranchiseApplicationResponse updateApplicationStatus(Long id, FranchiseApplicationStatus status,
			String adminNotes, String reviewedBy) {
		FranchiseApplication application = applicationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

		FranchiseApplicationStatus oldStatus = application.getStatus();

		application.setStatus(status);
		application.setAdminNotes(adminNotes);
		application.setReviewedBy(reviewedBy);
		application.setReviewedDate(LocalDateTime.now());

		FranchiseApplication updatedApplication = applicationRepository.save(application);

		// Send status update email
		try {
			sendStatusUpdateEmail(updatedApplication, oldStatus);
		} catch (Exception e) {
			System.err.println("Failed to send status update email: " + e.getMessage());
		}

		return convertToResponse(updatedApplication);
	}

	// Send status update email when application status changes
	private void sendStatusUpdateEmail(FranchiseApplication application, FranchiseApplicationStatus oldStatus) {
		try {
			Context context = new Context();
			context.setVariable("name", application.getFullName());
			context.setVariable("applicationId", application.getId());
			context.setVariable("oldStatus", oldStatus.getDescription());
			context.setVariable("newStatus", application.getStatus().getDescription());
			context.setVariable("adminNotes",
					application.getAdminNotes() != null ? application.getAdminNotes() : "No additional notes");
			context.setVariable("preferredCity", application.getPreferredCity());

			String subject = getStatusEmailSubject(application.getStatus());

			emailService.sendHtmlEmail(application.getEmail(), subject, "email/franchise-application-status-update",
					context);
			System.out.println("Status update email sent to: " + application.getEmail());
		} catch (Exception e) {
			System.err.println("Failed to send status update email: " + e.getMessage());
		}
	}

	// Get email subject based on status
	private String getStatusEmailSubject(FranchiseApplicationStatus status) {
		switch (status) {
		case UNDER_REVIEW:
			return "Your Franchise Application is Under Review - MAC's Franchise";
		case INTERVIEW_SCHEDULED:
			return "Interview Scheduled for Your Franchise Application - MAC's Franchise";
		case APPROVED:
			return "Congratulations! Your Franchise Application is Approved - MAC's Franchise";
		case REJECTED:
			return "Update on Your Franchise Application - MAC's Franchise";
		default:
			return "Update on Your Franchise Application - MAC's Franchise";
		}
	}

	// Delete application
	public void deleteApplication(Long id) {
		if (!applicationRepository.existsById(id)) {
			throw new RuntimeException("Application not found with id: " + id);
		}

		try {
			FranchiseApplication application = applicationRepository.findById(id).get();

			// Find franchise linked to this application
			Franchise linkedFranchise = null;

			// Method 1: Try by franchise_application_id (if your Franchise entity has this
			// field)
			try {
				linkedFranchise = franchiseRepository.findByFranchiseApplicationId(id);
				if (linkedFranchise != null) {
					System.out.println("Found franchise by application ID: " + linkedFranchise.getId());
				}
			} catch (Exception e) {
				// Method doesn't exist or no result
			}

			// Method 2: Try to find franchise by email from application
			if (linkedFranchise == null && application.getEmail() != null) {
				try {
					// You need to add this method to FranchiseRepository
					List<Franchise> franchisesByEmail = franchiseRepository.findByEmail(application.getEmail());
					if (!franchisesByEmail.isEmpty()) {
						linkedFranchise = franchisesByEmail.get(0);
						System.out.println("Found franchise by email: " + linkedFranchise.getId());
					}
				} catch (Exception e) {
					// Method doesn't exist or no result
				}
			}

			// Method 3: Try to find franchise by phone from application
			if (linkedFranchise == null && application.getPhone() != null) {
				try {
					// You need to add this method to FranchiseRepository
					List<Franchise> franchisesByPhone = franchiseRepository.findByPhone(application.getPhone());
					if (!franchisesByPhone.isEmpty()) {
						linkedFranchise = franchisesByPhone.get(0);
						System.out.println("Found franchise by phone: " + linkedFranchise.getId());
					}
				} catch (Exception e) {
					// Method doesn't exist or no result
				}
			}

			// If we found a linked franchise, delete all related data
			if (linkedFranchise != null) {
				Long franchiseId = linkedFranchise.getId();
				System.out.println("Deleting franchise ID: " + franchiseId);

				// Step 1: Delete all feedback records linked to this franchise
				try {
					List<Feedback> feedbacks = feedbackRepository.findByFranchiseId(franchiseId);
					if (!feedbacks.isEmpty()) {
						feedbackRepository.deleteAll(feedbacks);
						System.out.println("Deleted " + feedbacks.size() + " feedback records");
					}
				} catch (Exception e) {
					System.err.println("Error deleting feedback: " + e.getMessage());
				}

				// Step 2: Delete all jobs linked to this franchise
				try {
					List<Job> jobs = jobRepository.findByFranchiseId(franchiseId);
					if (!jobs.isEmpty()) {
						// First delete job applications
						for (Job job : jobs) {
							List<JobApplication> applications = jobApplicationRepository.findByJobId(job.getId());
							if (!applications.isEmpty()) {
								jobApplicationRepository.deleteAll(applications);
								System.out.println(
										"Deleted " + applications.size() + " job applications for job: " + job.getId());
							}
						}
						jobRepository.deleteAll(jobs);
						System.out.println("Deleted " + jobs.size() + " jobs");
					}
				} catch (Exception e) {
					System.err.println("Error deleting jobs: " + e.getMessage());
				}

				// Step 3: Delete all menu items linked to this franchise
				try {
					Page<MenuItem> menuItemsPage = menuRepository.findByFranchiseId(franchiseId, Pageable.unpaged());
					List<MenuItem> menuItems = menuItemsPage.getContent();
					if (!menuItems.isEmpty()) {
						menuRepository.deleteAll(menuItems);
						System.out.println("Deleted " + menuItems.size() + " menu items");
					}
				} catch (Exception e) {
					System.err.println("Error deleting menu items: " + e.getMessage());
				}

				// Step 4: Delete the franchise
				try {
					franchiseRepository.delete(linkedFranchise);
					System.out.println("Deleted franchise: " + franchiseId);
				} catch (Exception e) {
					System.err.println("Error deleting franchise: " + e.getMessage());
				}
			}

			// Step 5: Delete the application
			applicationRepository.deleteById(id);
			System.out.println("Deleted application: " + id);

		} catch (DataIntegrityViolationException e) {
			throw new RuntimeException(
					"Cannot delete this application because it is linked to other records: " + e.getMessage());
		}
	}

	// Get application statistics
	public List<Object[]> getApplicationStatistics() {
		return applicationRepository.countByStatus();
	}

	// Helper method to convert Entity to Response DTO
	private FranchiseApplicationResponse convertToResponse(FranchiseApplication application) {
		FranchiseApplicationResponse response = new FranchiseApplicationResponse();

		response.setId(application.getId());

		// Personal Information
		response.setFullName(application.getFullName());
		response.setAge(application.getAge());
		response.setAddress(application.getAddress());
		response.setPhone(application.getPhone());
		response.setEmail(application.getEmail());

		// Education
		response.setQualification(application.getQualification());
		response.setInstitution(application.getInstitution());
		response.setGraduationYear(application.getGraduationYear());

		// Financial Information
		response.setNetWorth(application.getNetWorth());
		response.setLiquidCapital(application.getLiquidCapital());
		response.setSourceOfFunds(application.getSourceOfFunds());

		// Business Interest
		response.setPreferredCity(application.getPreferredCity());
		response.setReasonForInterest(application.getReasonForInterest());

		// Commitment
		response.setPreviousOwnership(application.getPreviousOwnership());
		response.setOwnershipDetails(application.getOwnershipDetails());
		response.setWillingToTrain(application.getWillingToTrain());

		// Legal Documents
		response.setPanNumber(application.getPanNumber());
		response.setAadhaarNumber(application.getAadhaarNumber());

		// Status
		response.setStatus(application.getStatus());
		response.setAdminNotes(application.getAdminNotes());
		response.setAppliedDate(application.getAppliedDate());
		response.setReviewedDate(application.getReviewedDate());

		return response;
	}

	/**
	 * Approve a franchise application and automatically create User and Franchise
	 * 
	 * @param applicationId - ID of the application to approve
	 * @param username      - Username for the new franchise owner (provided by
	 *                      admin)
	 * @param password      - Password for the new franchise owner (provided by
	 *                      admin)
	 * @return ApproveApplicationResponse with created user and franchise details
	 */
	public ApproveApplicationResponse approveApplication(Long applicationId, String username, String password) {

		// 1. Get the application
		FranchiseApplication application = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

		// 2. Check if already approved
		if (application.getStatus() == FranchiseApplicationStatus.APPROVED) {
			throw new RuntimeException("Application is already approved");
		}

		// 3. Check if username already exists
		if (userRepository.existsByUsername(username)) {
			throw new RuntimeException("Username '" + username + "' is already taken. Please choose another.");
		}

		// 4. Check if email already exists
//		if (userRepository.existsByEmail(application.getEmail())) {
//			throw new RuntimeException("Email '" + application.getEmail()
//					+ "' is already registered. This applicant may already have an account.");
//		}
		// After franchise is saved and user is updated
		// Send welcome email with credentials

		// 5. Create User from application data
		User user = new User();
		user.setUsername(username);
		user.setPassword(passwordEncoder.encode(password));
		user.setEmail(application.getEmail());
		user.setFirstName(application.getFullName().split(" ")[0]); // First name from full name
		user.setLastName(application.getFullName().split(" ").length > 1
				? application.getFullName().substring(application.getFullName().indexOf(" ") + 1)
				: "");
		user.setPhone(application.getPhone());
		user.setEnabled(true);

		// Assign FRANCHISE_OWNER role
		Role ownerRole = roleRepository.findByName(RoleType.ROLE_FRANCHISE_OWNER)
				.orElseThrow(() -> new RuntimeException("Franchise Owner role not found"));
		Set<Role> roles = new HashSet<>();
		roles.add(ownerRole);
		user.setRoles(roles);

		// 6. Create Franchise from application data
		Franchise franchise = new Franchise();
		franchise.setFranchiseName(application.getFullName() + "'s Franchise"); // Default name, can be edited later
		franchise.setFranchiseCode(generateFranchiseCode());
		franchise.setAddressLine1(application.getAddress() != null ? application.getAddress() : "Address not provided");
		franchise.setCity(
				application.getPreferredCity() != null ? application.getPreferredCity() : "City not specified");
		franchise.setState("State not specified"); // Default, can be updated later
		franchise.setPostalCode("000000"); // Default, can be updated later
		franchise.setPhone(application.getPhone());
		franchise.setEmail(application.getEmail());
		franchise.setStatus(FranchiseStatus.PENDING_APPROVAL); // Initially pending, admin can activate later
		franchise.setOperatingHours("Mon-Sun: 10:00 AM - 11:00 PM"); // Default operating hours

		// 7. Save user first to get ID
		User savedUser = userRepository.save(user);

		// 8. Set bidirectional relationship
		savedUser.setFranchise(franchise);
		franchise.setUser(savedUser);

		// 9. Save franchise
		Franchise savedFranchise = franchiseRepository.save(franchise);

		// 10. Update user again with franchise reference
		savedUser = userRepository.save(savedUser);
		// After franchise is saved and user is updated
		// Send welcome email with credentials
		sendOwnerCredentialsEmail(application, savedUser, savedFranchise, password);
		// 11. Update application status
		application.setStatus(FranchiseApplicationStatus.APPROVED);
		application.setReviewedBy("system");
		application.setReviewedDate(LocalDateTime.now());
		application.setAdminNotes("Application approved. User and franchise created automatically.");
		FranchiseApplication updatedApplication = applicationRepository.save(application);

		// 12. Build response
		ApproveApplicationResponse response = new ApproveApplicationResponse();
		response.setApplicationId(updatedApplication.getId());
		response.setApplicationStatus(updatedApplication.getStatus().name());
		response.setMessage("Application approved successfully! User and franchise created.");

		// User details
		response.setUserId(savedUser.getId());
		response.setUsername(savedUser.getUsername());
		response.setEmail(savedUser.getEmail());
		response.setFirstName(savedUser.getFirstName());
		response.setLastName(savedUser.getLastName());
		response.setPhone(savedUser.getPhone());

		// Franchise details
		response.setFranchiseId(savedFranchise.getId());
		response.setFranchiseName(savedFranchise.getFranchiseName());
		response.setFranchiseCode(savedFranchise.getFranchiseCode());
		response.setCity(savedFranchise.getCity());
		response.setAddress(savedFranchise.getAddressLine1());
		response.setStatus(savedFranchise.getStatus().name());
		response.setCreatedAt(LocalDateTime.now());

		return response;
	}

	// Generate a unique franchise code Format: MAC + 3-digit number (e.g.,
	// MAC001,MAC002, etc.)
	private String generateFranchiseCode() {
	    Integer maxNumber = franchiseRepository.getMaxFranchiseNumber();
	    int nextNumber = (maxNumber == null ? 0 : maxNumber) + 1;
	    return "MAC" + String.format("%03d", nextNumber);
	}
}