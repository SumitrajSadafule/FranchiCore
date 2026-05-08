package com.macs.franchise.service;

import com.macs.franchise.dto.request.FranchiseUpdateRequest;
import com.macs.franchise.dto.response.FranchiseResponse;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.Job;
import com.macs.franchise.model.enums.FranchiseStatus;
import com.macs.franchise.repository.FeedbackRepository;
import com.macs.franchise.repository.FranchiseRepository;
import com.macs.franchise.repository.JobApplicationRepository;
import com.macs.franchise.repository.JobRepository;
import com.macs.franchise.repository.MenuRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
//import com.macs.franchise.dto.request.FranchiseUpdateRequest;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FranchiseService {

	@Autowired
	private FranchiseRepository franchiseRepository;

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private JobApplicationRepository jobApplicationRepository;

	@Autowired
	private FeedbackRepository feedbackRepository;

	@Autowired
	private MenuRepository menuRepository;

	// Get all franchises
	public List<FranchiseResponse> getAllFranchises() {
		return franchiseRepository.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	// Get franchise by ID
	public FranchiseResponse getFranchiseById(Long id) {
		Franchise franchise = franchiseRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Franchise not found with id: " + id));
		return convertToResponse(franchise);
	}

	// Get franchises by city (case insensitive)
	public List<FranchiseResponse> getFranchisesByCity(String city) {
		return franchiseRepository.findByCityIgnoreCase(city).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Search franchises (case insensitive)
	public List<FranchiseResponse> searchFranchises(String searchTerm) {
		return franchiseRepository.searchByNameOrCityIgnoreCase(searchTerm).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get franchises sorted by city (ascending)
	public List<FranchiseResponse> getFranchisesSortedByCityAsc() {
		return franchiseRepository.findAllSortedByCityAsc().stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get franchises sorted by city (descending)
	public List<FranchiseResponse> getFranchisesSortedByCityDesc() {
		return franchiseRepository.findAllSortedByCityDesc().stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	// Get active franchises
	public List<FranchiseResponse> getActiveFranchises() {
		return franchiseRepository.findByStatus(FranchiseStatus.ACTIVE).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

//    public List<FranchiseResponse> getAllFranchisesSorted(String sortBy, String direction) {
//        List<Franchise> franchises = franchiseRepository.findAllSorted(sortBy, direction);
//        return franchises.stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
	public List<FranchiseResponse> getAllFranchisesSorted(String sortBy, String direction) {
		// Validate sortBy field
		List<String> validFields = Arrays.asList("id", "name", "city", "state", "status");
		if (!validFields.contains(sortBy)) {
			sortBy = "id"; // default to id if invalid
		}

		// Validate direction
		if (!direction.equalsIgnoreCase("ASC") && !direction.equalsIgnoreCase("DESC")) {
			direction = "ASC";
		}

		List<Franchise> franchises = franchiseRepository.findAllSorted(sortBy, direction.toUpperCase());
		return franchises.stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	// Helper method to convert Entity to Response DTO
	private FranchiseResponse convertToResponse(Franchise franchise) {
		FranchiseResponse response = new FranchiseResponse();
		response.setId(franchise.getId());
		response.setFranchiseName(franchise.getFranchiseName());
		response.setFranchiseCode(franchise.getFranchiseCode());
		response.setAddressLine1(franchise.getAddressLine1());
		response.setAddressLine2(franchise.getAddressLine2());
		response.setCity(franchise.getCity());
		response.setState(franchise.getState());
		response.setPostalCode(franchise.getPostalCode());
		response.setCountry(franchise.getCountry());
		response.setPhone(franchise.getPhone());
		response.setEmail(franchise.getEmail());
		response.setLatitude(franchise.getLatitude());
		response.setLongitude(franchise.getLongitude());
		response.setStatus(franchise.getStatus());
		response.setOperatingHours(franchise.getOperatingHours());
		response.setManagerName(franchise.getManagerName());
		response.setManagerPhone(franchise.getManagerPhone());
	    response.setManagerEmail(franchise.getManagerEmail());
		response.setFullAddress(franchise.getFullAddress());

		if (franchise.getUser() != null) {
			response.setUserId(franchise.getUser().getId());
			response.setUserName(franchise.getUser().getFullName());
		}
		return response;
	}

	public FranchiseResponse updateFranchise(Long id, FranchiseUpdateRequest request) {
		Franchise franchise = franchiseRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Franchise not found with id: " + id));

		franchise.setFranchiseName(request.getFranchiseName());
		franchise.setFranchiseCode(request.getFranchiseCode());
		franchise.setAddressLine1(request.getAddressLine1());
		franchise.setAddressLine2(request.getAddressLine2());
		franchise.setCity(request.getCity());
		franchise.setState(request.getState());
		franchise.setPostalCode(request.getPostalCode());
		franchise.setCountry(request.getCountry());
		franchise.setPhone(request.getPhone());
		franchise.setEmail(request.getEmail());
		franchise.setOperatingHours(request.getOperatingHours());
		franchise.setManagerName(request.getManagerName());
		franchise.setManagerPhone(request.getManagerPhone());
		franchise.setManagerEmail(request.getManagerEmail());

		if (request.getLatitude() != null)
			franchise.setLatitude(request.getLatitude());
		if (request.getLongitude() != null)
			franchise.setLongitude(request.getLongitude());

		if (request.getStatus() != null) {
			franchise.setStatus(FranchiseStatus.valueOf(request.getStatus()));
		}

		Franchise updatedFranchise = franchiseRepository.save(franchise);
		return convertToResponse(updatedFranchise);
	}

	@Transactional
	public void deleteFranchise(Long id) {
		if (!franchiseRepository.existsById(id)) {
			throw new RuntimeException("Franchise not found with id: " + id);
		}

		try {
			// Step 1: Get all jobs for this franchise
			List<Job> jobs = jobRepository.findByFranchiseId(id);

			// Step 2: Delete job applications for each job first
			for (Job job : jobs) {
				jobApplicationRepository.deleteByJobId(job.getId());
			}

			// Step 3: Delete jobs
			jobRepository.deleteByFranchiseId(id);

			// Step 4: Delete feedback
			feedbackRepository.deleteByFranchiseId(id);

			// Step 5: Delete menu items
			menuRepository.deleteByFranchiseId(id);

			// Step 6: Delete the franchise
			franchiseRepository.deleteById(id);

		} catch (Exception e) {
			throw new RuntimeException(
					"Cannot delete franchise. Please delete all related records first: " + e.getMessage());
		}
	}
}