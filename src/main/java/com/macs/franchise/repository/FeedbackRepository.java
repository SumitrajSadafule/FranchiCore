package com.macs.franchise.repository;

import com.macs.franchise.model.Feedback;
import com.macs.franchise.model.enums.Rating;

import jakarta.transaction.Transactional;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

	// Find by franchise
	List<Feedback> findByFranchiseId(Long franchiseId);

	// Find by franchise and public status
	List<Feedback> findByFranchiseIdAndIsPublicTrue(Long franchiseId);

	// Find by rating
	List<Feedback> findByRating(Rating rating);

	// Find by would recommend
	List<Feedback> findByWouldRecommendTrue();

	// Find feedback with admin reply (responded)
	List<Feedback> findByAdminReplyIsNotNull();

	// Find feedback without admin reply (pending)
	List<Feedback> findByAdminReplyIsNull();

	// Search feedback by customer name or comments (case insensitive)
	@Query("SELECT f FROM Feedback f WHERE " + "LOWER(f.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
			+ "LOWER(f.comments) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	List<Feedback> searchFeedbackIgnoreCase(@Param("searchTerm") String searchTerm);

	// Get average rating for a franchise - FIXED: Use CASE to convert enum to
	// number
	@Query("SELECT AVG(CASE f.rating " + "WHEN 'ONE_STAR' THEN 1 " + "WHEN 'TWO_STARS' THEN 2 "
			+ "WHEN 'THREE_STARS' THEN 3 " + "WHEN 'FOUR_STARS' THEN 4 " + "WHEN 'FIVE_STARS' THEN 5 END) "
			+ "FROM Feedback f WHERE f.franchise.id = :franchiseId")
	Double getAverageRatingForFranchise(@Param("franchiseId") Long franchiseId);

	// Get rating distribution for a franchise
	@Query("SELECT f.rating, COUNT(f) FROM Feedback f WHERE f.franchise.id = :franchiseId GROUP BY f.rating")
	List<Object[]> getRatingDistribution(@Param("franchiseId") Long franchiseId);

	// Get recent feedback for a franchise
	List<Feedback> findTop10ByFranchiseIdOrderBySubmittedAtDesc(Long franchiseId);

	// Get all feedback sorted by date (latest first)
	List<Feedback> findAllByOrderBySubmittedAtDesc();

	// Find by franchise with pagination
	Page<Feedback> findByFranchiseId(Long franchiseId, org.springframework.data.domain.Pageable pageable);

	// Find by franchise and admin reply is null with pagination
	Page<Feedback> findByFranchiseIdAndAdminReplyIsNull(Long franchiseId,
			org.springframework.data.domain.Pageable pageable);

	// Get average service rating for a franchise
	@Query("SELECT AVG(f.serviceRating) FROM Feedback f WHERE f.franchise.id = :franchiseId")
	Double getAverageServiceRating(@Param("franchiseId") Long franchiseId);

	// Get average food rating for a franchise
	@Query("SELECT AVG(f.foodRating) FROM Feedback f WHERE f.franchise.id = :franchiseId")
	Double getAverageFoodRating(@Param("franchiseId") Long franchiseId);

	// Get average cleanliness rating for a franchise
	@Query("SELECT AVG(f.cleanlinessRating) FROM Feedback f WHERE f.franchise.id = :franchiseId")
	Double getAverageCleanlinessRating(@Param("franchiseId") Long franchiseId);

	// Get average value rating for a franchise
	@Query("SELECT AVG(f.valueRating) FROM Feedback f WHERE f.franchise.id = :franchiseId")
	Double getAverageValueRating(@Param("franchiseId") Long franchiseId);

	@Modifying
	@Transactional
	@Query("DELETE FROM Feedback f WHERE f.franchise.id = :franchiseId")
	void deleteByFranchiseId(@Param("franchiseId") Long franchiseId);
}