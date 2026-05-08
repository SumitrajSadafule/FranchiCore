import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

// ======================================================
// Header Component
// Main navigation header for all pages
// Changes based on authentication status and user role
// ======================================================

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin, isOwner, getUserFullName, getUserInitials } = useAuth();
  const { theme, toggleTheme, getThemeIcon } = useTheme();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header__nav-toggle') && !e.target.closest('.header__nav-menu')) {
        setIsMenuOpen(false);
      }
      if (!e.target.closest('.header__profile') && !e.target.closest('.header__profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (isAdmin()) return '/admin/dashboard';
    if (isOwner()) return '/owner/dashboard';
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container container">
        {/* Logo */}
        <Link to="/" className="header__logo" onClick={() => setIsMenuOpen(false)}>
          <img src="src/assets/images/logo.png" alt="MAC's Franchise" className="header__logo-image" />
          <span className="header__logo-text">MAC's</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className={`header__nav-toggle ${isMenuOpen ? 'header__nav-toggle--active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-menu">
            <li className="header__nav-item">
              <Link to="/" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/menu" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Menu
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/locations" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Locations
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/careers" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Careers
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/own-franchise" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Own a Franchise
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/contact" className="header__nav-link" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </li>

            {/* Mobile-only auth links */}
            {!isAuthenticated() && (
              <li className="header__nav-item header__nav-item--mobile">
                <Link to="/login" className="header__nav-link header__nav-link--login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Side Actions */}
        <div className="header__actions">
          {/* Theme Toggle */}
          <button 
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="header__theme-icon">{getThemeIcon()}</span>
          </button>

          {/* Authenticated User Menu */}
          {isAuthenticated() ? (
            <div className="header__profile">
              <button 
                className="header__profile-button"
                onClick={toggleProfileMenu}
                aria-label="Profile menu"
              >
                <span className="header__profile-avatar">
                  {getUserInitials()}
                </span>
                <span className="header__profile-name">{getUserFullName()}</span>
                <span className={`header__profile-arrow ${isProfileMenuOpen ? 'header__profile-arrow--up' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="header__profile-menu">
                  <div className="header__profile-header">
                    <span className="header__profile-header-avatar">{getUserInitials()}</span>
                    <div className="header__profile-header-info">
                      <span className="header__profile-header-name">{getUserFullName()}</span>
                      <span className="header__profile-header-email">{user?.email}</span>
                    </div>
                  </div>

                  <ul className="header__profile-links">
                    {dashboardLink && (
                      <li>
                        <button onClick={() => handleNavigation(dashboardLink)}>
                          <span className="header__profile-link-icon">📊</span>
                          Dashboard
                        </button>
                      </li>
                    )}
                    
                    {isOwner() && (
                      <>
                        <li>
                          <button onClick={() => handleNavigation('/owner/profile')}>
                            <span className="header__profile-link-icon">👤</span>
                            My Profile
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleNavigation('/owner/franchise')}>
                            <span className="header__profile-link-icon">🏪</span>
                            My Franchise
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleNavigation('/owner/jobs')}>
                            <span className="header__profile-link-icon">💼</span>
                            My Jobs
                          </button>
                        </li>
                      </>
                    )}

                    {isAdmin() && (
                      <>
                        <li>
                          <button onClick={() => handleNavigation('/admin/menu')}>
                            <span className="header__profile-link-icon">🍔</span>
                            Manage Menu
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleNavigation('/admin/applications')}>
                            <span className="header__profile-link-icon">📝</span>
                            Applications
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleNavigation('/admin/franchises')}>
                            <span className="header__profile-link-icon">🏢</span>
                            Franchises
                          </button>
                        </li>
                      </>
                    )}

                    <li className="header__profile-divider"></li>

                    <li>
                      <button onClick={handleLogout} className="header__profile-logout">
                        <span className="header__profile-link-icon">🚪</span>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Non-authenticated buttons */
            <div className="header__auth">
              <Link to="/login" className="header__auth-link header__auth-link--login">
                Login
              </Link>
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;