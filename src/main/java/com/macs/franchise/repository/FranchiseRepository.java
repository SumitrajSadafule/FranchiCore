package com.macs.franchise.repository;

import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.FranchiseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FranchiseRepository extends JpaRepository<Franchise, Long> {

	// Find by franchise code
	Optional<Franchise> findByFranchiseCode(String franchiseCode);

	// Find franchise by email
	List<Franchise> findByEmail(String email);

	// Find franchise by phone
	List<Franchise> findByPhone(String phone);

	// Find by city - case insensitive
	@Query("SELECT f FROM Franchise f WHERE LOWER(f.city) = LOWER(:city)")
	List<Franchise> findByCityIgnoreCase(@Param("city") String city);

	// Find by status - THIS WAS MISSING
	List<Franchise> findByStatus(FranchiseStatus status);

	// Search by name, city, state - case insensitive
	@Query("SELECT f FROM Franchise f WHERE " + "LOWER(f.franchiseName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(f.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(f.state) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	List<Franchise> searchByNameOrCityIgnoreCase(@Param("searchTerm") String searchTerm);

	// Get all franchises sorted by city
	@Query("SELECT f FROM Franchise f ORDER BY f.city ASC")
	List<Franchise> findAllSortedByCityAsc();

	@Query("SELECT f FROM Franchise f ORDER BY f.city DESC")
	List<Franchise> findAllSortedByCityDesc();
	
	 @Query("SELECT MAX(CAST(SUBSTRING(f.franchiseCode, 4) AS integer)) FROM Franchise f")
	    Integer getMaxFranchiseNumber();

	// Dynamic sorting by any field
	@Query("SELECT f FROM Franchise f ORDER BY " + "CASE WHEN :direction = 'ASC' THEN " + "  CASE :sortBy "
			+ "    WHEN 'id' THEN CAST(f.id AS string) " + "    WHEN 'name' THEN f.franchiseName "
			+ "    WHEN 'city' THEN f.city " + "    WHEN 'state' THEN f.state "
			+ "    WHEN 'status' THEN CAST(f.status AS string) " + "  END " + "END ASC, "
			+ "CASE WHEN :direction = 'DESC' THEN " + "  CASE :sortBy " + "    WHEN 'id' THEN CAST(f.id AS string) "
			+ "    WHEN 'name' THEN f.franchiseName " + "    WHEN 'city' THEN f.city "
			+ "    WHEN 'state' THEN f.state " + "    WHEN 'status' THEN CAST(f.status AS string) " + "  END "
			+ "END DESC")
	List<Franchise> findAllSorted(@Param("sortBy") String sortBy, @Param("direction") String direction);

	// Check if franchise code exists
	boolean existsByFranchiseCode(String franchiseCode);

	// Find franchise by franchise_application_id
	Franchise findByFranchiseApplicationId(Long franchiseApplicationId);

	/**
	 * Find the franchise with the highest ID (for generating next franchise code)
	 * 
	 * @return Optional containing the latest franchise
	 */
	Optional<Franchise> findTopByOrderByIdDesc();

}