import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import './CareersPage.css';

// ======================================================
// Careers Page Component
// Public-facing page showing all job openings
// Includes filters, search, and job listings
// ======================================================

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [sortBy, setSortBy] = useState('postedDate');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  const itemsPerPage = 6;

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, selectedLocation, selectedJobType, sortBy, sortDirection]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This now returns an array directly
      const jobsArray = await jobService.getOpenJobs(0, 100, 'postedDate', 'DESC');
      console.log('Jobs array:', jobsArray); // Should be an array
      
      const formattedJobs = jobService.formatJobs(jobsArray || []);
      setJobs(formattedJobs);
      
      // Extract unique locations and job types
      const uniqueLocations = [...new Set(formattedJobs.map(j => j.location))].sort();
      const uniqueJobTypes = [...new Set(formattedJobs.map(j => j.type))].sort();
      setLocations(uniqueLocations);
      setJobTypes(uniqueJobTypes);
      setTotalJobs(formattedJobs.length);
      setTotalPages(Math.ceil(formattedJobs.length / itemsPerPage));
    } catch (err) {
      setError('Failed to load job listings. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    // Apply job type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedJobType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'postedDate') {
        aValue = new Date(a.postedDate);
        bValue = new Date(b.postedDate);
      } else if (sortBy === 'title') {
        aValue = a.title;
        bValue = b.title;
      } else if (sortBy === 'location') {
        aValue = a.location;
        bValue = b.location;
      }

      if (aValue < bValue) return sortDirection === 'ASC' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'ASC' ? 1 : -1;
      return 0;
    });

    setFilteredJobs(filtered);
    setTotalJobs(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortDirection] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedJobType('all');
    setSortBy('postedDate');
    setSortDirection('DESC');
  };

  // Get paginated jobs for current page
  const getPaginatedJobs = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredJobs.slice(start, end);
  };

  // Sort options
  const sortOptions = [
    { value: 'postedDate-DESC', label: 'Newest First' },
    { value: 'postedDate-ASC', label: 'Oldest First' },
    { value: 'title-ASC', label: 'Job Title (A to Z)' },
    { value: 'title-DESC', label: 'Job Title (Z to A)' },
    { value: 'location-ASC', label: 'Location (A to Z)' },
    { value: 'location-DESC', label: 'Location (Z to A)' }
  ];

  // Job type display mapping
  const jobTypeLabels = {
    'FULL_TIME': 'Full Time',
    'PART_TIME': 'Part Time',
    'CONTRACT': 'Contract',
    'INTERNSHIP': 'Internship'
  };

  return (
    <div className="careers-page">
      {/* Hero Section */}
      <section className="careers-page__hero">
        <div className="careers-page__hero-content container">
          <h1 className="careers-page__hero-title animate-fade-in-down">
            Join Our <span className="careers-page__hero-highlight">Team</span>
          </h1>
          <p className="careers-page__hero-subtitle animate-fade-in-up">
            Discover exciting career opportunities at MAC's
          </p>
        </div>
      </section>

      <div className="careers-page__container container">
        {/* Why Join Us Section */}
        <section className="careers-page__why-join">
          <h2 className="careers-page__section-title">Why Join MAC's?</h2>
          <div className="careers-page__benefits-grid">
            <div className="careers-page__benefit-card animate-fade-in-up">
              <span className="careers-page__benefit-icon">💪</span>
              <h3>Career Growth</h3>
              <p>Opportunities for advancement and professional development</p>
            </div>
            <div className="careers-page__benefit-card animate-fade-in-up delay-100">
              <span className="careers-page__benefit-icon">💰</span>
              <h3>Competitive Pay</h3>
              <p>Attractive compensation packages and performance bonuses</p>
            </div>
            <div className="careers-page__benefit-card animate-fade-in-up delay-200">
              <span className="careers-page__benefit-icon">🎓</span>
              <h3>Training</h3>
              <p>Comprehensive training programs for all positions</p>
            </div>
            <div className="careers-page__benefit-card animate-fade-in-up delay-300">
              <span className="careers-page__benefit-icon">🌈</span>
              <h3>Great Culture</h3>
              <p>Inclusive and supportive work environment</p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <div className="careers-page__filters">
          <div className="careers-page__filters-header">
            <h2 className="careers-page__filters-title">Current Openings</h2>
            <button className="careers-page__filters-clear" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="careers-page__filters-grid">
            {/* Search */}
            <form onSubmit={handleSearch} className="careers-page__search">
              <input
                type="text"
                placeholder="Search jobs by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="careers-page__search-input"
              />
              <button type="submit" className="careers-page__search-button">
                🔍 Search
              </button>
            </form>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="careers-page__filter-select"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Job Type Filter */}
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="careers-page__filter-select"
            >
              <option value="all">All Job Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>
                  {jobTypeLabels[type] || type}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={handleSortChange}
              className="careers-page__filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="careers-page__results">
          Found {totalJobs} {totalJobs === 1 ? 'job' : 'jobs'}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="careers-page__loading">
            <div className="careers-page__spinner"></div>
            <p>Loading opportunities...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="careers-page__error">
            <span className="careers-page__error-icon">😕</span>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchJobs} className="careers-page__error-button">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="careers-page__empty">
            <span className="careers-page__empty-icon">💼</span>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters or check back later for new opportunities</p>
            <button onClick={clearFilters} className="careers-page__empty-button">
              Clear Filters
            </button>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <>
            <div className="careers-page__grid">
              {getPaginatedJobs().map((job, index) => (
                <div 
                  key={job.id} 
                  className="careers-page__job-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="careers-page__job-header">
                    <span className="careers-page__job-icon">{job.typeDisplay?.icon}</span>
                    <span className={`careers-page__job-type careers-page__job-type--${job.type?.toLowerCase()}`}>
                      {job.typeDisplay?.label}
                    </span>
                  </div>

                  <h3 className="careers-page__job-title">{job.title}</h3>
                  
                  <div className="careers-page__job-details">
                    <p className="careers-page__job-location">
                      <span>📍</span> {job.location}
                    </p>
                    <p className="careers-page__job-salary">
                      <span>💰</span> {job.salaryRange}
                    </p>
                    <p className="careers-page__job-experience">
                      <span>📚</span> {job.experienceRequired}
                    </p>
                    <p className="careers-page__job-positions">
                      <span>👥</span> {job.positionsAvailable} {job.positionsAvailable === 1 ? 'position' : 'positions'}
                    </p>
                  </div>

                  <p className="careers-page__job-description">
                    {job.description.length > 120 
                      ? `${job.description.substring(0, 120)}...` 
                      : job.description}
                  </p>

                  <div className="careers-page__job-footer">
                    <span className="careers-page__job-date">
                      Posted: {job.postedDate}
                    </span>
                    {job.daysRemaining > 0 && (
                      <span className="careers-page__job-deadline">
                        {job.daysRemaining} days left
                      </span>
                    )}
                  </div>

                  <Link to={`/careers/${job.id}`} className="careers-page__job-link">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="careers-page__pagination">
                <button
                  className="careers-page__pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ← Previous
                </button>
                
                <div className="careers-page__pagination-numbers">
                  {[...Array(totalPages).keys()].map(pageNum => (
                    <button
                      key={pageNum}
                      className={`careers-page__pagination-number ${
                        currentPage === pageNum ? 'careers-page__pagination-number--active' : ''
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="careers-page__pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Culture Section */}
        <section className="careers-page__culture">
          <h2 className="careers-page__section-title">Life at MAC's</h2>
          <div className="careers-page__culture-grid">
            <div className="careers-page__culture-card animate-fade-in-up">
              <img src="src/assets/images/family.png" alt="Team work" className="careers-page__culture-image" />
              <h3>Team Spirit</h3>
              <p>Work with amazing people who support each other</p>
            </div>
            <div className="careers-page__culture-card animate-fade-in-up delay-100">
              <img src="src/assets/images/store.png" alt="Training" className="careers-page__culture-image" />
              <h3>Continuous Learning</h3>
              <p>Regular training and skill development programs</p>
            </div>
            <div className="careers-page__culture-card animate-fade-in-up delay-200">
              <img src="src/assets/images/team.png" alt="Celebration" className="careers-page__culture-image" />
              <h3>Celebrate Together</h3>
              <p>Regular team events and celebrations</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="careers-page__cta">
          <h2 className="careers-page__cta-title">Don't see the right fit?</h2>
          <p className="careers-page__cta-subtitle">
            Send us your resume and we'll keep you in mind for future opportunities
          </p>
          <Link to="/contact" className="careers-page__cta-button">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
};

export default CareersPage;