import { apiMethods } from './api';

// ======================================================
// Job Service
// Handles all job-related API calls
// ======================================================

class JobService {
  /**
   * Get all jobs with pagination (Admin/Owner only)
   * @param {number} page - Page number (0-based)
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction (ASC/DESC)
   * @returns {Promise} - Paginated jobs
   */
  async getAllJobs(page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.getAll(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all open jobs (Public)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated open jobs
   */
  async getOpenJobs(page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.getOpenJobs(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get job by ID
   * @param {number} id - Job ID
   * @returns {Promise} - Job details
   */
  async getJobById(id) {
    try {
      const response = await apiMethods.jobs.getById(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get jobs by franchise
   * @param {number} franchiseId - Franchise ID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated jobs
   */
  async getJobsByFranchise(franchiseId, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.getByFranchise(franchiseId, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get jobs by location
   * @param {string} location - Location name
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated jobs
   */
  async getJobsByLocation(location, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.getByLocation(location, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search jobs
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated search results
   */
  async searchJobs(query, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.search(query, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get jobs by type
   * @param {string} type - Job type (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated jobs
   */
  async getJobsByType(type, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.getByType(type, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get jobs by status (Admin/Owner only)
   * @param {string} status - Job status (OPEN, CLOSED, ON_HOLD)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated jobs
   */
  async getJobsByStatus(status, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.jobs.getByStatus(status, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new job (Admin/Owner only)
   * @param {Object} jobData - Job data
   * @returns {Promise} - Created job
   */
  async createJob(jobData) {
    try {
      const response = await apiMethods.jobs.create(jobData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update job (Admin/Owner only)
   * @param {number} id - Job ID
   * @param {Object} jobData - Updated job data
   * @returns {Promise} - Updated job
   */
  async updateJob(id, jobData) {
    try {
      const response = await apiMethods.jobs.update(id, jobData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Close job (Admin/Owner only)
   * @param {number} id - Job ID
   * @returns {Promise} - Closed job
   */
  async closeJob(id) {
    try {
      const response = await apiMethods.jobs.close(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete job (Admin/Owner only)
   * @param {number} id - Job ID
   * @returns {Promise} - Deletion response
   */
  async deleteJob(id) {
    try {
      const response = await apiMethods.jobs.delete(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Apply for a job (Public)
   * @param {Object} applicationData - Application data
   * @returns {Promise} - Created application
   */
  async applyForJob(applicationData) {
    try {
      const response = await apiMethods.applications.apply(applicationData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get applications for a job (Admin/Owner only)
   * @param {number} jobId - Job ID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated applications
   */
  async getApplicationsForJob(jobId, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') {
    try {
      const response = await apiMethods.applications.getByJob(jobId, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update application status (Admin/Owner only)
   * @param {number} applicationId - Application ID
   * @param {string} status - New status
   * @returns {Promise} - Updated application
   */
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await apiMethods.applications.updateStatus(applicationId, status);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format job for display
   * @param {Object} job - Raw job data
   * @returns {Object} - Formatted job
   */
  formatJob(job) {
    let daysRemaining = null;
    let isExpired = false;
    
    if (job.applicationDeadline) {
        const deadlineDate = new Date(job.applicationDeadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        daysRemaining = diffDays > 0 ? diffDays : 0;
        isExpired = diffDays < 0;
    }
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements || 'No specific requirements',
      type: job.jobType,
      typeDisplay: this.getJobTypeDisplay(job.jobType),
      status: job.status,
      statusDisplay: this.getStatusDisplay(job.status),
      location: job.location,
      salaryRange: job.salaryRange || 'Negotiable',
      experienceRequired: job.experienceRequired || 'Freshers welcome',
      applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'No deadline',
      positionsAvailable: job.positionsAvailable || 1,
      franchiseId: job.franchiseId,
      franchiseName: job.franchiseName || 'MAC\'s Franchise',
      franchiseCity: job.franchiseCity,
      postedDate: job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently',
      isExpired: job.applicationDeadline ? new Date(job.applicationDeadline) < new Date() : false,
      daysRemaining: this.getDaysRemaining(job.applicationDeadline),
      applicationsCount: job.applicationsCount || 0, 
      hasDeadline: !!job.applicationDeadline,
    };
  }

  /**
   * Format multiple jobs
   * @param {Array} jobs - Raw jobs data
   * @returns {Array} - Formatted jobs
   */
  
formatJobs = (jobs) => {
    if (!jobs || !Array.isArray(jobs)) return [];
    return jobs.map(job => this.formatJob(job));
}

  /**
   * Format job application for display
   * @param {Object} application - Raw application data
   * @returns {Object} - Formatted application
   */
  formatApplication(application) {
    return {
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      age: application.age || 'N/A',
      address: application.address || 'N/A',
      qualification: application.qualification || 'N/A',
      experienceYears: application.experienceYears || 0,
      previousEmployer: application.previousEmployer || 'N/A',
      coverNote: application.coverNote || 'No cover note',
      status: application.status,
      statusDisplay: this.getApplicationStatusDisplay(application.status),
      jobId: application.jobId,
      jobTitle: application.jobTitle,
      franchiseName: application.franchiseName,
      appliedDate: application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'Recently'
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
   * Get job type display name
   * @param {string} type - Job type code
   * @returns {Object} - Display info
   */
  getJobTypeDisplay(type) {
    const types = {
      'FULL_TIME': { label: 'Full Time', icon: '⏰', color: 'success' },
      'PART_TIME': { label: 'Part Time', icon: '⚡', color: 'info' },
      'CONTRACT': { label: 'Contract', icon: '📝', color: 'warning' },
      'INTERNSHIP': { label: 'Internship', icon: '🎓', color: 'primary' }
    };
    return types[type] || { label: type, icon: '❓', color: 'default' };
  }

  /**
   * Get job status display
   * @param {string} status - Status code
   * @returns {Object} - Display info
   */
  getStatusDisplay(status) {
    const statuses = {
      'OPEN': { label: 'Open', color: 'success', icon: '✅' },
      'CLOSED': { label: 'Closed', color: 'error', icon: '❌' },
      'ON_HOLD': { label: 'On Hold', color: 'warning', icon: '⏸️' }
    };
    return statuses[status] || { label: status, color: 'default', icon: '❓' };
  }

  /**
   * Get application status display
   * @param {string} status - Status code
   * @returns {Object} - Display info
   */
  getApplicationStatusDisplay(status) {
    const statuses = {
      'NEW': { label: 'New', color: 'info', icon: '🆕' },
      'UNDER_REVIEW': { label: 'Under Review', color: 'warning', icon: '🔍' },
      'INTERVIEW_SCHEDULED': { label: 'Interview Scheduled', color: 'primary', icon: '📅' },
      'ACCEPTED': { label: 'Accepted', color: 'success', icon: '✅' },
      'REJECTED': { label: 'Rejected', color: 'error', icon: '❌' },
      'WITHDRAWN': { label: 'Withdrawn', color: 'default', icon: '↩️' }
    };
    return statuses[status] || { label: status, color: 'default', icon: '❓' };
  }

  /**
   * Get days remaining until deadline
   * @param {string} deadline - Deadline date
   * @returns {number|null} - Days remaining or null
   */
  getDaysRemaining(deadline) {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Get all job types for dropdown
   * @returns {Array} - Job types
   */
  getJobTypes() {
    return [
      { value: 'FULL_TIME', label: 'Full Time', icon: '⏰' },
      { value: 'PART_TIME', label: 'Part Time', icon: '⚡' },
      { value: 'CONTRACT', label: 'Contract', icon: '📝' },
      { value: 'INTERNSHIP', label: 'Internship', icon: '🎓' }
    ];
  }

  /**
   * Get all job statuses for dropdown
   * @returns {Array} - Job statuses
   */
  getJobStatuses() {
    return [
      { value: 'OPEN', label: 'Open', icon: '✅' },
      { value: 'CLOSED', label: 'Closed', icon: '❌' },
      { value: 'ON_HOLD', label: 'On Hold', icon: '⏸️' }
    ];
  }

  /**
   * Get all application statuses for dropdown
   * @returns {Array} - Application statuses
   */
  getApplicationStatuses() {
    return [
      { value: 'NEW', label: 'New', icon: '🆕' },
      { value: 'UNDER_REVIEW', label: 'Under Review', icon: '🔍' },
      { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', icon: '📅' },
      { value: 'ACCEPTED', label: 'Accepted', icon: '✅' },
      { value: 'REJECTED', label: 'Rejected', icon: '❌' },
      { value: 'WITHDRAWN', label: 'Withdrawn', icon: '↩️' }
    ];
  }

  /**
   * Validate job data
   * @param {Object} data - Job data
   * @returns {Object} - Validation result
   */
  validateJob(data) {
    const errors = {};

    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    } else if (data.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (!data.description || data.description.trim() === '') {
      errors.description = 'Description is required';
    } else if (data.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    } else if (data.description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters';
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
   * Validate job application data
   * @param {Object} data - Application data
   * @returns {Object} - Validation result
   */
  validateApplication(data) {
    const errors = {};

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

    if (!data.jobId) {
      errors.jobId = 'Job ID is required';
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
          return { message: 'Job not found', status: 404 };
        case 403:
          return { message: 'You do not have permission to perform this action', status: 403 };
        case 400:
          return { 
            message: error.response.data?.message || 'Invalid job data', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'Failed to process job request', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }
}

// Create singleton instance
const jobService = new JobService();

export default jobService;