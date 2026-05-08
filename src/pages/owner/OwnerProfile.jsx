import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import ownerService from '../../services/ownerService';
import './OwnerProfile.css';

// ======================================================
// Owner Profile Page Component
// Allows franchise owners to view and update their profile
// ======================================================

const OwnerProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profile, setProfile] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors }, 
    reset: resetPassword,
    watch 
  } = useForm();

  const newPassword = watch('newPassword');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await ownerService.getProfile();
      setProfile(data);
      
      // Reset form with profile data
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || ''
      });
    } catch (err) {
      setError('Failed to load profile. Please refresh the page.');
      console.error('Error loading profile:', err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const updatedProfile = await ownerService.updateProfile(data);
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await ownerService.changePassword(data.oldPassword, data.newPassword);
      setSuccessMessage('Password changed successfully!');
      setShowPasswordForm(false);
      resetPassword();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile) return '';
    const first = profile.firstName?.[0] || '';
    const last = profile.lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  if (!profile) {
    return (
      <div className="owner-profile">
        <div className="owner-profile__loading">
          <div className="owner-profile__spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-profile">
      {/* Header */}
      <div className="owner-profile__header">
        <h1 className="owner-profile__title">My Profile</h1>
        <p className="owner-profile__subtitle">Manage your personal information and password</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="owner-profile__error">
          <span className="owner-profile__error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="owner-profile__success">
          <span className="owner-profile__success-icon">✅</span>
          <p>{successMessage}</p>
        </div>
      )}

      <div className="owner-profile__grid">
        {/* Profile Information Card */}
        <div className="owner-profile__card">
          <div className="owner-profile__card-header">
            <h2 className="owner-profile__card-title">
              <span className="owner-profile__card-icon">👤</span>
              Personal Information
            </h2>
          </div>
          
          <div className="owner-profile__card-content">
            <div className="owner-profile__avatar-section">
              <div className="owner-profile__avatar">
                {getInitials()}
              </div>
              <div className="owner-profile__avatar-info">
                <h3 className="owner-profile__avatar-name">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="owner-profile__avatar-role">Franchise Owner</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="owner-profile__form">
              <div className="owner-profile__form-row">
                <div className="owner-profile__form-group">
                  <label className="owner-profile__form-label">First Name *</label>
                  <input
                    type="text"
                    className={`owner-profile__form-input ${errors.firstName ? 'owner-profile__form-input--error' : ''}`}
                    {...register('firstName', { 
                      required: 'First name is required',
                      maxLength: {
                        value: 50,
                        message: 'First name cannot exceed 50 characters'
                      }
                    })}
                  />
                  {errors.firstName && (
                    <span className="owner-profile__form-error">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="owner-profile__form-group">
                  <label className="owner-profile__form-label">Last Name</label>
                  <input
                    type="text"
                    className="owner-profile__form-input"
                    {...register('lastName', {
                      maxLength: {
                        value: 50,
                        message: 'Last name cannot exceed 50 characters'
                      }
                    })}
                  />
                </div>
              </div>

              <div className="owner-profile__form-group">
                <label className="owner-profile__form-label">Email Address *</label>
                <input
                  type="email"
                  className={`owner-profile__form-input ${errors.email ? 'owner-profile__form-input--error' : ''}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <span className="owner-profile__form-error">{errors.email.message}</span>
                )}
              </div>

              <div className="owner-profile__form-group">
                <label className="owner-profile__form-label">Phone Number</label>
                <input
                  type="tel"
                  className="owner-profile__form-input"
                  {...register('phone', {
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter a valid 10-digit mobile number'
                    }
                  })}
                />
                {errors.phone && (
                  <span className="owner-profile__form-error">{errors.phone.message}</span>
                )}
              </div>

              <div className="owner-profile__form-actions">
                <button
                  type="submit"
                  className="owner-profile__submit-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="owner-profile__card">
          <div className="owner-profile__card-header">
            <h2 className="owner-profile__card-title">
              <span className="owner-profile__card-icon">🔒</span>
              Security
            </h2>
          </div>
          
          <div className="owner-profile__card-content">
            {!showPasswordForm ? (
              <div className="owner-profile__password-info">
                <p className="owner-profile__password-text">
                  Your password was last changed 30 days ago. For security, we recommend changing it regularly.
                </p>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="owner-profile__change-password-button"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="owner-profile__form">
                <div className="owner-profile__form-group">
                  <label className="owner-profile__form-label">Current Password *</label>
                  <input
                    type="password"
                    className={`owner-profile__form-input ${passwordErrors.oldPassword ? 'owner-profile__form-input--error' : ''}`}
                    {...registerPassword('oldPassword', { 
                      required: 'Current password is required'
                    })}
                  />
                  {passwordErrors.oldPassword && (
                    <span className="owner-profile__form-error">{passwordErrors.oldPassword.message}</span>
                  )}
                </div>

                <div className="owner-profile__form-group">
                  <label className="owner-profile__form-label">New Password *</label>
                  <input
                    type="password"
                    className={`owner-profile__form-input ${passwordErrors.newPassword ? 'owner-profile__form-input--error' : ''}`}
                    {...registerPassword('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
                        message: 'Password must contain at least one letter and one number'
                      }
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <span className="owner-profile__form-error">{passwordErrors.newPassword.message}</span>
                  )}
                </div>

                <div className="owner-profile__form-group">
                  <label className="owner-profile__form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    className={`owner-profile__form-input ${passwordErrors.confirmPassword ? 'owner-profile__form-input--error' : ''}`}
                    {...registerPassword('confirmPassword', { 
                      required: 'Please confirm your new password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="owner-profile__form-error">{passwordErrors.confirmPassword.message}</span>
                  )}
                </div>

                <div className="owner-profile__form-actions">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="owner-profile__cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="owner-profile__submit-button"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account Info Card */}
        <div className="owner-profile__card">
          <div className="owner-profile__card-header">
            <h2 className="owner-profile__card-title">
              <span className="owner-profile__card-icon">ℹ️</span>
              Account Information
            </h2>
          </div>
          
          <div className="owner-profile__card-content">
            <div className="owner-profile__info-list">
              <div className="owner-profile__info-item">
                <span className="owner-profile__info-label">Username:</span>
                <span className="owner-profile__info-value">{profile.username}</span>
              </div>
              <div className="owner-profile__info-item">
                <span className="owner-profile__info-label">Account Type:</span>
                <span className="owner-profile__info-value">Franchise Owner</span>
              </div>
              <div className="owner-profile__info-item">
                <span className="owner-profile__info-label">Member Since:</span>
                <span className="owner-profile__info-value">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div className="owner-profile__info-item">
                <span className="owner-profile__info-label">Last Login:</span>
                <span className="owner-profile__info-value">
                  {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('en-IN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;