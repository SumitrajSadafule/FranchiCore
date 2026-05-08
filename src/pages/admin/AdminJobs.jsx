import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import jobService from '../../services/jobService';
import './AdminJobs.css';

// ======================================================
// Admin Jobs Page Component
// Super admin interface for viewing and managing all jobs across all franchises
// Allows filtering, sorting, and viewing job details
// ======================================================

const AdminJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
    onHoldJobs: 0,
    totalApplications: 0
  });
   const [showJobModal, setShowJobModal] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);
  // Add this state and effect at the top of your component
const [sidebarWidth, setSidebarWidth] = useState(320);
// Add this function to handle opening the modal
const handleViewJobDetails = (job) => {
  setSelectedJob(job);
  setShowJobModal(true);
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

// Add this function to close the modal
const handleCloseModal = () => {
  setShowJobModal(false);
  setSelectedJob(null);
  document.body.style.overflow = 'auto';
};
useEffect(() => {
  // Listen for sidebar toggle events
  const handleSidebarToggle = () => {
    // Small delay to let CSS transition complete
    setTimeout(() => {
      const sidebar = document.querySelector('.admin-layout__sidebar');
      if (sidebar) {
        const width = sidebar.offsetWidth;
        setSidebarWidth(width);
        // Force table container to recalculate
        const tableContainer = document.querySelector('.admin-jobs__table-container');
        if (tableContainer) {
          tableContainer.style.overflowX = 'auto';
        }
      }
    }, 300);
  };

  window.addEventListener('sidebarToggle', handleSidebarToggle);
  
  // Initial check
  const sidebar = document.querySelector('.admin-layout__sidebar');
  if (sidebar) {
    setSidebarWidth(sidebar.offsetWidth);
  }

  return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
}, []);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [franchiseFilter, setFranchiseFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Data for filters
  const [locations, setLocations] = useState([]);
  const [franchises, setFranchises] = useState([]);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobs();
    fetchFilterData();
  }, [currentPage, statusFilter, typeFilter, locationFilter, franchiseFilter, searchQuery]);

const fetchJobs = async () => {
  setLoading(true);
  setError(null);

  try {
    let response;
    
    if (searchQuery) {
      // If searching, use search endpoint
      response = await jobService.searchJobs(
        searchQuery,
        currentPage,
        itemsPerPage,
        'postedDate',
        'DESC'
      );
    } else {
      // Otherwise use getAll with filters
      response = await jobService.getAllJobs(
        currentPage,
        itemsPerPage,
        'postedDate',
        'DESC'
      );
    }

    // ← ← ← FIX STARTS HERE ← ← ←
    // Handle both array and paginated responses
    let jobsData = [];
    let totalElements = 0;
    let totalPagesCount = 0;

    if (Array.isArray(response)) {
      // API returns array directly
      console.log('API returned array with', response.length, 'jobs');
      jobsData = response;
      totalElements = jobsData.length;
      totalPagesCount = Math.ceil(jobsData.length / itemsPerPage);
    } else if (response && response.content) {
      // Paginated response format
      console.log('API returned paginated response');
      jobsData = response.content;
      totalElements = response.totalElements || jobsData.length;
      totalPagesCount = response.totalPages || 1;
    } else {
      // Fallback
      console.log('API returned unknown format:', response);
      jobsData = response || [];
      totalElements = jobsData.length;
      totalPagesCount = 1;
    }
    // ← ← ← FIX ENDS HERE ← ← ←

    // Apply additional filters client-side if needed
    
    let filteredData = [...jobsData];
    
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(job => job.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filteredData = filteredData.filter(job => job.jobType === typeFilter);
    }
    
    if (locationFilter !== 'all') {
      filteredData = filteredData.filter(job => job.location === locationFilter);
    }
    
    if (franchiseFilter !== 'all') {
      filteredData = filteredData.filter(job => job.franchiseId === parseInt(franchiseFilter));
    }

    const formattedJobs = jobService.formatJobs(filteredData);
    setJobs(formattedJobs);
    setFilteredJobs(formattedJobs);
    
    // Calculate stats
    const openCount = formattedJobs.filter(j => j.status === 'OPEN').length;
    const closedCount = formattedJobs.filter(j => j.status === 'CLOSED').length;
    const onHoldCount = formattedJobs.filter(j => j.status === 'ON_HOLD').length;
    
    setStats({
      totalJobs: totalElements,
      openJobs: openCount,
      closedJobs: closedCount,
      onHoldJobs: onHoldCount,
      totalApplications: formattedJobs.reduce((acc, job) => acc + (job.applicationsCount || 0), 0)
    });
    
    setTotalPages(totalPagesCount);
    setTotalItems(totalElements);
  } catch (err) {
    setError('Failed to load jobs. Please try again.');
    console.error('Error fetching jobs:', err);
  } finally {
    setLoading(false);
  }
};

  const fetchFilterData = async () => {
  try {
    console.log('🔄 Fetching filter data...');
    
    // Fetch all jobs to extract filter options (get more items)
    const response = await jobService.getAllJobs(0, 1000, 'postedDate', 'DESC');
    
    console.log('Filter data response:', response);
    
    // Handle both array and paginated responses
    let jobs = [];
    if (Array.isArray(response)) {
      jobs = response;
      console.log('Response is array, length:', jobs.length);
    } else if (response && response.content) {
      jobs = response.content;
      console.log('Response has content, length:', jobs.length);
    } else {
      jobs = response || [];
      console.log('Response fallback, length:', jobs.length);
    }
    
    // 🔴 FIX: Extract unique locations (case insensitive, remove duplicates)
    const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))].sort();
    console.log('Unique locations found:', uniqueLocations);
    setLocations(uniqueLocations);
    
    // 🔴 FIX: Extract unique franchises
    const uniqueFranchises = jobs
      .filter(job => job.franchiseId && job.franchiseName)
      .map(job => ({ 
        id: job.franchiseId, 
        name: job.franchiseName 
      }))
      .filter((value, index, self) => 
        index === self.findIndex(f => f.id === value.id)
      );
    console.log('Unique franchises found:', uniqueFranchises);
    setFranchises(uniqueFranchises);
    
  } catch (err) {
    console.error('Error fetching filter data:', err);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchJobs();
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
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
    setStatusFilter('all');
    setTypeFilter('all');
    setLocationFilter('all');
    setFranchiseFilter('all');
    setCurrentPage(0);
  };

  // const handleDeleteJob = async (jobId) => {
  //   if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
  //     return;
  //   }

  //   try {
  //     await jobService.deleteJob(jobId);
  //     await fetchJobs();
  //   } catch (err) {
  //     alert('Failed to delete job. Please try again.');
  //     console.error('Error deleting job:', err);
  //   }
  // };

  // const handleToggleJobStatus = async (jobId, currentStatus) => {
  //   const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    
  //   if (!window.confirm(`Are you sure you want to ${newStatus === 'OPEN' ? 'open' : 'close'} this job?`)) {
  //     return;
  //   }

  //   try {
  //     if (newStatus === 'CLOSED') {
  //       await jobService.closeJob(jobId);
  //     } else {
  //       // Reopen job (you might need to implement this)
  //       alert('Reopen functionality - would call API to update status');
  //       // await jobService.updateJob(jobId, { status: 'OPEN' });
  //     }
  //     await fetchJobs();
  //   } catch (err) {
  //     alert('Failed to update job status. Please try again.');
  //     console.error('Error updating job:', err);
  //   }
  // };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'OPEN': 'badge--success',
      'CLOSED': 'badge--error',
      'ON_HOLD': 'badge--warning'
    };
    return classes[status] || 'badge--default';
  };

  const getJobTypeIcon = (type) => {
    const icons = {
      'FULL_TIME': '⏰',
      'PART_TIME': '⚡',
      'CONTRACT': '📝',
      'INTERNSHIP': '🎓'
    };
    return icons[type] || '💼';
  };

  const getJobTypeLabel = (type) => {
    const labels = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'INTERNSHIP': 'Internship'
    };
    return labels[type] || type;
  };

  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'OPEN', label: 'Open' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'ON_HOLD', label: 'On Hold' }
  ];

  return (
    <div className="admin-jobs">
      {/* Header */}
      <div className="admin-jobs__header">
        <div>
          <h1 className="admin-jobs__title">Jobs Management</h1>
          <p className="admin-jobs__subtitle">
            View and manage all job postings across all franchises
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-jobs__stats">
        <div className="admin-jobs__stat-card">
          <span className="admin-jobs__stat-value">{stats.totalJobs}</span>
          <span className="admin-jobs__stat-label">Total Jobs</span>
        </div>
        <div className="admin-jobs__stat-card admin-jobs__stat-card--success">
          <span className="admin-jobs__stat-value">{stats.openJobs}</span>
          <span className="admin-jobs__stat-label">Open</span>
        </div>
        <div className="admin-jobs__stat-card admin-jobs__stat-card--warning">
          <span className="admin-jobs__stat-value">{stats.onHoldJobs}</span>
          <span className="admin-jobs__stat-label">On Hold</span>
        </div>
        <div className="admin-jobs__stat-card admin-jobs__stat-card--error">
          <span className="admin-jobs__stat-value">{stats.closedJobs}</span>
          <span className="admin-jobs__stat-label">Closed</span>
        </div>
        <div className="admin-jobs__stat-card admin-jobs__stat-card--info">
          <span className="admin-jobs__stat-value">{stats.totalApplications}</span>
          <span className="admin-jobs__stat-label">Applications</span>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-jobs__filters">
        <form onSubmit={handleSearch} className="admin-jobs__search">
          <input
            type="text"
            placeholder="Search jobs by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-jobs__search-input"
          />
          <button type="submit" className="admin-jobs__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="admin-jobs__filter-select"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={handleTypeFilterChange}
          className="admin-jobs__filter-select"
        >
          {jobTypes.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={handleLocationFilterChange}
          className="admin-jobs__filter-select"
        >
          <option value="all">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={franchiseFilter}
          onChange={handleFranchiseFilterChange}
          className="admin-jobs__filter-select"
        >
          <option value="all">All Franchises</option>
          {franchises.map(franchise => (
            <option key={franchise.id} value={franchise.id}>
              {franchise.name}
            </option>
          ))}
        </select>

        {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || locationFilter !== 'all' || franchiseFilter !== 'all') && (
          <button onClick={clearFilters} className="admin-jobs__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="admin-jobs__results-info">
        Showing {jobs.length} of {totalItems} jobs
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-jobs__loading">
          <div className="admin-jobs__spinner"></div>
          <p>Loading jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-jobs__error">
          <span className="admin-jobs__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchJobs} className="admin-jobs__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Jobs Table */}
      {!loading && !error && (
        <>
          {jobs.length === 0 ? (
            <div className="admin-jobs__empty">
              <span className="admin-jobs__empty-icon">💼</span>
              <h3>No jobs found</h3>
              <p>No job postings match your current filters.</p>
              <button onClick={clearFilters} className="admin-jobs__empty-button">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="admin-jobs__table-container">
                <table className="admin-jobs__table">
                  <thead>
                    <tr>
                      <th>Job Details</th>
                      <th>Franchise</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Applications</th>
                      <th>Posted Date</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>View Details</th>
                    </tr>
                  </thead>
                  <tbody>
  {jobs.map(job => (
    <tr key={job.id}>
      <td>
        <div className="admin-jobs__job-info">
          <div className="admin-jobs__job-icon">
            {getJobTypeIcon(job.type)}
          </div>
          <div>
            <div className="admin-jobs__job-title">{job.title}</div>
            <div className="admin-jobs__job-salary">{job.salaryRange}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="admin-jobs__franchise-info">
          <div className="admin-jobs__franchise-name">
            {job.franchiseName || 'N/A'}
          </div>
          <div className="admin-jobs__franchise-id">
            ID: {job.franchiseId || 'N/A'}
          </div>
        </div>
      </td>
      <td>
        <span className="admin-jobs__job-location">
          📍 {job.location}
        </span>
      </td>
      <td>
        <span className="admin-jobs__job-type">
          {getJobTypeLabel(job.type)}
        </span>
      </td>
      <td>
        <span className="admin-jobs__application-count">
          {job.applicationsCount || 0}
        </span>
      </td>
      <td>
        <span className="admin-jobs__posted-date">
          {job.postedDate}
        </span>
      </td>
      <td>
        <span className={`admin-jobs__deadline ${job.daysRemaining && job.daysRemaining < 7 ? 'admin-jobs__deadline--urgent' : ''}`}>
          {job.applicationDeadline || 'No deadline'}
          {job.daysRemaining > 0 && (
            <span className="admin-jobs__days-left">
              ({job.daysRemaining} days left)
            </span>
          )}
          {job.hasDeadline && job.daysRemaining <= 0 && (
      <span className="admin-jobs__days-left admin-jobs__days-left--expired">
        (Expired)
      </span>
    )}
        </span>
      </td>
      <td>
        <span className={`admin-jobs__status-badge ${getStatusBadgeClass(job.status)}`}>
          {job.statusDisplay?.label}
        </span>
      </td>
      <td>
  <div className="admin-jobs__actions">
    <button
      onClick={() => handleViewJobDetails(job)}
      className="admin-jobs__action-btn admin-jobs__action-btn--view"
      title="View Job Details"
    >
      👁️
    </button>
  </div>
</td>
    </tr>
  ))}
</tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="admin-jobs__pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="admin-jobs__pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="admin-jobs__pagination-info">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="admin-jobs__pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      {/* Job Details Modal */}
{showJobModal && selectedJob && (
  <div className="admin-jobs__modal-overlay" onClick={handleCloseModal}>
    <div className="admin-jobs__modal" onClick={(e) => e.stopPropagation()}>
      <div className="admin-jobs__modal-header">
        <h2 className="admin-jobs__modal-title">Job Details</h2>
        <button onClick={handleCloseModal} className="admin-jobs__modal-close">
          ×
        </button>
      </div>

      <div className="admin-jobs__modal-content">
        {/* Basic Information */}
        <div className="admin-jobs__modal-section">
          <h3 className="admin-jobs__modal-section-title">
            📋 Basic Information
          </h3>
          <div className="admin-jobs__modal-grid">
            <div className="admin-jobs__modal-field">
              <label>Job Title</label>
              <p>{selectedJob.title}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Job Type</label>
              <p>{getJobTypeLabel(selectedJob.type)}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Location</label>
              <p>{selectedJob.location}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Salary Range</label>
              <p>{selectedJob.salaryRange}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Experience Required</label>
              <p>{selectedJob.experienceRequired || 'Not specified'}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Positions Available</label>
              <p>{selectedJob.positionsAvailable || 1}</p>
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="admin-jobs__modal-section">
          <h3 className="admin-jobs__modal-section-title">
            📝 Job Description
          </h3>
          <p className="admin-jobs__modal-description">
            {selectedJob.description}
          </p>
        </div>

        <div className="admin-jobs__modal-section">
          <h3 className="admin-jobs__modal-section-title">
            ✅ Requirements
          </h3>
          <p className="admin-jobs__modal-description">
            {selectedJob.requirements || 'No specific requirements listed.'}
          </p>
        </div>

        {/* Franchise Information */}
        <div className="admin-jobs__modal-section">
          <h3 className="admin-jobs__modal-section-title">
            🏪 Franchise Information
          </h3>
          <div className="admin-jobs__modal-grid">
            <div className="admin-jobs__modal-field">
              <label>Franchise Name</label>
              <p>{selectedJob.franchiseName || 'N/A'}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Franchise ID</label>
              <p>{selectedJob.franchiseId || 'N/A'}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Franchise City</label>
              <p>{selectedJob.franchiseCity || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Application Statistics */}
        <div className="admin-jobs__modal-section">
          <h3 className="admin-jobs__modal-section-title">
            📊 Application Statistics
          </h3>
          <div className="admin-jobs__modal-stats">
            <div className="admin-jobs__modal-stat">
              <span className="admin-jobs__modal-stat-value">
                {selectedJob.applicationsCount || 0}
              </span>
              <span className="admin-jobs__modal-stat-label">
                Total Applications
              </span>
            </div>
            <div className="admin-jobs__modal-stat">
              <span className="admin-jobs__modal-stat-value">
                {selectedJob.status === 'OPEN' ? '✅' : '🔒'}
              </span>
              <span className="admin-jobs__modal-stat-label">
                Job Status
              </span>
            </div>
            <div className="admin-jobs__modal-stat">
              <span className="admin-jobs__modal-stat-value">
                {selectedJob.postedDate}
              </span>
              <span className="admin-jobs__modal-stat-label">
                Posted On
              </span>
            </div>
          </div>
        </div>

        {/* Dates Information */}
        <div className="admin-jobs__modal-section">
          <h3 className="admin-jobs__modal-section-title">
            📅 Important Dates
          </h3>
          <div className="admin-jobs__modal-grid">
            <div className="admin-jobs__modal-field">
              <label>Posted Date</label>
              <p>{selectedJob.postedDate}</p>
            </div>
            <div className="admin-jobs__modal-field">
              <label>Application Deadline</label>
              <p className={selectedJob.daysRemaining < 7 ? 'text-error' : ''}>
                {selectedJob.applicationDeadline || 'No deadline'}
                {selectedJob.daysRemaining > 0 && (
                  <span className="admin-jobs__days-left">
                      ({selectedJob.daysRemaining} days left)
      
                  </span>
                )}
              {selectedJob.hasDeadline && selectedJob.daysRemaining <= 0 && (
  <span className="admin-jobs__days-left--expired">
    (Expired)
  </span>
)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-jobs__modal-footer">
        <button onClick={handleCloseModal} className="admin-jobs__modal-button">
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminJobs;