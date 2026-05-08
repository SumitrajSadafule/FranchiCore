// ======================================================
// Formatters Utility
// Handles date, currency, phone, and other formatting functions
// Used consistently across the entire application
// ======================================================

/**
 * Format currency to Indian Rupees (INR)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return 'N/A';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return formatter.format(amount);
};

/**
 * Format currency in lakhs/crores (Indian numbering system)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency (e.g., ₹50 Lakhs, ₹2 Crores)
 */
export const formatIndianCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Crores`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} Thousands`;
  } else {
    return `₹${amount}`;
  }
};

/**
 * Format date to various formats
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (default: 'DD/MM/YYYY')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  const formats = {
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD MMM YYYY': d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    'DD MMMM YYYY': d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    'DD/MM/YYYY HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
    'HH:mm DD/MM/YYYY': `${hours}:${minutes} ${day}/${month}/${year}`,
    'full': d.toLocaleString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    'time': `${hours}:${minutes}`,
    'timeWithSeconds': `${hours}:${minutes}:${seconds}`,
    'iso': d.toISOString(),
    'api': d.toISOString().split('T')[0] // YYYY-MM-DD for API
  };

  return formats[format] || formats['DD/MM/YYYY'];
};

/**
 * Format phone number to Indian format
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a 10-digit number
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '0') {
    return `+91 ${cleaned.slice(1, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 12 && cleaned.slice(0, 2) === '91') {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length > 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7, 12)}`;
  }
  
  return phone;
};

/**
 * Format mobile number for display (masks middle digits)
 * @param {string} phone - The phone number to mask
 * @returns {string} Masked phone number
 */
export const maskPhone = (phone) => {
  if (!phone) return 'N/A';
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}XXXXX${cleaned.slice(8)}`;
  }
  return phone;
};

/**
 * Format email address (masks local part)
 * @param {string} email - The email to mask
 * @returns {string} Masked email
 */
export const maskEmail = (email) => {
  if (!email) return 'N/A';
  
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedLocal = local.length > 3 
    ? local.slice(0, 3) + '***' 
    : local + '***';
  
  return `${maskedLocal}@${domain}`;
};

/**
 * Format Aadhaar number (masks first 8 digits)
 * @param {string} aadhaar - The Aadhaar number to mask
 * @returns {string} Masked Aadhaar
 */
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return 'N/A';
  
  const cleaned = aadhaar.replace(/\D/g, '');
  if (cleaned.length === 12) {
    return `XXXX XXXX ${cleaned.slice(8)}`;
  }
  return aadhaar;
};

/**
 * Format PAN number
 * @param {string} pan - The PAN number to format
 * @returns {string} Formatted PAN
 */
export const formatPan = (pan) => {
  if (!pan) return 'N/A';
  
  const cleaned = pan.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 10) {
    return cleaned;
  }
  return pan;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format number with commas (Indian numbering system)
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
};

/**
 * Format address components
 * @param {Object} address - Address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country
  ].filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
};

/**
 * Format full name
 * @param {Object} name - Name object with firstName and lastName
 * @returns {string} Formatted full name
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return 'N/A';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Format rating to star display
 * @param {number} rating - Rating value (1-5)
 * @returns {string} Star representation
 */
export const formatRatingToStars = (rating) => {
  if (!rating) return '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
};

/**
 * Format duration in minutes to readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  return `${mins} minutes`;
};

/**
 * Format salary range
 * @param {string} range - Salary range string
 * @returns {string} Formatted salary range
 */
export const formatSalaryRange = (range) => {
  if (!range) return 'Negotiable';
  
  // If it's already formatted, return as is
  if (range.includes('₹') || range.includes('Lakh') || range.includes('Thousand')) {
    return range;
  }
  
  // Try to format as numbers
  const parts = range.split('-').map(p => p.trim());
  if (parts.length === 2) {
    const min = parseInt(parts[0]);
    const max = parseInt(parts[1]);
    if (!isNaN(min) && !isNaN(max)) {
      return `${formatIndianCurrency(min * 1000)} - ${formatIndianCurrency(max * 1000)}`;
    }
  }
  
  return range;
};
/**
 * Format date for API (YYYY-MM-DDTHH:MM:SS)
 * Converts date string to format expected by backend
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Formatted date string for API (YYYY-MM-DDT00:00:00)
 */
export const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  // If already has time, return as is
  if (dateString.includes('T')) return dateString;
  // Add time component
  return dateString + 'T00:00:00';
};

/**
 * Format date for input field (YYYY-MM-DD)
 * Converts API date to format for input type="date"
 * @param {string} dateString - Date from API (YYYY-MM-DDTHH:MM:SS)
 * @returns {string} - Formatted date for input (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Extract only the date part (YYYY-MM-DD)
  return dateString.split('T')[0];
};
// Usage examples:
// formatCurrency(500000) -> "₹5,00,000"
// formatIndianCurrency(5000000) -> "₹50 Lakhs"
// formatDate(new Date(), 'DD MMM YYYY') -> "28 Feb 2025"
// formatPhone('9876543210') -> "98765 43210"
// maskPhone('9876543210') -> "987XXXXX210"
// getRelativeTime('2025-02-25') -> "3 days ago"
// truncateText('Long text...', 10) -> "Long text..."
// formatRatingToStars(4.5) -> "★★★★½"
// formatDuration(150) -> "2h 30m"

export default {
  formatCurrency,
  formatIndianCurrency,
  formatDate,
  formatPhone,
  maskPhone,
  maskEmail,
  maskAadhaar,
  formatPan,
  formatFileSize,
  formatNumber,
  formatPercentage,
  getRelativeTime,
  formatAddress,
  formatFullName,
  truncateText,
  formatRatingToStars,
  formatDuration,
  formatSalaryRange,
  formatDateForAPI,     
  formatDateForInput 
};