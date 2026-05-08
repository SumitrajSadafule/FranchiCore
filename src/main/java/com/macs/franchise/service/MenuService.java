package com.macs.franchise.service;

import com.macs.franchise.dto.request.MenuItemRequest;
import com.macs.franchise.dto.response.MenuItemResponse;
import com.macs.franchise.dto.response.PageResponse;
import com.macs.franchise.model.MenuItem;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.repository.MenuRepository;
import com.macs.franchise.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

	@Autowired
	private MenuRepository menuRepository;

	@Autowired
	private FranchiseRepository franchiseRepository;

	// ========== PAGINATED METHODS ==========

	// Get all menu items with pagination
	public PageResponse<MenuItemResponse> getAllMenuItems(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.findAll(pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToResponse);

		return PageResponse.fromPage(responsePage);
	}

	// Get menu items by category with pagination
	public PageResponse<MenuItemResponse> getMenuItemsByCategory(String category, int page, int size, String sortBy,
			String direction) {
		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.findByCategory(category, pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToResponse);

		return PageResponse.fromPage(responsePage);
	}

	// Get menu items by franchise with pagination
	public PageResponse<MenuItemResponse> getMenuItemsByFranchise(Long franchiseId, int page, int size, String sortBy,
			String direction) {
		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.findByFranchiseId(franchiseId, pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToResponse);

		return PageResponse.fromPage(responsePage);
	}

	// Get available menu items with pagination
	public PageResponse<MenuItemResponse> getAvailableMenuItems(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.findByIsAvailableTrue(pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToResponse);

		return PageResponse.fromPage(responsePage);
	}

	// Search menu items with pagination
	public PageResponse<MenuItemResponse> searchMenuItems(String searchTerm, int page, int size, String sortBy,
			String direction) {
		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.searchByName(searchTerm, pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToResponse);

		return PageResponse.fromPage(responsePage);
	}

	// Get menu items by price range with pagination
	public PageResponse<MenuItemResponse> getMenuItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int page,
			int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<MenuItem> menuPage = menuRepository.findByPriceBetween(minPrice, maxPrice, pageable);
		Page<MenuItemResponse> responsePage = menuPage.map(this::convertToResponse);

		return PageResponse.fromPage(responsePage);
	}

	// ========== NON-PAGINATED METHODS (for dropdowns, etc.) ==========

	// Get all categories (small list, no pagination needed)
	public List<String> getAllCategories() {
		return menuRepository.findAllCategories();
	}

	// Get menu item by ID (single item, no pagination)
	public MenuItemResponse getMenuItemById(Long id) {
		MenuItem menuItem = menuRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
		return convertToResponse(menuItem);
	}

	// Create new menu item (single item)
	public MenuItemResponse createMenuItem(MenuItemRequest request) {
		MenuItem menuItem = new MenuItem();
		menuItem.setName(request.getName());
		menuItem.setDescription(request.getDescription());
		menuItem.setPrice(request.getPrice());
		menuItem.setCategory(request.getCategory());
		menuItem.setImageUrl(request.getImageUrl());
		menuItem.setAvailable(request.isAvailable());
		menuItem.setVegetarian(request.isVegetarian());
		menuItem.setSpicy(request.isSpicy());
		menuItem.setCalories(request.getCalories());
		menuItem.setPreparationTimeMinutes(request.getPreparationTimeMinutes());

		if (request.getFranchiseId() != null) {
			Franchise franchise = franchiseRepository.findById(request.getFranchiseId()).orElseThrow(
					() -> new RuntimeException("Franchise not found with id: " + request.getFranchiseId()));
			menuItem.setFranchise(franchise);
		}

		MenuItem savedItem = menuRepository.save(menuItem);
		return convertToResponse(savedItem);
	}

	// Update menu item (single item)
	public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
		MenuItem menuItem = menuRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

		menuItem.setName(request.getName());
		menuItem.setDescription(request.getDescription());
		menuItem.setPrice(request.getPrice());
		menuItem.setCategory(request.getCategory());
		menuItem.setImageUrl(request.getImageUrl());
		menuItem.setAvailable(request.isAvailable());
		menuItem.setVegetarian(request.isVegetarian());
		menuItem.setSpicy(request.isSpicy());
		menuItem.setCalories(request.getCalories());
		menuItem.setPreparationTimeMinutes(request.getPreparationTimeMinutes());

		if (request.getFranchiseId() != null) {
			Franchise franchise = franchiseRepository.findById(request.getFranchiseId()).orElseThrow(
					() -> new RuntimeException("Franchise not found with id: " + request.getFranchiseId()));
			menuItem.setFranchise(franchise);
		}

		MenuItem updatedItem = menuRepository.save(menuItem);
		return convertToResponse(updatedItem);
	}

	// Delete menu item
	public void deleteMenuItem(Long id) {
		if (!menuRepository.existsById(id)) {
			throw new RuntimeException("Menu item not found with id: " + id);
		}
		menuRepository.deleteById(id);
	}

	// Helper method to convert Entity to Response DTO
	private MenuItemResponse convertToResponse(MenuItem menuItem) {
		MenuItemResponse response = new MenuItemResponse();
		response.setId(menuItem.getId());
		response.setName(menuItem.getName());
		response.setDescription(menuItem.getDescription());
		response.setPrice(menuItem.getPrice());
		response.setCategory(menuItem.getCategory());
		response.setImageUrl(menuItem.getImageUrl());
		response.setAvailable(menuItem.isAvailable());
		response.setVegetarian(menuItem.isVegetarian());
		response.setSpicy(menuItem.isSpicy());
		response.setCalories(menuItem.getCalories());
		response.setPreparationTimeMinutes(menuItem.getPreparationTimeMinutes());
		response.setCreatedAt(menuItem.getCreatedAt());

		if (menuItem.getFranchise() != null) {
			response.setFranchiseId(menuItem.getFranchise().getId());
			response.setFranchiseName(menuItem.getFranchise().getFranchiseName());
		}

		return response;
	}
}