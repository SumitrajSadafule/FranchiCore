package com.macs.franchise.repository;

import com.macs.franchise.model.MenuItem;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<MenuItem, Long> {

	// Find by category with pagination
	Page<MenuItem> findByCategory(String category, Pageable pageable);

	// Find by franchise with pagination
	Page<MenuItem> findByFranchiseId(Long franchiseId, Pageable pageable);

	// Find available items with pagination
	Page<MenuItem> findByIsAvailableTrue(Pageable pageable);

	// Find vegetarian items with pagination
	Page<MenuItem> findByIsVegetarianTrue(Pageable pageable);

	// Search by name with pagination
	@Query("SELECT m FROM MenuItem m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	Page<MenuItem> searchByName(@Param("searchTerm") String searchTerm, Pageable pageable);

	// Find by price range with pagination
	Page<MenuItem> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

	// Find by category and franchise with pagination
	Page<MenuItem> findByCategoryAndFranchiseId(String category, Long franchiseId, Pageable pageable);

	// Get all categories (no pagination needed)
	@Query("SELECT DISTINCT m.category FROM MenuItem m ORDER BY m.category")
	List<String> findAllCategories();

	@Modifying
	@Transactional
	@Query("DELETE FROM MenuItem m WHERE m.franchise.id = :franchiseId")
	void deleteByFranchiseId(@Param("franchiseId") Long franchiseId);

}