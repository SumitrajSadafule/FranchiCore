package com.macs.franchise.controller;

import com.macs.franchise.dto.request.MenuItemRequest;
import com.macs.franchise.dto.response.MenuItemResponse;
import com.macs.franchise.dto.response.PageResponse;
import com.macs.franchise.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/menu")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MenuController {

	@Autowired
	private MenuService menuService;

	// GET all menu items with pagination
	@GetMapping
	public ResponseEntity<PageResponse<MenuItemResponse>> getAllMenuItems(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "ASC") String direction) {
		return ResponseEntity.ok(menuService.getAllMenuItems(page, size, sortBy, direction));
	}

	// GET menu item by ID (no pagination)
	@GetMapping("/{id}")
	public ResponseEntity<MenuItemResponse> getMenuItemById(@PathVariable Long id) {
		MenuItemResponse item = menuService.getMenuItemById(id);
		return ResponseEntity.ok(item);
	}

	// GET menu items by category with pagination
	@GetMapping("/category/{category}")
	public ResponseEntity<PageResponse<MenuItemResponse>> getMenuItemsByCategory(@PathVariable String category,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "ASC") String direction) {
		return ResponseEntity.ok(menuService.getMenuItemsByCategory(category, page, size, sortBy, direction));
	}

	// GET menu items by franchise with pagination
	@GetMapping("/franchise/{franchiseId}")
	public ResponseEntity<PageResponse<MenuItemResponse>> getMenuItemsByFranchise(@PathVariable Long franchiseId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "ASC") String direction) {
		return ResponseEntity.ok(menuService.getMenuItemsByFranchise(franchiseId, page, size, sortBy, direction));
	}

	// GET available menu items with pagination
	@GetMapping("/available")
	public ResponseEntity<PageResponse<MenuItemResponse>> getAvailableMenuItems(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "ASC") String direction) {
		return ResponseEntity.ok(menuService.getAvailableMenuItems(page, size, sortBy, direction));
	}

	// GET search menu items with pagination
	@GetMapping("/search")
	public ResponseEntity<PageResponse<MenuItemResponse>> searchMenuItems(@RequestParam String q,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "ASC") String direction) {
		return ResponseEntity.ok(menuService.searchMenuItems(q, page, size, sortBy, direction));
	}

	// GET menu items by price range with pagination
	@GetMapping("/price-range")
	public ResponseEntity<PageResponse<MenuItemResponse>> getMenuItemsByPriceRange(@RequestParam BigDecimal min,
			@RequestParam BigDecimal max, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "ASC") String direction) {
		return ResponseEntity.ok(menuService.getMenuItemsByPriceRange(min, max, page, size, sortBy, direction));
	}

	// GET all categories (no pagination needed)
	@GetMapping("/categories")
	public ResponseEntity<List<String>> getAllCategories() {
		List<String> categories = menuService.getAllCategories();
		return ResponseEntity.ok(categories);
	}

	// POST create new menu item (Admin only)
	@PostMapping
	public ResponseEntity<MenuItemResponse> createMenuItem(@RequestBody MenuItemRequest request) {
		MenuItemResponse createdItem = menuService.createMenuItem(request);
		return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
	}

	// PUT update menu item (Admin only)
	@PutMapping("/{id}")
	public ResponseEntity<MenuItemResponse> updateMenuItem(@PathVariable Long id,
			@RequestBody MenuItemRequest request) {
		MenuItemResponse updatedItem = menuService.updateMenuItem(id, request);
		return ResponseEntity.ok(updatedItem);
	}

	// DELETE menu item (Admin only)
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteMenuItem(@PathVariable Long id) {
		menuService.deleteMenuItem(id);
		Map<String, String> response = new HashMap<>();
		response.put("message", "Menu item deleted successfully");
		response.put("id", id.toString());
		return ResponseEntity.ok(response);
	}

	// Exception handler
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		error.put("status", "400");
		return ResponseEntity.badRequest().body(error);
	}
}