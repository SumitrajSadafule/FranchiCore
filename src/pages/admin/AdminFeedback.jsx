import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import feedbackService from '../../services/feedbackService';
import franchiseService from '../../services/franchiseService'; 
import './AdminFeedback.css';

// ======================================================
// Admin Feedback Page Component
// Super admin interface for managing customer feedback
// Allows viewing, filtering, and replying to feedback
// ======================================================

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    withReply: 0,
    withoutReply: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  });
  const [ratingFilter, setRatingFilter] = useState('all');
  const [replyFilter, setReplyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [franchiseFilter, setFranchiseFilter] = useState('all');
  const [franchises, setFranchises] = useState([]);
  console.log('Initial franchises state:', franchises);

  const itemsPerPage = 10;

    // Load franchises only once when component mounts
    useEffect(() => {
    fetchFranchises();
    }, []); // Empty array = run only once

    // Load feedback when filters change
    useEffect(() => {
    fetchFeedback();
    fetchStats();
    }, [currentPage, ratingFilter, replyFilter, searchQuery, franchiseFilter]);

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;
            
            if (searchQuery) {
            response = await feedbackService.searchFeedback(
                searchQuery,
                currentPage,
                itemsPerPage,
                'submittedAt',
                'DESC'
            );
            } else if (ratingFilter !== 'all') {
            response = await feedbackService.getFeedbackByRating(
                ratingFilter,
                currentPage,
                itemsPerPage,
                'submittedAt',
                'DESC'
            );
            } else if (replyFilter !== 'all') {
            if (replyFilter === 'replied') {
                response = await feedbackService.getAllFeedback(
                currentPage,
                itemsPerPage,
                'submittedAt',
                'DESC'
                );
                // Client-side filter for replied
                const allContent = response.content || response || [];
                const filtered = allContent.filter(f => f.adminReply);
                response = {
                content: filtered,
                totalElements: filtered.length,
                totalPages: Math.ceil(filtered.length / itemsPerPage)
                };
            } else if (replyFilter === 'pending') {
                // If you have a pending endpoint, use it, otherwise filter client-side
                try {
                response = await feedbackService.getPendingFeedback(
                    currentPage,
                    itemsPerPage,
                    'submittedAt',
                    'DESC'
                );
                } catch (err) {
                // Fallback to client-side filtering
                const allResponse = await feedbackService.getAllFeedback(0, 1000);
                const allContent = allResponse.content || allResponse || [];
                const filtered = allContent.filter(f => !f.adminReply);
                const start = currentPage * itemsPerPage;
                const paginated = filtered.slice(start, start + itemsPerPage);
                response = {
                    content: paginated,
                    totalElements: filtered.length,
                    totalPages: Math.ceil(filtered.length / itemsPerPage)
                };
                }
            }
            } else if (franchiseFilter !== 'all') {
            response = await feedbackService.getFeedbackByFranchise(
                franchiseFilter,
                currentPage,
                itemsPerPage,
                'submittedAt',
                'DESC'
            );
            } else {
            response = await feedbackService.getAllFeedback(
                currentPage,
                itemsPerPage,
                'submittedAt',
                'DESC'
            );
            }

            // Handle different response formats
            const feedbackContent = response.content || response || [];
            const formattedFeedback = feedbackService.formatFeedbacks(feedbackContent);
            setFeedback(formattedFeedback);
            setFilteredFeedback(formattedFeedback);
            setTotalPages(response.totalPages || Math.ceil(feedbackContent.length / itemsPerPage));
            setTotalItems(response.totalElements || feedbackContent.length);
        } catch (err) {
            setError('Failed to load feedback. Please try again.');
            console.error('Error fetching feedback:', err);
        } finally {
            setLoading(false);
        }
    };

const fetchStats = async () => {
  try {
    // Try to get stats from all feedback without requiring franchise ID
    try {
      // Get all feedback first
      const allFeedback = await feedbackService.getAllFeedback(0, 1000);
      const feedbacks = allFeedback.content || allFeedback || [];
      
      // Calculate stats manually
      const total = feedbacks.length;
      const withReply = feedbacks.filter(f => f.adminReply).length;
      const withoutReply = total - withReply;
      
      let totalRating = 0;
      let fiveStar = 0, fourStar = 0, threeStar = 0, twoStar = 0, oneStar = 0;
      
      feedbacks.forEach(f => {
        // Get rating value (handle both string and numeric ratings)
        let ratingValue = 0;
        if (typeof f.rating === 'string') {
          // Handle enum values like 'FIVE_STARS'
          if (f.rating === 'FIVE_STARS') ratingValue = 5;
          else if (f.rating === 'FOUR_STARS') ratingValue = 4;
          else if (f.rating === 'THREE_STARS') ratingValue = 3;
          else if (f.rating === 'TWO_STARS') ratingValue = 2;
          else if (f.rating === 'ONE_STAR') ratingValue = 1;
        } else {
          ratingValue = f.rating || 0;
        }
        
        totalRating += ratingValue;
        
        if (ratingValue === 5) fiveStar++;
        else if (ratingValue === 4) fourStar++;
        else if (ratingValue === 3) threeStar++;
        else if (ratingValue === 2) twoStar++;
        else if (ratingValue === 1) oneStar++;
      });
      
      setStats({
        total,
        averageRating: total > 0 ? (totalRating / total).toFixed(1) : 0,
        withReply,
        withoutReply,
        fiveStar,
        fourStar,
        threeStar,
        twoStar,
        oneStar
      });
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  } catch (err) {
    console.error('Error fetching feedback stats:', err);
  }
};

    const fetchFranchises = async () => {
        console.log('Fetching franchises...');
    try {
        const franchiseService = (await import('../../services/franchiseService')).default;
        const response = await franchiseService.getAllFranchises(0, 100);
        
        console.log('Raw franchise response:', response);
        
        // Handle different response formats
        let franchisesList = [];
        if (response && response.content) {
        franchisesList = response.content;
        console.log('Using response.content:', franchisesList);
        } else if (Array.isArray(response)) {
        franchisesList = response;
        console.log('Using response array:', franchisesList);
        }else {
            console.error('Unexpected franchise response format:', response);
        }
        
        console.log('Franchises loaded:', franchisesList); // Debug log
        setFranchises(franchisesList);
        setTimeout(() => {
        console.log('Franchises state after set:', franchises);
        }, 100);
    } catch (err) {
        console.error('Error fetching franchises:', err);
    }
    };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchFeedback();
  };

  const handleRatingFilterChange = (e) => {
    setRatingFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleReplyFilterChange = (e) => {
    setReplyFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleFranchiseFilterChange = (e) => {
    setFranchiseFilter(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('all');
    setReplyFilter('all');
    setFranchiseFilter('all');
    setCurrentPage(0);
  };

  const handleReplyClick = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.adminReply || '');
    setShowModal(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message.');
      return;
    }

    setSubmitting(true);

    try {
      const adminName = JSON.parse(localStorage.getItem('user'))?.firstName || 'Admin';
      await feedbackService.replyToFeedback(selectedFeedback.id, replyText, adminName);
      setShowModal(false);
      await fetchFeedback();
      await fetchStats();
    } catch (err) {
      alert('Failed to submit reply. Please try again.');
      console.error('Error submitting reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    try {
      await feedbackService.toggleVisibility(id, !currentStatus);
      await fetchFeedback();
    } catch (err) {
      alert('Failed to update visibility. Please try again.');
      console.error('Error toggling visibility:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await feedbackService.deleteFeedback(id);
      await fetchFeedback();
      await fetchStats();
    } catch (err) {
      alert('Failed to delete feedback. Please try again.');
      console.error('Error deleting feedback:', err);
    }
  };

  const getStarRating = (rating) => {
    const stars = [];
    const ratingValue = feedbackService.getRatingValue(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push(<span key={i} className="admin-feedback__star admin-feedback__star--filled">★</span>);
      } else {
        stars.push(<span key={i} className="admin-feedback__star">☆</span>);
      }
    }
    return stars;
  };

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: 'FIVE_STARS', label: '5 Stars' },
    { value: 'FOUR_STARS', label: '4 Stars' },
    { value: 'THREE_STARS', label: '3 Stars' },
    { value: 'TWO_STARS', label: '2 Stars' },
    { value: 'ONE_STAR', label: '1 Star' }
  ];

  const replyOptions = [
    { value: 'all', label: 'All Feedback' },
    { value: 'replied', label: 'Replied' },
    { value: 'pending', label: 'Pending Reply' }
  ];

  return (
    <div className="admin-feedback">
      {/* Header */}
      <div className="admin-feedback__header">
        <div>
          <h1 className="admin-feedback__title">Feedback Management</h1>
          <p className="admin-feedback__subtitle">
            Review and manage all customer feedback
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-feedback__stats">
        <div className="admin-feedback__stat-card">
          <span className="admin-feedback__stat-value">{stats.total}</span>
          <span className="admin-feedback__stat-label">Total Feedback</span>
        </div>
        <div className="admin-feedback__stat-card">
          <span className="admin-feedback__stat-value">{stats.averageRating}</span>
          <span className="admin-feedback__stat-label">Average Rating</span>
        </div>
        <div className="admin-feedback__stat-card">
          <span className="admin-feedback__stat-value">{stats.withReply}</span>
          <span className="admin-feedback__stat-label">Replied</span>
        </div>
        <div className="admin-feedback__stat-card">
          <span className="admin-feedback__stat-value">{stats.withoutReply}</span>
          <span className="admin-feedback__stat-label">Pending Reply</span>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="admin-feedback__distribution">
        <h3 className="admin-feedback__distribution-title">Rating Distribution</h3>
        <div className="admin-feedback__distribution-bars">
          <div className="admin-feedback__distribution-row">
            <span className="admin-feedback__distribution-label">5 Stars</span>
            <div className="admin-feedback__distribution-bar-container">
              <div 
                className="admin-feedback__distribution-bar admin-feedback__distribution-bar--5"
                style={{ width: `${stats.total > 0 ? (stats.fiveStar / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="admin-feedback__distribution-count">{stats.fiveStar}</span>
          </div>
          <div className="admin-feedback__distribution-row">
            <span className="admin-feedback__distribution-label">4 Stars</span>
            <div className="admin-feedback__distribution-bar-container">
              <div 
                className="admin-feedback__distribution-bar admin-feedback__distribution-bar--4"
                style={{ width: `${stats.total > 0 ? (stats.fourStar / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="admin-feedback__distribution-count">{stats.fourStar}</span>
          </div>
          <div className="admin-feedback__distribution-row">
            <span className="admin-feedback__distribution-label">3 Stars</span>
            <div className="admin-feedback__distribution-bar-container">
              <div 
                className="admin-feedback__distribution-bar admin-feedback__distribution-bar--3"
                style={{ width: `${stats.total > 0 ? (stats.threeStar / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="admin-feedback__distribution-count">{stats.threeStar}</span>
          </div>
          <div className="admin-feedback__distribution-row">
            <span className="admin-feedback__distribution-label">2 Stars</span>
            <div className="admin-feedback__distribution-bar-container">
              <div 
                className="admin-feedback__distribution-bar admin-feedback__distribution-bar--2"
                style={{ width: `${stats.total > 0 ? (stats.twoStar / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="admin-feedback__distribution-count">{stats.twoStar}</span>
          </div>
          <div className="admin-feedback__distribution-row">
            <span className="admin-feedback__distribution-label">1 Star</span>
            <div className="admin-feedback__distribution-bar-container">
              <div 
                className="admin-feedback__distribution-bar admin-feedback__distribution-bar--1"
                style={{ width: `${stats.total > 0 ? (stats.oneStar / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="admin-feedback__distribution-count">{stats.oneStar}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-feedback__filters">
        <form onSubmit={handleSearch} className="admin-feedback__search">
          <input
            type="text"
            placeholder="Search by customer name or comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-feedback__search-input"
          />
          <button type="submit" className="admin-feedback__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={franchiseFilter}
          onChange={handleFranchiseFilterChange}
          className="admin-feedback__filter-select"
        >
        <option value="all">All Franchises</option>
        {console.log('Rendering franchise options:', franchises)}
        {franchises.map(f => {
            console.log('Rendering franchise:', f);
            return (
            <option key={f.id} value={f.id}>
                {f.franchiseName || f.name || `Franchise ${f.id}`}
            </option>
            );
        })}
        </select>

        <select
          value={ratingFilter}
          onChange={handleRatingFilterChange}
          className="admin-feedback__filter-select"
        >
          {ratingOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={replyFilter}
          onChange={handleReplyFilterChange}
          className="admin-feedback__filter-select"
        >
          {replyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {(searchQuery || ratingFilter !== 'all' || replyFilter !== 'all' || franchiseFilter !== 'all') && (
          <button onClick={clearFilters} className="admin-feedback__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="admin-feedback__results-info">
        Showing {feedback.length} of {totalItems} feedback entries
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-feedback__loading">
          <div className="admin-feedback__spinner"></div>
          <p>Loading feedback...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-feedback__error">
          <span className="admin-feedback__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchFeedback} className="admin-feedback__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Feedback List */}
      {!loading && !error && (
        <>
          {feedback.length === 0 ? (
            <div className="admin-feedback__empty">
              <span className="admin-feedback__empty-icon">💬</span>
              <h3>No feedback found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="admin-feedback__list">
                {feedback.map(item => (
                  <div key={item.id} className="admin-feedback__card">
                    <div className="admin-feedback__card-header">
                      <div className="admin-feedback__customer-info">
                        <div className="admin-feedback__customer-avatar">
                          {item.customerName?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="admin-feedback__customer-name">{item.customerName}</h3>
                          <div className="admin-feedback__customer-rating">
                            {getStarRating(item.rating)}
                          </div>
                        </div>
                      </div>
                      <div className="admin-feedback__card-actions">
                        <span className="admin-feedback__date">{item.timeAgo}</span>
                        <button
                          onClick={() => handleToggleVisibility(item.id, item.isPublic)}
                          className={`admin-feedback__visibility-btn ${item.isPublic ? 'admin-feedback__visibility-btn--public' : 'admin-feedback__visibility-btn--private'}`}
                          title={item.isPublic ? 'Make Private' : 'Make Public'}
                        >
                          {item.isPublic ? '🌐' : '🔒'}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-feedback__delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="admin-feedback__card-body">
                      <div className="admin-feedback__franchise-info">
                        <span className="admin-feedback__franchise-name">
                          🏪 {item.franchiseName}
                        </span>
                      </div>

                      <div className="admin-feedback__detailed-ratings">
                        {item.serviceRating && (
                          <span className="admin-feedback__detail-rating">
                            Service: {item.serviceRating}/5
                          </span>
                        )}
                        {item.foodRating && (
                          <span className="admin-feedback__detail-rating">
                            Food: {item.foodRating}/5
                          </span>
                        )}
                        {item.cleanlinessRating && (
                          <span className="admin-feedback__detail-rating">
                            Cleanliness: {item.cleanlinessRating}/5
                          </span>
                        )}
                        {item.valueRating && (
                          <span className="admin-feedback__detail-rating">
                            Value: {item.valueRating}/5
                          </span>
                        )}
                      </div>

                      <p className="admin-feedback__comments">{item.comments}</p>

                      {item.wouldRecommend && (
                        <div className="admin-feedback__recommend">
                          <span>✅ Would recommend</span>
                        </div>
                      )}

                      {item.billNumber && (
                        <div className="admin-feedback__bill">
                          <span>🧾 Bill #{item.billNumber}</span>
                        </div>
                      )}

                      {item.adminReply && (
                        <div className="admin-feedback__reply">
                          <div className="admin-feedback__reply-header">
                            <span className="admin-feedback__reply-icon">💬</span>
                            <span className="admin-feedback__reply-date">
                              Admin replied • {item.repliedAt}
                            </span>
                          </div>
                          <p className="admin-feedback__reply-text">{item.adminReply}</p>
                        </div>
                      )}
                    </div>

                    <div className="admin-feedback__card-footer">
                      {!item.adminReply ? (
                        <button
                          onClick={() => handleReplyClick(item)}
                          className="admin-feedback__reply-button"
                        >
                          Reply to Feedback
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReplyClick(item)}
                          className="admin-feedback__edit-reply-button"
                        >
                          Edit Reply
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="admin-feedback__pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="admin-feedback__pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="admin-feedback__pagination-info">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="admin-feedback__pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Reply Modal */}
      {showModal && selectedFeedback && (
        <div className="admin-feedback__modal-overlay">
          <div className="admin-feedback__modal">
            <div className="admin-feedback__modal-header">
              <h2 className="admin-feedback__modal-title">
                {selectedFeedback.adminReply ? 'Edit Reply' : 'Reply to Feedback'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="admin-feedback__modal-close"
              >
                ×
              </button>
            </div>

            <div className="admin-feedback__modal-content">
              <div className="admin-feedback__modal-feedback">
                <div className="admin-feedback__modal-customer">
                  <strong>{selectedFeedback.customerName}</strong> 
                  <span className="admin-feedback__modal-franchise">
                    ({selectedFeedback.franchiseName})
                  </span>
                </div>
                <div className="admin-feedback__modal-rating">
                  {getStarRating(selectedFeedback.rating)}
                </div>
                <p className="admin-feedback__modal-comments">
                  "{selectedFeedback.comments}"
                </p>
              </div>

              <div className="admin-feedback__modal-reply">
                <label className="admin-feedback__modal-label">
                  Your Reply
                </label>
                <textarea
                  className="admin-feedback__modal-textarea"
                  rows="5"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply to this customer..."
                ></textarea>
              </div>

              <div className="admin-feedback__modal-actions">
                <button
                  onClick={() => setShowModal(false)}
                  className="admin-feedback__modal-button admin-feedback__modal-button--secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="admin-feedback__modal-button admin-feedback__modal-button--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : (selectedFeedback.adminReply ? 'Update Reply' : 'Send Reply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;