package com.macs.franchise.service;

import com.macs.franchise.dto.request.JobRequest;
import com.macs.franchise.dto.request.JobApplicationRequest;
import com.macs.franchise.dto.response.JobResponse;
import com.macs.franchise.dto.response.JobApplicationResponse;
import com.macs.franchise.model.Job;
import com.macs.franchise.model.JobApplication;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.JobStatus;
import com.macs.franchise.model.enums.ApplicationStatus;
import com.macs.franchise.model.enums.JobType;
import com.macs.franchise.repository.JobRepository;
import com.macs.franchise.repository.JobApplicationRepository;
import com.macs.franchise.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import com.macs.franchise.service.EmailService;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDateTime;
import org.springframework.scheduling.annotation.Scheduled;

@Service
public class JobService {

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private JobApplicationRepository applicationRepository;

	@Autowired
	private FranchiseRepository franchiseRepository;

	@Autowired
	private EmailService emailService;

	// ========== JOB METHODS ==========

	// Get all jobs
	public List<JobResponse> getAllJobs() {
		return jobRepository.findAllByOrderByPostedDateDesc().stream().map(this::convertToJobResponse)
				.collect(Collectors.toList());
	}

	// Get job by ID
	public JobResponse getJobById(Long id) {
		Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
		return convertToJobResponse(job);
	}

	// Get jobs by franchise
	public List<JobResponse> getJobsByFranchise(Long franchiseId) {
		return jobRepository.findByFranchiseId(franchiseId).stream().map(this::convertToJobResponse)
				.collect(Collectors.toList());
	}

	// Get open jobs
	public List<JobResponse> getOpenJobs() {
		return jobRepository.findByStatusOrderByPostedDateDesc(JobStatus.OPEN).stream().map(this::convertToJobResponse)
				.collect(Collectors.toList());
	}

	// Get jobs by type
	public List<JobResponse> getJobsByType(JobType jobType) {
		return jobRepository.findByJobType(jobType).stream().map(this::convertToJobResponse)
				.collect(Collectors.toList());
	}

	// Get jobs by location (case insensitive)
	public List<JobResponse> getJobsByLocation(String location) {
		return jobRepository.findByLocationContainingIgnoreCase(location).stream().map(this::convertToJobResponse)
				.collect(Collectors.toList());
	}

	// Search jobs (case insensitive)
	public List<JobResponse> searchJobs(String searchTerm) {
		return jobRepository.searchJobsIgnoreCase(searchTerm).stream().map(this::convertToJobResponse)
				.collect(Collectors.toList());
	}

	// Create new job
	public JobResponse createJob(JobRequest request) {
		Franchise franchise = franchiseRepository.findById(request.getFranchiseId())
				.orElseThrow(() -> new RuntimeException("Franchise not found with id: " + request.getFranchiseId()));

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
//        job.setStatus(JobStatus.OPEN);

		if (request.getApplicationDeadline() != null
				&& request.getApplicationDeadline().isBefore(LocalDateTime.now())) {
			job.setStatus(JobStatus.CLOSED);
		} else {
			job.setStatus(JobStatus.OPEN);
		}

		Job savedJob = jobRepository.save(job);
		return convertToJobResponse(savedJob);
	}

	// Update job
	public JobResponse updateJob(Long id, JobRequest request) {
		Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

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

	// Close job
	public JobResponse closeJob(Long id) {
		Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
		job.setStatus(JobStatus.CLOSED);
		Job updatedJob = jobRepository.save(job);
		return convertToJobResponse(updatedJob);
	}

	public List<JobResponse> getJobsByStatus(JobStatus status) {
		return jobRepository.findByStatus(status).stream().map(this::convertToJobResponse).collect(Collectors.toList());
	}

	public JobResponse openJob(Long id) {
		Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
		job.setStatus(JobStatus.OPEN);
		Job updatedJob = jobRepository.save(job);
		return convertToJobResponse(updatedJob);
	}

	// Delete job
	public void deleteJob(Long id) {
		if (!jobRepository.existsById(id)) {
			throw new RuntimeException("Job not found with id: " + id);
		}
		jobRepository.deleteById(id);
	}

	// ========== APPLICATION METHODS ==========

	// Apply for a job
	public JobApplicationResponse applyForJob(JobApplicationRequest request) {
		// Check if already applied
		if (applicationRepository.existsByEmailAndJobId(request.getEmail(), request.getJobId())) {
			throw new RuntimeException("You have already applied for this job");
		}

		Job job = jobRepository.findById(request.getJobId())
				.orElseThrow(() -> new RuntimeException("Job not found with id: " + request.getJobId()));

		if (job.getStatus() != JobStatus.OPEN) {
			throw new RuntimeException("This job is no longer accepting applications");
		}

		JobApplication application = new JobApplication();
		application.setFullName(request.getFullName());
		application.setEmail(request.getEmail());
		application.setPhone(request.getPhone());
		application.setAge(request.getAge());
		application.setAddress(request.getAddress());
		application.setQualification(request.getQualification());
		application.setExperienceYears(request.getExperienceYears());
		application.setPreviousEmployer(request.getPreviousEmployer());
		application.setCoverNote(request.getCoverNote());
		application.setJob(job);
		application.setStatus(ApplicationStatus.NEW);

		JobApplication savedApplication = applicationRepository.save(application);
		try {
			sendJobApplicationConfirmationEmail(savedApplication, job);
		} catch (Exception e) {
			System.err.println("Failed to send job application confirmation email: " + e.getMessage());
		}
		return convertToApplicationResponse(savedApplication);
	}

	// Send confirmation email when a job application is submitted
	private void sendJobApplicationConfirmationEmail(JobApplication application, Job job) {
		try {
			Context context = new Context();
			context.setVariable("name", application.getFullName());
			context.setVariable("jobTitle", job.getTitle());
			context.setVariable("location", job.getLocation());
			context.setVariable("applicationId", application.getId());
			context.setVariable("appliedDate",
					application.getAppliedDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
			context.setVariable("status", application.getStatus().toString());

			emailService.sendHtmlEmail(application.getEmail(),
					"Job Application Received - " + job.getTitle() + " - MAC's Careers",
					"email/job-application-confirmation", context);
			System.out.println("Job application confirmation email sent to: " + application.getEmail());
		} catch (Exception e) {
			System.err.println("Failed to send job application confirmation email: " + e.getMessage());
		}
	}

	// Get applications for a job
	public List<JobApplicationResponse> getApplicationsForJob(Long jobId) {
		return applicationRepository.findByJobId(jobId, null).stream().map(this::convertToApplicationResponse)
				.collect(Collectors.toList());
	}

	// Update application status
	public JobApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatus status) {
		JobApplication application = applicationRepository.findById(applicationId)
				.orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

		ApplicationStatus oldStatus = application.getStatus();
		application.setStatus(status);

		JobApplication updatedApplication = applicationRepository.save(application);

		// Send status update email
		try {
			sendJobApplicationStatusUpdateEmail(updatedApplication, oldStatus);
		} catch (Exception e) {
			System.err.println("Failed to send job application status update email: " + e.getMessage());
		}

		return convertToApplicationResponse(updatedApplication);
	}

	// Send status update email when job application status changes
	private void sendJobApplicationStatusUpdateEmail(JobApplication application, ApplicationStatus oldStatus) {
		try {
			Context context = new Context();
			context.setVariable("name", application.getFullName());
			context.setVariable("jobTitle", application.getJob().getTitle());
			context.setVariable("oldStatus", oldStatus.toString());
			context.setVariable("newStatus", application.getStatus().toString());

			String subject = getJobStatusEmailSubject(application.getStatus(), application.getJob().getTitle());

			emailService.sendHtmlEmail(application.getEmail(), subject, "email/job-application-status-update", context);
			System.out.println("Job application status update email sent to: " + application.getEmail());
		} catch (Exception e) {
			System.err.println("Failed to send job application status update email: " + e.getMessage());
		}
	}

	// Get email subject based on job application status
	private String getJobStatusEmailSubject(ApplicationStatus status, String jobTitle) {
		switch (status) {
		case UNDER_REVIEW:
			return "Your application for " + jobTitle + " is Under Review - MAC's Careers";
		case INTERVIEW_SCHEDULED:
			return "Interview Scheduled for " + jobTitle + " - MAC's Careers";
		case ACCEPTED:
			return "Congratulations! Your application for " + jobTitle + " has been Accepted - MAC's Careers";
		case REJECTED:
			return "Update on your application for " + jobTitle + " - MAC's Careers";
		default:
			return "Update on your application for " + jobTitle + " - MAC's Careers";
		}
	}

	// ========== CONVERSION METHODS ==========

	public JobResponse convertToJobResponse(Job job) {
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
		response.setApplicationsCount(applicationRepository.countByJobId(job.getId()));
		if (job.getFranchise() != null) {
			response.setFranchiseId(job.getFranchise().getId());
			response.setFranchiseName(job.getFranchise().getFranchiseName());
			response.setFranchiseCity(job.getFranchise().getCity());
		}

		return response;
	}

	@Scheduled(cron = "0 0 0 * * ?")
	public void autoCloseExpiredJobs() {
		try {
			// Get all OPEN jobs
			List<Job> openJobs = jobRepository.findByStatus(JobStatus.OPEN);

			LocalDateTime now = LocalDateTime.now();
			int closedCount = 0;

			for (Job job : openJobs) {
				if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(now)) {
					job.setStatus(JobStatus.CLOSED);
					jobRepository.save(job);
					closedCount++;
					System.out.println("Auto-closed job: " + job.getId() + " - " + job.getTitle());
				}
			}

			if (closedCount > 0) {
				System.out.println("Auto-closed " + closedCount + " expired jobs at " + now);
			}
		} catch (Exception e) {
			System.err.println("Error auto-closing jobs: " + e.getMessage());
		}
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
}