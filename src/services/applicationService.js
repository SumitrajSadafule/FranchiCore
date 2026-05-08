import { apiMethods } from './api';
// ======================================================
// Application Service
// Handles all franchise application-related API calls
// ======================================================

class ApplicationService {
  /**
   * Submit new franchise application (Public)
   * @param {Object} applicationData - Application data
   * @returns {Promise} - Created application
   */
  async submitApplication(applicationData) {
    try {
      const response = await apiMethods.franchiseApplications.submit(applicationData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all applications with pagination (Admin only)
   * @param {number} page - Page number (0-based)
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction (ASC/DESC)
   * @returns {Promise} - Paginated applications
   */
  async getAllApplications(page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.franchiseApplications.getAll(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get application by ID (Admin only)
   * @param {number} id - Application ID
   * @returns {Promise} - Application details
   */
  async getApplicationById(id) {
    try {
      const response = await apiMethods.franchiseApplications.getById(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get applications by status (Admin only)
   * @param {string} status - Application status
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated applications
   */
  async getApplicationsByStatus(status, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.franchiseApplications.getByStatus(status, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get applications by city (Admin only)
   * @param {string} city - City name
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated applications
   */
  async getApplicationsByCity(city, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.franchiseApplications.getByCity(city, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search applications (Admin only)
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated search results
   */
  async searchApplications(query, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.franchiseApplications.search(query, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update application status (Admin only)
   * @param {number} id - Application ID
   * @param {string} status - New status
   * @param {string} adminNotes - Admin notes
   * @param {string} reviewedBy - Reviewer email
   * @returns {Promise} - Updated application
   */
  async updateApplicationStatus(id, status, adminNotes = '', reviewedBy = '') {
    try {
      const response = await apiMethods.franchiseApplications.updateStatus(id, status, adminNotes, reviewedBy);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get application statistics (Admin only)
   * @returns {Promise} - Statistics
   */
  async getApplicationStatistics() {
    try {
      const response = await apiMethods.franchiseApplications.getStatistics();
      
      // Convert array of arrays to object
      if (Array.isArray(response)) {
        const stats = {
          total: 0,
          newApplications: 0,
          pendingReview: 0,
          approved: 0,
          rejected: 0,
          byStatus: {}
        };
        
        response.forEach(([status, count]) => {
          stats.byStatus[status] = count;
          
          // Map to your expected format
          switch(status) {
            case 'NEW':
              stats.newApplications = count;
              break;
            case 'UNDER_REVIEW':
            case 'INTERVIEW_SCHEDULED':
              stats.pendingReview += count;
              break;
            case 'APPROVED':
              stats.approved = count;
              break;
            case 'REJECTED':
              stats.rejected = count;
              break;
          }
          stats.total += count;
        });
        
        return stats;
      }
      return response;
    } catch (err) {
      throw this.handleError(err);
    }
  }

  /**
   * Delete application (Admin only)
   * @param {number} id - Application ID
   * @returns {Promise} - Deletion response
   */
  async deleteApplication(id) {
    try {
      const response = await apiMethods.franchiseApplications.delete(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format application for display
   * @param {Object} application - Raw application data
   * @returns {Object} - Formatted application
   */
  formatApplication(application) {
    return {
      id: application.id,
      fullName: application.fullName,
      age: application.age || 'N/A',
      address: application.address || 'N/A',
      phone: application.phone,
      email: application.email,
      
      // Education
      qualification: application.qualification || 'N/A',
      institution: application.institution || 'N/A',
      graduationYear: application.graduationYear || 'N/A',
      
      // Financial
      netWorth: application.netWorth !== undefined && application.netWorth !== null 
        ? this.formatCurrency(Number(application.netWorth)) 
        : 'N/A',
      liquidCapital: application.liquidCapital !== undefined && application.liquidCapital !== null 
        ? this.formatCurrency(Number(application.liquidCapital)) 
        : 'N/A',
      sourceOfFunds: application.sourceOfFunds || 'N/A',
      
      // Business Interest
      preferredCity: application.preferredCity || 'N/A',
      reasonForInterest: application.reasonForInterest || 'N/A',
      
      // Commitment
      previousOwnership: application.previousOwnership ? 'Yes' : 'No',
      ownershipDetails: application.ownershipDetails || 'N/A',
      willingToTrain: application.willingToTrain ? 'Yes' : 'No',
      
      // Legal
      panNumber: application.panNumber || 'N/A',
      aadhaarNumber: application.aadhaarNumber ? this.maskAadhaar(application.aadhaarNumber) : 'N/A',
      
      // Status
      status: application.status,
      statusDisplay: this.getStatusDisplay(application.status),
      adminNotes: application.adminNotes || '',
      appliedDate: application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'N/A',
      reviewedDate: application.reviewedDate ? new Date(application.reviewedDate).toLocaleDateString() : 'Not reviewed',
      reviewedBy: application.reviewedBy || 'Not assigned'
    };
  }

  /**
   * Format multiple applications
   * @param {Array} applications - Raw applications data
   * @returns {Array} - Formatted applications
   */
  formatApplications(applications) {
    return applications.map(app => this.formatApplication(app));
  }

  /**
   * Format currency
   * @param {number} amount - Amount
   * @returns {string} - Formatted currency
   */
  formatCurrency(amount) {
    // Handle null, undefined, or empty values
    if (amount === null || amount === undefined || amount === '') {
      return 'N/A';
    }
    
    // Convert to number
    const numAmount = Number(amount);
    
    // Check if it's a valid number
    if (isNaN(numAmount)) {
      console.warn('Invalid amount for currency formatting:', amount);
      return 'N/A';
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  }

  /**
   * Mask Aadhaar number
   * @param {string} aadhaar - Aadhaar number
   * @returns {string} - Masked Aadhaar
   */
  maskAadhaar(aadhaar) {
    if (!aadhaar || aadhaar.length < 12) return aadhaar;
    return 'XXXX XXXX ' + aadhaar.slice(-4);
  }

  /**
   * Get status display
   * @param {string} status - Status code
   * @returns {Object} - Display info
   */
  getStatusDisplay(status) {
    const statuses = {
      'NEW': { 
        label: 'New', 
        color: 'info', 
        icon: '🆕',
        description: 'Recently received',
        nextAction: 'Review application'
      },
      'UNDER_REVIEW': { 
        label: 'Under Review', 
        color: 'warning', 
        icon: '🔍',
        description: 'Being evaluated',
        nextAction: 'Schedule interview'
      },
      'INTERVIEW_SCHEDULED': { 
        label: 'Interview Scheduled', 
        color: 'primary', 
        icon: '📅',
        description: 'Discussion planned',
        nextAction: 'Conduct interview'
      },
      'APPROVED': { 
        label: 'Approved', 
        color: 'success', 
        icon: '✅',
        description: 'Accepted into network',
        nextAction: 'Create owner account'
      },
      'REJECTED': { 
        label: 'Rejected', 
        color: 'error', 
        icon: '❌',
        description: 'Application denied',
        nextAction: 'Send feedback'
      }
    };
    return statuses[status] || { 
      label: status, 
      color: 'default', 
      icon: '❓',
      description: 'Unknown status',
      nextAction: 'Review'
    };
  }

  /**
   * Get all statuses for dropdown
   * @returns {Array} - Status options
   */
  getStatusOptions() {
    return [
      { value: 'NEW', label: 'New', icon: '🆕' },
      { value: 'UNDER_REVIEW', label: 'Under Review', icon: '🔍' },
      { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', icon: '📅' },
      { value: 'APPROVED', label: 'Approved', icon: '✅' },
      { value: 'REJECTED', label: 'Rejected', icon: '❌' }
    ];
  }

  /**
   * Get statistics summary
   * @param {Array} applications - List of applications
   * @returns {Object} - Statistics
   */
  getStatisticsSummary(applications) {
    if (!applications || !applications.length) {
      return {
        total: 0,
        byStatus: {},
        byCity: {},
        newApplications: 0,
        pendingReview: 0,
        approved: 0,
        rejected: 0
      };
    }

    const byStatus = {};
    const byCity = {};
    let newApplications = 0;
    let pendingReview = 0;
    let approved = 0;
    let rejected = 0;

    applications.forEach(app => {
      // Count by status
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;

      // Count by city
      if (app.preferredCity) {
        byCity[app.preferredCity] = (byCity[app.preferredCity] || 0) + 1;
      }

      // Status specific counts
      switch (app.status) {
        case 'NEW':
          newApplications++;
          break;
        case 'UNDER_REVIEW':
        case 'INTERVIEW_SCHEDULED':
          pendingReview++;
          break;
        case 'APPROVED':
          approved++;
          break;
        case 'REJECTED':
          rejected++;
          break;
        default:
          break;
      }
    });

    return {
      total: applications.length,
      byStatus,
      byCity,
      newApplications,
      pendingReview,
      approved,
      rejected
    };
  }

  /**
   * Check if application can be edited
   * @param {Object} application - Application object
   * @returns {boolean} - Can edit
   */
  canEdit(application) {
    return application.status === 'NEW' || application.status === 'UNDER_REVIEW';
  }

  /**
   * Check if application can be approved
   * @param {Object} application - Application object
   * @returns {boolean} - Can approve
   */
  canApprove(application) {
    return application.status === 'UNDER_REVIEW' || application.status === 'INTERVIEW_SCHEDULED';
  }

  /**
   * Get next recommended status
   * @param {string} currentStatus - Current status
   * @returns {string} - Next status
   */
  getNextStatus(currentStatus) {
    const flow = {
      'NEW': 'UNDER_REVIEW',
      'UNDER_REVIEW': 'INTERVIEW_SCHEDULED',
      'INTERVIEW_SCHEDULED': 'APPROVED'
    };
    return flow[currentStatus] || currentStatus;
  }

  /**
   * Validate application data
   * @param {Object} data - Application data
   * @returns {Object} - Validation result
   */
  validateApplication(data) {
    const errors = {};

    // Personal Info
    if (!data.fullName || data.fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    }

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    // Financial
    if (!data.netWorth) {
      errors.netWorth = 'Net worth is required';
    } else if (data.netWorth < 1000000) {
      errors.netWorth = 'Minimum net worth required is ₹10,00,000';
    }

    if (!data.liquidCapital) {
      errors.liquidCapital = 'Liquid capital is required';
    } else if (data.liquidCapital < 500000) {
      errors.liquidCapital = 'Minimum liquid capital required is ₹5,00,000';
    }

    // Legal
    if (!data.panNumber || data.panNumber.trim() === '') {
      errors.panNumber = 'PAN number is required';
    } else if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(data.panNumber)) {
      errors.panNumber = 'Invalid PAN format';
    }

    if (!data.aadhaarNumber || data.aadhaarNumber.trim() === '') {
      errors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(data.aadhaarNumber)) {
      errors.aadhaarNumber = 'Aadhaar must be 12 digits';
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
          return { message: 'Application not found', status: 404 };
        case 403:
          return { message: 'You do not have permission to perform this action', status: 403 };
        case 400:
          return { 
            message: error.response.data?.message || 'Invalid application data', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'Failed to process application request', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }

  /**
   * Export applications to CSV
   * @param {Array} applications - List of applications
   * @returns {string} - CSV string
   */
  exportToCSV(applications) {
    if (!applications || !applications.length) return '';

    const headers = [
      'ID', 'Full Name', 'Email', 'Phone', 'Preferred City',
      'Net Worth', 'Liquid Capital', 'Status', 'Applied Date'
    ];

    const rows = applications.map(app => [
      app.id,
      app.fullName,
      app.email,
      app.phone,
      app.preferredCity || 'N/A',
      app.netWorth || 'N/A',
      app.liquidCapital || 'N/A',
      app.status,
      app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

    /**
   * Approve a franchise application and automatically create user and franchise
   * @param {number} id - Application ID
   * @param {string} username - Username for the new franchise owner
   * @param {string} password - Password for the new franchise owner
   * @returns {Promise} - Approval result with user and franchise details
   */
  async approveApplication(id, username, password) {
    try {
      const response = await apiMethods.franchiseApplications.approve(id, username, password);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Create singleton instance
const applicationService = new ApplicationService();

export default applicationService;