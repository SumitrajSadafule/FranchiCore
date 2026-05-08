package com.macs.franchise.controller;

import com.macs.franchise.dto.request.FranchiseUpdateRequest;
import com.macs.franchise.dto.response.FranchiseResponse;
import com.macs.franchise.service.FranchiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/franchises")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FranchiseController {

	@Autowired
	private FranchiseService franchiseService;

	// UPDATE franchise (Admin only)
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<FranchiseResponse> updateFranchise(@PathVariable Long id,
			@RequestBody FranchiseUpdateRequest request) {

		FranchiseResponse updatedFranchise = franchiseService.updateFranchise(id, request);
		return ResponseEntity.ok(updatedFranchise);
	}

	// GET all franchises
	@GetMapping
	public ResponseEntity<List<FranchiseResponse>> getAllFranchises() {
		List<FranchiseResponse> franchises = franchiseService.getAllFranchises();
		return ResponseEntity.ok(franchises);
	}

	// GET franchise by ID
	@GetMapping("/{id}")
	public ResponseEntity<FranchiseResponse> getFranchiseById(@PathVariable Long id) {
		FranchiseResponse franchise = franchiseService.getFranchiseById(id);
		return ResponseEntity.ok(franchise);
	}

	// GET franchises by city
	@GetMapping("/city/{city}")
	public ResponseEntity<List<FranchiseResponse>> getFranchisesByCity(@PathVariable String city) {
		List<FranchiseResponse> franchises = franchiseService.getFranchisesByCity(city);
		return ResponseEntity.ok(franchises);
	}

	// GET search franchises
	@GetMapping("/search")
	public ResponseEntity<List<FranchiseResponse>> searchFranchises(@RequestParam String q) {
		List<FranchiseResponse> franchises = franchiseService.searchFranchises(q);
		return ResponseEntity.ok(franchises);
	}

	// GET franchises sorted by city (ascending)
	@GetMapping("/sort/city/asc")
	public ResponseEntity<List<FranchiseResponse>> getFranchisesSortedByCityAsc() {
		List<FranchiseResponse> franchises = franchiseService.getFranchisesSortedByCityAsc();
		return ResponseEntity.ok(franchises);
	}

	// GET franchises sorted by city (descending)
	@GetMapping("/sort/city/desc")
	public ResponseEntity<List<FranchiseResponse>> getFranchisesSortedByCityDesc() {
		List<FranchiseResponse> franchises = franchiseService.getFranchisesSortedByCityDesc();
		return ResponseEntity.ok(franchises);
	}

	// GET active franchises
	@GetMapping("/active")
	public ResponseEntity<List<FranchiseResponse>> getActiveFranchises() {
		List<FranchiseResponse> franchises = franchiseService.getActiveFranchises();
		return ResponseEntity.ok(franchises);
	}

	// GET franchises sorted by any field
	@GetMapping("/sort")
	public ResponseEntity<?> getAllFranchisesSorted(@RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "ASC") String direction) {
		try {
			return ResponseEntity.ok(franchiseService.getAllFranchisesSorted(sortBy, direction));
		} catch (Exception e) {
			Map<String, String> error = new HashMap<>();
			error.put("error", e.getMessage());
			return ResponseEntity.badRequest().body(error);
		}
	}

	// Exception handler
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		error.put("status", "400");
		return ResponseEntity.badRequest().body(error);
	}

	// DELETE franchise (Admin only)
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	public ResponseEntity<Map<String, String>> deleteFranchise(@PathVariable Long id) {
		try {
			franchiseService.deleteFranchise(id);
			Map<String, String> response = new HashMap<>();
			response.put("message", "Franchise deleted successfully");
			response.put("id", id.toString());
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			Map<String, String> error = new HashMap<>();
			error.put("error", e.getMessage());
			return ResponseEntity.badRequest().body(error);
		}
	}
}