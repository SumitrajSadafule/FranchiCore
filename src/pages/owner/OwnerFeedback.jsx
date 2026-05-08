import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ownerService from '../../services/ownerService';
import feedbackService from '../../services/feedbackService';
import './OwnerFeedback.css';

// ======================================================
// Owner Feedback Page Component
// Displays all customer feedback for the owner's franchise
// Allows viewing, filtering, and replying to feedback
// ======================================================

const OwnerFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
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

  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [currentPage, ratingFilter, replyFilter, searchQuery]);

  const fetchFeedback = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await ownerService.getFeedback(
      currentPage,
      itemsPerPage,
      'submittedAt',
      'DESC'
    );

    let formattedFeedback = feedbackService.formatFeedbacks(response.content || []);
    
    // ADD THIS - Apply rating filter
    if (ratingFilter !== 'all') {
      formattedFeedback = formattedFeedback.filter(f => f.rating === ratingFilter);
    }
    
    // ADD THIS - Apply reply filter
    if (replyFilter !== 'all') {
      if (replyFilter === 'replied') {
        formattedFeedback = formattedFeedback.filter(f => f.adminReply);
      } else if (replyFilter === 'pending') {
        formattedFeedback = formattedFeedback.filter(f => !f.adminReply);
      }
    }
    
    // ADD THIS - Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      formattedFeedback = formattedFeedback.filter(f => 
        f.customerName?.toLowerCase().includes(query) ||
        f.comments?.toLowerCase().includes(query)
      );
    }

    setFeedback(formattedFeedback);
    setFilteredFeedback(formattedFeedback);
    setTotalPages(Math.ceil(formattedFeedback.length / itemsPerPage));
    setTotalItems(formattedFeedback.length);
    setCurrentPage(0);
  } catch (err) {
    setError('Failed to load feedback. Please try again.');
    console.error('Error fetching feedback:', err);
  } finally {
    setLoading(false);
  }
};

  const fetchStats = async () => {
    try {
      const data = await ownerService.getFeedbackStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching feedback stats:', err);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('all');
    setReplyFilter('all');
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
      await ownerService.replyToFeedback(selectedFeedback.id, replyText);
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

  const getStarRating = (rating) => {
    const stars = [];
    const ratingValue = feedbackService.getRatingValue(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push(<span key={i} className="owner-feedback__star owner-feedback__star--filled">★</span>);
      } else {
        stars.push(<span key={i} className="owner-feedback__star">☆</span>);
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

  return (
    <div className="owner-feedback">
      {/* Header */}
      <div className="owner-feedback__header">
        <div>
          <h1 className="owner-feedback__title">Customer Feedback</h1>
          <p className="owner-feedback__subtitle">
            Review and respond to customer feedback
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="owner-feedback__stats">
          <div className="owner-feedback__stat-card">
            <span className="owner-feedback__stat-value">{stats.total || 0}</span>
            <span className="owner-feedback__stat-label">Total Feedback</span>
          </div>
          <div className="owner-feedback__stat-card">
            <span className="owner-feedback__stat-value">{stats.averageRating || 0}</span>
            <span className="owner-feedback__stat-label">Average Rating</span>
          </div>
          <div className="owner-feedback__stat-card">
            <span className="owner-feedback__stat-value">{stats.withReply || 0}</span>
            <span className="owner-feedback__stat-label">Replied</span>
          </div>
          <div className="owner-feedback__stat-card">
            <span className="owner-feedback__stat-value">{stats.withoutReply || 0}</span>
            <span className="owner-feedback__stat-label">Pending Reply</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="owner-feedback__filters">
        <form onSubmit={handleSearch} className="owner-feedback__search">
          <input
            type="text"
            placeholder="Search by customer name or comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="owner-feedback__search-input"
          />
          <button type="submit" className="owner-feedback__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={ratingFilter}
          onChange={handleRatingFilterChange}
          className="owner-feedback__filter-select"
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
          className="owner-feedback__filter-select"
        >
          <option value="all">All Feedback</option>
          <option value="replied">Replied</option>
          <option value="pending">Pending Reply</option>
        </select>

        {(searchQuery || ratingFilter !== 'all' || replyFilter !== 'all') && (
          <button onClick={clearFilters} className="owner-feedback__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="owner-feedback__results-info">
        Showing {feedback.length} of {totalItems} feedback entries
      </div>

      {/* Loading State */}
      {loading && (
        <div className="owner-feedback__loading">
          <div className="owner-feedback__spinner"></div>
          <p>Loading feedback...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="owner-feedback__error">
          <span className="owner-feedback__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchFeedback} className="owner-feedback__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Feedback List */}
      {!loading && !error && (
        <>
          {feedback.length === 0 ? (
            <div className="owner-feedback__empty">
              <span className="owner-feedback__empty-icon">💬</span>
              <h3>No feedback found</h3>
              <p>When customers leave feedback, they'll appear here.</p>
            </div>
          ) : (
            <>
              <div className="owner-feedback__list">
                {feedback.map(item => (
                  <div key={item.id} className="owner-feedback__card">
                    <div className="owner-feedback__card-header">
                      <div className="owner-feedback__customer-info">
                        <div className="owner-feedback__customer-avatar">
                          {item.customerName?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="owner-feedback__customer-name">
                            {item.customerName}
                          </h3>
                          <div className="owner-feedback__customer-rating">
                            {getStarRating(item.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="owner-feedback__date">{item.timeAgo}</span>
                    </div>

                    <div className="owner-feedback__card-body">
                      <div className="owner-feedback__detailed-ratings">
                        {item.serviceRating && (
                          <span className="owner-feedback__detail-rating">
                            Service: {item.serviceRating}/5
                          </span>
                        )}
                        {item.foodRating && (
                          <span className="owner-feedback__detail-rating">
                            Food: {item.foodRating}/5
                          </span>
                        )}
                        {item.cleanlinessRating && (
                          <span className="owner-feedback__detail-rating">
                            Cleanliness: {item.cleanlinessRating}/5
                          </span>
                        )}
                        {item.valueRating && (
                          <span className="owner-feedback__detail-rating">
                            Value: {item.valueRating}/5
                          </span>
                        )}
                      </div>

                      <p className="owner-feedback__comments">{item.comments}</p>

                      {item.wouldRecommend && (
                        <div className="owner-feedback__recommend">
                          <span>✅ Would recommend</span>
                        </div>
                      )}

                      {item.billNumber && (
                        <div className="owner-feedback__bill">
                          <span>🧾 Bill #{item.billNumber}</span>
                        </div>
                      )}

                      {item.adminReply && (
                        <div className="owner-feedback__reply">
                          <div className="owner-feedback__reply-header">
                            <span className="owner-feedback__reply-icon">💬</span>
                            <span className="owner-feedback__reply-date">
                              Your reply • {item.repliedAt}
                            </span>
                          </div>
                          <p className="owner-feedback__reply-text">{item.adminReply}</p>
                        </div>
                      )}
                    </div>

                    <div className="owner-feedback__card-footer">
                      {!item.adminReply && (
                        <button
                          onClick={() => handleReplyClick(item)}
                          className="owner-feedback__reply-button"
                        >
                          Reply to Feedback
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="owner-feedback__pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="owner-feedback__pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="owner-feedback__pagination-info">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="owner-feedback__pagination-btn"
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
        <div className="owner-feedback__modal-overlay">
          <div className="owner-feedback__modal">
            <div className="owner-feedback__modal-header">
              <h2 className="owner-feedback__modal-title">
                Reply to Feedback
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="owner-feedback__modal-close"
              >
                ×
              </button>
            </div>

            <div className="owner-feedback__modal-content">
              <div className="owner-feedback__modal-feedback">
                <div className="owner-feedback__modal-customer">
                  <strong>{selectedFeedback.customerName}</strong> wrote:
                </div>
                <div className="owner-feedback__modal-rating">
                  {getStarRating(selectedFeedback.rating)}
                </div>
                <p className="owner-feedback__modal-comments">
                  "{selectedFeedback.comments}"
                </p>
              </div>

              <div className="owner-feedback__modal-reply">
                <label className="owner-feedback__modal-label">
                  Your Reply
                </label>
                <textarea
                  className="owner-feedback__modal-textarea"
                  rows="5"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply to this customer..."
                ></textarea>
              </div>

              <div className="owner-feedback__modal-actions">
                <button
                  onClick={() => setShowModal(false)}
                  className="owner-feedback__modal-button owner-feedback__modal-button--secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="owner-feedback__modal-button owner-feedback__modal-button--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFeedback;