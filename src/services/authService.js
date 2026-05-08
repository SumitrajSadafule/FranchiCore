import api, { apiMethods } from './api';

// ======================================================
// Authentication Service
// Handles all auth-related API calls and token management
// No registration - only login for Admin and Owners
// ======================================================

class AuthService {
  /**
   * Login user and store token
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - User password
   * @returns {Promise} - User data and token
   */
  async login(usernameOrEmail, password) {
    try {
      // Use apiMethods.auth.login instead of api.auth
      const response = await apiMethods.auth.login({ usernameOrEmail, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('userRole', response.roles[0]);
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user - clear local storage and redirect
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Clear authorization header
    delete api.defaults.headers.common['Authorization'];
    
    window.location.href = '/login';
  }

  /**
   * Get current user from local storage
   * @returns {Object|null} - User object or null
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get auth token
   * @returns {string|null} - JWT token
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Get user role
   * @returns {string|null} - User role
   */
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} - True if user has any of the roles
   */
  hasRole(roles) {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  }

  /**
   * Check if user is admin
   * @returns {boolean} - True if admin
   */
  isAdmin() {
    return this.hasRole('ROLE_SUPER_ADMIN');
  }

  /**
   * Check if user is franchise owner
   * @returns {boolean} - True if franchise owner
   */
  isOwner() {
    return this.hasRole('ROLE_FRANCHISE_OWNER');
  }

  /**
   * Validate current token with server
   * @returns {Promise} - Validation response
   */
  async validateToken() {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }
      
      const response = await apiMethods.auth.validateToken();
      return response;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  /**
   * Refresh user data from local storage
   * @returns {Object|null} - Updated user data
   */
  refreshUserData() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
    return user;
  }

  /**
   * Handle authentication errors
   * @param {Error} error - Error object
   * @returns {Object} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.logout();
          return { message: 'Invalid credentials', status: 401 };
        case 403:
          return { message: 'Access denied', status: 403 };
        case 400:
          return { 
            message: error.response.data?.message || 'Bad request', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'An error occurred', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }

  /**
   * Get authorization header object
   * @returns {Object} - Headers object with Authorization
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Clear all user data
   */
  clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    delete api.defaults.headers.common['Authorization'];
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;