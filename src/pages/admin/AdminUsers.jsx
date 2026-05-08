import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiMethods } from '../../services/api';
import './AdminUsers.css';

// ======================================================
// Admin Users Page Component
// Super admin interface for managing users
// Allows creating, editing, and managing user accounts
// ======================================================

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [franchises, setFranchises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchFranchises();
  }, [currentPage, roleFilter, searchQuery]);

  // 🔴 CHANGED: Fetch users from backend API
const fetchUsers = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await apiMethods.admin.getUsers(
      currentPage,
      itemsPerPage,
      'id',
      'ASC'
    );
    
    // Get all users from response
    const allUsers = response.content || [];
    
    // Filter out admin users AFTER getting from API
    const filteredData = allUsers.filter(user => user.username !== 'admin');
    
    // IMPORTANT: Update pagination info based on filtered count
    // Since we filtered out admin, we need to recalculate
    // But the backend pagination is based on total users including admin
    // So we use the backend's totalPages for navigation
    
    setUsers(filteredData);
    setFilteredUsers(filteredData);
    
    // Use backend's pagination info for total pages and items
    setTotalPages(response.totalPages || 0);
    setTotalItems(response.totalElements || 0);
  } catch (err) {
    setError('Failed to load users. Please try again.');
    console.error('Error fetching users:', err);
  } finally {
    setLoading(false);
  }
};

const fetchFranchises = async () => {
  try {
    const response = await apiMethods.franchises.getAll(0, 100, 'franchiseName', 'ASC');
    // 🔴 FIX: The API returns array directly, not response.content
    const franchisesData = Array.isArray(response) ? response : response.content || [];
    setFranchises(franchisesData);
    console.log('Franchises loaded:', franchisesData.length); // Debug log
  } catch (err) {
    console.error('Error fetching franchises:', err);
  }
};

  const handleAddNew = () => {
    setEditingUser(null);
    reset({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'ROLE_CUSTOMER',
      franchiseId: '',
      enabled: true
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('firstName', user.firstName);
    setValue('lastName', user.lastName || '');
    setValue('phone', user.phone || '');
    setValue('role', user.roles[0]);
    setValue('franchiseId', user.franchiseId || '');
    setValue('enabled', user.enabled);
    setShowModal(true);
  };

  // 🔴 CHANGED: Delete user with backend API
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiMethods.admin.deleteUser(id);
      await fetchUsers(); // Refresh the list
      alert('User deleted successfully!');
    } catch (err) {
      alert('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  // 🔴 CHANGED: Toggle user status with backend API
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await apiMethods.admin.toggleUserStatus(id);
      await fetchUsers(); // Refresh the list
      const newStatus = !currentStatus ? 'activated' : 'deactivated';
      alert(`User ${newStatus} successfully!`);
    } catch (err) {
      alert('Failed to update user status. Please try again.');
      console.error('Error updating user status:', err);
    }
  };

  // 🔴 CHANGED: Create/Update user with backend API
const onSubmit = async (data) => {
  setLoading(true);

  try {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    const userData = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      enabled: data.enabled,
      franchiseId: data.franchiseId ? parseInt(data.franchiseId) : null
    };

    if (!editingUser) {
      userData.password = data.password;
    }

    if (editingUser) {
      await apiMethods.admin.updateUser(editingUser.id, userData);
      alert('User updated successfully!');
    } else {
      await apiMethods.admin.createUser(userData);
      alert('User created successfully!');
    }

    setShowModal(false);
    
    // 🔴 FIX: Reset to first page to see the updated user
    setCurrentPage(0);
    
    // 🔴 FIX: Small delay to ensure modal is closed before refresh
    setTimeout(() => {
      fetchUsers();
    }, 100);
    
  } catch (err) {
    alert(err.message || 'Failed to save user. Please try again.');
    console.error('Error saving user:', err);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setCurrentPage(0);
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'ROLE_SUPER_ADMIN': 'badge--primary',
      'ROLE_FRANCHISE_OWNER': 'badge--success',
      'ROLE_CUSTOMER': 'badge--info',
      'ROLE_JOB_SEEKER': 'badge--warning',
      'ROLE_APPLICANT': 'badge--secondary'
    };
    return classes[role] || 'badge--default';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      'ROLE_SUPER_ADMIN': 'Super Admin',
      'ROLE_FRANCHISE_OWNER': 'Franchise Owner',
      'ROLE_CUSTOMER': 'Customer',
      'ROLE_JOB_SEEKER': 'Job Seeker',
      'ROLE_APPLICANT': 'Applicant'
    };
    return names[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="admin-users__header">
        <div>
          <h1 className="admin-users__title">User Management</h1>
          <p className="admin-users__subtitle">
            Manage all users, roles, and permissions
          </p>
        </div>
        <button onClick={handleAddNew} className="admin-users__add-button">
          <span className="admin-users__add-icon">+</span>
          Create New User
        </button>
      </div>

      {/* Filters */}
      <div className="admin-users__filters">
        <form onSubmit={handleSearch} className="admin-users__search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-users__search-input"
          />
          <button type="submit" className="admin-users__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="admin-users__filter-select"
        >
          <option value="all">All Roles</option>
          <option value="ROLE_SUPER_ADMIN">Super Admin</option>
          <option value="ROLE_FRANCHISE_OWNER">Franchise Owner</option>
          <option value="ROLE_CUSTOMER">Customer</option>
          <option value="ROLE_JOB_SEEKER">Job Seeker</option>
          <option value="ROLE_APPLICANT">Applicant</option>
        </select>

        {(searchQuery || roleFilter !== 'all') && (
          <button onClick={clearFilters} className="admin-users__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="admin-users__results-info">
        Showing {users.length} of {totalItems -1} users
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-users__loading">
          <div className="admin-users__spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-users__error">
          <span className="admin-users__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchUsers} className="admin-users__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <>
          <div className="admin-users__table-container">
            <table className="admin-users__table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Franchise</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Last_Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-users__user-info">
                        <div className="admin-users__user-avatar">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div className="admin-users__user-name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="admin-users__user-username">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-users__contact-info">
                        <div>📧 {user.email}</div>
                        <div>📞 {user.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      {user.roles && user.roles.map(role => (
                        <span
                          key={role}
                          className={`admin-users__role-badge ${getRoleBadgeClass(role)}`}
                        >
                          {getRoleDisplayName(role)}
                        </span>
                      ))}
                    </td>
                    <td>
                      {user.franchiseName ? (
                        <span className="admin-users__franchise-name">
                          {user.franchiseName}
                        </span>
                      ) : (
                        <span className="admin-users__franchise-na">—</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.enabled)}
                        className={`admin-users__status-badge ${
                          user.enabled ? 'admin-users__status-badge--active' : 'admin-users__status-badge--inactive'
                        }`}
                      >
                        {user.enabled ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <span className="admin-users__date">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span className="admin-users__date">
                        {formatDate(user.lastLogin)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-users__actions">
                        <button
                          onClick={() => handleEdit(user)}
                          className="admin-users__action-btn admin-users__action-btn--edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="admin-users__action-btn admin-users__action-btn--delete"
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
            <div className="admin-users__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="admin-users__pagination-btn"
              >
                ← Previous
              </button>
              <span className="admin-users__pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="admin-users__pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="admin-users__modal-overlay">
          <div className="admin-users__modal">
            <div className="admin-users__modal-header">
              <h2 className="admin-users__modal-title">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="admin-users__modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="admin-users__modal-form">
              <div className="admin-users__form-section">
                <h3 className="admin-users__form-section-title">Account Information</h3>
                
                <div className="admin-users__form-row">
                  <div className="admin-users__form-group">
                    <label className="admin-users__form-label">Username *</label>
                    <input
                      type="text"
                      className={`admin-users__form-input ${errors.username ? 'admin-users__form-input--error' : ''}`}
                      {...register('username', { 
                        required: 'Username is required',
                        minLength: {
                          value: 3,
                          message: 'Username must be at least 3 characters'
                        }
                      })}
                      disabled={editingUser}
                    />
                    {errors.username && (
                      <span className="admin-users__form-error">{errors.username.message}</span>
                    )}
                  </div>

                  <div className="admin-users__form-group">
                    <label className="admin-users__form-label">Email *</label>
                    <input
                      type="email"
                      className={`admin-users__form-input ${errors.email ? 'admin-users__form-input--error' : ''}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <span className="admin-users__form-error">{errors.email.message}</span>
                    )}
                  </div>
                </div>

                {!editingUser && (
                  <div className="admin-users__form-row">
                    <div className="admin-users__form-group">
                      <label className="admin-users__form-label">Password *</label>
                      <input
                        type="password"
                        className={`admin-users__form-input ${errors.password ? 'admin-users__form-input--error' : ''}`}
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                      />
                      {errors.password && (
                        <span className="admin-users__form-error">{errors.password.message}</span>
                      )}
                    </div>

                    <div className="admin-users__form-group">
                      <label className="admin-users__form-label">Confirm Password *</label>
                      <input
                        type="password"
                        className={`admin-users__form-input ${errors.confirmPassword ? 'admin-users__form-input--error' : ''}`}
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password'
                        })}
                      />
                      {errors.confirmPassword && (
                        <span className="admin-users__form-error">{errors.confirmPassword.message}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-users__form-section">
                <h3 className="admin-users__form-section-title">Personal Information</h3>
                
                <div className="admin-users__form-row">
                  <div className="admin-users__form-group">
                    <label className="admin-users__form-label">First Name *</label>
                    <input
                      type="text"
                      className={`admin-users__form-input ${errors.firstName ? 'admin-users__form-input--error' : ''}`}
                      {...register('firstName', { 
                        required: 'First name is required'
                      })}
                    />
                    {errors.firstName && (
                      <span className="admin-users__form-error">{errors.firstName.message}</span>
                    )}
                  </div>

                  <div className="admin-users__form-group">
                    <label className="admin-users__form-label">Last Name</label>
                    <input
                      type="text"
                      className="admin-users__form-input"
                      {...register('lastName')}
                    />
                  </div>
                </div>

                <div className="admin-users__form-group">
                  <label className="admin-users__form-label">Phone</label>
                  <input
                    type="tel"
                    className="admin-users__form-input"
                    {...register('phone')}
                  />
                </div>
              </div>

              <div className="admin-users__form-section">
                <h3 className="admin-users__form-section-title">Role & Permissions</h3>
                
                <div className="admin-users__form-row">
                  <div className="admin-users__form-group">
                    <label className="admin-users__form-label">Role *</label>
                    <select
                      className={`admin-users__form-select ${errors.role ? 'admin-users__form-input--error' : ''}`}
                      {...register('role', { 
                        required: 'Please select a role'
                      })}
                    >
                      <option value="ROLE_CUSTOMER">Customer</option>
                      <option value="ROLE_FRANCHISE_OWNER">Franchise Owner</option>
                      <option value="ROLE_JOB_SEEKER">Job Seeker</option>
                      <option value="ROLE_APPLICANT">Applicant</option>
                      <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <div className="admin-users__form-group">
                    <label className="admin-users__form-label">Franchise (for owners)</label>
                    <select
                      className="admin-users__form-select"
                      {...register('franchiseId')}
                    >
                      <option value="">Select Franchise</option>
                      {franchises.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.franchiseName} - {f.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-users__form-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      {...register('enabled')}
                    />
                      Account Enabled
                  </label>
                </div>
              </div>

              <div className="admin-users__form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-users__form-button admin-users__form-button--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-users__form-button admin-users__form-button--primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;