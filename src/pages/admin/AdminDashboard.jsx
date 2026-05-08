import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import franchiseService from '../../services/franchiseService';
import applicationService from '../../services/applicationService';
import feedbackService from '../../services/feedbackService';
import { apiMethods } from '../../services/api';
import './AdminDashboard.css';

// ======================================================
// Admin Dashboard Page Component
// Super admin dashboard with overview statistics and management tools
// ======================================================

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalFranchises: 0,
    activeFranchises: 0,
    pendingApplications: 0,
    totalApplications: 0,
    totalFeedback: 0,
    averageRating: 0,
    totalJobs: 0,
    openJobs: 0,
    totalUsers: 0,
    applicationsThisWeek: 0,   
    newFeedbackToday: 0,        
    pendingReplies: 0 
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [franchiseStats, setFranchiseStats] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [applicationTrends, setApplicationTrends] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        franchisesRes,
        applicationsRes,
        feedbackRes,
        statsRes,
        jobsRes,      
        usersRes
      ] = await Promise.all([
        franchiseService.getAllFranchises(0, 100),
        applicationService.getAllApplications(0, 5, 'appliedDate', 'DESC'),
        feedbackService.getAllFeedback(0, 5, 'submittedAt', 'DESC'),
        applicationService.getApplicationStatistics(),
        apiMethods.jobs.getAll(0, 100, 'postedDate', 'DESC'),      
        apiMethods.admin.getUsers(0, 100, 'id', 'ASC')
      ]);

      // Process statistics - Handle both array and object responses
      const franchises = Array.isArray(franchisesRes) ? franchisesRes : (franchisesRes.content || []);
      const applications = Array.isArray(applicationsRes) ? applicationsRes : (applicationsRes.content || []);
      const feedbacks = Array.isArray(feedbackRes) ? feedbackRes : (feedbackRes.content || []);
      const recentApplications = applications.slice(0, 5);
      const recentFeedbacks = feedbacks.slice(0, 4);
      const statistics = statsRes || {};
      // Process jobs
      const jobs = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.content || []);
      const totalJobs = jobs.length;
      const openJobs = jobs.filter(j => j.status === 'OPEN').length;
      // Process users
      const users = Array.isArray(usersRes) ? usersRes : (usersRes?.content || []);
      const totalUsers = users.length;

      // Calculate stats
      const activeFranchises = franchises.filter(f => f.status === 'ACTIVE').length;
      const pendingApps = applications.filter(a => a.status === 'NEW').length;
      // Calculate applications this week
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const appsThisWeek = applications.filter(app => new Date(app.appliedDate) >= oneWeekAgo).length;

// Calculate new feedback today
const today = new Date().toDateString();
const newFeedbackToday = feedbacks.filter(f => new Date(f.submittedAt).toDateString() === today).length;

// Calculate pending replies (feedback without admin reply)
const pendingReplies = feedbacks.filter(f => !f.adminReply).length;
      // FIXED: Convert rating enum to numeric value
      const getRatingValue = (rating) => {
        const values = {
          'ONE_STAR': 1,
          'TWO_STARS': 2,
          'THREE_STARS': 3,
          'FOUR_STARS': 4,
          'FIVE_STARS': 5
        };
        return values[rating] || 0;
      };

      const avgRating = feedbacks.length > 0 
        ? feedbacks.reduce((acc, f) => acc + getRatingValue(f.rating), 0) / feedbacks.length 
        : 0;

      setStats({
        totalFranchises: franchises.length,
        activeFranchises,
        pendingApplications: pendingApps,
        totalApplications: applications.length,
        totalFeedback: feedbacks.length,
        averageRating: avgRating.toFixed(1),
        totalJobs: totalJobs, // This should come from jobs API
        openJobs: openJobs, // This should come from jobs API
        totalUsers: totalUsers -1, // This should come from users API
        applicationsThisWeek: appsThisWeek,      
        newFeedbackToday: newFeedbackToday,      
        pendingReplies: pendingReplies         
      });

      setRecentApplications(recentApplications);
      setRecentFeedback(recentFeedbacks);
      
      setFranchiseStats(statistics.byStatus || {});
      setApplicationTrends(statistics.byMonth || []);

    } catch (err) {
      setError('Failed to load dashboard data. Please refresh the page.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '🏪',
      title: 'Add Franchise',
      description: 'Create a new franchise location',
      link: '/admin/franchises/create',
      color: 'primary'
    },
    {
      icon: '🍔',
      title: 'Update Menu',
      description: 'Add or modify menu items',
      link: '/admin/menu',
      color: 'success'
    },
    {
      icon: '📝',
      title: 'Review Applications',
      description: `${stats.pendingApplications} pending reviews`,
      link: '/admin/applications?status=NEW',
      color: 'warning'
    },
    {
      icon: '👥',
      title: 'Manage Users',
      description: 'Create or update user accounts',
      link: '/admin/users',
      color: 'info'
    }
  ];

  const statCards = [
    {
      title: 'Total Franchises',
      value: stats.totalFranchises,
      icon: '🏪',
      trend: '+5 this month',
      color: 'primary',
      link: '/admin/franchises'
    },
    {
      title: 'Active Franchises',
      value: stats.activeFranchises,
      icon: '✅',
      trend: `${((stats.activeFranchises / stats.totalFranchises) * 100).toFixed(0)}% active`,
      color: 'success',
      link: '/admin/franchises?status=ACTIVE'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: '⏳',
      trend: 'Need review',
      color: 'warning',
      link: '/admin/applications?status=NEW'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: '📄',
      trend: 'All time',
      color: 'info',
      link: '/admin/applications'
    },
    {
      title: 'Customer Feedback',
      value: stats.totalFeedback,
      icon: '💬',
      trend: `Replied. ${stats.totalFeedback - stats.pendingReplies || 0} `,
      color: 'secondary',
      link: '/admin/feedback'
    },
    {
      title: 'Open Jobs',
      value: stats.openJobs,
      icon: '💼',
      trend: `${stats.totalJobs} total positions`,
      color: 'primary',
      link: '/admin/jobs'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      trend: '+5 this week',
      color: 'success',
      link: '/admin/users'
    },
    {
      title: 'Avg. Rating',
      value: stats.averageRating,
      icon: '⭐',
      trend: 'out of 5',
      color: 'warning',
      suffix: '/5',
      link: '/admin/feedback'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'NEW': { class: 'badge--info', text: 'New' },
      'UNDER_REVIEW': { class: 'badge--warning', text: 'Under Review' },
      'INTERVIEW_SCHEDULED': { class: 'badge--primary', text: 'Interview' },
      'APPROVED': { class: 'badge--success', text: 'Approved' },
      'REJECTED': { class: 'badge--error', text: 'Rejected' }
    };
    return badges[status] || { class: 'badge--default', text: status };
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__error">
          <span className="admin-dashboard__error-icon">😕</span>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="admin-dashboard__error-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Welcome back, {user?.firstName}!</h1>
          <p className="admin-dashboard__subtitle">
            Here's what's happening with your franchises today.
          </p>
        </div>
        <div className="admin-dashboard__date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard__quick-actions">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`admin-dashboard__quick-action admin-dashboard__quick-action--${action.color}`}
          >
            <span className="admin-dashboard__quick-action-icon">{action.icon}</span>
            <div className="admin-dashboard__quick-action-content">
              <h3 className="admin-dashboard__quick-action-title">{action.title}</h3>
              <p className="admin-dashboard__quick-action-description">{action.description}</p>
            </div>
            <span className="admin-dashboard__quick-action-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* Statistics Grid */}
      <div className="admin-dashboard__stats-grid">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`admin-dashboard__stat-card admin-dashboard__stat-card--${stat.color}`}
          >
            <div className="admin-dashboard__stat-header">
              <span className="admin-dashboard__stat-icon">{stat.icon}</span>
              <span className="admin-dashboard__stat-trend">{stat.trend}</span>
            </div>
            <div className="admin-dashboard__stat-content">
              <h3 className="admin-dashboard__stat-title">{stat.title}</h3>
              <p className="admin-dashboard__stat-value">
                {stat.value}{stat.suffix}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="admin-dashboard__activity-grid">
        {/* Recent Applications */}
        <div className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">
              <span className="admin-dashboard__card-icon">📝</span>
              Recent Franchise Applications
            </h2>
            <Link to="/admin/applications" className="admin-dashboard__card-link">
              View All →
            </Link>
          </div>
          <div className="admin-dashboard__card-content">
            {recentApplications.length > 0 ? (
              <div className="admin-dashboard__list">
                {recentApplications.map(app => (
                  <Link
                    key={app.id}
                    to={"/admin/applications"}
                    className="admin-dashboard__list-item"
                  >
                    <div className="admin-dashboard__list-item-avatar">
                      {app.fullName?.charAt(0)}
                    </div>
                    <div className="admin-dashboard__list-item-content">
                      <h4 className="admin-dashboard__list-item-title">{app.fullName}</h4>
                      <p className="admin-dashboard__list-item-subtitle">
                        {app.preferredCity} • ₹{(app.liquidCapital / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <span className={`admin-dashboard__badge ${getStatusBadge(app.status).class}`}>
                      {getStatusBadge(app.status).text}
                    </span>
                    <span className="admin-dashboard__list-item-date">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="admin-dashboard__empty">No recent applications</p>
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">
              <span className="admin-dashboard__card-icon">💬</span>
              Recent Customer Feedback
            </h2>
            <Link to="/admin/feedback" className="admin-dashboard__card-link">
              View All →
            </Link>
          </div>
          <div className="admin-dashboard__card-content">
            {recentFeedback.length > 0 ? (
              <div className="admin-dashboard__list">
                {recentFeedback.map(feedback => (
                  <Link
                    key={feedback.id}
                    to={"/admin/feedback"}
                    className="admin-dashboard__list-item"
                  >
                    <div className="admin-dashboard__list-item-avatar">
                      {feedback.customerName?.charAt(0)}
                    </div>
                    <div className="admin-dashboard__list-item-content">
                      <h4 className="admin-dashboard__list-item-title">{feedback.customerName}</h4>
                      <p className="admin-dashboard__list-item-subtitle">
                        {feedback.franchiseName} • {feedback.ratingDisplay?.label}
                      </p>
                      <p className="admin-dashboard__list-item-text">{feedback.comments?.substring(0, 60)}...</p>
                    </div>
                    {!feedback.adminReply && (
                      <span className="admin-dashboard__badge badge--warning">Pending Reply</span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="admin-dashboard__empty">No recent feedback</p>
            )}
          </div>
        </div>

        {/* Franchise Status Distribution */}
        <div className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">
              <span className="admin-dashboard__card-icon">📊</span>
              Franchise Status
            </h2>
          </div>
          <div className="admin-dashboard__card-content">
            <div className="admin-dashboard__status-list">
              {Object.entries(franchiseStats).map(([status, count]) => (
                <div key={status} className="admin-dashboard__status-item">
                  <span className="admin-dashboard__status-label">{status}</span>
                  <div className="admin-dashboard__status-bar">
                    <div 
                      className="admin-dashboard__status-fill"
                      style={{ 
                        width: `${(count / stats.totalFranchises) * 100}%`,
                        backgroundColor: `var(--color-${status === 'ACTIVE' ? 'success' : status === 'PENDING' ? 'warning' : 'error'})`
                      }}
                    ></div>
                  </div>
                  <span className="admin-dashboard__status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-dashboard__card">
          <div className="admin-dashboard__card-header">
            <h2 className="admin-dashboard__card-title">
              <span className="admin-dashboard__card-icon">⚡</span>
              Quick Stats
            </h2>
          </div>
          <div className="admin-dashboard__card-content">
            <div className="admin-dashboard__quick-stats">
              <div className="admin-dashboard__quick-stat">
                <span className="admin-dashboard__quick-stat-label">Applications this week</span>
                <span className="admin-dashboard__quick-stat-value">{stats.applicationsThisWeek || 0}</span>
              </div>
              <div className="admin-dashboard__quick-stat">
                <span className="admin-dashboard__quick-stat-label">New feedback today</span>
                <span className="admin-dashboard__quick-stat-value">{stats.newFeedbackToday || 0}</span>
              </div>
              <div className="admin-dashboard__quick-stat">
                <span className="admin-dashboard__quick-stat-label">Pending reviews</span>
                <span className="admin-dashboard__quick-stat-value">{stats.pendingApplications}</span>
              </div>
              <div className="admin-dashboard__quick-stat">
                <span className="admin-dashboard__quick-stat-label">Unread messages</span>
                <span className="admin-dashboard__quick-stat-value">{stats.pendingReplies || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;