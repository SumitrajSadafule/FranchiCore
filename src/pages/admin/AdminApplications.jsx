import React, { useState, useEffect } from 'react';
import { Link , useLocation } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import './AdminApplications.css';


// ======================================================
// Admin Applications Page Component
// Super admin interface for managing franchise applications
// Allows viewing, filtering, and updating application status
// ======================================================

const AdminApplications = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('status') || 'all';
  });
  const [cityFilter, setCityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({});
  const [allCities, setAllCities] = useState([]); // Add this line
  const [updatingStatus, setUpdatingStatus] = useState(false);


  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [selectedAppForDelete, setSelectedAppForDelete] = useState(null);
const [deleting, setDeleting] = useState(false);

  // 🔴 ADD THESE STATE VARIABLES
const [showApproveDialog, setShowApproveDialog] = useState(false);
const [selectedAppForApprove, setSelectedAppForApprove] = useState(null);
const [approveUsername, setApproveUsername] = useState('');
const [approvePassword, setApprovePassword] = useState('');
const [approving, setApproving] = useState(false);

  const itemsPerPage = 10;

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const statusParam = params.get('status');
  
  // Load all cities ONCE when component mounts
  const loadAllCities = async () => {
    try {
      console.log('📡 Loading all cities...');
      // Get all applications without filters to extract all cities
      const response = await applicationService.getAllApplications(0, 100);
      let allApps = [];
      if (Array.isArray(response)) {
        allApps = response;
      } else if (response?.content) {
        allApps = response.content;
      }
      
      // Extract unique cities
      const cities = [...new Set(allApps.map(app => app.preferredCity).filter(Boolean))];
      setAllCities(cities.sort());
      console.log('✅ Loaded all cities:', cities);
    } catch (err) {
      console.error('Error loading cities:', err);
      // Fallback to some default cities if API fails
      setAllCities(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad']);
    }
  };
  
  loadAllCities();
  
  // Handle URL param
  if (statusParam && statusParam !== statusFilter) {
    console.log('Setting status filter from URL:', statusParam);
    setStatusFilter(statusParam);
    setCurrentPage(0);
  } else {
    console.log('No URL param change, fetching with current status:', statusFilter);
    fetchApplications();
    fetchStatistics();
  }
}, [location]);

useEffect(() => {
  console.log('📡 Initial data load');
  fetchApplications();
  fetchStatistics();
}, []); // Empty array = runs only once on mount

// useEffect(() => {
//   // Skip the first run if it was triggered by URL
//   if (statusFilter === 'initial') return;
  
//   console.log('🎯 Filters useEffect triggered with:', {
//     statusFilter,
//     cityFilter,

//     currentPage
//   });
  
//   // Add a small delay to prevent multiple rapid calls
//   const timeoutId = setTimeout(() => {
//     fetchApplications();
//     fetchStatistics();
//   }, 300); // 300ms debounce
  
//   // Cleanup function to cancel timeout if dependencies change again
//   return () => clearTimeout(timeoutId);
  
// }, [currentPage, statusFilter, cityFilter]); // Dependencies stay the same

const fetchApplications = async () => {
  setLoading(true);
  setError(null);

  console.log('🔍 fetchApplications called with filters:', {
    searchQuery: searchQuery || 'none',
    statusFilter,
    cityFilter,
    currentPage
  });

  try {
    let response;
        // ===== NEW CASE: ALL THREE FILTERS (Search + Status + City) =====
    if (searchQuery && statusFilter !== 'all' && cityFilter !== 'all') {
      console.log('📡 ALL THREE FILTERS ACTIVE - getting all data and filtering');
      
      // Get all applications (get more to ensure we have all data for filtering)
      const allResponse = await applicationService.getAllApplications(0, 100);
      
      let allApps = [];
      if (Array.isArray(allResponse)) {
        allApps = allResponse;
      } else if (allResponse?.content) {
        allApps = allResponse.content;
      }
      
      console.log(`   Total apps from DB: ${allApps.length}`);
      
      // Apply search filter
      const searchLower = searchQuery.toLowerCase();
      const searchFiltered = allApps.filter(app => 
        (app.fullName && app.fullName.toLowerCase().includes(searchLower)) ||
        (app.email && app.email.toLowerCase().includes(searchLower)) ||
        (app.phone && app.phone.includes(searchQuery))
      );
      console.log(`   After search: ${searchFiltered.length} apps`);
      
      // Apply status filter
      const statusFiltered = searchFiltered.filter(app => app.status === statusFilter);
      console.log(`   After status ${statusFilter}: ${statusFiltered.length} apps`);
      
      // Apply city filter
      const cityFiltered = statusFiltered.filter(app => app.preferredCity === cityFilter);
      console.log(`   After city ${cityFilter}: ${cityFiltered.length} apps`);
      
      // Handle pagination
      const start = currentPage * itemsPerPage;
      const paginated = cityFiltered.slice(start, start + itemsPerPage);
      
      const formattedApps = applicationService.formatApplications(paginated);
      setApplications(formattedApps);
      setFilteredApplications(formattedApps);
      setTotalPages(Math.ceil(cityFiltered.length / itemsPerPage));
      setTotalItems(cityFiltered.length);
      setLoading(false);
      return;
    }
    
    // CASE 1: Search + Status combined
    else if (searchQuery && statusFilter !== 'all') {
      console.log('📡 Search + Status combined');
      response = await applicationService.searchApplications(
        searchQuery,
        0, // Get all search results first
        100, // Get more to filter
        'appliedDate',
        'DESC'
      );
      
      // Parse response
      let allSearchResults = [];
      if (Array.isArray(response)) {
        allSearchResults = response;
      } else if (response && response.content) {
        allSearchResults = response.content;
      }
      
      // Filter by status
      const filteredByStatus = allSearchResults.filter(app => app.status === statusFilter);
      console.log(`   Search returned ${allSearchResults.length} apps`);
      console.log(`   After status filter: ${filteredByStatus.length} apps`);
      
      // Handle pagination
      const start = currentPage * itemsPerPage;
      const paginated = filteredByStatus.slice(start, start + itemsPerPage);
      
      const formattedApps = applicationService.formatApplications(paginated);
      setApplications(formattedApps);
      setFilteredApplications(formattedApps);
      setTotalPages(Math.ceil(filteredByStatus.length / itemsPerPage));
      setTotalItems(filteredByStatus.length);
      setLoading(false);
      return;
    }
    
    // CASE 2: Search only
    else if (searchQuery) {
      console.log('📡 Using SEARCH API');
      response = await applicationService.searchApplications(
        searchQuery,
        currentPage,
        itemsPerPage,
        'appliedDate',
        'DESC'
      );
      
      // If status filter is active, filter search results
      if (statusFilter !== 'all') {
        console.log(`🔍 Filtering search results by status: ${statusFilter}`);
        
        let searchResults = [];
        if (Array.isArray(response)) {
          searchResults = response;
        } else if (response && response.content) {
          searchResults = response.content;
        }
        
        // Filter by status
        const filteredByStatus = searchResults.filter(app => app.status === statusFilter);
        console.log(`   Before status filter: ${searchResults.length} apps`);
        console.log(`   After status filter: ${filteredByStatus.length} apps`);
        
        // Reconstruct response with filtered data
        if (Array.isArray(response)) {
          response = filteredByStatus;
        } else if (response && response.content) {
          response.content = filteredByStatus;
          response.totalElements = filteredByStatus.length;
          response.totalPages = Math.ceil(filteredByStatus.length / itemsPerPage);
        }
      }
    }
    
    // CASE 3: Status only
    else if (statusFilter !== 'all') {
      console.log('📡 Using STATUS API:', statusFilter);
      response = await applicationService.getApplicationsByStatus(
        statusFilter,
        currentPage,
        itemsPerPage,
        'appliedDate',
        'DESC'
      );
    }
    
    // CASE 4: City only
    else if (cityFilter !== 'all') {
      console.log('📡 Using CITY API:', cityFilter);
      response = await applicationService.getApplicationsByCity(
        cityFilter,
        currentPage,
        itemsPerPage,
        'appliedDate',
        'DESC'
      );
    }
    
    // CASE 5: No filters
    else {
      console.log('📡 Using ALL API');
      response = await applicationService.getAllApplications(
        currentPage,
        itemsPerPage,
        'appliedDate',
        'DESC'
      );
    }

    // Handle response (existing code)
    console.log('Raw API Response:', response);
    
    let applicationsArray = [];
    let totalElements = 0;
    let totalPagesCount = 0;
    
    if (Array.isArray(response)) {
      applicationsArray = response;
      totalElements = response.length;
      totalPagesCount = Math.ceil(response.length / itemsPerPage);
    } else if (response && response.content) {
      applicationsArray = response.content;
      totalElements = response.totalElements || response.length;
      totalPagesCount = response.totalPages || 0;
    }

    const formattedApps = applicationService.formatApplications(applicationsArray);

    setApplications(formattedApps);
    setFilteredApplications(formattedApps);
    setTotalPages(totalPagesCount);
    setTotalItems(totalElements);
    
  } catch (err) {
    setError('Failed to load applications. Please try again.');
    console.error('Error fetching applications:', err);
  } finally {
    setLoading(false);
  }
};

  const fetchStatistics = async () => {
    try {
      const data = await applicationService.getApplicationStatistics();
      console.log('Statistics data:', data);
      
      // Check if data is the expected format
      if (Array.isArray(data)) {
        // Convert array format to object
        const stats = {
          total: 0,
          newApplications: 0,
          pendingReview: 0,
          approved: 0,
          rejected: 0
        };
        
        data.forEach(([status, count]) => {
          stats.total += count;
          switch(status) {
            case 'NEW':
              stats.newApplications = count;
              break;
            case 'UNDER_REVIEW':
            case 'INTERVIEW_SCHEDULED':
              stats.pendingReview += count;
              break;
            case 'APPROVED':
              stats.approved = count;
              break;
            case 'REJECTED':
              stats.rejected = count;
              break;
          }
        });
        
        setStats(stats);
      } else {
        setStats(data || {});
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setUpdateStatus(application.status);
    setAdminNotes(application.adminNotes || '');
    setShowModal(true);
  };

  // 🔴 REPLACE THIS FUNCTION - Add loading spinner
const handleUpdateStatus = async () => {
  // If status is being changed to APPROVED, show dialog first
  if (updateStatus === 'APPROVED' && selectedApplication.status !== 'APPROVED') {
    setShowModal(false);
    setTimeout(() => {
      openApproveDialog(selectedApplication);
    }, 100);
    return;
  }
  
  // 🔴 SET LOADING STATE TO TRUE
  setUpdatingStatus(true);
  
  try {
    await applicationService.updateApplicationStatus(
      selectedApplication.id,
      updateStatus,
      adminNotes,
      'admin@macs.com'
    );
    
    setShowModal(false);
    await fetchApplications();
    await fetchStatistics();
  } catch (err) {
    alert('Failed to update application status. Please try again.');
    console.error('Error updating application:', err);
  } finally {
    // 🔴 SET LOADING STATE TO FALSE
    setUpdatingStatus(false);
  }
};

  // 🔴 ADD THIS FUNCTION - Handle approve action
const handleApprove = async () => {
  // Validate inputs
  if (!approveUsername.trim()) {
    alert('Please enter a username');
    return;
  }
  if (!approvePassword.trim()) {
    alert('Please enter a password');
    return;
  }
  if (approvePassword.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  setApproving(true);
  
  try {
    const result = await applicationService.approveApplication(
      selectedAppForApprove.id,
      approveUsername,
      approvePassword
    );
    
    console.log('Approval result:', result);
    
    // Success message
    alert(`✅ Application approved successfully!\n\nUser: ${result.username}\nFranchise: ${result.franchiseName}\nFranchise Code: ${result.franchiseCode}`);
    


    // 🔴 CLOSE BOTH DIALOGS
    setShowApproveDialog(false);
    setShowModal(false);  // 🔴 ADD THIS - Close the main modal
    setSelectedAppForApprove(null);
    setSelectedApplication(null);  // 🔴 ADD THIS - Clear selected application
    setApproveUsername('');
    setApprovePassword('');
    await fetchApplications();
    await fetchStatistics();

    
    
  } catch (err) {
    console.error('Approval error:', err);
    alert(`❌ Failed to approve application: ${err.message || 'Please try again'}`);
  if (selectedAppForApprove) {
      setSelectedApplication(selectedAppForApprove);
      setUpdateStatus(selectedAppForApprove.status);
      setAdminNotes(selectedAppForApprove.adminNotes || '');
      setShowModal(true);
    }
  }finally {
    setApproving(false);
  }
};

// 🔴 ADD THIS FUNCTION - Open approve dialog
const openApproveDialog = (application) => {
  setSelectedAppForApprove(application);
  setApproveUsername('');
  setApprovePassword('');
  setShowApproveDialog(true);
};

  // 🔴 REPLACE THIS FUNCTION - Open delete confirmation dialog instead of direct confirm
const handleDeleteClick = (application) => {
  setSelectedAppForDelete(application);
  setShowDeleteDialog(true);
};

// 🔴 ADD THIS FUNCTION - Handle actual delete after confirmation
const handleConfirmDelete = async () => {
  if (!selectedAppForDelete) return;
  
  setDeleting(true);
  
  try {
    await applicationService.deleteApplication(selectedAppForDelete.id);
    await fetchApplications();
    await fetchStatistics();
    setShowDeleteDialog(false);
    setSelectedAppForDelete(null);
  } catch (err) {
    alert('Failed to delete application. Please try again.');
    console.error('Error deleting application:', err);
  } finally {
    setDeleting(false);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchApplications();
    fetchStatistics();
  };

const handleStatusFilterChange = (e) => {
  const newStatus = e.target.value;
  console.log('🔄 Status filter changed from', statusFilter, 'to', newStatus);
  setStatusFilter(newStatus);
  setCurrentPage(0);
  // Remove any immediate fetch - let useEffect handle it
};

const handleCityFilterChange = (e) => {
  const newCity = e.target.value;
  console.log('🔄 City filter changed from', cityFilter, 'to', newCity);
  setCityFilter(newCity);
  setCurrentPage(0);
  // Remove any immediate fetch - let useEffect handle it
};

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const clearFilters = () => {
  console.log('🧹 Clearing all filters');
  
  // Reset all filter states
  setSearchQuery('');
  setStatusFilter('all');
  setCityFilter('all');
  setCurrentPage(0);
  
  // Important: Don't use setTimeout for the fetch
  // Instead, fetch immediately after state updates
  // But we need to wait for state to update first
  
  // Use a small timeout to ensure states are updated
  setTimeout(() => {
    console.log('📡 Fetching all applications after clear');
    
    // Call the API directly with no filters
    applicationService.getAllApplications(0, 10)
      .then(response => {
        console.log('✅ Clear All API response:', response);
        
        let apps = [];
        if (Array.isArray(response)) {
          apps = response;
        } else if (response?.content) {
          apps = response.content;
        }
        
        const formattedApps = applicationService.formatApplications(apps);
        setApplications(formattedApps);
        setFilteredApplications(formattedApps);
        setTotalPages(Math.ceil(apps.length / 10));
        setTotalItems(apps.length);
      })
      .catch(err => {
        console.error('Error in clear all:', err);
        setError('Failed to load applications');
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, 100);
};

const getUniqueCities = () => {
  // Return ALL cities, not filtered ones
  console.log('🏙️ Returning all cities:', allCities);
  return allCities;
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'NEW': 'badge--info',
      'UNDER_REVIEW': 'badge--warning',
      'INTERVIEW_SCHEDULED': 'badge--primary',
      'APPROVED': 'badge--success',
      'REJECTED': 'badge--error'
    };
    return colors[status] || 'badge--default';
  };

  return (
    <div className="admin-applications">
      {/* Header */}
      <div className="admin-applications__header">
        <div>
          <h1 className="admin-applications__title">Franchise Applications</h1>
          <p className="admin-applications__subtitle">
            Review and manage franchise applications
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="admin-applications__stats">
        <div className="admin-applications__stat-card">
          <span className="admin-applications__stat-value">{stats.total || 0}</span>
          <span className="admin-applications__stat-label">Total Applications</span>
        </div>
        <div className="admin-applications__stat-card">
          <span className="admin-applications__stat-value">{stats.newApplications || 0}</span>
          <span className="admin-applications__stat-label">New</span>
        </div>
        <div className="admin-applications__stat-card">
          <span className="admin-applications__stat-value">{stats.pendingReview || 0}</span>
          <span className="admin-applications__stat-label">Under Review</span>
        </div>
        <div className="admin-applications__stat-card">
          <span className="admin-applications__stat-value">{stats.approved || 0}</span>
          <span className="admin-applications__stat-label">Approved</span>
        </div>
        <div className="admin-applications__stat-card">
          <span className="admin-applications__stat-value">{stats.rejected || 0}</span>
          <span className="admin-applications__stat-label">Rejected</span>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-applications__filters">
        <form onSubmit={handleSearch} className="admin-applications__search">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-applications__search-input"
          />
          <button type="submit" className="admin-applications__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="admin-applications__filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="NEW">New</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={cityFilter}
          onChange={handleCityFilterChange}
          className="admin-applications__filter-select"
        >
          <option value="all">All Cities</option>
          {getUniqueCities().map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {(searchQuery || statusFilter !== 'all' || cityFilter !== 'all') && (
          <button onClick={clearFilters} className="admin-applications__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="admin-applications__results-info">
        Showing {applications.length} of {totalItems} applications
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-applications__loading">
          <div className="admin-applications__spinner"></div>
          <p>Loading applications...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-applications__error">
          <span className="admin-applications__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchApplications} className="admin-applications__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Applications Table */}
      {!loading && !error && (
        <>
          <div className="admin-applications__table-container">
            <table className="admin-applications__table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Preferred City</th>
                  <th>Financials</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="admin-applications__applicant-info">
                        <div className="admin-applications__applicant-avatar">
                          {app.fullName?.charAt(0)}
                        </div>
                        <div>
                          <div className="admin-applications__applicant-name">
                            {app.fullName}
                          </div>
                          <div className="admin-applications__applicant-age">
                            Age: {app.age}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-applications__contact-info">
                        <div>📧 {app.email}</div>
                        <div>📞 {app.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-applications__city">
                        {app.preferredCity}
                      </span>
                    </td>
                    <td>
                      <div className="admin-applications__financials">
                        <div>Net: {app.netWorth}</div>
                        <div>Liquid: {app.liquidCapital}</div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-applications__experience">
                        <div>{app.qualification}</div>
                        {app.previousOwnership === 'Yes' && (
                          <span className="admin-applications__ownership-badge">
                            Previous Owner
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-applications__status-badge ${getStatusColor(app.status)}`}>
                        {app.statusDisplay?.label || app.status || 'Unknown'}
                      </span>
                      {app.adminNotes && (
                        <div className="admin-applications__notes-indicator" title={app.adminNotes}>
                          📝
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="admin-applications__date">
                        {app.appliedDate}
                      </div>
                    </td>
                    <td>
                      <div className="admin-applications__actions">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="admin-applications__action-btn admin-applications__action-btn--view"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
  onClick={() => handleDeleteClick(app)}  // Changed from handleDelete to handleDeleteClick
  className="admin-applications__action-btn admin-applications__action-btn--delete"
  title="Delete"
>
  🗑️
</button>

{/* 🔴 ADD THIS - Delete Confirmation Dialog */}
{showDeleteDialog && selectedAppForDelete && (
  <div className="admin-applications__delete-overlay" onClick={(e) => {
    if (e.target === e.currentTarget) setShowDeleteDialog(false);
  }}>
    <div className="admin-applications__delete-dialog">
      <div className="admin-applications__delete-header">
        <div className="admin-applications__delete-icon">🗑️</div>
        <h3 className="admin-applications__delete-title">Confirm Deletion</h3>
        <button
          onClick={() => setShowDeleteDialog(false)}
          className="admin-applications__delete-close"
        >
          ×
        </button>
      </div>
      
      <div className="admin-applications__delete-body">
        <p className="admin-applications__delete-warning">
          Are you sure you want to delete this application?
        </p>
        
        <div className="admin-applications__delete-info">
          <div className="admin-applications__delete-info-item">
            <span className="admin-applications__delete-info-label">Applicant:</span>
            <span className="admin-applications__delete-info-value">{selectedAppForDelete.fullName}</span>
          </div>
          <div className="admin-applications__delete-info-item">
            <span className="admin-applications__delete-info-label">Email:</span>
            <span className="admin-applications__delete-info-value">{selectedAppForDelete.email}</span>
          </div>
          <div className="admin-applications__delete-info-item">
            <span className="admin-applications__delete-info-label">Status:</span>
            <span className="admin-applications__delete-info-value">{selectedAppForDelete.statusDisplay?.label || selectedAppForDelete.status}</span>
          </div>
          <div className="admin-applications__delete-info-item">
            <span className="admin-applications__delete-info-label">Applied Date:</span>
            <span className="admin-applications__delete-info-value">{selectedAppForDelete.appliedDate}</span>
          </div>
        </div>
        
        <div className="admin-applications__delete-warning-box">
          <span className="admin-applications__delete-warning-icon">⚠️</span>
          <span className="admin-applications__delete-warning-text">
            The application data will be permanently deleted.
          </span>
        </div>
      </div>
      
      <div className="admin-applications__delete-actions">
        <button
          onClick={() => setShowDeleteDialog(false)}
          className="admin-applications__delete-cancel"
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="admin-applications__delete-confirm"
          disabled={deleting}
        >
          {deleting ? (
            <>
              <span className="admin-applications__spinner-small"></span>
              Deleting...
            </>
          ) : (
            'Yes, Delete'
          )}
        </button>
      </div>
    </div>
  </div>
)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-applications__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="admin-applications__pagination-btn"
              >
                ← Previous
              </button>
              <span className="admin-applications__pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="admin-applications__pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="admin-applications__modal-overlay">
          <div className="admin-applications__modal">
            <div className="admin-applications__modal-header">
              <h2 className="admin-applications__modal-title">
                Application Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="admin-applications__modal-close"
              >
                ×
              </button>
            </div>

            <div className="admin-applications__modal-content">
              {/* Personal Information */}
              <div className="admin-applications__modal-section">
                <h3 className="admin-applications__modal-section-title">
                  Personal Information
                </h3>
                <div className="admin-applications__modal-grid">
                  <div className="admin-applications__modal-field">
                    <label>Full Name</label>
                    <p>{selectedApplication.fullName}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Age</label>
                    <p>{selectedApplication.age}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Email</label>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Phone</label>
                    <p>{selectedApplication.phone}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Address</label>
                    <p>{selectedApplication.address}</p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="admin-applications__modal-section">
                <h3 className="admin-applications__modal-section-title">
                  Education
                </h3>
                <div className="admin-applications__modal-grid">
                  <div className="admin-applications__modal-field">
                    <label>Qualification</label>
                    <p>{selectedApplication.qualification}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Institution</label>
                    <p>{selectedApplication.institution}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Graduation Year</label>
                    <p>{selectedApplication.graduationYear}</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="admin-applications__modal-section">
                <h3 className="admin-applications__modal-section-title">
                  Financial Information
                </h3>
                <div className="admin-applications__modal-grid">
                  <div className="admin-applications__modal-field">
                    <label>Net Worth</label>
                    <p className="admin-applications__modal-field--highlight">
                      {selectedApplication.netWorth}
                    </p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Liquid Capital</label>
                    <p className="admin-applications__modal-field--highlight">
                      {selectedApplication.liquidCapital}
                    </p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Source of Funds</label>
                    <p>{selectedApplication.sourceOfFunds}</p>
                  </div>
                </div>
              </div>

              {/* Business Interest */}
              <div className="admin-applications__modal-section">
                <h3 className="admin-applications__modal-section-title">
                  Business Interest
                </h3>
                <div className="admin-applications__modal-grid">
                  <div className="admin-applications__modal-field">
                    <label>Preferred City</label>
                    <p>{selectedApplication.preferredCity}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Reason for Interest</label>
                    <p>{selectedApplication.reasonForInterest}</p>
                  </div>
                </div>
              </div>

              {/* Commitment */}
              <div className="admin-applications__modal-section">
                <h3 className="admin-applications__modal-section-title">
                  Commitment
                </h3>
                <div className="admin-applications__modal-grid">
                  <div className="admin-applications__modal-field">
                    <label>Previous Ownership</label>
                    <p>{selectedApplication.previousOwnership}</p>
                  </div>
                  {selectedApplication.ownershipDetails && (
                    <div className="admin-applications__modal-field">
                      <label>Ownership Details</label>
                      <p>{selectedApplication.ownershipDetails}</p>
                    </div>
                  )}
                  <div className="admin-applications__modal-field">
                    <label>Willing to Train</label>
                    <p>{selectedApplication.willingToTrain}</p>
                  </div>
                </div>
              </div>

              {/* Legal Documents */}
              <div className="admin-applications__modal-section">
                <h3 className="admin-applications__modal-section-title">
                  Legal Documents
                </h3>
                <div className="admin-applications__modal-grid">
                  <div className="admin-applications__modal-field">
                    <label>PAN Number</label>
                    <p>{selectedApplication.panNumber}</p>
                  </div>
                  <div className="admin-applications__modal-field">
                    <label>Aadhaar Number</label>
                    <p>{selectedApplication.aadhaarNumber}</p>
                  </div>
                </div>
              </div>

{/* Status Update - MODIFIED to add Approve button and read-only for APPROVED */}
<div className="admin-applications__modal-section">
  <h3 className="admin-applications__modal-section-title">
    Application Status
  </h3>
  
  {/* 🔴 ADD THIS LOCK ICON SECTION - Shows when status is APPROVED */}
  {selectedApplication.status === 'APPROVED' && (
    <div className="admin-applications__approved-banner">
      <span className="admin-applications__approved-icon">🔒</span>
      <span className="admin-applications__approved-text">
        This application has been approved. A franchise owner account has been created.
      </span>
    </div>
  )}
  
  <div className="admin-applications__status-update">
    <select
      value={updateStatus}
      onChange={(e) => setUpdateStatus(e.target.value)}
      className="admin-applications__status-select"
      disabled={selectedApplication.status === 'APPROVED'}
    >
      <option value="NEW">New</option>
      <option value="UNDER_REVIEW">Under Review</option>
      <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
      <option value="APPROVED">Approved</option>
      <option value="REJECTED">Rejected</option>
    </select>

    <textarea
      placeholder="Admin notes (optional)"
      value={adminNotes}
      onChange={(e) => setAdminNotes(e.target.value)}
      className="admin-applications__notes-input"
      rows="3"
      disabled={selectedApplication.status === 'APPROVED'}
    ></textarea>

   <div className="admin-applications__button-group">
  <button
    onClick={handleUpdateStatus}
    className="admin-applications__update-button"
    disabled={selectedApplication.status === 'APPROVED' || updatingStatus}
  >
    {updatingStatus ? (
      <>
        <span className="admin-applications__spinner-small"></span>
        Updating...
      </>
    ) : (
      'Update Status'
    )}
  </button>
</div>
  </div>
</div>
            </div>
          </div>
        </div>
        
      )}
      {/* 🔴 ADD THIS - Approve Dialog (Modal inside Modal) */}
{showApproveDialog && selectedAppForApprove && (
  <div 
  className="admin-applications__approve-overlay" 
  onClick={(e) => {
    if (e.target === e.currentTarget) {
      setShowApproveDialog(false);
      setSelectedAppForApprove(null);
      setApproveUsername('');
      setApprovePassword('');
      // 🔴 Reopen the main modal
      if (selectedAppForApprove) {
        setSelectedApplication(selectedAppForApprove);
        setUpdateStatus(selectedAppForApprove.status);
        setAdminNotes(selectedAppForApprove.adminNotes || '');
        setShowModal(true);
      }
    }
  }}
>
    <div className="admin-applications__approve-dialog">
      <div className="admin-applications__approve-header">
        <h3 className="admin-applications__approve-title">
          Create Franchise Owner Account
        </h3>
        <button
  onClick={() => {
    setShowApproveDialog(false);
    setSelectedAppForApprove(null);
    setApproveUsername('');
    setApprovePassword('');
    // 🔴 Reopen the main modal with the same application
    setSelectedApplication(selectedAppForApprove);
    setUpdateStatus(selectedAppForApprove.status);
    setAdminNotes(selectedAppForApprove.adminNotes || '');
    setShowModal(true);
  }}
  className="admin-applications__approve-close"
>
  ×
</button>
      </div>
      
      <div className="admin-applications__approve-body">
        <div className="admin-applications__approve-info">
          <p><strong>Applicant:</strong> {selectedAppForApprove.fullName}</p>
          <p><strong>Email:</strong> {selectedAppForApprove.email}</p>
          <p><strong>Preferred City:</strong> {selectedAppForApprove.preferredCity}</p>
        </div>
        
        <div className="admin-applications__approve-warning">
          <span className="admin-applications__approve-warning-icon">⚠️</span>
          <span className="admin-applications__approve-warning-text">
            This will create a new franchise owner account and a new franchise location.
            The owner will use these credentials to login.
          </span>
        </div>
        
        <div className="admin-applications__form-group">
          <label className="admin-applications__form-label">
            Username *
          </label>
          <input
            type="text"
            placeholder="Enter username (e.g., john_doe)"
            value={approveUsername}
            onChange={(e) => setApproveUsername(e.target.value)}
            className="admin-applications__form-input"
            disabled={approving}
          />
        </div>
        
        <div className="admin-applications__form-group">
          <label className="admin-applications__form-label">
            Password *
          </label>
          <input
            type="password"
            placeholder="Enter password (min 6 characters)"
            value={approvePassword}
            onChange={(e) => setApprovePassword(e.target.value)}
            className="admin-applications__form-input"
            disabled={approving}
          />
        </div>
        
        <div className="admin-applications__approve-actions">
         <button
  onClick={() => {
    setShowApproveDialog(false);
    setSelectedAppForApprove(null);
    setApproveUsername('');
    setApprovePassword('');
    // 🔴 Reopen the main modal with the same application
    setSelectedApplication(selectedAppForApprove);
    setUpdateStatus(selectedAppForApprove.status);
    setAdminNotes(selectedAppForApprove.adminNotes || '');
    setShowModal(true);
  }}
  className="admin-applications__approve-cancel"
  disabled={approving}
>
  Cancel
</button>
          <button
            onClick={handleApprove}
            className="admin-applications__approve-confirm"
            disabled={approving}
          >
            {approving ? (
              <>
                <span className="admin-applications__spinner-small"></span>
                Creating...
              </>
            ) : (
              'Create & Approve'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminApplications;