package com.macs.franchise.repository;

import com.macs.franchise.model.Job;
import com.macs.franchise.model.enums.JobType;

import jakarta.transaction.Transactional;

import com.macs.franchise.model.enums.JobStatus;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

	// Find by franchise
	List<Job> findByFranchiseId(Long franchiseId);

	// Find by status
	List<Job> findByStatus(JobStatus status);

	// Find by job type
	List<Job> findByJobType(JobType jobType);

	// Find by location - case insensitive
	@Query("SELECT j FROM Job j WHERE LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
	List<Job> findByLocationContainingIgnoreCase(@Param("location") String location);

	// Search jobs by title, description, location - case insensitive
	@Query("SELECT j FROM Job j WHERE " + "LOWER(j.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(j.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(j.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	List<Job> searchJobsIgnoreCase(@Param("searchTerm") String searchTerm);

	// Find open jobs (status = OPEN)
	List<Job> findByStatusOrderByPostedDateDesc(JobStatus status);

	// Find by franchise and status
	List<Job> findByFranchiseIdAndStatus(Long franchiseId, JobStatus status);

	@Modifying
	@Transactional
	@Query("DELETE FROM Job j WHERE j.franchise.id = :franchiseId")
	void deleteByFranchiseId(@Param("franchiseId") Long franchiseId);

	// Get all jobs sorted by posted date (latest first)
	List<Job> findAllByOrderByPostedDateDesc();

	// Find by franchise with pagination
	Page<Job> findByFranchiseId(Long franchiseId, org.springframework.data.domain.Pageable pageable);

}