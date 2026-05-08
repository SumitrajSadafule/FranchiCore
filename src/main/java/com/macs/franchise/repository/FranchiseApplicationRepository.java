package com.macs.franchise.repository;

import com.macs.franchise.model.FranchiseApplication;
import com.macs.franchise.model.enums.FranchiseApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FranchiseApplicationRepository extends JpaRepository<FranchiseApplication, Long> {

	// Find by status
	List<FranchiseApplication> findByStatus(FranchiseApplicationStatus status);

	// Find by email (to check if already applied)
	boolean existsByEmail(String email);

	// Find by preferred city - case insensitive
	@Query("SELECT f FROM FranchiseApplication f WHERE LOWER(f.preferredCity) = LOWER(:city)")
	List<FranchiseApplication> findByPreferredCityIgnoreCase(@Param("city") String city);

	// Search applications by name, email, phone, city - case insensitive
	@Query("SELECT f FROM FranchiseApplication f WHERE "
			+ "LOWER(f.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(f.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(f.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(f.preferredCity) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	List<FranchiseApplication> searchApplicationsIgnoreCase(@Param("searchTerm") String searchTerm);

	// Get all applications sorted by applied date (latest first)
	List<FranchiseApplication> findAllByOrderByAppliedDateDesc();

	// Count by status
	@Query("SELECT f.status, COUNT(f) FROM FranchiseApplication f GROUP BY f.status")
	List<Object[]> countByStatus();
}