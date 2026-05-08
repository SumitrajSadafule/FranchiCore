import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ownerService from '../../services/ownerService';
import './OwnerFranchise.css';

// ======================================================
// Owner Franchise Page Component
// Allows franchise owners to view and update their franchise details
// ======================================================

const OwnerFranchise = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [franchise, setFranchise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchFranchise();
  }, []);

  const fetchFranchise = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ownerService.getFranchise();
      setFranchise(data);
      
      // Reset form with franchise data
      reset({
        franchiseName: data.franchiseName || '',
        phone: data.phone || '',
        email: data.email || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        state: data.state || '',
        postalCode: data.postalCode || '',
        operatingHours: data.operatingHours || '',
        managerName: data.managerName || '',
        managerPhone: data.managerPhone || '',
        managerEmail: data.managerEmail || ''
      });
    } catch (err) {
      setError('Failed to load franchise details. Please refresh the page.');
      console.error('Error loading franchise:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const updatedFranchise = await ownerService.updateFranchise(data);
      setFranchise(updatedFranchise);
      setIsEditing(false);
      setSuccessMessage('Franchise details updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update franchise. Please try again.');
      console.error('Error updating franchise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    reset({
      franchiseName: franchise.franchiseName || '',
      phone: franchise.phone || '',
      email: franchise.email || '',
      addressLine1: franchise.addressLine1 || '',
      addressLine2: franchise.addressLine2 || '',
      city: franchise.city || '',
      state: franchise.state || '',
      postalCode: franchise.postalCode || '',
      operatingHours: franchise.operatingHours || '',
      managerName: franchise.managerName || '',
      managerPhone: franchise.managerPhone || '',
      managerEmail: franchise.managerEmail || ''
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'success',
      'UNDER_REVIEW': 'warning',
      'PROBATION': 'warning',
      'SUSPENDED': 'error',
      'CLOSED': 'error',
      'PENDING_APPROVAL': 'info'
    };
    return colors[status] || 'default';
  };

  if (loading && !franchise) {
    return (
      <div className="owner-franchise">
        <div className="owner-franchise__loading">
          <div className="owner-franchise__spinner"></div>
          <p>Loading franchise details...</p>
        </div>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="owner-franchise">
        <div className="owner-franchise__error">
          <span className="owner-franchise__error-icon">😕</span>
          <h3>No Franchise Found</h3>
          <p>You don't have a franchise assigned to your account yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-franchise">
      {/* Header */}
      <div className="owner-franchise__header">
        <div>
          <h1 className="owner-franchise__title">My Franchise</h1>
          <p className="owner-franchise__subtitle">Manage your franchise location details</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="owner-franchise__edit-button"
          >
            ✏️ Edit Franchise
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="owner-franchise__error-message">
          <span className="owner-franchise__error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="owner-franchise__success-message">
          <span className="owner-franchise__success-icon">✅</span>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Status Banner */}
      <div className={`owner-franchise__status-banner owner-franchise__status-banner--${getStatusColor(franchise.status)}`}>
        <div className="owner-franchise__status-icon">
          {franchise.status === 'ACTIVE' ? '✅' : '⏳'}
        </div>
        <div className="owner-franchise__status-info">
          <h3 className="owner-franchise__status-title">
            Franchise Status: {franchise.statusDisplay?.label}
          </h3>
          <p className="owner-franchise__status-description">
            {franchise.statusDisplay?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="owner-franchise__grid">
        {/* Basic Information */}
        <div className="owner-franchise__card">
          <div className="owner-franchise__card-header">
            <h2 className="owner-franchise__card-title">
              <span className="owner-franchise__card-icon">🏪</span>
              Basic Information
            </h2>
          </div>
          
          <div className="owner-franchise__card-content">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="owner-franchise__form">
                <div className="owner-franchise__form-group">
                  <label className="owner-franchise__form-label">Franchise Name *</label>
                  <input
                    type="text"
                    className={`owner-franchise__form-input ${errors.franchiseName ? 'owner-franchise__form-input--error' : ''}`}
                    {...register('franchiseName', { 
                      required: 'Franchise name is required'
                    })}
                  />
                  {errors.franchiseName && (
                    <span className="owner-franchise__form-error">{errors.franchiseName.message}</span>
                  )}
                </div>

                <div className="owner-franchise__form-row">
                  <div className="owner-franchise__form-group">
                    <label className="owner-franchise__form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`owner-franchise__form-input ${errors.phone ? 'owner-franchise__form-input--error' : ''}`}
                      {...register('phone', { 
                        required: 'Phone number is required'
                      })}
                    />
                    {errors.phone && (
                      <span className="owner-franchise__form-error">{errors.phone.message}</span>
                    )}
                  </div>

                  <div className="owner-franchise__form-group">
                    <label className="owner-franchise__form-label">Email *</label>
                    <input
                      type="email"
                      className={`owner-franchise__form-input ${errors.email ? 'owner-franchise__form-input--error' : ''}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <span className="owner-franchise__form-error">{errors.email.message}</span>
                    )}
                  </div>
                </div>

                <div className="owner-franchise__form-group">
                  <label className="owner-franchise__form-label">Operating Hours</label>
                  <input
                    type="text"
                    className="owner-franchise__form-input"
                    placeholder="e.g., Mon-Sun: 10:00 AM - 11:00 PM"
                    {...register('operatingHours')}
                  />
                </div>
              </form>
            ) : (
              <div className="owner-franchise__info-list">
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Franchise Name:</span>
                  <span className="owner-franchise__info-value">{franchise.franchiseName}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Franchise Code:</span>
                  <span className="owner-franchise__info-value">{franchise.franchiseCode}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Phone:</span>
                  <span className="owner-franchise__info-value">{franchise.phone}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Email:</span>
                  <span className="owner-franchise__info-value">{franchise.email}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Operating Hours:</span>
                  <span className="owner-franchise__info-value">{franchise.operatingHours || 'Not specified'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="owner-franchise__card">
          <div className="owner-franchise__card-header">
            <h2 className="owner-franchise__card-title">
              <span className="owner-franchise__card-icon">📍</span>
              Location Details
            </h2>
          </div>
          
          <div className="owner-franchise__card-content">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="owner-franchise__form">
                <div className="owner-franchise__form-group">
                  <label className="owner-franchise__form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    className={`owner-franchise__form-input ${errors.addressLine1 ? 'owner-franchise__form-input--error' : ''}`}
                    {...register('addressLine1', { 
                      required: 'Address is required'
                    })}
                  />
                  {errors.addressLine1 && (
                    <span className="owner-franchise__form-error">{errors.addressLine1.message}</span>
                  )}
                </div>

                <div className="owner-franchise__form-group">
                  <label className="owner-franchise__form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="owner-franchise__form-input"
                    {...register('addressLine2')}
                  />
                </div>

                <div className="owner-franchise__form-row">
                  <div className="owner-franchise__form-group">
                    <label className="owner-franchise__form-label">City *</label>
                    <input
                      type="text"
                      className={`owner-franchise__form-input ${errors.city ? 'owner-franchise__form-input--error' : ''}`}
                      {...register('city', { 
                        required: 'City is required'
                      })}
                    />
                    {errors.city && (
                      <span className="owner-franchise__form-error">{errors.city.message}</span>
                    )}
                  </div>

                  <div className="owner-franchise__form-group">
                    <label className="owner-franchise__form-label">State *</label>
                    <input
                      type="text"
                      className={`owner-franchise__form-input ${errors.state ? 'owner-franchise__form-input--error' : ''}`}
                      {...register('state', { 
                        required: 'State is required'
                      })}
                    />
                    {errors.state && (
                      <span className="owner-franchise__form-error">{errors.state.message}</span>
                    )}
                  </div>
                </div>

                <div className="owner-franchise__form-group">
                  <label className="owner-franchise__form-label">Postal Code *</label>
                  <input
                    type="text"
                    className={`owner-franchise__form-input ${errors.postalCode ? 'owner-franchise__form-input--error' : ''}`}
                    {...register('postalCode', { 
                      required: 'Postal code is required'
                    })}
                  />
                  {errors.postalCode && (
                    <span className="owner-franchise__form-error">{errors.postalCode.message}</span>
                  )}
                </div>
              </form>
            ) : (
              <div className="owner-franchise__info-list">
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Address:</span>
                  <span className="owner-franchise__info-value">{franchise.fullAddress}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">City:</span>
                  <span className="owner-franchise__info-value">{franchise.city}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">State:</span>
                  <span className="owner-franchise__info-value">{franchise.state}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Postal Code:</span>
                  <span className="owner-franchise__info-value">{franchise.postalCode}</span>
                </div>
                {franchise.latitude && franchise.longitude && (
                  <div className="owner-franchise__info-item">
                    <span className="owner-franchise__info-label">Coordinates:</span>
                    <span className="owner-franchise__info-value">
                      {franchise.latitude}, {franchise.longitude}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Manager Information */}
        <div className="owner-franchise__card">
          <div className="owner-franchise__card-header">
            <h2 className="owner-franchise__card-title">
              <span className="owner-franchise__card-icon">👤</span>
              Manager Information
            </h2>
          </div>
          
          <div className="owner-franchise__card-content">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="owner-franchise__form">
                <div className="owner-franchise__form-group">
                  <label className="owner-franchise__form-label">Manager Name</label>
                  <input
                    type="text"
                    className="owner-franchise__form-input"
                    {...register('managerName')}
                  />
                </div>

                <div className="owner-franchise__form-row">
                  <div className="owner-franchise__form-group">
                    <label className="owner-franchise__form-label">Manager Phone</label>
                    <input
                      type="tel"
                      className="owner-franchise__form-input"
                      {...register('managerPhone')}
                    />
                  </div>

                  <div className="owner-franchise__form-group">
                    <label className="owner-franchise__form-label">Manager Email</label>
                    <input
                      type="email"
                      className="owner-franchise__form-input"
                      {...register('managerEmail')}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="owner-franchise__info-list">
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Manager Name:</span>
                  <span className="owner-franchise__info-value">{franchise.managerName || 'Not assigned'}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Manager Phone:</span>
                  <span className="owner-franchise__info-value">{franchise.managerPhone || 'Not assigned'}</span>
                </div>
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Manager Email:</span>
                  <span className="owner-franchise__info-value">{franchise.managerEmail || 'Not assigned'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="owner-franchise__card">
          <div className="owner-franchise__card-header">
            <h2 className="owner-franchise__card-title">
              <span className="owner-franchise__card-icon">📊</span>
              Additional Information
            </h2>
          </div>
          
          <div className="owner-franchise__card-content">
            <div className="owner-franchise__info-list">
              <div className="owner-franchise__info-item">
                <span className="owner-franchise__info-label">Established:</span>
                <span className="owner-franchise__info-value">
                  {franchise.openingDate ? new Date(franchise.openingDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="owner-franchise__info-item">
                <span className="owner-franchise__info-label">Last Updated:</span>
                <span className="owner-franchise__info-value">
                  {franchise.updatedAt ? new Date(franchise.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {franchise.notes && (
                <div className="owner-franchise__info-item">
                  <span className="owner-franchise__info-label">Notes:</span>
                  <span className="owner-franchise__info-value">{franchise.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions (when editing) */}
      {isEditing && (
        <div className="owner-franchise__form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="owner-franchise__cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="owner-franchise__save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OwnerFranchise;