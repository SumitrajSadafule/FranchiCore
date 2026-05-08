import { apiMethods } from './api';

// ======================================================
// Franchise Service
// Handles all franchise-related API calls
// ======================================================

class FranchiseService {
  /**
   * Get all franchises with pagination
   * @param {number} page - Page number (0-based)
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction (ASC/DESC)
   * @returns {Promise} - Paginated franchises
   */
  async getAllFranchises(page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.franchises.getAll(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get franchise by ID
   * @param {number} id - Franchise ID
   * @returns {Promise} - Franchise details
   */
  async getFranchiseById(id) {
    try {
      const response = await apiMethods.franchises.getById(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get franchises by city with pagination
   * @param {string} city - City name
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated franchises
   */
  async getFranchisesByCity(city, page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.franchises.getByCity(city, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search franchises with pagination
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated search results
   */
  async searchFranchises(query, page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.franchises.search(query, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get franchises sorted by any field with pagination
   * @param {string} sortBy - Sort field (id, name, city, state, status)
   * @param {string} direction - Sort direction (ASC/DESC)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @returns {Promise} - Paginated sorted franchises
   */
  async getFranchisesSorted(sortBy = 'id', direction = 'ASC', page = 0, size = 10) {
    try {
      const response = await apiMethods.franchises.getSorted(sortBy, direction, page, size);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get active franchises with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated active franchises
   */
  async getActiveFranchises(page = 0, size = 10, sortBy = 'id', direction = 'ASC') {
    try {
      const response = await apiMethods.franchises.getActive(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all unique cities from franchises
   * @param {Array} franchises - List of franchises
   * @returns {Array} - Unique cities
   */
  getUniqueCities(franchises) {
    if (!franchises || !Array.isArray(franchises)) return [];
    return [...new Set(franchises.map(f => f.city))].sort();
  }

  /**
   * Get all unique states from franchises
   * @param {Array} franchises - List of franchises
   * @returns {Array} - Unique states
   */
  getUniqueStates(franchises) {
    if (!franchises || !Array.isArray(franchises)) return [];
    return [...new Set(franchises.map(f => f.state))].sort();
  }
   // Update franchise
async updateFranchise(id, franchiseData) {
  try {
    const response = await apiMethods.franchises.updateFranchise(id, franchiseData);
    return response;
  } catch (error) {
    throw this.handleError(error);
  }
}

async deleteFranchise(id) {
    try {
        const response = await apiMethods.franchises.deleteFranchise(id);
        return response;
    } catch (error) {
        throw this.handleError(error);
    }
}
  /**
   * Format franchise for display
   * @param {Object} franchise - Raw franchise data
   * @returns {Object} - Formatted franchise
   */
  formatFranchise(franchise) {
    return {
      id: franchise.id,
      name: franchise.franchiseName,
      code: franchise.franchiseCode,
      address: franchise.fullAddress || this.formatAddress(franchise),
      addressLine1: franchise.addressLine1,
      addressLine2: franchise.addressLine2,
      city: franchise.city,
      state: franchise.state,
      postalCode: franchise.postalCode,
      country: franchise.country,
      phone: franchise.phone,
      email: franchise.email,
      latitude: franchise.latitude,
      longitude: franchise.longitude,
      status: franchise.status,
      statusDisplay: this.getStatusDisplay(franchise.status),
      operatingHours: franchise.operatingHours || 'Mon-Sun: 10:00 AM - 11:00 PM',
      managerName: franchise.managerName || 'Not Assigned',
      managerPhone: franchise.managerPhone || franchise.phone,
      managerEmail: franchise.managerEmail || franchise.email,
      openingDate: franchise.openingDate ? new Date(franchise.openingDate).toLocaleDateString() : 'N/A',
      mapUrl: this.getMapUrl(franchise.latitude, franchise.longitude)
    };
  }

  /**
   * Format multiple franchises
   * @param {Array} franchises - Raw franchises data
   * @returns {Array} - Formatted franchises
   */
  formatFranchises(franchises) {
    return franchises.map(f => this.formatFranchise(f));
  }

  /**
   * Format full address from components
   * @param {Object} franchise - Franchise object
   * @returns {string} - Formatted address
   */
  formatAddress(franchise) {
    const parts = [
      franchise.addressLine1,
      franchise.addressLine2,
      franchise.city,
      franchise.state,
      franchise.postalCode,
      franchise.country
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  }

  /**
   * Get status display name and color
   * @param {string} status - Status code
   * @returns {Object} - Status display info
   */
  getStatusDisplay(status) {
    const statusMap = {
      'ACTIVE': { label: 'Active', color: 'success', icon: '✅' },
      'UNDER_REVIEW': { label: 'Under Review', color: 'warning', icon: '⏳' },
      'PROBATION': { label: 'Probation', color: 'warning', icon: '⚠️' },
      'SUSPENDED': { label: 'Suspended', color: 'error', icon: '⛔' },
      'CLOSED': { label: 'Closed', color: 'error', icon: '❌' },
      'PENDING_APPROVAL': { label: 'Pending Approval', color: 'info', icon: '📝' }
    };
    return statusMap[status] || { label: status, color: 'default', icon: '❓' };
  }

  /**
   * Get Google Maps URL for coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} - Google Maps URL
   */
  getMapUrl(lat, lng) {
    if (!lat || !lng) return null;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  /**
   * Get distance between two coordinates (Haversine formula)
   * @param {number} lat1 - Latitude 1
   * @param {number} lon1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lon2 - Longitude 2
   * @returns {number} - Distance in kilometers
   */
  getDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param {number} value - Degrees
   * @returns {number} - Radians
   */
  toRad(value) {
    return value * Math.PI / 180;
  }

  /**
   * Get nearby franchises based on user location
   * @param {Array} franchises - List of franchises
   * @param {number} userLat - User latitude
   * @param {number} userLng - User longitude
   * @param {number} radius - Search radius in km
   * @returns {Array} - Nearby franchises with distance
   */
  getNearbyFranchises(franchises, userLat, userLng, radius = 10) {
    if (!userLat || !userLng || !franchises || !Array.isArray(franchises)) {
      return [];
    }

    return franchises
      .filter(f => f.latitude && f.longitude)
      .map(f => ({
        ...f,
        distance: this.getDistance(userLat, userLng, f.latitude, f.longitude)
      }))
      .filter(f => f.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Validate franchise search filters
   * @param {Object} filters - Search filters
   * @returns {Object} - Validation result
   */
  validateFilters(filters) {
    const errors = {};

    if (filters.city && filters.city.trim().length < 2) {
      errors.city = 'City name must be at least 2 characters';
    }

    if (filters.search && filters.search.trim().length < 2) {
      errors.search = 'Search term must be at least 2 characters';
    }

    if (filters.radius && (filters.radius < 1 || filters.radius > 100)) {
      errors.radius = 'Radius must be between 1 and 100 km';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
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
          return { message: 'Franchise not found', status: 404 };
        case 403:
          return { message: 'You do not have permission to view this data', status: 403 };
        case 400:
          return { 
            message: error.response.data?.message || 'Invalid request', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'Failed to fetch franchises', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }

  /**
   * Export franchises to CSV
   * @param {Array} franchises - List of franchises
   * @returns {string} - CSV string
   */
  exportToCSV(franchises) {
    if (!franchises || !franchises.length) return '';

    const headers = ['Name', 'Code', 'City', 'State', 'Address', 'Phone', 'Email', 'Status'];
    const rows = franchises.map(f => [
      f.franchiseName,
      f.franchiseCode,
      f.city,
      f.state,
      this.formatAddress(f),
      f.phone,
      f.email,
      f.status
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  /**
   * Get statistics about franchises
   * @param {Array} franchises - List of franchises
   * @returns {Object} - Statistics
   */
  getStatistics(franchises) {
    if (!franchises || !franchises.length) {
      return {
        total: 0,
        byStatus: {},
        byCity: {},
        byState: {}
      };
    }

    const byStatus = {};
    const byCity = {};
    const byState = {};

    franchises.forEach(f => {
      // Count by status
      byStatus[f.status] = (byStatus[f.status] || 0) + 1;

      // Count by city
      byCity[f.city] = (byCity[f.city] || 0) + 1;

      // Count by state
      byState[f.state] = (byState[f.state] || 0) + 1;
    });

    return {
      total: franchises.length,
      byStatus,
      byCity,
      byState
    };
  }
}

// Create singleton instance
const franchiseService = new FranchiseService();

export default franchiseService;