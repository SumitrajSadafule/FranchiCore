import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ownerService from '../../services/ownerService';
import jobService from '../../services/jobService';
import './OwnerEditJob.css';
import { formatDateForAPI, formatDateForInput } from '../../utils/formatters';

// ======================================================
// Owner Edit Job Page Component
// Allows franchise owners to edit existing job postings
// ======================================================

const OwnerEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time', icon: '⏰' },
    { value: 'PART_TIME', label: 'Part Time', icon: '⚡' },
    { value: 'CONTRACT', label: 'Contract', icon: '📝' },
    { value: 'INTERNSHIP', label: 'Internship', icon: '🎓' }
  ];

  const experienceLevels = [
    'Fresher',
    '0-1 years',
    '1-2 years',
    '2-3 years',
    '3-5 years',
    '5+ years'
  ];

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  useEffect(() => {
    console.log('Job ID from URL:', id);  // ADD THIS - Should be number, not 'edit'
  if (!id || id === 'edit') {
    setError('Invalid job ID');
    setLoading(false);
    return;
  }
    fetchJob();
  }, [id]);

const fetchJob = async () => {
  try {
    // Use getJobById API instead of fetching all jobs
    const response = await jobService.getJobById(id);
    
    if (response) {
      setJob(response);
      
      reset({
        title: response.title,
        description: response.description,
        requirements: response.requirements,
        jobType: response.jobType,
        location: response.location,
        salaryRange: response.salaryRange,
        experienceRequired: response.experienceRequired,
        positionsAvailable: response.positionsAvailable,
        applicationDeadline: response.applicationDeadline ? response.applicationDeadline.split('T')[0] : ''
      });
    } else {
      setError('Job not found');
    }
  } catch (err) {
    setError('Failed to load job details');
    console.error('Error fetching job:', err);
  } finally {
    setLoading(false);
  }
};


  const onSubmit = async (data) => {
  setSubmitting(true);
  setError(null);

  try {
    const jobData = {
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      jobType: data.jobType,
      location: data.location,
      salaryRange: data.salaryRange,
      experienceRequired: data.experienceRequired,
      positionsAvailable: parseInt(data.positionsAvailable),
      franchiseId: job?.franchiseId
    };

    if (data.applicationDeadline) {
      jobData.applicationDeadline = data.applicationDeadline + 'T00:00:00';
    }

    // CHANGED: Use updateJobFull instead of updateJob
    await ownerService.updateJobFull(parseInt(id), jobData);
    navigate('/owner/jobs', { 
      state: { message: 'Job updated successfully!' } 
    });
  } catch (err) {
    setError(err.message || 'Failed to update job. Please try again.');
    console.error('Error updating job:', err);
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="owner-edit-job">
        <div className="owner-edit-job__loading">
          <div className="owner-edit-job__spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-edit-job">
        <div className="owner-edit-job__error">
          <span className="owner-edit-job__error-icon">😕</span>
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/owner/jobs')} className="owner-edit-job__back-button">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-edit-job">
      {/* Header */}
      <div className="owner-edit-job__header">
        <h1 className="owner-edit-job__title">Edit Job</h1>
        <p className="owner-edit-job__subtitle">
          Update job details for <strong>{job?.title}</strong>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="owner-edit-job__error-message">
          <span className="owner-edit-job__error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="owner-edit-job__form">
        {/* Basic Information */}
        <div className="owner-edit-job__card">
          <h2 className="owner-edit-job__card-title">
            <span className="owner-edit-job__card-icon">📋</span>
            Basic Information
          </h2>

          <div className="owner-edit-job__form-group">
            <label className="owner-edit-job__form-label">
              Job Title *
            </label>
            <input
              type="text"
              className={`owner-edit-job__form-input ${errors.title ? 'owner-edit-job__form-input--error' : ''}`}
              placeholder="e.g., Cashier, Kitchen Staff, Manager"
              {...register('title', { 
                required: 'Job title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters'
                }
              })}
            />
            {errors.title && (
              <span className="owner-edit-job__form-error">{errors.title.message}</span>
            )}
          </div>

          <div className="owner-edit-job__form-row">
            <div className="owner-edit-job__form-group">
              <label className="owner-edit-job__form-label">
                Job Type *
              </label>
              <select
                className={`owner-edit-job__form-select ${errors.jobType ? 'owner-edit-job__form-input--error' : ''}`}
                {...register('jobType', { 
                  required: 'Please select a job type'
                })}
              >
                <option value="">Select Job Type</option>
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.jobType && (
                <span className="owner-edit-job__form-error">{errors.jobType.message}</span>
              )}
            </div>

            <div className="owner-edit-job__form-group">
              <label className="owner-edit-job__form-label">
                Location *
              </label>
              <select
                className={`owner-edit-job__form-select ${errors.location ? 'owner-edit-job__form-input--error' : ''}`}
                {...register('location', { 
                  required: 'Please select a location'
                })}
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && (
                <span className="owner-edit-job__form-error">{errors.location.message}</span>
              )}
            </div>
          </div>

          <div className="owner-edit-job__form-row">
            <div className="owner-edit-job__form-group">
              <label className="owner-edit-job__form-label">
                Salary Range *
              </label>
              <input
                type="text"
                className={`owner-edit-job__form-input ${errors.salaryRange ? 'owner-edit-job__form-input--error' : ''}`}
                placeholder="e.g., ₹15,000 - ₹20,000 per month"
                {...register('salaryRange', { 
                  required: 'Salary range is required'
                })}
              />
              {errors.salaryRange && (
                <span className="owner-edit-job__form-error">{errors.salaryRange.message}</span>
              )}
            </div>

            <div className="owner-edit-job__form-group">
              <label className="owner-edit-job__form-label">
                Positions Available *
              </label>
              <input
                type="number"
                className={`owner-edit-job__form-input ${errors.positionsAvailable ? 'owner-edit-job__form-input--error' : ''}`}
                placeholder="Number of openings"
                min="1"
                {...register('positionsAvailable', { 
                  required: 'Number of positions is required',
                  min: {
                    value: 1,
                    message: 'At least 1 position required'
                  }
                })}
              />
              {errors.positionsAvailable && (
                <span className="owner-edit-job__form-error">{errors.positionsAvailable.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="owner-edit-job__card">
          <h2 className="owner-edit-job__card-title">
            <span className="owner-edit-job__card-icon">📝</span>
            Job Description & Requirements
          </h2>

          <div className="owner-edit-job__form-group">
            <label className="owner-edit-job__form-label">
              Job Description *
            </label>
            <textarea
              rows="6"
              className={`owner-edit-job__form-textarea ${errors.description ? 'owner-edit-job__form-input--error' : ''}`}
              placeholder="Describe the role, responsibilities, and what the candidate will do..."
              {...register('description', { 
                required: 'Job description is required',
                minLength: {
                  value: 50,
                  message: 'Description must be at least 50 characters'
                },
                maxLength: {
                  value: 2000,
                  message: 'Description cannot exceed 2000 characters'
                }
              })}
            ></textarea>
            {errors.description && (
              <span className="owner-edit-job__form-error">{errors.description.message}</span>
            )}
          </div>

          <div className="owner-edit-job__form-group">
            <label className="owner-edit-job__form-label">
              Requirements *
            </label>
            <textarea
              rows="4"
              className={`owner-edit-job__form-textarea ${errors.requirements ? 'owner-edit-job__form-input--error' : ''}`}
              placeholder="List the requirements, skills, and qualifications needed..."
              {...register('requirements', { 
                required: 'Requirements are required',
                minLength: {
                  value: 20,
                  message: 'Requirements must be at least 20 characters'
                },
                maxLength: {
                  value: 1000,
                  message: 'Requirements cannot exceed 1000 characters'
                }
              })}
            ></textarea>
            {errors.requirements && (
              <span className="owner-edit-job__form-error">{errors.requirements.message}</span>
            )}
          </div>

          <div className="owner-edit-job__form-group">
            <label className="owner-edit-job__form-label">
              Experience Required *
            </label>
            <select
              className={`owner-edit-job__form-select ${errors.experienceRequired ? 'owner-edit-job__form-input--error' : ''}`}
              {...register('experienceRequired', { 
                required: 'Please select experience level'
              })}
            >
              <option value="">Select Experience Level</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.experienceRequired && (
              <span className="owner-edit-job__form-error">{errors.experienceRequired.message}</span>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="owner-edit-job__card">
          <h2 className="owner-edit-job__card-title">
            <span className="owner-edit-job__card-icon">⏰</span>
            Additional Information
          </h2>

          <div className="owner-edit-job__form-group">
            <label className="owner-edit-job__form-label">
              Application Deadline
            </label>
            <input
              type="date"
              className="owner-edit-job__form-input"
              {...register('applicationDeadline')}
            />
            <p className="owner-edit-job__form-hint">
              Leave blank for no deadline
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="owner-edit-job__form-actions">
          <button
            type="button"
            onClick={() => navigate('/owner/jobs')}
            className="owner-edit-job__cancel-button"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="owner-edit-job__submit-button"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="owner-edit-job__spinner"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerEditJob;