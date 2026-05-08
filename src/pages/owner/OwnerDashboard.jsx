import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ownerService from '../../services/ownerService';
import './OwnerDashboard.css';

// ======================================================
// Owner Dashboard Page Component
// Franchise owner's main dashboard with overview statistics
// ======================================================

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    franchise: null,
    profile: null,
    stats: {
      totalJobs: 0,
      openJobs: 0,
      totalApplications: 0,
      newApplications: 0,
      totalFeedback: 0,
      averageRating: 0
    },
    recentJobs: [],
    recentFeedback: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ownerService.getDashboard();
      
      // Format recent jobs with proper display data
      const formattedRecentJobs = (data.recentJobs || []).map(job => ({
        ...job,
        typeDisplay: {
          icon: job.jobType === 'FULL_TIME' ? '⏰' : 
                job.jobType === 'PART_TIME' ? '⚡' : 
                job.jobType === 'CONTRACT' ? '📝' : '🎓',
          label: job.jobType === 'FULL_TIME' ? 'Full Time' :
                 job.jobType === 'PART_TIME' ? 'Part Time' :
                 job.jobType === 'CONTRACT' ? 'Contract' : 'Internship'
        },
        applicationsCount: job.applicationsCount || 0
      }));
      
      // Format recent feedback with proper display data
      const formattedRecentFeedback = (data.recentFeedback || []).map(feedback => ({
        ...feedback,
        ratingDisplay: {
          label: `${feedback.ratingValue || 0} Stars`
        },
        timeAgo: (() => {
          const date = new Date(feedback.submittedAt);
          const now = new Date();
          const diffMs = now - date;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);
          
          if (diffMins < 60) return `${diffMins} minutes ago`;
          if (diffHours < 24) return `${diffHours} hours ago`;
          if (diffDays < 7) return `${diffDays} days ago`;
          return date.toLocaleDateString();
        })(),
        stars: '⭐'.repeat(feedback.ratingValue || 0) + '☆'.repeat(5 - (feedback.ratingValue || 0))
      }));
      
      // Set formatted data
      setDashboardData({
        ...data,
        recentJobs: formattedRecentJobs,
        recentFeedback: formattedRecentFeedback
      });
      
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh the page.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '➕',
      title: 'Post New Job',
      description: 'Create a new job opening',
      link: '/owner/jobs/create',
      color: 'primary'
    },
    {
      icon: '📋',
      title: 'View Applications',
      description: `${dashboardData.stats.newApplications} new applications`,
      link: '/owner/jobs/applications',
      color: 'success'
    },
    {
      icon: '💬',
      title: 'Reply to Feedback',
      description: 'Respond to customer reviews',
      link: '/owner/feedback',
      color: 'warning'
    },
    {
      icon: '🍔',
      title: 'View Menu',
      description: 'Manage menu items',
      link: '/owner/menu',
      color: 'info'
    }
  ];

  const statCards = [
    {
      title: 'Total Jobs',
      value: dashboardData.stats.totalJobs,
      icon: '💼',
      trend: `${dashboardData.stats.openJobs} open`,
      color: 'primary',
      link: '/owner/jobs'
    },
    {
      title: 'Total Applications',
      value: dashboardData.stats.totalApplications,
      icon: '📝',
      trend: `${dashboardData.stats.newApplications} new`,
      color: 'success',
      link: '/owner/jobs/applications'
    },
    {
      title: 'Customer Feedback',
      value: dashboardData.stats.totalFeedback,
      icon: '💬',
      trend: `Avg. ${dashboardData.stats.averageRating} ⭐`,
      color: 'warning',
      link: '/owner/feedback'
    },
    {
      title: 'Open Jobs',
      value: dashboardData.stats.openJobs,
      icon: '✅',
      trend: 'Currently hiring',
      color: 'info',
      link: '/owner/jobs'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'OPEN': { class: 'badge--success', text: 'Open' },
      'CLOSED': { class: 'badge--error', text: 'Closed' },
      'ON_HOLD': { class: 'badge--warning', text: 'On Hold' }
    };
    return badges[status] || { class: 'badge--default', text: status };
  };

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="owner-dashboard__loading">
          <div className="owner-dashboard__spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dashboard">
        <div className="owner-dashboard__error">
          <span className="owner-dashboard__error-icon">😕</span>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="owner-dashboard__error-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ADD THIS HELPER FUNCTION
const getStatusDisplay = (status) => {
  const statusMap = {
    'ACTIVE': { label: 'Active', color: 'success', icon: '✅' },
    'UNDER_REVIEW': { label: 'Under Review', color: 'warning', icon: '⏳' },
    'PROBATION': { label: 'Probation', color: 'warning', icon: '⚠️' },
    'SUSPENDED': { label: 'Suspended', color: 'error', icon: '⛔' },
    'CLOSED': { label: 'Closed', color: 'error', icon: '❌' },
    'PENDING_APPROVAL': { label: 'Pending Approval', color: 'info', icon: '📝' }
  };
  
  return statusMap[status] || { label: status, color: 'default', icon: '❓' };
};

  return (
    <div className="owner-dashboard">
      {/* Welcome Header */}
      <div className="owner-dashboard__header">
        <div>
          <h1 className="owner-dashboard__title">
            Welcome back, {dashboardData.profile?.firstName || 'Owner'}!
          </h1>
          <p className="owner-dashboard__subtitle">
            {dashboardData.franchise?.franchiseName} • {dashboardData.franchise?.city}
          </p>
        </div>
        <div className="owner-dashboard__date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="owner-dashboard__quick-actions">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`owner-dashboard__quick-action owner-dashboard__quick-action--${action.color}`}
          >
            <span className="owner-dashboard__quick-action-icon">{action.icon}</span>
            <div className="owner-dashboard__quick-action-content">
              <h3 className="owner-dashboard__quick-action-title">{action.title}</h3>
              <p className="owner-dashboard__quick-action-description">{action.description}</p>
            </div>
            <span className="owner-dashboard__quick-action-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="owner-dashboard__stats-grid">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`owner-dashboard__stat-card owner-dashboard__stat-card--${stat.color}`}
          >
            <div className="owner-dashboard__stat-header">
              <span className="owner-dashboard__stat-icon">{stat.icon}</span>
              <span className="owner-dashboard__stat-trend">{stat.trend}</span>
            </div>
            <div className="owner-dashboard__stat-content">
              <h3 className="owner-dashboard__stat-title">{stat.title}</h3>
              <p className="owner-dashboard__stat-value">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="owner-dashboard__activity-grid">
        {/* Recent Jobs */}
        <div className="owner-dashboard__card">
          <div className="owner-dashboard__card-header">
            <h2 className="owner-dashboard__card-title">
              <span className="owner-dashboard__card-icon">💼</span>
              Recent Job Postings
            </h2>
            <Link to="/owner/jobs" className="owner-dashboard__card-link">
              View All →
            </Link>
          </div>
          <div className="owner-dashboard__card-content">
            {dashboardData.recentJobs.length > 0 ? (
              <div className="owner-dashboard__list">
                {dashboardData.recentJobs.map(job => (
                  <Link
                    key={job.id}
                    to={`/owner/jobs/${job.id}/edit`}
                    className="owner-dashboard__list-item"
                  >
                    <div className="owner-dashboard__list-item-icon">
                      {job.typeDisplay?.icon}
                    </div>
                    <div className="owner-dashboard__list-item-content">
                      <h4 className="owner-dashboard__list-item-title">{job.title}</h4>
                      <p className="owner-dashboard__list-item-subtitle">
                        {job.location} • {job.applicationsCount || 0} applications
                      </p>
                    </div>
                    <span className={`owner-dashboard__badge ${getStatusBadge(job.status).class}`}>
                      {getStatusBadge(job.status).text}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="owner-dashboard__empty">
                <p>No jobs posted yet</p>
                <Link to="/owner/jobs/create" className="owner-dashboard__empty-link">
                  Post your first job →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="owner-dashboard__card">
          <div className="owner-dashboard__card-header">
            <h2 className="owner-dashboard__card-title">
              <span className="owner-dashboard__card-icon">💬</span>
              Recent Customer Feedback
            </h2>
            <Link to="/owner/feedback" className="owner-dashboard__card-link">
              View All →
            </Link>
          </div>
          <div className="owner-dashboard__card-content">
            {dashboardData.recentFeedback.length > 0 ? (
              <div className="owner-dashboard__list">
                {dashboardData.recentFeedback.map(feedback => (
                  <Link
                    key={feedback.id}
                    to={`/owner/feedback`}
                    className="owner-dashboard__list-item"
                  >
                    <div className="owner-dashboard__list-item-avatar">
                      {feedback.customerName?.charAt(0)}
                    </div>
                    <div className="owner-dashboard__list-item-content">
                      <h4 className="owner-dashboard__list-item-title">{feedback.customerName}</h4>
                      <p className="owner-dashboard__list-item-subtitle">
                        Rating: {(() => {
    const ratingMap = {
      'ONE_STAR': 1,
      'TWO_STARS': 2,
      'THREE_STARS': 3,
      'FOUR_STARS': 4,
      'FIVE_STARS': 5
    };
    const ratingValue = ratingMap[feedback.rating] || feedback.ratingValue || 0;
    return `${ratingValue} Stars`;
  })()} • {feedback.timeAgo}
                      </p>
                      <p className="owner-dashboard__list-item-text">
                        {feedback.comments?.substring(0, 60)}...
                      </p>
                    </div>
                    {!feedback.adminReply && (
                      <span className="owner-dashboard__badge badge--warning">New</span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="owner-dashboard__empty">
                <p>No feedback yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="owner-dashboard__card">
          <div className="owner-dashboard__card-header">
            <h2 className="owner-dashboard__card-title">
              <span className="owner-dashboard__card-icon">⚡</span>
              Quick Stats
            </h2>
          </div>
          <div className="owner-dashboard__card-content">
            <div className="owner-dashboard__quick-stats">
  <div className="owner-dashboard__quick-stat">
    <span className="owner-dashboard__quick-stat-label">Total Jobs</span>
    <span className="owner-dashboard__quick-stat-value">{dashboardData.stats.totalJobs}</span>
  </div>
  <div className="owner-dashboard__quick-stat">
    <span className="owner-dashboard__quick-stat-label">Pending replies</span>
    <span className="owner-dashboard__quick-stat-value">
      {dashboardData.stats.totalFeedback - dashboardData.recentFeedback.filter(f => f.adminReply).length}
    </span>
  </div>
  <div className="owner-dashboard__quick-stat">
    <span className="owner-dashboard__quick-stat-label">Open Jobs</span>
    <span className="owner-dashboard__quick-stat-value">{dashboardData.stats.openJobs}</span>
  </div>
  <div className="owner-dashboard__quick-stat">
    <span className="owner-dashboard__quick-stat-label">New Applications</span>
    <span className="owner-dashboard__quick-stat-value">{dashboardData.stats.newApplications}</span>
  </div>
</div>
          </div>
        </div>

        {/* Franchise Info */}
        <div className="owner-dashboard__card">
          <div className="owner-dashboard__card-header">
            <h2 className="owner-dashboard__card-title">
              <span className="owner-dashboard__card-icon">🏪</span>
              Your Franchise
            </h2>
            <Link to="/owner/franchise" className="owner-dashboard__card-link">
              Manage →
            </Link>
          </div>
          <div className="owner-dashboard__card-content">
            {dashboardData.franchise && (
              <div className="owner-dashboard__franchise-info">
                <div className="owner-dashboard__franchise-field">
                  <span className="owner-dashboard__franchise-label">Name:</span>
                  <span className="owner-dashboard__franchise-value">{dashboardData.franchise.franchiseName}</span>
                </div>
                <div className="owner-dashboard__franchise-field">
                  <span className="owner-dashboard__franchise-label">Location:</span>
                  <span className="owner-dashboard__franchise-value">{dashboardData.franchise.city}, {dashboardData.franchise.state}</span>
                </div>
                <div className="owner-dashboard__franchise-field">
                  <span className="owner-dashboard__franchise-label">Phone:</span>
                  <span className="owner-dashboard__franchise-value">{dashboardData.franchise.phone}</span>
                </div>
                <div className="owner-dashboard__franchise-field">
                  <span className="owner-dashboard__franchise-label">Email:</span>
                  <span className="owner-dashboard__franchise-value">{dashboardData.franchise.email}</span>
                </div>
                <div className="owner-dashboard__franchise-field">
  <span className="owner-dashboard__franchise-label">Status:</span>
  <span className={`owner-dashboard__franchise-status owner-dashboard__franchise-status--${dashboardData.franchise.status?.toLowerCase()}`}>
    {dashboardData.franchise.status}
  </span>
</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;