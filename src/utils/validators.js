// ======================================================
// Validators Utility
// Handles form validation, email/phone checks, and data validation
// Used consistently across the entire application
// ======================================================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a valid Indian mobile number
  // Starts with 6-9 and is 10 digits long
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate PAN card number
 * @param {string} pan - PAN number to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePAN = (pan) => {
  if (!pan) {
    return { isValid: false, message: 'PAN number is required' };
  }

  // PAN format: ABCDE1234F
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan.toUpperCase())) {
    return { 
      isValid: false, 
      message: 'Please enter a valid PAN number (e.g., ABCDE1234F)' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate Aadhaar number
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) {
    return { isValid: false, message: 'Aadhaar number is required' };
  }

  // Remove all non-numeric characters
  const cleaned = aadhaar.replace(/\D/g, '');

  // Check if it's 12 digits
  if (cleaned.length !== 12) {
    return { isValid: false, message: 'Aadhaar number must be 12 digits' };
  }

  // Basic format check (can add Verhoeff algorithm for more accuracy)
  const aadhaarRegex = /^\d{12}$/;
  if (!aadhaarRegex.test(cleaned)) {
    return { isValid: false, message: 'Please enter a valid Aadhaar number' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 40,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true
  } = options;

  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${minLength} characters long` 
    };
  }

  if (password.length > maxLength) {
    return { 
      isValid: false, 
      message: `Password must not exceed ${maxLength} characters` 
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one lowercase letter' 
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one number' 
    };
  }

  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one special character' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' };
  }

  if (username.length > 50) {
    return { isValid: false, message: 'Username must not exceed 50 characters' };
  }

  // Only allow letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      message: 'Username can only contain letters, numbers, and underscores' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateURL = (url) => {
  if (!url) return { isValid: true, message: '' };

  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch (e) {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

/**
 * Validate age
 * @param {number} age - Age to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and message
 */
export const validateAge = (age, options = {}) => {
  const { min = 18, max = 65 } = options;

  if (age === null || age === undefined || age === '') {
    return { isValid: false, message: 'Age is required' };
  }

  const numAge = Number(age);
  if (isNaN(numAge)) {
    return { isValid: false, message: 'Please enter a valid age' };
  }

  if (numAge < min) {
    return { isValid: false, message: `You must be at least ${min} years old` };
  }

  if (numAge > max) {
    return { isValid: false, message: `Age must be less than ${max}` };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate price/amount
 * @param {number} amount - Amount to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and message
 */
export const validateAmount = (amount, options = {}) => {
  const { min = 0, max = Infinity, required = true } = options;

  if (required && (amount === null || amount === undefined || amount === '')) {
    return { isValid: false, message: 'Amount is required' };
  }

  if (!required && !amount) return { isValid: true, message: '' };

  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Please enter a valid amount' };
  }

  if (numAmount < min) {
    return { isValid: false, message: `Amount must be at least ${min}` };
  }

  if (numAmount > max) {
    return { isValid: false, message: `Amount must not exceed ${max}` };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Name of the field
 * @returns {Object} Validation result with isValid and message
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate minimum length
 * @param {string} value - String to check
 * @param {number} min - Minimum length
 * @param {string} fieldName - Name of the field
 * @returns {Object} Validation result with isValid and message
 */
export const validateMinLength = (value, min, fieldName = 'This field') => {
  if (!value) return { isValid: true, message: '' };
  
  if (value.length < min) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${min} characters` 
    };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate maximum length
 * @param {string} value - String to check
 * @param {number} max - Maximum length
 * @param {string} fieldName - Name of the field
 * @returns {Object} Validation result with isValid and message
 */
export const validateMaxLength = (value, max, fieldName = 'This field') => {
  if (!value) return { isValid: true, message: '' };
  
  if (value.length > max) {
    return { 
      isValid: false, 
      message: `${fieldName} must not exceed ${max} characters` 
    };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate PIN code
 * @param {string} pincode - PIN code to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePincode = (pincode) => {
  if (!pincode) {
    return { isValid: false, message: 'PIN code is required' };
  }

  const cleaned = pincode.replace(/\D/g, '');
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  
  if (!pincodeRegex.test(cleaned)) {
    return { isValid: false, message: 'Please enter a valid 6-digit PIN code' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate IFSC code
 * @param {string} ifsc - IFSC code to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateIFSC = (ifsc) => {
  if (!ifsc) {
    return { isValid: false, message: 'IFSC code is required' };
  }

  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifsc.toUpperCase())) {
    return { 
      isValid: false, 
      message: 'Please enter a valid IFSC code (e.g., SBIN0123456)' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate GST number
 * @param {string} gst - GST number to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateGST = (gst) => {
  if (!gst) {
    return { isValid: false, message: 'GST number is required' };
  }

  // GST format: 22AAAAA0000A1Z5
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  if (!gstRegex.test(gst.toUpperCase())) {
    return { 
      isValid: false, 
      message: 'Please enter a valid GST number' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @returns {Object} Validation result with isValid and message
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) return { isValid: true, message: '' };

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Object} Validation result with isValid and message
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) return { isValid: true, message: '' };

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { 
      isValid: false, 
      message: `File size must not exceed ${maxSizeMB}MB` 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Object} Validation result with isValid and message
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: true, message: '' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }

  if (end < start) {
    return { isValid: false, message: 'End date must be after start date' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate future date
 * @param {Date|string} date - Date to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateFutureDate = (date) => {
  if (!date) return { isValid: true, message: '' };

  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }

  if (inputDate < today) {
    return { isValid: false, message: 'Date must be in the future' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate past date
 * @param {Date|string} date - Date to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePastDate = (date) => {
  if (!date) return { isValid: true, message: '' };

  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }

  if (inputDate > today) {
    return { isValid: false, message: 'Date must be in the past' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate form data with multiple fields
 * @param {Object} data - Form data object
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors object
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    fieldRules.forEach(rule => {
      const result = rule.validate(value, data);
      if (!result.isValid && !errors[field]) {
        errors[field] = result.message;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Predefined validation rules for common fields
export const validationRules = {
  email: { validate: validateEmail },
  phone: { validate: validatePhone },
  pan: { validate: validatePAN },
  aadhaar: { validate: validateAadhaar },
  username: { validate: validateUsername },
  password: { validate: validatePassword },
  age: { validate: validateAge },
  pincode: { validate: validatePincode },
  ifsc: { validate: validateIFSC },
  gst: { validate: validateGST }
};

// Usage examples:
// validateEmail('test@example.com') -> { isValid: true, message: '' }
// validatePhone('9876543210') -> { isValid: true, message: '' }
// validatePAN('ABCDE1234F') -> { isValid: true, message: '' }
// validateAadhaar('123456789012') -> { isValid: true, message: '' }
// validatePassword('Password123!') -> { isValid: true, message: '' }
// validateForm(data, rules) -> { isValid: boolean, errors: object }

export default {
  validateEmail,
  validatePhone,
  validatePAN,
  validateAadhaar,
  validatePassword,
  validateUsername,
  validateURL,
  validateAge,
  validateAmount,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePincode,
  validateIFSC,
  validateGST,
  validateFileType,
  validateFileSize,
  validateDateRange,
  validateFutureDate,
  validatePastDate,
  validateForm,
  validationRules
};