import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ownerService from '../../services/ownerService';
import jobService from '../../services/jobService';
import './OwnerJobs.css';

// ======================================================
// Owner Jobs Page Component
// Displays all jobs posted by the franchise owner
// Allows viewing, filtering, and managing jobs
// ======================================================

const OwnerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, statusFilter, searchQuery]);

const fetchJobs = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await ownerService.getJobs(
      currentPage,
      itemsPerPage,
      'postedDate',
      'DESC'
    );
    
    // 🔴 ADD THIS - Apply filters (status + search)
    let filteredContent = response.content || [];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredContent = filteredContent.filter(job => job.status === statusFilter);
    }
    
    // 🔴 ADD THIS - Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredContent = filteredContent.filter(job => 
        job.title?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query)
      );
    }
    
    const formattedJobs = jobService.formatJobs(filteredContent);
    setJobs(formattedJobs);
    setFilteredJobs(formattedJobs);
    setTotalPages(Math.ceil(filteredContent.length / itemsPerPage));
    setTotalItems(filteredContent.length);
  } catch (err) {
    setError('Failed to load jobs. Please try again.');
    console.error('Error fetching jobs:', err);
  } finally {
    setLoading(false);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(0);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await ownerService.deleteJob(jobId);
      await fetchJobs();
    } catch (err) {
      alert('Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    }
  };

const handleCloseJob = async (jobId) => {
  if (!window.confirm('Are you sure you want to close this job?')) {
    return;
  }

  try {
    await ownerService.closeJob(jobId);
    await fetchJobs();
    alert('Job closed successfully!');
  } catch (err) {
    alert('Failed to close job. Please try again.');
    console.error('Error closing job:', err);
  }
};


const handleOpenJob = async (jobId) => {
  if (!window.confirm('Are you sure you want to reopen this job?')) {
    return;
  }

  try {
    await ownerService.openJob(jobId);
    await fetchJobs();
    alert('Job reopened successfully!');
  } catch (err) {
    alert('Failed to open job. Please try again.');
    console.error('Error opening job:', err);
  }
};

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

  return (
    <div className="owner-jobs">
      {/* Header */}
      <div className="owner-jobs__header">
        <div>
          <h1 className="owner-jobs__title">Job Management</h1>
          <p className="owner-jobs__subtitle">Manage your job postings and applications</p>
        </div>
        <Link to="/owner/jobs/create" className="owner-jobs__create-button">
          <span className="owner-jobs__create-icon">+</span>
          Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="owner-jobs__filters">
        <form onSubmit={handleSearch} className="owner-jobs__search">
          <input
            type="text"
            placeholder="Search jobs by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="owner-jobs__search-input"
          />
          <button type="submit" className="owner-jobs__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="owner-jobs__filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>

        {(searchQuery || statusFilter !== 'all') && (
          <button onClick={clearFilters} className="owner-jobs__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="owner-jobs__results-info">
        Showing {jobs.length} of {totalItems} jobs
      </div>

      {/* Loading State */}
      {loading && (
        <div className="owner-jobs__loading">
          <div className="owner-jobs__spinner"></div>
          <p>Loading jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="owner-jobs__error">
          <span className="owner-jobs__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchJobs} className="owner-jobs__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Jobs Table */}
      {!loading && !error && (
        <>
          {jobs.length === 0 ? (
            <div className="owner-jobs__empty">
              <span className="owner-jobs__empty-icon">💼</span>
              <h3>No jobs found</h3>
              <p>Get started by posting your first job opening.</p>
              <Link to="/owner/jobs/create" className="owner-jobs__empty-button">
                Post a Job
              </Link>
            </div>
          ) : (
            <>
              <div className="owner-jobs__table-container">
                <table className="owner-jobs__table">
                  <thead>
                    <tr>
                      <th>Job Details</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Applications</th>
                      <th>Posted Date</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id}>
                        <td>
                          <div className="owner-jobs__job-info">
                            <div className="owner-jobs__job-icon">
                              {getJobTypeIcon(job.type)}
                            </div>
                            <div>
                              <div className="owner-jobs__job-title">{job.title}</div>
                              <div className="owner-jobs__job-salary">{job.salaryRange}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="owner-jobs__job-location">
                            📍 {job.location}
                          </span>
                        </td>
                        <td>
                          <span className={`owner-jobs__job-type owner-jobs__job-type--${job.type?.toLowerCase()}`}>
                            {job.typeDisplay?.label}
                          </span>
                        </td>
                        <td>
                          <span className="owner-jobs__application-count">
                            {job.applicationsCount || 0}
                          </span>
                        </td>
                        <td>
                          <span className="owner-jobs__posted-date">
                            {job.postedDate}
                          </span>
                        </td>
                        <td>
                          <span className="owner-jobs__posted-date">
                            {job.applicationDeadline ? job.applicationDeadline : 'No deadline'}
                          </span>
                        </td>
                        <td>
                          <span className={`owner-jobs__status-badge ${getStatusBadgeClass(job.status)}`}>
                            {job.statusDisplay?.label}
                          </span>
                        </td>
                        <td>
                          <div className="owner-jobs__actions">
                            <Link
                              to={`/owner/jobs/${job.id}/applications`}
                              className="owner-jobs__action-btn owner-jobs__action-btn--view"
                              title="View Applications"
                            >
                              👥
                            </Link>
                            <Link
                              to={`/owner/jobs/${job.id}/edit`}
                              className="owner-jobs__action-btn owner-jobs__action-btn--edit"
                              title="Edit Job"
                            >
                              ✏️
                            </Link>
                            {job.status === 'OPEN' && (
    <button
      onClick={() => handleCloseJob(job.id)}
      className="owner-jobs__action-btn owner-jobs__action-btn--close"
      title="Close Job"
    >
      🔒
    </button>
  )}
  {job.status === 'CLOSED' && (
    <button
      onClick={() => handleOpenJob(job.id)}
      className="owner-jobs__action-btn owner-jobs__action-btn--open"
      title="Open Job"
    >
      🔓
    </button>
  )}
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="owner-jobs__action-btn owner-jobs__action-btn--delete"
                              title="Delete Job"
                            >
                              🗑️
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
                <div className="owner-jobs__pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="owner-jobs__pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="owner-jobs__pagination-info">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="owner-jobs__pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OwnerJobs;