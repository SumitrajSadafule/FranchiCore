import axios from 'axios';

// ======================================================
// API Configuration
// Base URL from environment variables
// ======================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ======================================================
// Request Interceptor
// Adds auth token to every request if available
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// Response Interceptor
// Handles errors globally
// ======================================================

api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.response || error);
    }

    // Handle specific error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Server error');
          break;
          
        default:
          // Other errors
          break;
      }
    }

    return Promise.reject(error);
  }
);

// ======================================================
// Helper Methods
// ======================================================

/**
 * Handle API response consistently
 */
const handleResponse = (response) => {
  return response.data;
};

/**
 * Handle API error consistently
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    throw {
      status: error.response.status,
      message: error.response.data?.message || error.response.statusText,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    throw {
      status: 0,
      message: 'Network error - no response from server',
      data: null,
    };
  } else {
    // Something else happened
    throw {
      status: -1,
      message: error.message || 'Unknown error occurred',
      data: null,
    };
  }
};

// ======================================================
// API Methods
// ======================================================

const apiMethods = {
  // ===== AUTH APIs =====
  auth: {
    login: (credentials) => 
      api.post('/auth/login', credentials).then(handleResponse).catch(handleError),
    
    validateToken: () => 
      api.get('/auth/validate').then(handleResponse).catch(handleError),
  },

  // ===== MENU APIs =====
  menu: {
    getAll: (page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/menu?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getById: (id) => 
      api.get(`/menu/${id}`).then(handleResponse).catch(handleError),
    
    getByCategory: (category, page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/menu/category/${category}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    search: (query, page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/menu/search?q=${query}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getCategories: () => 
      api.get('/menu/categories').then(handleResponse).catch(handleError),
    
    create: (data) => 
      api.post('/menu', data).then(handleResponse).catch(handleError),
    
    update: (id, data) => 
      api.put(`/menu/${id}`, data).then(handleResponse).catch(handleError),
    
    delete: (id) => 
      api.delete(`/menu/${id}`).then(handleResponse).catch(handleError),
  },

  // ===== FRANCHISE APIs =====
  franchises: {
    getAll: (page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/franchises?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getById: (id) => 
      api.get(`/franchises/${id}`).then(handleResponse).catch(handleError),
    
    getByCity: (city, page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/franchises/city/${city}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    search: (query, page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/franchises/search?q=${query}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getSorted: (sortBy = 'id', direction = 'ASC', page = 0, size = 10) => 
      api.get(`/franchises/sort?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}`)
        .then(handleResponse).catch(handleError),
    
    getActive: (page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/franchises/active?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),

    deleteFranchise: (id) => 
      api.delete(`/franchises/${id}`).then(handleResponse).catch(handleError),
  },

  // ===== JOBS APIs =====
  jobs: {
    // Public endpoints
    getOpenJobs: (page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs/open?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getById: (id) => 
      api.get(`/jobs/${id}`).then(handleResponse).catch(handleError),
    
    getByLocation: (location, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs/location/${location}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    search: (query, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs/search?q=${query}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getByType: (type, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs/type/${type}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    // Protected endpoints (require token)
    getAll: (page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getByStatus: (status, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs/status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getByFranchise: (franchiseId, page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/jobs/franchise/${franchiseId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    create: (data) => 
      api.post('/jobs', data).then(handleResponse).catch(handleError),
    
    update: (id, data) => 
      api.put(`/jobs/${id}`, data).then(handleResponse).catch(handleError),
    
    close: (id) => 
      api.patch(`/jobs/${id}/close`).then(handleResponse).catch(handleError),
    
    delete: (id) => 
      api.delete(`/jobs/${id}`).then(handleResponse).catch(handleError),
  },

  // ===== JOB APPLICATIONS APIs =====
  applications: {
    // Public - apply for job
    apply: (data) => 
      api.post('/jobs/apply', data).then(handleResponse).catch(handleError),
    
    // Protected - view applications
    getByJob: (jobId, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/jobs/${jobId}/applications?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    updateStatus: (applicationId, status) => 
      api.patch(`/jobs/applications/${applicationId}/status?status=${status}`)
        .then(handleResponse).catch(handleError),
  },

  // ===== FRANCHISE APPLICATIONS APIs =====

 

  franchiseApplications: {
 // Update franchise (Admin only)
      updateFranchise: (id, data) => 
    api.put(`/admin/franchises/${id}`, data).then(handleResponse).catch(handleError),
    // Public - submit application
    submit: (data) => 
      api.post('/franchise-applications/submit', data).then(handleResponse).catch(handleError),
    
    // Protected - admin endpoints
    getAll: (page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/franchise-applications?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getById: (id) => 
      api.get(`/franchise-applications/${id}`).then(handleResponse).catch(handleError),
    
    getByStatus: (status, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/franchise-applications/status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getByCity: (city, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/franchise-applications/city/${city}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    search: (query, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/franchise-applications/search?q=${query}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    updateStatus: (id, status, adminNotes, reviewedBy) => 
      api.patch(`/franchise-applications/${id}/status?status=${status}&adminNotes=${adminNotes || ''}&reviewedBy=${reviewedBy}`)
        .then(handleResponse).catch(handleError),
    
    getStatistics: () => 
      api.get('/franchise-applications/statistics').then(handleResponse).catch(handleError),
    
    delete: (id) => 
      api.delete(`/franchise-applications/${id}`).then(handleResponse).catch(handleError),

        // 🔴 ADD THIS NEW METHOD - Approve application and create owner
    approve: (id, username, password) => 
      api.post(`/franchise-applications/${id}/approve`, { username, password })
        .then(handleResponse).catch(handleError),
  },

  // ===== FEEDBACK APIs =====
  feedback: {
    // Public endpoints
    submit: (data) => 
      api.post('/feedback/submit', data).then(handleResponse).catch(handleError),
    
    getPublicByFranchise: (franchiseId, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/feedback/franchise/${franchiseId}/public?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getAverageRating: (franchiseId) => 
      api.get(`/feedback/franchise/${franchiseId}/average-rating`).then(handleResponse).catch(handleError),
    
    getRatingStats: (franchiseId) => 
      api.get(`/feedback/franchise/${franchiseId}/rating-stats`).then(handleResponse).catch(handleError),
    
    getRatingDistribution: (franchiseId) => 
      api.get(`/feedback/franchise/${franchiseId}/rating-distribution`).then(handleResponse).catch(handleError),
    
    getRecent: (franchiseId, limit = 5) => 
      api.get(`/feedback/franchise/${franchiseId}/recent?limit=${limit}`).then(handleResponse).catch(handleError),
    
    // Protected endpoints
    getAll: (page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/feedback?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getById: (id) => 
      api.get(`/feedback/${id}`).then(handleResponse).catch(handleError),
    
    getByFranchise: (franchiseId, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/feedback/franchise/${franchiseId}/all?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getByRating: (rating, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/feedback/rating/${rating}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    search: (query, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/feedback/search?q=${query}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getPending: (page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/feedback/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    reply: (id, reply, repliedBy) => 
      api.post(`/feedback/${id}/reply?reply=${encodeURIComponent(reply)}&repliedBy=${repliedBy}`)
        .then(handleResponse).catch(handleError),
    
    toggleVisibility: (id, isPublic) => 
      api.patch(`/feedback/${id}/visibility?isPublic=${isPublic}`).then(handleResponse).catch(handleError),
    
    delete: (id) => 
      api.delete(`/feedback/${id}`).then(handleResponse).catch(handleError),
  },

  // ===== OWNER APIs =====
  owner: {
    // Profile
    getProfile: () => 
      api.get('/owner/profile').then(handleResponse).catch(handleError),
    
    updateProfile: (data) => 
      api.put('/owner/profile', data).then(handleResponse).catch(handleError),
    
    changePassword: (oldPassword, newPassword) => 
      api.post('/owner/change-password', { oldPassword, newPassword }).then(handleResponse).catch(handleError),
    
    // Franchise
    getFranchise: () => 
      api.get('/owner/franchise').then(handleResponse).catch(handleError),
    
    updateFranchise: (data) => 
      api.put('/owner/franchise', data).then(handleResponse).catch(handleError),
    
    // Jobs
    getJobs: (page = 0, size = 10, sortBy = 'postedDate', direction = 'DESC') => 
      api.get(`/owner/jobs?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    createJob: (data) => 
      api.post('/owner/jobs', data).then(handleResponse).catch(handleError),
    
    updateJob: (id, data) => 
      api.patch(`/owner/jobs/${id}`, data).then(handleResponse).catch(handleError),
    
    updateJobFull: (id, data) => 
      api.put(`/jobs/${id}`, data).then(handleResponse).catch(handleError),

    closeJob: (id) => 
      api.patch(`/owner/jobs/${id}/close`).then(handleResponse).catch(handleError),

    openJob: (id) => 
      api.patch(`/jobs/${id}/open`).then(handleResponse).catch(handleError),
    
    deleteJob: (id) => 
      api.delete(`/owner/jobs/${id}`).then(handleResponse).catch(handleError),
    
    // Applications
    getAllApplications: (page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/owner/jobs/applications?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getJobApplications: (jobId, page = 0, size = 10, sortBy = 'appliedDate', direction = 'DESC') => 
      api.get(`/owner/jobs/${jobId}/applications?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    updateApplicationStatus: (applicationId, status) => 
      api.patch(`/owner/applications/${applicationId}/status?status=${status}`)
        .then(handleResponse).catch(handleError),
    
    // Feedback
    getFeedback: (page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/owner/feedback?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getFeedbackStats: () => 
      api.get('/owner/feedback/stats').then(handleResponse).catch(handleError),
    
    getPendingFeedback: (page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') => 
      api.get(`/owner/feedback/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    getRecentFeedback: (page = 0, size = 10) => 
      api.get(`/owner/feedback/recent?page=${page}&size=${size}`).then(handleResponse).catch(handleError),
    
    replyToFeedback: (feedbackId, reply) => 
      api.post(`/owner/feedback/${feedbackId}/reply`, { reply }).then(handleResponse).catch(handleError),
    
    // Menu
    getMenu: (page = 0, size = 10, sortBy = 'name', direction = 'ASC') => 
      api.get(`/owner/menu?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    updateMenuItemAvailability: (itemId, available) => 
      api.patch(`/owner/menu/${itemId}/availability?available=${available}`)
        .then(handleResponse).catch(handleError),
    
    updateMenuItemPrice: (itemId, price) => 
      api.patch(`/owner/menu/${itemId}/price?price=${price}`).then(handleResponse).catch(handleError),
    
    // Dashboard
    getDashboard: () => 
      api.get('/owner/dashboard').then(handleResponse).catch(handleError),
    
    getJobStats: () => 
      api.get('/owner/stats/jobs').then(handleResponse).catch(handleError),
    
    getFeedbackStatsSummary: () => 
      api.get('/owner/stats/feedback').then(handleResponse).catch(handleError),
  },

    admin: {
    getUsers: (page = 0, size = 10, sortBy = 'id', direction = 'ASC') => 
      api.get(`/admin/users?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`)
        .then(handleResponse).catch(handleError),
    
    createUser: (data) => 
      api.post('/admin/users', data).then(handleResponse).catch(handleError),
    
    updateUser: (id, data) => 
      api.put(`/admin/users/${id}`, data).then(handleResponse).catch(handleError),
    
    deleteUser: (id) => 
      api.delete(`/admin/users/${id}`).then(handleResponse).catch(handleError),
    
    toggleUserStatus: (id) => 
      api.patch(`/admin/users/${id}/toggle`).then(handleResponse).catch(handleError),
  },
};

// Export both the axios instance and the api methods
export default api;  // Default export for the axios instance
export { apiMethods };  // Named export for the API methods