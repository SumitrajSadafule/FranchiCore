package com.macs.franchise.repository;

import com.macs.franchise.model.JobApplication;
import com.macs.franchise.model.enums.ApplicationStatus;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

	// Find by job ID (returns list) - for non-paginated queries
	List<JobApplication> findByJobId(Long jobId);

	// Find by job ID with pagination
	Page<JobApplication> findByJobId(Long jobId, Pageable pageable);

	// Find by multiple job IDs with pagination
	Page<JobApplication> findByJobIdIn(List<Long> jobIds, Pageable pageable);

	// Find by status with pagination
	Page<JobApplication> findByStatus(ApplicationStatus status, Pageable pageable);

	// Find by job and status with pagination
	Page<JobApplication> findByJobIdAndStatus(Long jobId, ApplicationStatus status, Pageable pageable);

	// Count applications for a job
	Long countByJobId(Long jobId);

	// Check if exists by email and job
	boolean existsByEmailAndJobId(String email, Long jobId);

	@Modifying
	@Transactional
	@Query("DELETE FROM JobApplication ja WHERE ja.job.id = :jobId")
	void deleteByJobId(@Param("jobId") Long jobId);
}