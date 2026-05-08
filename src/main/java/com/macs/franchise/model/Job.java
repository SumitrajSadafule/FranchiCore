package com.macs.franchise.model;

import com.macs.franchise.model.enums.JobType;
import com.macs.franchise.model.enums.JobStatus;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@EntityListeners(AuditingEntityListener.class)
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "description", length = 2000, nullable = false)
    private String description;

    @Column(name = "requirements", length = 2000)
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", length = 20, nullable = false)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private JobStatus status = JobStatus.OPEN;

    @Column(name = "location", length = 100, nullable = false)
    private String location;

    @Column(name = "salary_range", length = 50)
    private String salaryRange;

    @Column(name = "experience_required", length = 50)
    private String experienceRequired;

    @Column(name = "application_deadline")
    private LocalDateTime applicationDeadline;

    @Column(name = "positions_available")
    private Integer positionsAvailable = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "franchise_id", nullable = false)
    private Franchise franchise;

    @CreatedDate
    @Column(name = "posted_date", updatable = false)
    private LocalDateTime postedDate;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "posted_by")
    private String postedBy;

    // Constructors
    public Job() {}

    public Job(String title, String description, JobType jobType, String location, Franchise franchise) {
        this.title = title;
        this.description = description;
        this.jobType = jobType;
        this.location = location;
        this.franchise = franchise;
    }

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

    public Franchise getFranchise() { return franchise; }
    public void setFranchise(Franchise franchise) { this.franchise = franchise; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }
}