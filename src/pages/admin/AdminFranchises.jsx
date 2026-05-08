import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import franchiseService from '../../services/franchiseService';
import './AdminFranchises.css';
import { apiMethods } from '../../services/api';

// ======================================================
// Admin Franchises Page Component
// Super admin interface for managing franchise locations
// Allows CRUD operations on franchises
// ======================================================

const AdminFranchises = () => {
  const [franchises, setFranchises] = useState([]);
  const [filteredFranchises, setFilteredFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({
    franchiseName: '',
    franchiseCode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    status: 'ACTIVE',
    operatingHours: 'Mon-Sun: 10:00 AM - 11:00 PM',
    managerName: '',
    managerPhone: '',
    managerEmail: ''
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchFranchises();
  }, [currentPage, statusFilter, cityFilter, searchQuery]);

  const fetchFranchises = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (searchQuery) {
        response = await franchiseService.searchFranchises(
          searchQuery,
          currentPage,
          itemsPerPage,
          'city',
          'ASC'
        );
      } else if (statusFilter !== 'all') {
    // 🔴 FIX: Use the API to filter by status directly
    console.log('Filtering by status:', statusFilter);
    
    // First, get all franchises
    const allFranchises = await franchiseService.getAllFranchises(0, 1000, 'city', 'ASC');
    let franchisesData = [];
    
    if (Array.isArray(allFranchises)) {
        franchisesData = allFranchises;
    } else if (allFranchises.content) {
        franchisesData = allFranchises.content;
    }
    
    // Filter by status
    const filtered = franchisesData.filter(f => f.status === statusFilter);
    console.log(`Found ${filtered.length} franchises with status ${statusFilter}`);
    
    // Format the filtered data
    const formattedFranchises = franchiseService.formatFranchises(filtered);
    
    // Handle pagination
    const start = currentPage * itemsPerPage;
    const paginated = formattedFranchises.slice(start, start + itemsPerPage);
    
    setFranchises(paginated);
    setFilteredFranchises(paginated);
    setTotalPages(Math.ceil(formattedFranchises.length / itemsPerPage));
    setTotalItems(formattedFranchises.length);
    setLoading(false);
    return;

      } else if (cityFilter !== 'all') {
        response = await franchiseService.getFranchisesByCity(
          cityFilter,
          currentPage,
          itemsPerPage,
          'city',
          'ASC'
        );
      } else {
        response = await franchiseService.getAllFranchises(
          currentPage,
          itemsPerPage,
          'city',
          'ASC'
        );
      }

let franchisesData = [];
let totalPagesCount = 0;
let totalItemsCount = 0;

if (Array.isArray(response)) {
  // API returned array directly
  franchisesData = response;
  totalPagesCount = 1; // No pagination
  totalItemsCount = response.length;
  console.log('Received array with', response.length, 'items');
} else {
  // API returned paginated object
  franchisesData = response.content || [];
  totalPagesCount = response.totalPages || 0;
  totalItemsCount = response.totalElements || 0;
}

const formattedFranchises = franchiseService.formatFranchises(franchisesData);
console.log('Formatted franchises sample:', formattedFranchises[0]);
setFranchises(formattedFranchises);
setFilteredFranchises(formattedFranchises);
 setFranchises(franchisesData);
    setFilteredFranchises(franchisesData);
setTotalPages(totalPagesCount);
setTotalItems(totalItemsCount);
    } catch (err) {
      setError('Failed to load franchises. Please try again.');
      console.error('Error fetching franchises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNew = () => {
    setEditingFranchise(null);
    setFormData({
      franchiseName: '',
      franchiseCode: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      email: '',
      latitude: '',
      longitude: '',
      status: 'ACTIVE',
      operatingHours: 'Mon-Sun: 10:00 AM - 11:00 PM',
      managerName: '',
      managerPhone: '',
      managerEmail: ''
    });
    setShowModal(true);
  };

 const handleEdit = (franchise) => {
  console.log('Editing franchise:', franchise);
  
  setEditingFranchise(franchise);
  
  // FIX: Use the correct field names from the franchise object
  setFormData({
    franchiseName: franchise.name || franchise.franchiseName || '',  // ← Changed: name not franchiseName
    franchiseCode: franchise.code || franchise.franchiseCode || '',  // ← Changed: code not franchiseCode
    addressLine1: franchise.addressLine1 || franchise.address || '',
    addressLine2: franchise.addressLine2 || '',
    city: franchise.city || '',
    state: franchise.state || '',
    postalCode: franchise.postalCode || '',
    country: franchise.country || 'India',
    phone: franchise.phone || '',
    email: franchise.email || '',
    latitude: franchise.latitude || '',
    longitude: franchise.longitude || '',
    status: franchise.status || 'ACTIVE',
    operatingHours: franchise.operatingHours || 'Mon-Sun: 10:00 AM - 11:00 PM',
    managerName: franchise.managerName || '',
    managerPhone: franchise.managerPhone || '',
    managerEmail: franchise.managerEmail || ''
  });
  
  setShowModal(true);
};

const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this franchise?')) {
        return;
    }

    try {
        await franchiseService.deleteFranchise(id);
        alert('Franchise deleted successfully!');
        await fetchFranchises(); // Refresh the list
    } catch (err) {
        alert(err.message || 'Failed to delete franchise. Please try again.');
        console.error('Error deleting franchise:', err);
    }
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (editingFranchise) {
      // Create properly formatted update data
      const updateData = {
        franchiseName: formData.franchiseName,
        franchiseCode: formData.franchiseCode,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || '',
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country || 'India',
        phone: formData.phone,
        email: formData.email,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        status: formData.status,
        operatingHours: formData.operatingHours,
        managerName: formData.managerName || '',
        managerPhone: formData.managerPhone || '',
        managerEmail: formData.managerEmail || ''
      };
      
      console.log('Sending update data for franchise ID:', editingFranchise.id);
      console.log('Update data:', updateData);
      
      // Use the correct endpoint with the franchise ID
      const response = await fetch(`http://localhost:8080/api/franchises/${editingFranchise.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)  // ✅ FIXED: Use updateData, not formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Update failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Update successful:', result);
      alert('Franchise updated successfully!');
    } else {
      alert('Create functionality will be implemented with backend API');
    }

    setShowModal(false);
    await fetchFranchises();
  } catch (err) {
    console.error('Error saving franchise:', err);
    alert(err.message || 'Failed to save franchise. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // const handleStatusChange = async (id, newStatus) => {
  //   try {
  //     // Note: Add update franchise status API when available
  //     alert(`Status change to ${newStatus} will be implemented with backend API`);
  //     // await franchiseService.updateFranchiseStatus(id, newStatus);
  //     // await fetchFranchises();
  //   } catch (err) {
  //     alert('Failed to update franchise status. Please try again.');
  //     console.error('Error updating status:', err);
  //   }
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchFranchises();
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleCityFilterChange = (e) => {
    setCityFilter(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCityFilter('all');
    setCurrentPage(0);
  };

  const getUniqueCities = () => {
    return [...new Set(franchises.map(f => f.city).filter(Boolean))];
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'badge--success',
      'UNDER_REVIEW': 'badge--warning',
      'PROBATION': 'badge--warning',
      'SUSPENDED': 'badge--error',
      'CLOSED': 'badge--error',
      'PENDING_APPROVAL': 'badge--info'
    };
    return colors[status] || 'badge--default';
  };

  return (
    <div className="admin-franchises">
      {/* Header */}
      <div className="admin-franchises__header">
        <div>
          <h1 className="admin-franchises__title">Franchise Management</h1>
          <p className="admin-franchises__subtitle">
            Manage all franchise locations
          </p>
        </div>
        <button onClick={handleAddNew} className="admin-franchises__add-button">
          <span className="admin-franchises__add-icon">+</span>
          Add New Franchise
        </button>
      </div>

      {/* Filters */}
      <div className="admin-franchises__filters">
        <form onSubmit={handleSearch} className="admin-franchises__search">
          <input
            type="text"
            placeholder="Search franchises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-franchises__search-input"
          />
          <button type="submit" className="admin-franchises__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="admin-franchises__filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="PROBATION">Probation</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="CLOSED">Closed</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
        </select>

        <select
          value={cityFilter}
          onChange={handleCityFilterChange}
          className="admin-franchises__filter-select"
        >
          <option value="all">All Cities</option>
          {getUniqueCities().map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {(searchQuery || statusFilter !== 'all' || cityFilter !== 'all') && (
          <button onClick={clearFilters} className="admin-franchises__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="admin-franchises__results-info">
        Showing {franchises.length} of {totalItems} franchises
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-franchises__loading">
          <div className="admin-franchises__spinner"></div>
          <p>Loading franchises...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-franchises__error">
          <span className="admin-franchises__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchFranchises} className="admin-franchises__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Franchises Table */}
      {!loading && !error && (
        <>
   <div className="admin-franchises__table-container">
  <table className="admin-franchises__table">
    <thead>
      <tr>
        <th>Franchise</th>
        <th>Location</th>
        <th>Contact</th>
        <th>Manager</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {franchises.map(franchise => (
        <tr key={franchise.id}>
          <td>
            <div className="admin-franchises__franchise-info">
              <span className="admin-franchises__franchise-icon">🏪</span>
              <div>
                <div className="admin-franchises__franchise-name">
                  {franchise.name || franchise.franchiseName || 'N/A'}
                </div>
                <div className="admin-franchises__franchise-code" style={{ fontSize: '12px', color: '#888' }}>
                  Code: {franchise.code || franchise.franchiseCode || 'N/A'}
                </div>
                <div className="admin-franchises__franchise-hours">
                  {franchise.operatingHours}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div className="admin-franchises__location-info">
              <div>{franchise.addressLine1 || franchise.address}</div>
              <div className="admin-franchises__location-city">
                {franchise.city}, {franchise.state} {franchise.postalCode}
              </div>
            </div>
          </td>
          <td>
            <div className="admin-franchises__contact-info">
              <div>📞 {franchise.phone}</div>
              <div>✉️ {franchise.email}</div>
            </div>
          </td>
          <td>
            <div className="admin-franchises__manager-info">
              <div className="admin-franchises__manager-name">
                {franchise.managerName || 'Not Assigned'}
              </div>
              {franchise.managerPhone && (
                <div className="admin-franchises__manager-phone">
                  {franchise.managerPhone}
                </div>
              )}
            </div>
          </td>
          <td>
            <span className={`admin-franchises__status-badge ${getStatusColor(franchise.status)}`}>
              {franchise.status || 'ACTIVE'}
            </span>
          </td>
          <td>
            <div className="admin-franchises__actions">
              <button
                onClick={() => handleEdit(franchise)}
                className="admin-franchises__action-btn admin-franchises__action-btn--edit"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(franchise.id)}
                className="admin-franchises__action-btn admin-franchises__action-btn--delete"
                title="Delete"
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
            <div className="admin-franchises__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="admin-franchises__pagination-btn"
              >
                ← Previous
              </button>
              <span className="admin-franchises__pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="admin-franchises__pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-franchises__modal-overlay">
          <div className="admin-franchises__modal">
            <div className="admin-franchises__modal-header">
              <h2 className="admin-franchises__modal-title">
                {editingFranchise ? 'Edit Franchise' : 'Add New Franchise'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="admin-franchises__modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-franchises__modal-form">
               {editingFranchise && (
    <input type="hidden" name="id" value={editingFranchise.id} />
  )}
              <div className="admin-franchises__form-section">
                <h3 className="admin-franchises__form-section-title">Basic Information</h3>
                
                <div className="admin-franchises__form-row">
                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Franchise Name *</label>
                    <input
                      type="text"
                      name="franchiseName"
                      value={formData.franchiseName}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                    />
                  </div>

                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Franchise Code *</label>
                    <input
                      type="text"
                      name="franchiseCode"
                      value={formData.franchiseCode}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                      placeholder="e.g., MAC001"
                    />
                  </div>
                </div>

                <div className="admin-franchises__form-row">
                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                    />
                  </div>

                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                    />
                  </div>
                </div>

                <div className="admin-franchises__form-group">
                  <label className="admin-franchises__form-label">Operating Hours</label>
                  <input
                    type="text"
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleInputChange}
                    className="admin-franchises__form-input"
                  />
                </div>
              </div>

              <div className="admin-franchises__form-section">
                <h3 className="admin-franchises__form-section-title">Address</h3>
                
                <div className="admin-franchises__form-group">
                  <label className="admin-franchises__form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="admin-franchises__form-input"
                    required
                  />
                </div>

                <div className="admin-franchises__form-group">
                  <label className="admin-franchises__form-label">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="admin-franchises__form-input"
                  />
                </div>

                <div className="admin-franchises__form-row">
                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                    />
                  </div>

                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                    />
                  </div>
                </div>

                <div className="admin-franchises__form-row">
                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                      required
                    />
                  </div>

                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-franchises__form-section">
                <h3 className="admin-franchises__form-section-title">Manager Information</h3>
                
                <div className="admin-franchises__form-row">
                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Manager Name</label>
                    <input
                      type="text"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                    />
                  </div>

                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Manager Phone</label>
                    <input
                      type="tel"
                      name="managerPhone"
                      value={formData.managerPhone}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                    />
                  </div>
                </div>

                <div className="admin-franchises__form-group">
                  <label className="admin-franchises__form-label">Manager Email</label>
                  <input
                    type="email"
                    name="managerEmail"
                    value={formData.managerEmail}
                    onChange={handleInputChange}
                    className="admin-franchises__form-input"
                  />
                </div>
              </div>

              <div className="admin-franchises__form-section">
                <h3 className="admin-franchises__form-section-title">Additional Information</h3>
                
                <div className="admin-franchises__form-row">
                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                    />
                  </div>

                  <div className="admin-franchises__form-group">
                    <label className="admin-franchises__form-label">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="admin-franchises__form-input"
                    />
                  </div>
                </div>

                <div className="admin-franchises__form-group">
                  <label className="admin-franchises__form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="admin-franchises__form-select"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="PROBATION">Probation</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="CLOSED">Closed</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                  </select>
                </div>
              </div>

              <div className="admin-franchises__form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-franchises__form-button admin-franchises__form-button--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-franchises__form-button admin-franchises__form-button--primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingFranchise ? 'Update Franchise' : 'Add Franchise')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFranchises;