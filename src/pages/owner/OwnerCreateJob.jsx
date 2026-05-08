import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ownerService from '../../services/ownerService';
import './OwnerCreateJob.css';
import { formatDateForAPI } from '../../utils/formatters';
// ======================================================
// Owner Create Job Page Component
// Allows franchise owners to create new job postings
// ======================================================

const OwnerCreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

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

  const onSubmit = async (data) => {
  setLoading(true);
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
      // 🔴 USE THE HELPER FUNCTION
      applicationDeadline: formatDateForAPI(data.applicationDeadline)
    };

    await ownerService.createJob(jobData);
    navigate('/owner/jobs', { 
      state: { message: 'Job posted successfully!' } 
    });
  } catch (err) {
    setError(err.message || 'Failed to create job. Please try again.');
    console.error('Error creating job:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="owner-create-job">
      {/* Header */}
      <div className="owner-create-job__header">
        <h1 className="owner-create-job__title">Post a New Job</h1>
        <p className="owner-create-job__subtitle">
          Create a job posting to find the perfect candidate
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="owner-create-job__error">
          <span className="owner-create-job__error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="owner-create-job__form">
        {/* Basic Information */}
        <div className="owner-create-job__card">
          <h2 className="owner-create-job__card-title">
            <span className="owner-create-job__card-icon">📋</span>
            Basic Information
          </h2>

          <div className="owner-create-job__form-group">
            <label className="owner-create-job__form-label">
              Job Title *
            </label>
            <input
              type="text"
              className={`owner-create-job__form-input ${errors.title ? 'owner-create-job__form-input--error' : ''}`}
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
              <span className="owner-create-job__form-error">{errors.title.message}</span>
            )}
          </div>

          <div className="owner-create-job__form-row">
            <div className="owner-create-job__form-group">
              <label className="owner-create-job__form-label">
                Job Type *
              </label>
              <select
                className={`owner-create-job__form-select ${errors.jobType ? 'owner-create-job__form-input--error' : ''}`}
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
                <span className="owner-create-job__form-error">{errors.jobType.message}</span>
              )}
            </div>

            <div className="owner-create-job__form-group">
              <label className="owner-create-job__form-label">
                Location *
              </label>
              <select
                className={`owner-create-job__form-select ${errors.location ? 'owner-create-job__form-input--error' : ''}`}
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
                <span className="owner-create-job__form-error">{errors.location.message}</span>
              )}
            </div>
          </div>

          <div className="owner-create-job__form-row">
            <div className="owner-create-job__form-group">
              <label className="owner-create-job__form-label">
                Salary Range *
              </label>
              <input
                type="text"
                className={`owner-create-job__form-input ${errors.salaryRange ? 'owner-create-job__form-input--error' : ''}`}
                placeholder="e.g., ₹15,000 - ₹20,000 per month"
                {...register('salaryRange', { 
                  required: 'Salary range is required'
                })}
              />
              {errors.salaryRange && (
                <span className="owner-create-job__form-error">{errors.salaryRange.message}</span>
              )}
            </div>

            <div className="owner-create-job__form-group">
              <label className="owner-create-job__form-label">
                Positions Available *
              </label>
              <input
                type="number"
                className={`owner-create-job__form-input ${errors.positionsAvailable ? 'owner-create-job__form-input--error' : ''}`}
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
                <span className="owner-create-job__form-error">{errors.positionsAvailable.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="owner-create-job__card">
          <h2 className="owner-create-job__card-title">
            <span className="owner-create-job__card-icon">📝</span>
            Job Description & Requirements
          </h2>

          <div className="owner-create-job__form-group">
            <label className="owner-create-job__form-label">
              Job Description *
            </label>
            <textarea
              rows="6"
              className={`owner-create-job__form-textarea ${errors.description ? 'owner-create-job__form-input--error' : ''}`}
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
              <span className="owner-create-job__form-error">{errors.description.message}</span>
            )}
          </div>

          <div className="owner-create-job__form-group">
            <label className="owner-create-job__form-label">
              Requirements *
            </label>
            <textarea
              rows="4"
              className={`owner-create-job__form-textarea ${errors.requirements ? 'owner-create-job__form-input--error' : ''}`}
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
              <span className="owner-create-job__form-error">{errors.requirements.message}</span>
            )}
          </div>

          <div className="owner-create-job__form-group">
            <label className="owner-create-job__form-label">
              Experience Required *
            </label>
            <select
              className={`owner-create-job__form-select ${errors.experienceRequired ? 'owner-create-job__form-input--error' : ''}`}
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
              <span className="owner-create-job__form-error">{errors.experienceRequired.message}</span>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="owner-create-job__card">
          <h2 className="owner-create-job__card-title">
            <span className="owner-create-job__card-icon">⏰</span>
            Additional Information
          </h2>

          <div className="owner-create-job__form-group">
            <label className="owner-create-job__form-label">
              Application Deadline
            </label>
            <input
              type="date"
              className="owner-create-job__form-input"
              {...register('applicationDeadline')}
            />
            <p className="owner-create-job__form-hint">
              Leave blank for no deadline
            </p>
          </div>

          <div className="owner-create-job__form-tips">
            <h3 className="owner-create-job__tips-title">💡 Tips for a Great Job Posting</h3>
            <ul className="owner-create-job__tips-list">
              <li>Use a clear and specific job title</li>
              <li>Describe the role accurately</li>
              <li>List both required and preferred qualifications</li>
              <li>Mention any benefits or perks</li>
              <li>Be transparent about the salary range</li>
              <li>Proofread before posting</li>
            </ul>
          </div>
        </div>

        {/* Form Actions */}
        <div className="owner-create-job__form-actions">
          <button
            type="button"
            onClick={() => navigate('/owner/jobs')}
            className="owner-create-job__cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="owner-create-job__submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="owner-create-job__spinner"></span>
                Posting...
              </>
            ) : (
              'Post Job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerCreateJob;