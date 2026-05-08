import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ownerService from '../../services/ownerService';
import jobService from '../../services/jobService';
import './OwnerApplications.css';

// TEMPORARY DEBUG - REMOVE AFTER FIXING
console.log('🔍 OwnerApplications component mounted');
// ======================================================
// Owner Applications Page Component
// Displays all job applications for the owner's franchise
// Allows filtering, sorting, and updating application status
// ======================================================

const OwnerApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications();
    if (!id) {
      fetchJobs();
    } else {
      fetchCurrentJobTitle();
    }
  }, [currentPage, statusFilter, jobFilter, searchQuery, id]);

const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (id) {
        response = await ownerService.getJobApplications(
          id,  // Use the job ID from URL
          currentPage,
          itemsPerPage,
          'appliedDate',
          'DESC'
        );
      } else if (jobFilter !== 'all') {
        response = await ownerService.getJobApplications(
          jobFilter,
          currentPage,
          itemsPerPage,
          'appliedDate',
          'DESC'
        );
      } else {
        response = await ownerService.getAllApplications(
          currentPage,
          itemsPerPage,
          'appliedDate',
          'DESC'
        );
      }
      
      let applications = response.content || [];
      
      // CHANGED: Apply status filter
      if (statusFilter !== 'all') {
        applications = applications.filter(app => app.status === statusFilter);
      }
      
      // CHANGED: Apply search filter (by name or email)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        applications = applications.filter(app => 
          app.fullName?.toLowerCase().includes(query) ||
          app.email?.toLowerCase().includes(query)
        );
      }
      
      const formattedApps = jobService.formatApplications(applications);
      setApplications(formattedApps);
      setFilteredApplications(formattedApps);
      setTotalPages(response.totalPages || 0);
      // CHANGED: Update total items count after filtering
      setTotalItems(applications.length);
    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await ownerService.getJobs(0, 100, 'title', 'ASC');
      setJobs(response.content || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

const fetchCurrentJobTitle = async () => {
  if (!id) return;
  try {
    // CHANGED: Use the specific job endpoint instead of searching all jobs
    const response = await ownerService.getJobs(0, 1, 'id', 'ASC');
    // Find the job by ID from the jobs list
    const job = response.content?.find(j => j.id === parseInt(id));
    if (job) {
      setCurrentJobTitle(job.title);
    } else {
      // If not found in list, try to get from jobs API directly
      const allJobsResponse = await ownerService.getJobs(0, 100, 'id', 'ASC');
      const foundJob = allJobsResponse.content?.find(j => j.id === parseInt(id));
      if (foundJob) {
        setCurrentJobTitle(foundJob.title);
      } else {
        setCurrentJobTitle(`Job #${id}`);
      }
    }
  } catch (err) {
    console.error('Error fetching job title:', err);
    setCurrentJobTitle(`Job #${id}`);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchApplications();
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleJobFilterChange = (e) => {
    setJobFilter(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setJobFilter('all');
    setCurrentPage(0);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setUpdateStatus(application.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await ownerService.updateApplicationStatus(selectedApplication.id, updateStatus);
      setShowModal(false);
      await fetchApplications();
    } catch (err) {
      alert('Failed to update application status. Please try again.');
      console.error('Error updating status:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'NEW': 'badge--info',
      'UNDER_REVIEW': 'badge--warning',
      'INTERVIEW_SCHEDULED': 'badge--primary',
      'ACCEPTED': 'badge--success',
      'REJECTED': 'badge--error',
      'WITHDRAWN': 'badge--default'
    };
    return classes[status] || 'badge--default';
  };

  const getStatusDisplay = (status) => {
    const displays = {
      'NEW': 'New',
      'UNDER_REVIEW': 'Under Review',
      'INTERVIEW_SCHEDULED': 'Interview Scheduled',
      'ACCEPTED': 'Accepted',
      'REJECTED': 'Rejected',
      'WITHDRAWN': 'Withdrawn'
    };
    return displays[status] || status;
  };

  return (
    <div className="owner-applications">
      {/* Header */}
      <div className="owner-applications__header">
        <div>
          <h1 className="owner-applications__title">Job Applications</h1>
          <p className="owner-applications__subtitle">
            {id ? `Applications for this job position` : 'Review and manage applications for your jobs'}
          </p>
        </div>
        {id && (
          <Link to="/owner/jobs" className="owner-applications__back-button">
            ← Back to Jobs
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="owner-applications__filters">
        <form onSubmit={handleSearch} className="owner-applications__search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="owner-applications__search-input"
          />
          <button type="submit" className="owner-applications__search-button">
            🔍 Search
          </button>
        </form>

        {!id && (
          <select
            value={jobFilter}
            onChange={handleJobFilterChange}
            className="owner-applications__filter-select"
          >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        )}
        
        {/* CHANGED: Show current job name when viewing specific job */}
        {id && (
          <div className="owner-applications__current-job">
            <strong>Job:</strong> {currentJobTitle || `Job #${id}`}
          </div>
        )}

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="owner-applications__filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="NEW">New</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>

        {(searchQuery || statusFilter !== 'all' || jobFilter !== 'all') && (
          <button onClick={clearFilters} className="owner-applications__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="owner-applications__results-info">
        Showing {applications.length} of {totalItems} applications
      </div>

      {/* Loading State */}
      {loading && (
        <div className="owner-applications__loading">
          <div className="owner-applications__spinner"></div>
          <p>Loading applications...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="owner-applications__error">
          <span className="owner-applications__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchApplications} className="owner-applications__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Applications Table */}
      {!loading && !error && (
        <>
          {applications.length === 0 ? (
            <div className="owner-applications__empty">
              <span className="owner-applications__empty-icon">📋</span>
              <h3>No applications found</h3>
              <p>When candidates apply for your jobs, they'll appear here.</p>
            </div>
          ) : (
            <>
              <div className="owner-applications__table-container">
                <table className="owner-applications__table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Job Applied</th>
                      <th>Contact</th>
                      <th>Experience</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>
                          <div className="owner-applications__applicant-info">
                            <div className="owner-applications__applicant-avatar">
                              {app.fullName?.charAt(0)}
                            </div>
                            <div>
                              <div className="owner-applications__applicant-name">
                                {app.fullName}
                              </div>
                              <div className="owner-applications__applicant-age">
                                Age: {app.age || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="owner-applications__job-info">
                            <div className="owner-applications__job-title">
                              {app.jobTitle}
                            </div>
                            <div className="owner-applications__job-franchise">
                              {app.franchiseName}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="owner-applications__contact-info">
                            <div>📧 {app.email}</div>
                            <div>📞 {app.phone}</div>
                          </div>
                        </td>
                        <td>
                          <div className="owner-applications__experience">
                            <div>{app.qualification || 'N/A'}</div>
                            <div className="owner-applications__experience-years">
                              {app.experienceYears} years
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="owner-applications__applied-date">
                            {app.appliedDate}
                          </span>
                        </td>
                        <td>
                          <span className={`owner-applications__status-badge ${getStatusBadgeClass(app.status)}`}>
                            {getStatusDisplay(app.status)}
                          </span>
                        </td>
                        <td>
                          <div className="owner-applications__actions">
                            <button
                              onClick={() => handleViewApplication(app)}
                              className="owner-applications__action-btn owner-applications__action-btn--view"
                              title="View Details"
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
                <div className="owner-applications__pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="owner-applications__pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="owner-applications__pagination-info">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="owner-applications__pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="owner-applications__modal-overlay">
          <div className="owner-applications__modal">
            <div className="owner-applications__modal-header">
              <h2 className="owner-applications__modal-title">
                Application Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="owner-applications__modal-close"
              >
                ×
              </button>
            </div>

            <div className="owner-applications__modal-content">
              {/* Personal Information */}
              <div className="owner-applications__modal-section">
                <h3 className="owner-applications__modal-section-title">
                  Personal Information
                </h3>
                <div className="owner-applications__modal-grid">
                  <div className="owner-applications__modal-field">
                    <label>Full Name</label>
                    <p>{selectedApplication.fullName}</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Age</label>
                    <p>{selectedApplication.age || 'N/A'}</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Email</label>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Phone</label>
                    <p>{selectedApplication.phone}</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Address</label>
                    <p>{selectedApplication.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="owner-applications__modal-section">
                <h3 className="owner-applications__modal-section-title">
                  Job Details
                </h3>
                <div className="owner-applications__modal-grid">
                  <div className="owner-applications__modal-field">
                    <label>Position</label>
                    <p>{selectedApplication.jobTitle}</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Franchise</label>
                    <p>{selectedApplication.franchiseName}</p>
                  </div>
                </div>
              </div>

              {/* Education & Experience */}
              <div className="owner-applications__modal-section">
                <h3 className="owner-applications__modal-section-title">
                  Education & Experience
                </h3>
                <div className="owner-applications__modal-grid">
                  <div className="owner-applications__modal-field">
                    <label>Qualification</label>
                    <p>{selectedApplication.qualification || 'N/A'}</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Experience</label>
                    <p>{selectedApplication.experienceYears} years</p>
                  </div>
                  <div className="owner-applications__modal-field">
                    <label>Previous Employer</label>
                    <p>{selectedApplication.previousEmployer || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Cover Note */}
              {selectedApplication.coverNote && (
                <div className="owner-applications__modal-section">
                  <h3 className="owner-applications__modal-section-title">
                    Cover Note
                  </h3>
                  <p className="owner-applications__modal-cover-note">
                    {selectedApplication.coverNote}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div className="owner-applications__modal-section">
                <h3 className="owner-applications__modal-section-title">
                  Update Status
                </h3>
                <div className="owner-applications__status-update">
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="owner-applications__status-select"
                  >
                    <option value="NEW">New</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    className="owner-applications__update-button"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerApplications;