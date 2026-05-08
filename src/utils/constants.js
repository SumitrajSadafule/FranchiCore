// ======================================================
// Constants Utility
// Stores all constant values like API endpoints, roles, status codes
// Single source of truth for application-wide constants
// ======================================================

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE: '/auth/validate',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  // Menu
  MENU: {
    BASE: '/menu',
    CATEGORIES: '/menu/categories',
    SEARCH: '/menu/search',
    BY_CATEGORY: (category) => `/menu/category/${category}`,
    BY_FRANCHISE: (franchiseId) => `/menu/franchise/${franchiseId}`,
    AVAILABLE: '/menu/available',
    PRICE_RANGE: '/menu/price-range'
  },

  // Franchises
  FRANCHISES: {
    BASE: '/franchises',
    SEARCH: '/franchises/search',
    BY_CITY: (city) => `/franchises/city/${city}`,
    SORT: '/franchises/sort',
    ACTIVE: '/franchises/active',
    STATS: '/franchises/stats'
  },

  // Jobs
  JOBS: {
    BASE: '/jobs',
    OPEN: '/jobs/open',
    SEARCH: '/jobs/search',
    BY_LOCATION: (location) => `/jobs/location/${location}`,
    BY_TYPE: (type) => `/jobs/type/${type}`,
    BY_STATUS: (status) => `/jobs/status/${status}`,
    BY_FRANCHISE: (franchiseId) => `/jobs/franchise/${franchiseId}`,
    APPLY: '/jobs/apply',
    APPLICATIONS: (jobId) => `/jobs/${jobId}/applications`
  },

  // Job Applications
  JOB_APPLICATIONS: {
    BASE: '/jobs/applications',
    BY_JOB: (jobId) => `/jobs/${jobId}/applications`,
    UPDATE_STATUS: (applicationId) => `/jobs/applications/${applicationId}/status`
  },

  // Franchise Applications
  FRANCHISE_APPLICATIONS: {
    BASE: '/franchise-applications',
    SUBMIT: '/franchise-applications/submit',
    BY_STATUS: (status) => `/franchise-applications/status/${status}`,
    BY_CITY: (city) => `/franchise-applications/city/${city}`,
    SEARCH: '/franchise-applications/search',
    STATISTICS: '/franchise-applications/statistics',
    UPDATE_STATUS: (id) => `/franchise-applications/${id}/status`
  },

  // Feedback
  FEEDBACK: {
    BASE: '/feedback',
    SUBMIT: '/feedback/submit',
    BY_FRANCHISE: (franchiseId) => `/feedback/franchise/${franchiseId}`,
    PUBLIC: (franchiseId) => `/feedback/franchise/${franchiseId}/public`,
    AVERAGE_RATING: (franchiseId) => `/feedback/franchise/${franchiseId}/average-rating`,
    RATING_STATS: (franchiseId) => `/feedback/franchise/${franchiseId}/rating-stats`,
    RATING_DISTRIBUTION: (franchiseId) => `/feedback/franchise/${franchiseId}/rating-distribution`,
    RECENT: (franchiseId) => `/feedback/franchise/${franchiseId}/recent`,
    BY_RATING: (rating) => `/feedback/rating/${rating}`,
    SEARCH: '/feedback/search',
    PENDING: '/feedback/pending',
    REPLY: (id) => `/feedback/${id}/reply`,
    TOGGLE_VISIBILITY: (id) => `/feedback/${id}/visibility`
  },

  // Owner
  OWNER: {
    PROFILE: '/owner/profile',
    CHANGE_PASSWORD: '/owner/change-password',
    FRANCHISE: '/owner/franchise',
    JOBS: '/owner/jobs',
    CREATE_JOB: '/owner/jobs',
    UPDATE_JOB: (id) => `/owner/jobs/${id}`,
    CLOSE_JOB: (id) => `/owner/jobs/${id}/close`,
    DELETE_JOB: (id) => `/owner/jobs/${id}`,
    ALL_APPLICATIONS: '/owner/jobs/applications',
    JOB_APPLICATIONS: (jobId) => `/owner/jobs/${jobId}/applications`,
    UPDATE_APPLICATION_STATUS: (applicationId) => `/owner/applications/${applicationId}/status`,
    FEEDBACK: '/owner/feedback',
    FEEDBACK_STATS: '/owner/feedback/stats',
    PENDING_FEEDBACK: '/owner/feedback/pending',
    RECENT_FEEDBACK: '/owner/feedback/recent',
    REPLY_FEEDBACK: (feedbackId) => `/owner/feedback/${feedbackId}/reply`,
    MENU: '/owner/menu',
    UPDATE_MENU_AVAILABILITY: (itemId) => `/owner/menu/${itemId}/availability`,
    UPDATE_MENU_PRICE: (itemId) => `/owner/menu/${itemId}/price`,
    DASHBOARD: '/owner/dashboard',
    JOB_STATS: '/owner/stats/jobs',
    FEEDBACK_STATS_SUMMARY: '/owner/stats/feedback'
  },

  // Admin
  ADMIN: {
    USERS: '/admin/users',
    CREATE_USER: '/admin/users',
    UPDATE_USER: (id) => `/admin/users/${id}`,
    DELETE_USER: (id) => `/admin/users/${id}`,
    TOGGLE_USER_STATUS: (id) => `/admin/users/${id}/toggle`,
    STATISTICS: '/admin/statistics'
  }
};

// ===== USER ROLES =====
export const ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  FRANCHISE_OWNER: 'ROLE_FRANCHISE_OWNER',
  CUSTOMER: 'ROLE_CUSTOMER',
  JOB_SEEKER: 'ROLE_JOB_SEEKER',
  APPLICANT: 'ROLE_APPLICANT'
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.FRANCHISE_OWNER]: 'Franchise Owner',
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.JOB_SEEKER]: 'Job Seeker',
  [ROLES.APPLICANT]: 'Applicant'
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'primary',
  [ROLES.FRANCHISE_OWNER]: 'success',
  [ROLES.CUSTOMER]: 'info',
  [ROLES.JOB_SEEKER]: 'warning',
  [ROLES.APPLICANT]: 'secondary'
};

// ===== APPLICATION STATUS =====
export const APPLICATION_STATUS = {
  NEW: 'NEW',
  UNDER_REVIEW: 'UNDER_REVIEW',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN'
};

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.NEW]: 'New',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'Under Review',
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'Interview Scheduled',
  [APPLICATION_STATUS.APPROVED]: 'Approved',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.WITHDRAWN]: 'Withdrawn'
};

export const APPLICATION_STATUS_COLORS = {
  [APPLICATION_STATUS.NEW]: 'info',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'warning',
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'primary',
  [APPLICATION_STATUS.APPROVED]: 'success',
  [APPLICATION_STATUS.REJECTED]: 'error',
  [APPLICATION_STATUS.WITHDRAWN]: 'default'
};

// ===== JOB STATUS =====
export const JOB_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ON_HOLD: 'ON_HOLD'
};

export const JOB_STATUS_LABELS = {
  [JOB_STATUS.OPEN]: 'Open',
  [JOB_STATUS.CLOSED]: 'Closed',
  [JOB_STATUS.ON_HOLD]: 'On Hold'
};

export const JOB_STATUS_COLORS = {
  [JOB_STATUS.OPEN]: 'success',
  [JOB_STATUS.CLOSED]: 'error',
  [JOB_STATUS.ON_HOLD]: 'warning'
};

// ===== JOB TYPES =====
export const JOB_TYPES = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP'
};

export const JOB_TYPE_LABELS = {
  [JOB_TYPES.FULL_TIME]: 'Full Time',
  [JOB_TYPES.PART_TIME]: 'Part Time',
  [JOB_TYPES.CONTRACT]: 'Contract',
  [JOB_TYPES.INTERNSHIP]: 'Internship'
};

export const JOB_TYPE_ICONS = {
  [JOB_TYPES.FULL_TIME]: '⏰',
  [JOB_TYPES.PART_TIME]: '⚡',
  [JOB_TYPES.CONTRACT]: '📝',
  [JOB_TYPES.INTERNSHIP]: '🎓'
};

// ===== FRANCHISE STATUS =====
export const FRANCHISE_STATUS = {
  ACTIVE: 'ACTIVE',
  UNDER_REVIEW: 'UNDER_REVIEW',
  PROBATION: 'PROBATION',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
  PENDING_APPROVAL: 'PENDING_APPROVAL'
};

export const FRANCHISE_STATUS_LABELS = {
  [FRANCHISE_STATUS.ACTIVE]: 'Active',
  [FRANCHISE_STATUS.UNDER_REVIEW]: 'Under Review',
  [FRANCHISE_STATUS.PROBATION]: 'Probation',
  [FRANCHISE_STATUS.SUSPENDED]: 'Suspended',
  [FRANCHISE_STATUS.CLOSED]: 'Closed',
  [FRANCHISE_STATUS.PENDING_APPROVAL]: 'Pending Approval'
};

export const FRANCHISE_STATUS_COLORS = {
  [FRANCHISE_STATUS.ACTIVE]: 'success',
  [FRANCHISE_STATUS.UNDER_REVIEW]: 'warning',
  [FRANCHISE_STATUS.PROBATION]: 'warning',
  [FRANCHISE_STATUS.SUSPENDED]: 'error',
  [FRANCHISE_STATUS.CLOSED]: 'error',
  [FRANCHISE_STATUS.PENDING_APPROVAL]: 'info'
};

// ===== RATINGS =====
export const RATINGS = {
  ONE_STAR: 'ONE_STAR',
  TWO_STARS: 'TWO_STARS',
  THREE_STARS: 'THREE_STARS',
  FOUR_STARS: 'FOUR_STARS',
  FIVE_STARS: 'FIVE_STARS'
};

export const RATING_VALUES = {
  [RATINGS.ONE_STAR]: 1,
  [RATINGS.TWO_STARS]: 2,
  [RATINGS.THREE_STARS]: 3,
  [RATINGS.FOUR_STARS]: 4,
  [RATINGS.FIVE_STARS]: 5
};

export const RATING_LABELS = {
  [RATINGS.ONE_STAR]: '1 Star',
  [RATINGS.TWO_STARS]: '2 Stars',
  [RATINGS.THREE_STARS]: '3 Stars',
  [RATINGS.FOUR_STARS]: '4 Stars',
  [RATINGS.FIVE_STARS]: '5 Stars'
};

// ===== PAGINATION =====
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// ===== DATE FORMATS =====
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  FULL: 'full',
  TIME: 'time'
};

// ===== CURRENCY =====
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  LOCALE: 'en-IN'
};

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_ROLE: 'userRole',
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences'
};

// ===== HTTP STATUS CODES =====
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check the form for errors.',
  SERVER: 'An unexpected error occurred. Please try again later.',
  DEFAULT: 'An error occurred. Please try again.'
};

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logout successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  PASSWORD_CHANGE: 'Password changed successfully!',
  JOB_CREATED: 'Job posted successfully!',
  JOB_UPDATED: 'Job updated successfully!',
  JOB_CLOSED: 'Job closed successfully!',
  JOB_DELETED: 'Job deleted successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully!',
  FEEDBACK_REPLIED: 'Reply sent successfully!',
  FRANCHISE_UPDATED: 'Franchise details updated successfully!',
  MENU_UPDATED: 'Menu updated successfully!'
};

// ===== FILE UPLOAD =====
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

// ===== THEME =====
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// ===== ANIMATION DURATIONS =====
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350
};

// ===== BREAKPOINTS (in pixels) =====
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280
};

// ===== SOCIAL MEDIA LINKS =====
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/macs',
  INSTAGRAM: 'https://instagram.com/macs',
  TWITTER: 'https://twitter.com/macs',
  YOUTUBE: 'https://youtube.com/macs',
  LINKEDIN: 'https://linkedin.com/company/macs'
};

// ===== CONTACT INFORMATION =====
export const CONTACT = {
  PHONE: '+91 22 1234 5678',
  EMAIL: 'info@macs.com',
  SUPPORT_EMAIL: 'support@macs.com',
  FRANCHISE_EMAIL: 'franchise@macs.com',
  ADDRESS: '123 Franchise Avenue, Mumbai, Maharashtra 400001'
};

// ===== BUSINESS HOURS =====
export const BUSINESS_HOURS = {
  WEEKDAYS: '9:00 AM - 8:00 PM',
  SATURDAY: '10:00 AM - 6:00 PM',
  SUNDAY: 'Closed',
  DEFAULT: 'Mon-Sun: 10:00 AM - 11:00 PM'
};

// Usage examples:
// import { ROLES, APPLICATION_STATUS, HTTP_STATUS } from '../utils/constants';
// 
// if (user.role === ROLES.SUPER_ADMIN) { ... }
// if (status === APPLICATION_STATUS.APPROVED) { ... }
// if (error.response.status === HTTP_STATUS.UNAUTHORIZED) { ... }

export default {
  API_ENDPOINTS,
  ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
  JOB_STATUS,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  JOB_TYPES,
  JOB_TYPE_LABELS,
  JOB_TYPE_ICONS,
  FRANCHISE_STATUS,
  FRANCHISE_STATUS_LABELS,
  FRANCHISE_STATUS_COLORS,
  RATINGS,
  RATING_VALUES,
  RATING_LABELS,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DATE_FORMATS,
  CURRENCY,
  STORAGE_KEYS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  ALLOWED_IMAGE_TYPES,
  THEMES,
  ANIMATION,
  BREAKPOINTS,
  SOCIAL_LINKS,
  CONTACT,
  BUSINESS_HOURS
};