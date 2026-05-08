import { apiMethods } from './api';

// ======================================================
// Feedback Service
// Handles all customer feedback-related API calls
// ======================================================

class FeedbackService {
  /**
   * Submit new feedback (Public)
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise} - Created feedback
   */
  async submitFeedback(feedbackData) {
    try {
      const response = await apiMethods.feedback.submit(feedbackData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get public feedback for a franchise (Public)
   * @param {number} franchiseId - Franchise ID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated feedback
   */
  async getPublicFeedback(franchiseId, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.feedback.getPublicByFranchise(franchiseId, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get average rating for franchise (Public)
   * @param {number} franchiseId - Franchise ID
   * @returns {Promise} - Average rating
   */
  async getAverageRating(franchiseId) {
    try {
      const response = await apiMethods.feedback.getAverageRating(franchiseId);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get rating statistics (min, max, average) (Public)
   * @param {number} franchiseId - Franchise ID
   * @returns {Promise} - Rating stats
   */
  async getRatingStats(franchiseId) {
    try {
      const response = await apiMethods.feedback.getRatingStats(franchiseId);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get rating distribution (Public)
   * @param {number} franchiseId - Franchise ID
   * @returns {Promise} - Rating distribution
   */
  async getRatingDistribution(franchiseId) {
    try {
      const response = await apiMethods.feedback.getRatingDistribution(franchiseId);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get recent feedback (Public)
   * @param {number} franchiseId - Franchise ID
   * @param {number} limit - Number of items
   * @returns {Promise} - Recent feedback
   */
  async getRecentFeedback(franchiseId, limit = 5) {
    try {
      const response = await apiMethods.feedback.getRecent(franchiseId, limit);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all feedback with pagination (Admin only)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated feedback
   */
  async getAllFeedback(page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.feedback.getAll(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get feedback by ID (Admin/Owner only)
   * @param {number} id - Feedback ID
   * @returns {Promise} - Feedback details
   */
  async getFeedbackById(id) {
    try {
      const response = await apiMethods.feedback.getById(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all feedback for a franchise (Admin/Owner only)
   * @param {number} franchiseId - Franchise ID
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated feedback
   */
  async getFeedbackByFranchise(franchiseId, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.feedback.getByFranchise(franchiseId, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get feedback by rating (Admin/Owner only)
   * @param {string} rating - Rating (ONE_STAR, TWO_STARS, etc.)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated feedback
   */
  async getFeedbackByRating(rating, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.feedback.getByRating(rating, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search feedback (Admin/Owner only)
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated search results
   */
  async searchFeedback(query, page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.feedback.search(query, page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pending feedback (no reply) (Admin/Owner only)
   * @param {number} page - Page number
   * @param {number} size - Items per page
   * @param {string} sortBy - Sort field
   * @param {string} direction - Sort direction
   * @returns {Promise} - Paginated pending feedback
   */
  async getPendingFeedback(page = 0, size = 10, sortBy = 'submittedAt', direction = 'DESC') {
    try {
      const response = await apiMethods.feedback.getPending(page, size, sortBy, direction);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reply to feedback (Admin/Owner only)
   * @param {number} id - Feedback ID
   * @param {string} reply - Reply message
   * @param {string} repliedBy - Replier name/email
   * @returns {Promise} - Updated feedback
   */
  async replyToFeedback(id, reply, repliedBy) {
    try {
      const response = await apiMethods.feedback.reply(id, reply, repliedBy);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle feedback visibility (Admin only)
   * @param {number} id - Feedback ID
   * @param {boolean} isPublic - Visibility status
   * @returns {Promise} - Updated feedback
   */
  async toggleVisibility(id, isPublic) {
    try {
      const response = await apiMethods.feedback.toggleVisibility(id, isPublic);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete feedback (Admin only)
   * @param {number} id - Feedback ID
   * @returns {Promise} - Deletion response
   */
  async deleteFeedback(id) {
    try {
      const response = await apiMethods.feedback.delete(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format feedback for display
   * @param {Object} feedback - Raw feedback data
   * @returns {Object} - Formatted feedback
   */
  formatFeedback(feedback) {
    return {
      id: feedback.id,
      customerName: feedback.customerName,
      customerEmail: feedback.customerEmail,
      customerPhone: feedback.customerPhone,
      billNumber: feedback.billNumber || 'N/A',
      rating: feedback.rating,
      ratingDisplay: this.getRatingDisplay(feedback.rating),
      ratingValue: this.getRatingValue(feedback.rating),
      stars: this.getStarRating(feedback.rating),
      comments: feedback.comments,
      wouldRecommend: feedback.wouldRecommend ? 'Yes' : 'No',
      wouldRecommendIcon: feedback.wouldRecommend ? '✅' : '❌',
      
      // Detailed ratings
      serviceRating: feedback.serviceRating || 'N/A',
      foodRating: feedback.foodRating || 'N/A',
      cleanlinessRating: feedback.cleanlinessRating || 'N/A',
      valueRating: feedback.valueRating || 'N/A',
      averageRating: feedback.averageRating || this.calculateAverageRating(feedback),
      
      // Reply info
      adminReply: feedback.adminReply,
      hasReply: !!feedback.adminReply,
      repliedAt: feedback.repliedAt ? new Date(feedback.repliedAt).toLocaleDateString() : null,
      repliedBy: feedback.repliedBy || null,
      
      // Visibility
      isPublic: feedback.isPublic,
      visibilityIcon: feedback.isPublic ? '🌐' : '🔒',
      visibilityText: feedback.isPublic ? 'Public' : 'Private',
      
      // Franchise info
      franchiseId: feedback.franchiseId,
      franchiseName: feedback.franchiseName || 'MAC\'s Franchise',
      franchiseCity: feedback.franchiseCity,
      
      // Dates
      submittedAt: feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleDateString() : 'N/A',
      submittedDateTime: feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleString() : 'N/A',
      
      // Time ago
      timeAgo: this.getTimeAgo(feedback.submittedAt)
    };
  }

  /**
   * Format multiple feedback items
   * @param {Array} feedbacks - Raw feedback data
   * @returns {Array} - Formatted feedback
   */
  formatFeedbacks(feedbacks) {
    return feedbacks.map(f => this.formatFeedback(f));
  }

  /**
   * Get rating display info
   * @param {string} rating - Rating code
   * @returns {Object} - Display info
   */
  getRatingDisplay(rating) {
    const ratings = {
      'ONE_STAR': { label: '1 Star', color: 'error', icon: '⭐', description: 'Poor' },
      'TWO_STARS': { label: '2 Stars', color: 'error', icon: '⭐⭐', description: 'Fair' },
      'THREE_STARS': { label: '3 Stars', color: 'warning', icon: '⭐⭐⭐', description: 'Good' },
      'FOUR_STARS': { label: '4 Stars', color: 'success', icon: '⭐⭐⭐⭐', description: 'Very Good' },
      'FIVE_STARS': { label: '5 Stars', color: 'success', icon: '⭐⭐⭐⭐⭐', description: 'Excellent' }
    };
    return ratings[rating] || { label: rating, color: 'default', icon: '❓', description: 'Unknown' };
  }

  /**
   * Get numeric rating value
   * @param {string} rating - Rating code
   * @returns {number} - Rating value (1-5)
   */
  getRatingValue(rating) {
    const values = {
      'ONE_STAR': 1,
      'TWO_STARS': 2,
      'THREE_STARS': 3,
      'FOUR_STARS': 4,
      'FIVE_STARS': 5
    };
    return values[rating] || 0;
  }

  /**
   * Get star rating as string
   * @param {string} rating - Rating code
   * @returns {string} - Star string
   */
  getStarRating(rating) {
    const value = this.getRatingValue(rating);
    return '⭐'.repeat(value);
  }

  /**
   * Calculate average rating from detailed ratings
   * @param {Object} feedback - Feedback object
   * @returns {number} - Average rating
   */
  calculateAverageRating(feedback) {
    const ratings = [
      feedback.serviceRating,
      feedback.foodRating,
      feedback.cleanlinessRating,
      feedback.valueRating
    ].filter(r => r && !isNaN(r));
    
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return (sum / ratings.length).toFixed(1);
  }

  /**
   * Get all rating options for dropdown
   * @returns {Array} - Rating options
   */
  getRatingOptions() {
    return [
      { value: 'ONE_STAR', label: '1 Star', icon: '⭐' },
      { value: 'TWO_STARS', label: '2 Stars', icon: '⭐⭐' },
      { value: 'THREE_STARS', label: '3 Stars', icon: '⭐⭐⭐' },
      { value: 'FOUR_STARS', label: '4 Stars', icon: '⭐⭐⭐⭐' },
      { value: 'FIVE_STARS', label: '5 Stars', icon: '⭐⭐⭐⭐⭐' }
    ];
  }

  /**
   * Get time ago string
   * @param {string} date - Date string
   * @returns {string} - Time ago
   */
  getTimeAgo(date) {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return past.toLocaleDateString();
  }

  /**
   * Get statistics summary
   * @param {Array} feedbacks - List of feedback
   * @returns {Object} - Statistics
   */
  getStatisticsSummary(feedbacks) {
    if (!feedbacks || !feedbacks.length) {
      return {
        total: 0,
        averageRating: 0,
        byRating: {},
        withReply: 0,
        withoutReply: 0,
        recommendCount: 0,
        notRecommendCount: 0
      };
    }

    const byRating = {};
    let totalRating = 0;
    let withReply = 0;
    let recommendCount = 0;

    feedbacks.forEach(f => {
      // Count by rating
      byRating[f.rating] = (byRating[f.rating] || 0) + 1;
      
      // Sum ratings for average
      totalRating += this.getRatingValue(f.rating);
      
      // Count replies
      if (f.adminReply) withReply++;
      
      // Count recommendations
      if (f.wouldRecommend) recommendCount++;
    });

    return {
      total: feedbacks.length,
      averageRating: (totalRating / feedbacks.length).toFixed(1),
      byRating,
      withReply,
      withoutReply: feedbacks.length - withReply,
      recommendCount,
      notRecommendCount: feedbacks.length - recommendCount,
      recommendPercentage: ((recommendCount / feedbacks.length) * 100).toFixed(1)
    };
  }

  /**
   * Get rating distribution for chart
   * @param {Object} byRating - Rating counts
   * @returns {Array} - Chart data
   */
  getRatingChartData(byRating) {
    const ratings = [
      { rating: 'FIVE_STARS', label: '5 Stars', value: byRating['FIVE_STARS'] || 0 },
      { rating: 'FOUR_STARS', label: '4 Stars', value: byRating['FOUR_STARS'] || 0 },
      { rating: 'THREE_STARS', label: '3 Stars', value: byRating['THREE_STARS'] || 0 },
      { rating: 'TWO_STARS', label: '2 Stars', value: byRating['TWO_STARS'] || 0 },
      { rating: 'ONE_STAR', label: '1 Star', value: byRating['ONE_STAR'] || 0 }
    ];
    return ratings;
  }

  /**
   * Validate feedback data
   * @param {Object} data - Feedback data
   * @returns {Object} - Validation result
   */
  validateFeedback(data) {
    const errors = {};

    if (!data.customerName || data.customerName.trim() === '') {
      errors.customerName = 'Name is required';
    }

    if (!data.customerEmail || data.customerEmail.trim() === '') {
      errors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.customerEmail)) {
      errors.customerEmail = 'Email is invalid';
    }

    if (!data.customerPhone || data.customerPhone.trim() === '') {
      errors.customerPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(data.customerPhone.replace(/\D/g, ''))) {
      errors.customerPhone = 'Phone number must be 10 digits';
    }

    if (!data.rating) {
      errors.rating = 'Rating is required';
    }

    if (!data.comments || data.comments.trim() === '') {
      errors.comments = 'Comments are required';
    } else if (data.comments.length < 10) {
      errors.comments = 'Comments must be at least 10 characters';
    }

    if (!data.franchiseId) {
      errors.franchiseId = 'Franchise selection is required';
    }

    // Validate detailed ratings (1-5)
    if (data.serviceRating && (data.serviceRating < 1 || data.serviceRating > 5)) {
      errors.serviceRating = 'Service rating must be between 1 and 5';
    }

    if (data.foodRating && (data.foodRating < 1 || data.foodRating > 5)) {
      errors.foodRating = 'Food rating must be between 1 and 5';
    }

    if (data.cleanlinessRating && (data.cleanlinessRating < 1 || data.cleanlinessRating > 5)) {
      errors.cleanlinessRating = 'Cleanliness rating must be between 1 and 5';
    }

    if (data.valueRating && (data.valueRating < 1 || data.valueRating > 5)) {
      errors.valueRating = 'Value rating must be between 1 and 5';
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
          return { message: 'Feedback not found', status: 404 };
        case 403:
          return { message: 'You do not have permission to perform this action', status: 403 };
        case 400:
          return { 
            message: error.response.data?.message || 'Invalid feedback data', 
            status: 400,
            errors: error.response.data?.errors 
          };
        default:
          return { 
            message: error.response.data?.message || 'Failed to process feedback request', 
            status: error.response.status 
          };
      }
    }
    return { message: error.message || 'Network error', status: 0 };
  }

  /**
   * Export feedback to CSV
   * @param {Array} feedbacks - List of feedback
   * @returns {string} - CSV string
   */
  exportToCSV(feedbacks) {
    if (!feedbacks || !feedbacks.length) return '';

    const headers = [
      'ID', 'Customer Name', 'Email', 'Phone', 'Rating',
      'Comments', 'Would Recommend', 'Service Rating',
      'Food Rating', 'Cleanliness', 'Value Rating',
      'Has Reply', 'Submitted Date', 'Franchise'
    ];

    const rows = feedbacks.map(f => [
      f.id,
      f.customerName,
      f.customerEmail,
      f.customerPhone,
      this.getRatingValue(f.rating),
      f.comments?.replace(/,/g, ';'),
      f.wouldRecommend ? 'Yes' : 'No',
      f.serviceRating || 'N/A',
      f.foodRating || 'N/A',
      f.cleanlinessRating || 'N/A',
      f.valueRating || 'N/A',
      f.adminReply ? 'Yes' : 'No',
      f.submittedAt ? new Date(f.submittedAt).toLocaleDateString() : 'N/A',
      f.franchiseName || 'N/A'
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }
}

// Create singleton instance
const feedbackService = new FeedbackService();

export default feedbackService;