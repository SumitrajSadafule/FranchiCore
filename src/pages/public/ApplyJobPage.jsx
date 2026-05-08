import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import jobService from '../../services/jobService';
import './ApplyJobPage.css';

// ======================================================
// Apply Job Page Component
// Public-facing page for job application submission
// Uses React Hook Form for form handling
// ======================================================

const ApplyJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobService.getJobById(id);
      const formattedJob = jobService.formatJob(response);
      setJob(formattedJob);
    } catch (err) {
      setError('Failed to load job details. Please try again.');
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        ...data,
        jobId: parseInt(id),
        age: parseInt(data.age),
        experienceYears: parseInt(data.experienceYears) || 0
      };

      await jobService.applyForJob(applicationData);
      setSubmitSuccess(true);
      reset();
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="apply-job-page">
        <div className="apply-job-page__loading">
          <div className="apply-job-page__spinner"></div>
          <p>Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="apply-job-page">
        <div className="apply-job-page__error">
          <span className="apply-job-page__error-icon">😕</span>
          <h3>Job Not Found</h3>
          <p>The job you're applying for doesn't exist or has been removed.</p>
          <Link to="/careers" className="apply-job-page__error-button">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="apply-job-page">
        <div className="apply-job-page__success">
          <div className="apply-job-page__success-content">
            <span className="apply-job-page__success-icon">🎉</span>
            <h2 className="apply-job-page__success-title">Application Submitted!</h2>
            <p className="apply-job-page__success-message">
              Thank you for applying to {job.title} at {job.franchiseName}. 
              We'll review your application and get back to you soon.
            </p>
            <div className="apply-job-page__success-actions">
              <Link to="/careers" className="apply-job-page__success-button apply-job-page__success-button--primary">
                Browse More Jobs
              </Link>
              <Link to="/" className="apply-job-page__success-button apply-job-page__success-button--secondary">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-job-page">
      {/* Header */}
      <div className="apply-job-page__header">
        <div className="apply-job-page__header-content container">
          <Link to={`/careers/${id}`} className="apply-job-page__back-link">
            ← Back to Job Details
          </Link>
          <h1 className="apply-job-page__title">Apply for {job.title}</h1>
          <p className="apply-job-page__subtitle">
            {job.franchiseName} • {job.location}
          </p>
        </div>
      </div>

      <div className="apply-job-page__container container">
        <div className="apply-job-page__grid">
          {/* Application Form */}
          <div className="apply-job-page__form-container">
            {error && (
              <div className="apply-job-page__form-error">
                <span className="apply-job-page__form-error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="apply-job-page__form">
              {/* Personal Information */}
              <div className="apply-job-page__form-section">
                <h2 className="apply-job-page__form-section-title">Personal Information</h2>
                
                <div className="apply-job-page__form-group">
                  <label htmlFor="fullName" className="apply-job-page__form-label">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className={`apply-job-page__form-input ${errors.fullName ? 'apply-job-page__form-input--error' : ''}`}
                    placeholder="Enter your full name"
                    {...register('fullName', { 
                      required: 'Full name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                      }
                    })}
                  />
                  {errors.fullName && (
                    <span className="apply-job-page__form-error-message">{errors.fullName.message}</span>
                  )}
                </div>

                <div className="apply-job-page__form-row">
                  <div className="apply-job-page__form-group">
                    <label htmlFor="email" className="apply-job-page__form-label">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`apply-job-page__form-input ${errors.email ? 'apply-job-page__form-input--error' : ''}`}
                      placeholder="your@email.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <span className="apply-job-page__form-error-message">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="apply-job-page__form-group">
                    <label htmlFor="phone" className="apply-job-page__form-label">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={`apply-job-page__form-input ${errors.phone ? 'apply-job-page__form-input--error' : ''}`}
                      placeholder="10-digit mobile number"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Enter a valid 10-digit mobile number'
                        }
                      })}
                    />
                    {errors.phone && (
                      <span className="apply-job-page__form-error-message">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                <div className="apply-job-page__form-row">
                  <div className="apply-job-page__form-group">
                    <label htmlFor="age" className="apply-job-page__form-label">
                      Age *
                    </label>
                    <input
                      id="age"
                      type="number"
                      className={`apply-job-page__form-input ${errors.age ? 'apply-job-page__form-input--error' : ''}`}
                      placeholder="Your age"
                      {...register('age', { 
                        required: 'Age is required',
                        min: {
                          value: 18,
                          message: 'You must be at least 18 years old'
                        },
                        max: {
                          value: 65,
                          message: 'Age must be less than 65'
                        }
                      })}
                    />
                    {errors.age && (
                      <span className="apply-job-page__form-error-message">{errors.age.message}</span>
                    )}
                  </div>

                  <div className="apply-job-page__form-group">
                    <label htmlFor="address" className="apply-job-page__form-label">
                      Current Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="apply-job-page__form-input"
                      placeholder="Your current address"
                      {...register('address')}
                    />
                  </div>
                </div>
              </div>

              {/* Education & Experience */}
              <div className="apply-job-page__form-section">
                <h2 className="apply-job-page__form-section-title">Education & Experience</h2>
                
                <div className="apply-job-page__form-group">
                  <label htmlFor="qualification" className="apply-job-page__form-label">
                    Highest Qualification *
                  </label>
                  <select
                    id="qualification"
                    className={`apply-job-page__form-select ${errors.qualification ? 'apply-job-page__form-input--error' : ''}`}
                    {...register('qualification', { 
                      required: 'Please select your qualification'
                    })}
                  >
                    <option value="">Select Qualification</option>
                    <option value="10th">10th Pass</option>
                    <option value="12th">12th Pass</option>
                    <option value="diploma">Diploma</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Post Graduate</option>
                  </select>
                  {errors.qualification && (
                    <span className="apply-job-page__form-error-message">{errors.qualification.message}</span>
                  )}
                </div>

                <div className="apply-job-page__form-row">
                  <div className="apply-job-page__form-group">
                    <label htmlFor="experienceYears" className="apply-job-page__form-label">
                      Years of Experience
                    </label>
                    <input
                      id="experienceYears"
                      type="number"
                      className="apply-job-page__form-input"
                      placeholder="Years of experience"
                      {...register('experienceYears', {
                        min: {
                          value: 0,
                          message: 'Experience cannot be negative'
                        },
                        max: {
                          value: 50,
                          message: 'Experience seems too high'
                        }
                      })}
                    />
                  </div>

                  <div className="apply-job-page__form-group">
                    <label htmlFor="previousEmployer" className="apply-job-page__form-label">
                      Previous Employer
                    </label>
                    <input
                      id="previousEmployer"
                      type="text"
                      className="apply-job-page__form-input"
                      placeholder="Last company worked for"
                      {...register('previousEmployer')}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="apply-job-page__form-section">
                <h2 className="apply-job-page__form-section-title">Additional Information</h2>
                
                <div className="apply-job-page__form-group">
                  <label htmlFor="coverNote" className="apply-job-page__form-label">
                    Cover Note / Why are you interested?
                  </label>
                  <textarea
                    id="coverNote"
                    rows="5"
                    className="apply-job-page__form-textarea"
                    placeholder="Tell us why you'd be a great fit for this position..."
                    {...register('coverNote', {
                      maxLength: {
                        value: 1000,
                        message: 'Cover note cannot exceed 1000 characters'
                      }
                    })}
                  ></textarea>
                  {errors.coverNote && (
                    <span className="apply-job-page__form-error-message">{errors.coverNote.message}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="apply-job-page__form-actions">
                <button
                  type="submit"
                  className="apply-job-page__submit-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="apply-job-page__submit-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
                <p className="apply-job-page__form-note">
                  * Required fields
                </p>
              </div>
            </form>
          </div>

          {/* Job Summary Sidebar */}
          <div className="apply-job-page__sidebar">
            <div className="apply-job-page__job-summary">
              <h3 className="apply-job-page__job-summary-title">Job Summary</h3>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Position:</span>
                <span className="apply-job-page__job-summary-value">{job.title}</span>
              </div>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Location:</span>
                <span className="apply-job-page__job-summary-value">{job.location}</span>
              </div>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Job Type:</span>
                <span className="apply-job-page__job-summary-value">
                  <span className={`apply-job-page__job-type apply-job-page__job-type--${job.type?.toLowerCase()}`}>
                    {job.typeDisplay?.label}
                  </span>
                </span>
              </div>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Experience:</span>
                <span className="apply-job-page__job-summary-value">{job.experienceRequired}</span>
              </div>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Salary:</span>
                <span className="apply-job-page__job-summary-value">{job.salaryRange}</span>
              </div>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Positions:</span>
                <span className="apply-job-page__job-summary-value">{job.positionsAvailable}</span>
              </div>
              
              <div className="apply-job-page__job-summary-item">
                <span className="apply-job-page__job-summary-label">Posted:</span>
                <span className="apply-job-page__job-summary-value">{job.postedDate}</span>
              </div>

              {job.daysRemaining > 0 && (
                <div className="apply-job-page__job-deadline">
                  ⏰ {job.daysRemaining} days left to apply
                </div>
              )}
            </div>

            <div className="apply-job-page__info-box">
              <h4 className="apply-job-page__info-box-title">📝 Application Tips</h4>
              <ul className="apply-job-page__info-box-list">
                <li>Fill all required fields accurately</li>
                <li>Double-check your contact information</li>
                <li>Be honest about your experience</li>
                <li>Write a personalized cover note</li>
                <li>No resume required - we keep it simple!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobPage;