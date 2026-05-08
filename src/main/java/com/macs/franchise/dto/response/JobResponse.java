package com.macs.franchise.dto.response;

import com.macs.franchise.model.enums.JobType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.macs.franchise.model.enums.JobStatus;
import java.time.LocalDateTime;

public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private JobType jobType;
    private JobStatus status;
    private String location;
    private String salaryRange;
    private String experienceRequired;
    private LocalDateTime applicationDeadline;
    private Integer positionsAvailable;
    private Long franchiseId;
    private String franchiseName;
    private String franchiseCity;
    private LocalDateTime postedDate;
    @JsonProperty("applicationsCount")
    private Long applicationsCount;
    // Constructors
    public JobResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getExperienceRequired() { return experienceRequired; }
    public void setExperienceRequired(String experienceRequired) { this.experienceRequired = experienceRequired; }

    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public Integer getPositionsAvailable() { return positionsAvailable; }
    public void setPositionsAvailable(Integer positionsAvailable) { this.positionsAvailable = positionsAvailable; }

    public Long getFranchiseId() { return franchiseId; }
    public void setFranchiseId(Long franchiseId) { this.franchiseId = franchiseId; }

    public String getFranchiseName() { return franchiseName; }
    public void setFranchiseName(String franchiseName) { this.franchiseName = franchiseName; }

    public String getFranchiseCity() { return franchiseCity; }
    public void setFranchiseCity(String franchiseCity) { this.franchiseCity = franchiseCity; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }
    
    public Long getApplicationsCount() { return applicationsCount; }
    public void setApplicationsCount(Long applicationsCount) { this.applicationsCount = applicationsCount; }
}