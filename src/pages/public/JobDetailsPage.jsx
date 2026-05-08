import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import './JobDetailsPage.css';

// ======================================================
// Job Details Page Component
// Public-facing page showing detailed job information
// Includes job description, requirements, and apply button
// ======================================================

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobService.getJobById(id);
      const formattedJob = jobService.formatJob(response);
      setJob(formattedJob);
      
      // Fetch similar jobs (same location or type)
      await fetchSimilarJobs(formattedJob);
    } catch (err) {
      setError('Failed to load job details. Please try again.');
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarJobs = async (currentJob) => {
    try {
      const response = await jobService.getOpenJobs(0, 3, 'postedDate', 'DESC');
      const formattedJobs = jobService.formatJobs(response.content || []);
      
      // Filter out current job and find similar ones
      const similar = formattedJobs
        .filter(j => j.id !== currentJob.id)
        .filter(j => j.location === currentJob.location || j.type === currentJob.type)
        .slice(0, 3);
      
      setSimilarJobs(similar);
    } catch (err) {
      console.error('Error fetching similar jobs:', err);
    }
  };

  const handleApply = () => {
    navigate(`/careers/${id}/apply`);
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-page__loading">
          <div className="job-details-page__spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-page">
        <div className="job-details-page__error">
          <span className="job-details-page__error-icon">😕</span>
          <h3>Oops! Something went wrong</h3>
          <p>{error || 'Job not found'}</p>
          <button onClick={() => navigate('/careers')} className="job-details-page__error-button">
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Hero Section */}
      <section className="job-details-page__hero">
        <div className="job-details-page__hero-content container">
          <Link to="/careers" className="job-details-page__back-link">
            ← Back to Careers
          </Link>
          <h1 className="job-details-page__hero-title animate-fade-in-down">
            {job.title}
          </h1>
          <div className="job-details-page__hero-meta animate-fade-in-up">
            <span className="job-details-page__hero-location">📍 {job.location}</span>
            <span className={`job-details-page__hero-type job-details-page__hero-type--${job.type?.toLowerCase()}`}>
              {job.typeDisplay?.label}
            </span>
          </div>
        </div>
      </section>

      <div className="job-details-page__container container">
        <div className="job-details-page__grid">
          {/* Main Content */}
          <main className="job-details-page__main">
            {/* Quick Info Cards */}
            <div className="job-details-page__quick-info">
              <div className="job-details-page__info-card">
                <span className="job-details-page__info-icon">💰</span>
                <div className="job-details-page__info-content">
                  <span className="job-details-page__info-label">Salary Range</span>
                  <span className="job-details-page__info-value">{job.salaryRange}</span>
                </div>
              </div>
              
              <div className="job-details-page__info-card">
                <span className="job-details-page__info-icon">📚</span>
                <div className="job-details-page__info-content">
                  <span className="job-details-page__info-label">Experience</span>
                  <span className="job-details-page__info-value">{job.experienceRequired}</span>
                </div>
              </div>
              
              <div className="job-details-page__info-card">
                <span className="job-details-page__info-icon">👥</span>
                <div className="job-details-page__info-content">
                  <span className="job-details-page__info-label">Positions</span>
                  <span className="job-details-page__info-value">
                    {job.positionsAvailable} {job.positionsAvailable === 1 ? 'opening' : 'openings'}
                  </span>
                </div>
              </div>
              
              <div className="job-details-page__info-card">
                <span className="job-details-page__info-icon">📅</span>
                <div className="job-details-page__info-content">
                  <span className="job-details-page__info-label">Posted</span>
                  <span className="job-details-page__info-value">{job.postedDate}</span>
                </div>
              </div>
            </div>

            {/* Deadline Warning - Show when deadline is approaching (7 days or less) */}
{job.daysRemaining > 0 && job.daysRemaining <= 7 && (
  <div className="job-details-page__deadline-warning">
    <span className="job-details-page__deadline-icon">⏰</span>
    <p>
      <strong>Only {job.daysRemaining} days left</strong> to apply for this position!
    </p>
  </div>
)}

            {/* Job Description */}
            <section className="job-details-page__section">
              <h2 className="job-details-page__section-title">Job Description</h2>
              <div className="job-details-page__description">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="job-details-page__section">
              <h2 className="job-details-page__section-title">Requirements</h2>
              <div className="job-details-page__requirements">
                {job.requirements.split('\n').map((requirement, index) => (
                  <div key={index} className="job-details-page__requirement-item">
                    <span className="job-details-page__requirement-bullet">•</span>
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Responsibilities (if available) */}
            {job.responsibilities && (
              <section className="job-details-page__section">
                <h2 className="job-details-page__section-title">Responsibilities</h2>
                <div className="job-details-page__responsibilities">
                  {job.responsibilities.split('\n').map((item, index) => (
                    <div key={index} className="job-details-page__responsibility-item">
                      <span className="job-details-page__responsibility-bullet">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits (if available) */}
            {job.benefits && (
              <section className="job-details-page__section">
                <h2 className="job-details-page__section-title">Benefits</h2>
                <div className="job-details-page__benefits">
                  {job.benefits.split('\n').map((benefit, index) => (
                    <div key={index} className="job-details-page__benefit-item">
                      <span className="job-details-page__benefit-bullet">✨</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Franchise Info */}
            <section className="job-details-page__franchise-info">
              <h3 className="job-details-page__franchise-title">
                About {job.franchiseName}
              </h3>
              <p className="job-details-page__franchise-location">
                📍 {job.franchiseCity}
              </p>
              <p className="job-details-page__franchise-description">
                Join our team at {job.franchiseName} and be part of a dynamic 
                environment dedicated to serving quality food and creating 
                memorable experiences for our customers.
              </p>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="job-details-page__sidebar">
            {/* Apply Card */}
<div className="job-details-page__apply-card">
  <h3 className="job-details-page__apply-title">Ready to Apply?</h3>
  <p className="job-details-page__apply-deadline">
    {job.daysRemaining === null 
      ? 'No deadline' 
      : job.daysRemaining > 0 
        ? `${job.daysRemaining} days remaining` 
        : 'Application deadline passed'}
  </p>
  <button 
    onClick={handleApply}
    className="job-details-page__apply-button"
    disabled={job.daysRemaining !== null && job.daysRemaining <= 0}
  >
    {job.daysRemaining === null || job.daysRemaining > 0 ? 'Apply Now' : 'Applications Closed'}
  </button>
  <p className="job-details-page__apply-note">
    No resume required. Simple application process.
  </p>
</div>

            {/* Job Overview */}
            <div className="job-details-page__overview">
              <h3 className="job-details-page__overview-title">Job Overview</h3>
              <ul className="job-details-page__overview-list">
                <li className="job-details-page__overview-item">
                  <span className="job-details-page__overview-label">Job Type:</span>
                  <span className="job-details-page__overview-value">
                    {job.typeDisplay?.label}
                  </span>
                </li>
                <li className="job-details-page__overview-item">
                  <span className="job-details-page__overview-label">Location:</span>
                  <span className="job-details-page__overview-value">{job.location}</span>
                </li>
                <li className="job-details-page__overview-item">
                  <span className="job-details-page__overview-label">Experience:</span>
                  <span className="job-details-page__overview-value">{job.experienceRequired}</span>
                </li>
                <li className="job-details-page__overview-item">
                  <span className="job-details-page__overview-label">Salary:</span>
                  <span className="job-details-page__overview-value">{job.salaryRange}</span>
                </li>
                <li className="job-details-page__overview-item">
                  <span className="job-details-page__overview-label">Posted:</span>
                  <span className="job-details-page__overview-value">{job.postedDate}</span>
                </li>
                <li className="job-details-page__overview-item">
  <span className="job-details-page__overview-label">Deadline:</span>
  <span className="job-details-page__overview-value" style={{ 
    color: job.daysRemaining !== null && job.daysRemaining <= 0 ? 'var(--color-error)' : 'inherit',
    fontWeight: job.daysRemaining !== null && job.daysRemaining <= 0 ? 'bold' : 'normal'
  }}>
    {job.applicationDeadline ? job.applicationDeadline : 'No deadline'}
    {job.daysRemaining !== null && job.daysRemaining <= 0 && job.applicationDeadline && ' (Expired)'}
  </span>
</li>
              </ul>
            </div>

            {/* Share Job */}
            <div className="job-details-page__share">
              <h3 className="job-details-page__share-title">Share this job</h3>
              <div className="job-details-page__share-buttons">
                <button className="job-details-page__share-btn" aria-label="Share on Facebook">
                  📘
                </button>
                <button className="job-details-page__share-btn" aria-label="Share on Twitter">
                  🐦
                </button>
                <button className="job-details-page__share-btn" aria-label="Share on LinkedIn">
                  💼
                </button>
                <button className="job-details-page__share-btn" aria-label="Share via Email">
                  ✉️
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Jobs Section */}
        {similarJobs.length > 0 && (
          <section className="job-details-page__similar">
            <h2 className="job-details-page__similar-title">Similar Jobs You Might Like</h2>
            <div className="job-details-page__similar-grid">
              {similarJobs.map((similarJob, index) => (
                <div key={similarJob.id} className="job-details-page__similar-card">
                  <div className="job-details-page__similar-header">
                    <span className={`job-details-page__similar-type job-details-page__similar-type--${similarJob.type?.toLowerCase()}`}>
                      {similarJob.typeDisplay?.label}
                    </span>
                  </div>
                  <h3 className="job-details-page__similar-job-title">{similarJob.title}</h3>
                  <p className="job-details-page__similar-location">📍 {similarJob.location}</p>
                  <p className="job-details-page__similar-salary">{similarJob.salaryRange}</p>
                  <Link to={`/careers/${similarJob.id}`} className="job-details-page__similar-link">
                    View Job →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;