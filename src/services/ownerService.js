import { apiMethods } from './api';

// ======================================================
// Owner Service
// Handles all franchise owner dashboard API calls
// ======================================================

class OwnerService {
  // ========== PROFILE MANAGEMENT ==========

  /**
   * Get owner profile
   * @returns {Promise} - Owner profile data
   */
  async getProfile() {
    try {
      const response = await apiMethods.owner.getProfile();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update owner profile
   * @param {Object} profileData - Profile data
   * @returns {Promise} - Updated profile
   */
  async updateProfile(profileData) {
    try {
      const response = await apiMethods.owner.updateProfile(profileData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Change password
   * @param {string} oldPassword - Old password
   * @param {string} newPassword - New password
   * @returns {Promise} - Response
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await apiMethods.owner.changePassword(oldPassword, newPassword);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== FRANCHISE MANAGEMENT ==========

  /**
   * Get owner's franchise details
   * @returns {Promise} - Franchise details
   */
  async getFranchise() {
    try {
      const response = await apiMethods.owner.getFranchise();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update franchise details
   * @param {Object} franchiseData - Franchise data
   * @returns {Promise} - Updated franchise
   */
  async updateFranchise(franchiseData) {
    try {
      const response = await apiMethods.owner.updateFranchise(franchiseData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== JOB MANAGEMENT ==========

  /**
   * Get owner's jobs with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated jobs
   */
  async getJobs(page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.owner.getJobs(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new job
   * @param {Object} jobData - Job data
   * @returns {Promise} - Created job
   */
  async createJob(jobData) {
    try {
      const response = await apiMethods.owner.createJob(jobData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update job
   * @param {number} id - Job ID
   * @param {Object} jobData - Job data
   * @returns {Promise} - Updated job
   */
  async updateJob(id, jobData) {
    try {
      const response = await apiMethods.owner.updateJob(id, jobData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateJobFull(id, jobData) {
  try {
    const response = await apiMethods.owner.updateJobFull(id, jobData);
    return response;
  } catch (error) {
    throw this.handleError(error);
  }
}

  /**
   * Close job
   * @param {number} id - Job ID
   * @returns {Promise} - Closed job
   */
  async closeJob(id) {
    try {
      const response = await apiMethods.owner.closeJob(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

async openJob(id) {
  try {
    const response = await apiMethods.owner.openJob(id);
    return response;
  } catch (error) {
    throw this.handleError(error);
  }
}

  /**
   * Delete job
   * @param {number} id - Job ID
   * @returns {Promise} - Deletion response
   */
  async deleteJob(id) {
    try {
      const response = await apiMethods.owner.deleteJob(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== APPLICATION MANAGEMENT ==========

  /**
   * Get all applications for owner's jobs with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated applications
   */
  async getAllApplications(page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.owner.getAllApplications(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get applications for specific job with pagination
   * @param {number} jobId - Job ID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated applications
   */
  async getJobApplications(jobId, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.owner.getJobApplications(jobId, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update application status
   * @param {number} applicationId - Application ID
   * @param {string} status - New status
   * @returns {Promise} - Updated application
   */
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await apiMethods.owner.updateApplicationStatus(applicationId, status);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== FEEDBACK MANAGEMENT ==========

  /**
   * Get feedback for owner's franchise with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated feedback
   */
  async getFeedback(page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.owner.getFeedback(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get feedback statistics
   * @returns {Promise} - Feedback stats
   */
  async getFeedbackStats() {
    try {
      const response = await apiMethods.owner.getFeedbackStats();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pending feedback (no reply) with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated pending feedback
   */
  async getPendingFeedback(page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.owner.getPendingFeedback(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get recent feedback
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @returns {Promise} - Recent feedback
   */
  async getRecentFeedback(page = 0, size = 10) {
    try {
      const response = await apiMethods.owner.getRecentFeedback(page, size);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reply to feedback
   * @param {number} feedbackId - Feedback ID
   * @param {string} reply - Reply message
   * @returns {Promise} - Updated feedback
   */
  async replyToFeedback(feedbackId, reply) {
    try {
      const response = await apiMethods.owner.replyToFeedback(feedbackId, reply);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== MENU MANAGEMENT ==========

  /**
   * Get owner's menu items with pagination
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated menu items
   */
  async getMenu(page = 0, size = 10, sortBy = 'name', direction = 'ASC') {
    try {
      const response = await apiMethods.owner.getMenu(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update menu item availability
   * @param {number} itemId - Menu item ID
   * @param {boolean} available - Availability status
   * @returns {Promise} - Updated menu item
   */
  async updateMenuItemAvailability(itemId, available) {
    try {
      const response = await apiMethods.owner.updateMenuItemAvailability(itemId, available);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update menu item price
   * @param {number} itemId - Menu item ID
   * @param {number} price - New price
   * @returns {Promise} - Updated menu item
   */
  async updateMenuItemPrice(itemId, price) {
    try {
      const response = await apiMethods.owner.updateMenuItemPrice(itemId, price);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== DASHBOARD ==========

  /**
   * Get owner dashboard statistics
   * @returns {Promise} - Dashboard stats
   */
  async getDashboard() {
    try {
      const response = await apiMethods.owner.getDashboard();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get job statistics
   * @returns {Promise} - Job stats
   */
  async getJobStats() {
    try {
      const response = await apiMethods.owner.getJobStats();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get feedback statistics summary
   * @returns {Promise} - Feedback stats summary
   */
  async getFeedbackStatsSummary() {
    try {
      const response = await apiMethods.owner.getFeedbackStatsSummary();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== FORMATTING METHODS ==========

  /**
   * Format owner profile for display
   * @param {Object} profile - Raw profile data
   * @returns {Object} - Formatted profile
   */
  formatProfile(profile) {
    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fullName: `${profile.firstName} ${profile.lastName || ''}`.trim(),
      phone: profile.phone || 'Not provided',
      franchiseId: profile.franchiseId,
      franchiseName: profile.franchiseName || 'Not assigned',
      joinedDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'
    };
  }

  /**
   * Format dashboard data for display
   * @param {Object} dashboard - Raw dashboard data
   * @returns {Object} - Formatted dashboard
   */
  formatDashboard(dashboard) {
    return {
      franchise: dashboard.franchise,
      profile: this.formatProfile(dashboard.profile),
      stats: {
        totalJobs: dashboard.stats?.totalJobs || 0,
        openJobs: dashboard.stats?.openJobs || 0,
        closedJobs: (dashboard.stats?.totalJobs || 0) - (dashboard.stats?.openJobs || 0),
        totalApplications: dashboard.stats?.totalApplications || 0,
        newApplications: dashboard.stats?.newApplications || 0,
        totalFeedback: dashboard.stats?.totalFeedback || 0,
        averageRating: dashboard.stats?.averageRating?.toFixed(1) || '0.0',
        applicationsByStatus: dashboard.stats?.applicationsByStatus || {}
      },
      recentJobs: dashboard.recentJobs || [],
      recentFeedback: dashboard.recentFeedback || []
    };
  }

  /**
   * Get status color for dashboard
   * @param {string} status - Status
   * @returns {string} - Color code
   */
  getStatusColor(status) {
    const colors = {
      'NEW': 'info',
      'UNDER_REVIEW': 'warning',
      'INTERVIEW_SCHEDULED': 'primary',
      'ACCEPTED': 'success',
      'REJECTED': 'error',
      'OPEN': 'success',
      'CLOSED': 'error',
      'ON_HOLD': 'warning'
    };
    return colors[status] || 'default';
  }

  /**
   * Get quick actions for owner
   * @returns {Array} - Quick actions
   */
  getQuickActions() {
    return [
      { id: 'post-job', label: 'Post New Job', icon: '📝', path: '/owner/jobs/create', color: 'primary' },
      { id: 'view-applications', label: 'View Applications', icon: '👥', path: '/owner/jobs/applications', color: 'info' },
      { id: 'reply-feedback', label: 'Reply to Feedback', icon: '💬', path: '/owner/feedback/pending', color: 'success' },
      { id: 'update-menu', label: 'Update Menu', icon: '🍔', path: '/owner/menu', color: 'warning' }
    ];
  }

  /**
   * Get statistics cards data
   * @param {Object} stats - Statistics
   * @returns {Array} - Cards data
   */
  getStatsCards(stats) {
    return [
      {
        title: 'Total Jobs',
        value: stats.totalJobs,
        icon: '💼',
        color: 'primary',
        trend: '+12%',
        link: '/owner/jobs'
      },
      {
        title: 'Open Jobs',
        value: stats.openJobs,
        icon: '✅',
        color: 'success',
        trend: `${((stats.openJobs / stats.totalJobs) * 100).toFixed(0)}%`,
        link: '/owner/jobs?status=OPEN'
      },
      {
        title: 'Total Applications',
        value: stats.totalApplications,
        icon: '📄',
        color: 'info',
        trend: '+8%',
        link: '/owner/jobs/applications'
      },
      {
        title: 'New Applications',
        value: stats.newApplications,
        icon: '🆕',
        color: 'warning',
        trend: 'Today',
        link: '/owner/jobs/applications?status=NEW'
      },
      {
        title: 'Total Feedback',
        value: stats.totalFeedback,
        icon: '💬',
        color: 'secondary',
        trend: 'This month',
        link: '/owner/feedback'
      },
      {
        title: 'Average Rating',
        value: stats.averageRating,
        icon: '⭐',
        color: 'success',
        suffix: '/5',
        link: '/owner/feedback'
      }
    ];
  }

  /**
   * Validate job data for owner
   * @param {Object} data - Job data
   * @returns {Object} - Validation result
   */
  validateJob(data) {
    const errors = {};

    if (!data.title || data.title.trim() === '') {
      errors.title = 'Job title is required';
    } else if (data.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!data.description || data.description.trim() === '') {
      errors.description = 'Job description is required';
    } else if (data.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    if (!data.jobType) {
      errors.jobType = 'Job type is required';
    }

    if (!data.location || data.location.trim() === '') {
      errors.location = 'Location is required';
    }

    if (data.positionsAvailable && data.positionsAvailable < 1) {
      errors.positionsAvailable = 'Positions must be at least 1';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate franchise data for owner
   * @param {Object} data - Franchise data
   * @returns {Object} - Validation result
   */
  validateFranchise(data) {
    const errors = {};

    if (!data.franchiseName || data.franchiseName.trim() === '') {
      errors.franchiseName = 'Franchise name is required';
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (!data.addressLine1 || data.addressLine1.trim() === '') {
      errors.addressLine1 = 'Address is required';
    }

    if (!data.city || data.city.trim() === '') {
      errors.city = 'City is required';
    }

    if (!data.state || data.state.trim() === '') {
      errors.state = 'State is required';
    }

    if (!data.postalCode || data.postalCode.trim() === '') {
      errors.postalCode = 'Postal code is required';
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
          return { message: 'Resource not found', status: 404 };
        case 403:
          return { message: 'You do not have permission to perform this action', status: 403 };
        case 401:
          return { message: 'Please login again', status: 401 };
        case 400:
          return { 
            message: error.response.data?.message || 'Invalid data', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'Request failed', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }
}

// Create singleton instance
const ownerService = new OwnerService();

export default ownerService;