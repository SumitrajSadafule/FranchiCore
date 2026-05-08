import { apiMethods } from './api';

// ======================================================
// Menu Service
// Handles all menu-related API calls
// ======================================================

class MenuService {
  /**
   * Get all menu items with pagination
   * @param {number} page - Page number (0-based)
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction (ASC/DESC)
   * @returns {Promise} - Paginated menu items
   */
  async getAllMenuItems(page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getAll(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /** 
   * Get menu item by ID
   * @param {number} id - Menu item ID
   * @returns {Promise} - Menu item details
   */
  async getMenuItemById(id) {
    try {
      const response = await apiMethods.menu.getById(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get menu items by category with pagination
   * @param {string} category - Category name
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated menu items
   */
  async getMenuItemsByCategory(category, page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getByCategory(category, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search menu items with pagination
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated search results
   */
  async searchMenuItems(query, page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.search(query, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all menu categories
   * @returns {Promise} - List of categories
   */
  async getAllCategories() {
    try {
      const response = await apiMethods.menu.getCategories();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get available menu items with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated available items
   */
  async getAvailableMenuItems(page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getAvailable(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get menu items by franchise with pagination
   * @param {number} franchiseId - Franchise ID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated franchise menu items
   */
  async getMenuItemsByFranchise(franchiseId, page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getByFranchise(franchiseId, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new menu item (Admin only)
   * @param {Object} menuItemData - Menu item data
   * @returns {Promise} - Created menu item
   */
  async createMenuItem(menuItemData) {
    try {
      const response = await apiMethods.menu.create(menuItemData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update menu item (Admin only)
   * @param {number} id - Menu item ID
   * @param {Object} menuItemData - Updated menu item data
   * @returns {Promise} - Updated menu item
   */
  async updateMenuItem(id, menuItemData) {
    try {
      const response = await apiMethods.menu.update(id, menuItemData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete menu item (Admin only)
   * @param {number} id - Menu item ID
   * @returns {Promise} - Deletion response
   */
  async deleteMenuItem(id) {
    try {
      const response = await apiMethods.menu.delete(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get menu items by price range with pagination
   * @param {number} min - Minimum price
   * @param {number} max - Maximum price
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated menu items
   */
  async getMenuItemsByPriceRange(min, max, page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getByPriceRange(min, max, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get vegetarian menu items with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated vegetarian items
   */
  async getVegetarianItems(page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getVegetarian(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get spicy menu items with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated spicy items
   */
  async getSpicyItems(page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.menu.getSpicy(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get menu item by name (partial match)
   * @param {string} name - Item name
   * @returns {Promise} - Matching menu items
   */
  async getMenuItemByName(name) {
    try {
      return await this.searchMenuItems(name, 0, 10, 'name', 'ASC');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format menu item for display
   * @param {Object} item - Raw menu item
   * @returns {Object} - Formatted menu item
   */
  formatMenuItem(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    imageUrl: item.imageUrl || '/images/default-food.jpg',
    isAvailable: item.available,
    isVegetarian: item.vegetarian,
    isSpicy: item.spicy,
    calories: item.calories,
    preparationTimeMinutes: item.preparationTimeMinutes,
    franchiseName: item.franchiseName || 'All Locations',
    createdAt: item.createdAt,
    // Keep original fields for compatibility
    available: item.available,
    vegetarian: item.vegetarian,
    spicy: item.spicy
  };
}

  /**
   * Format multiple menu items
   * @param {Array} items - Raw menu items
   * @returns {Array} - Formatted menu items
   */
  formatMenuItems(items) {
    return items.map(item => this.formatMenuItem(item));
  }

  /**
   * Get category display name
   * @param {string} category - Category code
   * @returns {string} - Display name
   */
  getCategoryDisplayName(category) {
    const categories = {
      'Burgers': '🍔 Burgers',
      'Fries': '🍟 Fries & Sides',
      'Beverages': '🥤 Beverages',
      'Desserts': '🍦 Desserts',
      'Breakfast': '🍳 Breakfast',
      'Chicken': '🍗 Chicken',
      'Salads': '🥗 Salads',
      'Happy Meal': '🎁 Happy Meal'
    };
    return categories[category] || category;
  }

  /**
   * Get all category display names
   * @returns {Array} - List of category display names
   */
  getAllCategoryDisplayNames() {
    return Object.entries(this.getCategoryDisplayName({}))
      .map(([value, label]) => ({ value, label }));
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return { message: 'Menu item not found', status: 404 };
        case 403:
          return { message: 'You do not have permission to perform this action', status: 403 };
        case 400:
          return { 
            message: error.response.data?.message || 'Invalid menu item data', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'Failed to process menu request', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }

  /**
   * Validate menu item data
   * @param {Object} data - Menu item data
   * @returns {Object} - Validation result
   */
  validateMenuItem(data) {
    const errors = {};

    if (!data.name || data.name.trim() === '') {
      errors.name = 'Name is required';
    } else if (data.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    if (!data.description || data.description.trim() === '') {
      errors.description = 'Description is required';
    } else if (data.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (!data.price) {
      errors.price = 'Price is required';
    } else if (data.price <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (data.price > 1000) {
      errors.price = 'Price must be less than 1000';
    }

    if (!data.category || data.category.trim() === '') {
      errors.category = 'Category is required';
    }

    if (data.calories && (data.calories < 0 || data.calories > 2000)) {
      errors.calories = 'Calories must be between 0 and 2000';
    }

    if (data.preparationTimeMinutes && data.preparationTimeMinutes < 1) {
      errors.preparationTimeMinutes = 'Preparation time must be at least 1 minute';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Create singleton instance
const menuService = new MenuService();

export default menuService;