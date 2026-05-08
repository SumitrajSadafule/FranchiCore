import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import menuService from '../../services/menuService';
import franchiseService from '../../services/franchiseService';
import jobService from '../../services/jobService';
import './HomePage.css';
import { FcPortraitMode } from "react-icons/fc";
import { RiTeamFill } from "react-icons/ri";

// ======================================================
// Home Page Component
// Public-facing homepage with hero section, featured items,
// promotions, and quick links
// ======================================================

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState({
    featured: true,
    locations: true,
    jobs: true
  });
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchFeaturedItems();
    fetchPopularLocations();
    fetchRecentJobs();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(prev => ({ ...prev, featured: true }));
      const response = await menuService.getAllMenuItems(0, 6, 'name', 'ASC');
      setFeaturedItems(response.content || []);
    } catch (err) {
      console.error('Error fetching featured items:', err);
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  };

  const fetchPopularLocations = async () => {
    try {
      setLoading(prev => ({ ...prev, locations: true }));
      const response = await franchiseService.getAllFranchises(0, 4, 'city', 'ASC');
      setPopularLocations(response.content || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const fetchRecentJobs = async () => {
    try {
      setLoading(prev => ({ ...prev, jobs: true }));
      const response = await jobService.getOpenJobs(0, 3, 'postedDate', 'DESC');
      setRecentJobs(response.content || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  // Hero section stats
  const stats = [
    { value: '50+', label: 'Years of Service', icon: '⭐' },
    { value: '12+', label: 'Locations', icon: '📍' },
    { value: '10K+', label: 'Happy Customers', icon: <FcPortraitMode /> },
    { value: '5K+', label: 'Team Members', icon: <RiTeamFill /> }
  ];

  // Promotions data
  const promotions = [
    {
      id: 1,
      title: 'Monday Madness',
      description: 'Buy 1 Get 1 Free on all burgers',
      image: '/src/assets/images/promote-your-food-combo-offers.png',
      validUntil: '2026-5-31',
      bgColor: 'primary'
    },
    {
      id: 2,
      title: 'Family Feast',
      description: '4 meals + 4 fries + 4 drinks at 30% off',
      image: '/src/assets/images/McFavourites-Bundle.webp',
      validUntil: '2026-12-31',
      bgColor: 'secondary'
    },
    {
      id: 3,
      title: 'Student Special',
      description: '20% off on all meals with student ID',
      image: '/src/assets/images/promo-student.png',
      validUntil: '2026-12-31',
      bgColor: 'accent'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-page__hero">
        <div className="home-page__hero-overlay"></div>
        <div className="home-page__hero-content container">
          <h1 className="home-page__hero-title animate-fade-in-up">
            Taste the <span className="home-page__hero-highlight">Magic</span>
          </h1>
          <p className="home-page__hero-subtitle animate-fade-in-up delay-200">
            Serving delicious moments since 1955. Join us for an unforgettable experience.
          </p>
          <div className="home-page__hero-buttons animate-fade-in-up delay-300">
            <Link to="/menu" className="home-page__hero-button home-page__hero-button--primary">
              View Menu
            </Link>
            <Link to="/locations" className="home-page__hero-button home-page__hero-button--secondary">
              Find a Location
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-page__stats">
        <div className="home-page__stats-container container">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="home-page__stat-item animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="home-page__stat-icon">{stat.icon}</span>
              <div className="home-page__stat-content">
                <span className="home-page__stat-value">{stat.value}</span>
                <span className="home-page__stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="home-page__promotions">
        <div className="container">
          <h2 className="home-page__section-title">
            <span className="home-page__section-title-highlight">Hot</span> Offers
          </h2>
          <p className="home-page__section-subtitle">
            Don't miss out on these amazing deals!
          </p>

          <div className="home-page__promotions-grid">
            {promotions.map((promo, index) => (
              <div 
                key={promo.id}
                className={`home-page__promotion-card home-page__promotion-card--${promo.bgColor} animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="home-page__promotion-content">
                  <h3 className="home-page__promotion-title">{promo.title}</h3>
                  <p className="home-page__promotion-description">{promo.description}</p>
                  <p className="home-page__promotion-valid">
                    Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                  </p>
                  <Link to="/menu" className="home-page__promotion-link">
                    View More →
                  </Link>
                </div>
                <div className="home-page__promotion-image">
                  <img src={promo.image} alt={promo.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="home-page__featured">
        <div className="container">
          <h2 className="home-page__section-title">
            Featured <span className="home-page__section-title-highlight">Favorites</span>
          </h2>
          <p className="home-page__section-subtitle">
            Customer favorites you'll love
          </p>

          {loading.featured ? (
            <div className="home-page__loading">
              <div className="home-page__spinner"></div>
            </div>
          ) : (
            <div className="home-page__featured-grid">
              {featuredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="home-page__featured-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="home-page__featured-image">
                    <img 
                      src={item.imageUrl || '/images/default-food.jpg'} 
                      alt={item.name}
                      onError={(e) => {
                        // Set a flag to prevent infinite loops
                          if (!e.target.hasAttribute('data-error')) {
                            e.target.setAttribute('data-error', 'true');
                            e.target.src = '/images/default-food.jpg';
                          }
                      }}
                    />
                    {!item.available && (
                      <span className="home-page__featured-badge home-page__featured-badge--unavailable">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="home-page__featured-content">
                    <h3 className="home-page__featured-name">{item.name}</h3>
                    <p className="home-page__featured-description">{item.description}</p>
                    <div className="home-page__featured-footer">
                      <span className="home-page__featured-price">
                        ₹{item.price?.toFixed(2)}
                      </span>
                      <Link to={`/menu/${item.id}`} className="home-page__featured-link">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Locations */}
      <section className="home-page__locations">
        <div className="container">
          <h2 className="home-page__section-title">
            Popular <span className="home-page__section-title-highlight">Locations</span>
          </h2>
          <p className="home-page__section-subtitle">
            Find a MAC's near you
          </p>

          {loading.locations ? (
            <div className="home-page__loading">
              <div className="home-page__spinner"></div>
            </div>
          ) : (
            <div className="home-page__locations-grid">
              {popularLocations.map((location, index) => (
                <div 
                  key={location.id} 
                  className="home-page__location-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="home-page__location-icon">📍</div>
                  <h3 className="home-page__location-name">{location.franchiseName}</h3>
                  <p className="home-page__location-address">{location.city}, {location.state}</p>
                  <p className="home-page__location-hours">{location.operatingHours}</p>
                  <Link to={`/locations/${location.id}`} className="home-page__location-link">
                    View Details →
                  </Link>
                </div>
              ))}
                  
            </div>
          )}

          <div className="home-page__jobs-footer">
                  <Link to="/locations" className="home-page__jobs-link">
                    View All Locations →
                  </Link>
                  </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="home-page__jobs">
        <div className="container">
          <h2 className="home-page__section-title">
            Join Our <span className="home-page__section-title-highlight">Team</span>
          </h2>
          <p className="home-page__section-subtitle">
            We're hiring! Check out our latest openings
          </p>

          {loading.jobs ? (
            <div className="home-page__loading">
              <div className="home-page__spinner"></div>
            </div>
          ) : (
            <div className="home-page__jobs-grid">
              {recentJobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="home-page__job-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="home-page__job-header">
                    <span className="home-page__job-icon">💼</span>
                    <span className="home-page__job-type">{job.typeDisplay?.label}</span>
                  </div>
                  <h3 className="home-page__job-title">{job.title}</h3>
                  <p className="home-page__job-location">📍 {job.location}</p>
                  <p className="home-page__job-salary">{job.salaryRange}</p>
                  <Link to={`/careers/${job.id}`} className="home-page__job-link">
                    Apply Now →
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="home-page__jobs-footer">
            <Link to="/careers" className="home-page__jobs-link">
              View All Opportunities →
            </Link>
          </div>
        </div>
      </section>

      {/* Own a Franchise CTA */}
      <section className="home-page__franchise-cta">
        <div className="home-page__franchise-cta-content container">
          <h2 className="home-page__franchise-cta-title">
            Own a MAC's Franchise
          </h2>
          <p className="home-page__franchise-cta-subtitle">
            Join our family of successful franchise owners. 
            Be part of India's fastest-growing food chain.
          </p>
          <Link to="/own-franchise" className="home-page__franchise-cta-button">
            Learn More
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="home-page__newsletter">
        <div className="home-page__newsletter-content container">
          <h2 className="home-page__newsletter-title">
            Stay Updated
          </h2>
          <p className="home-page__newsletter-subtitle">
            Subscribe to our newsletter for exclusive offers and updates
          </p>
          <form className="home-page__newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="home-page__newsletter-input"
              required
            />
            <button type="submit" className="home-page__newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;