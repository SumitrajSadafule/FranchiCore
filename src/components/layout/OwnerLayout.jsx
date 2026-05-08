import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './OwnerLayout.css';

// ======================================================
// Owner Layout Component
// Layout for franchise owner dashboard
// Includes sidebar navigation and header
// ======================================================

const OwnerLayout = () => {
  const { user, logout, getUserFullName, getUserInitials } = useAuth();
  const { theme, toggleTheme, getThemeIcon } = useTheme();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/owner/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/owner/profile', icon: '👤', label: 'My Profile' },
    { path: '/owner/franchise', icon: '🏪', label: 'My Franchise' },
    { 
      path: '/owner/jobs', 
      icon: '💼', 
      label: 'Jobs',
      // children: [
      //   { path: '/owner/jobs', icon: '📋', label: 'All Jobs' },
      //   { path: '/owner/jobs/create', icon: '➕', label: 'Create Job' }
      // ]
    },
    { path: '/owner/jobs/applications', icon: '📝', label: 'Applications' },
    { path: '/owner/feedback', icon: '💬', label: 'Feedback' },
    { path: '/owner/menu', icon: '🍔', label: 'Menu' }
  ];

  const quickActions = [
    { icon: '➕', label: 'Post Job', onClick: () => navigate('/owner/jobs/create') },
    { icon: '📝', label: 'View Applications', onClick: () => navigate('/owner/jobs/applications') },
    { icon: '💬', label: 'Reply to Feedback', onClick: () => navigate('/owner/feedback') },
    { icon: '🍔', label: 'View Menu', onClick: () => navigate('/owner/menu') }
  ];

  return (
    <div className={`owner-layout ${isSidebarOpen ? 'owner-layout--sidebar-open' : 'owner-layout--sidebar-closed'}`}>
      {/* Sidebar Overlay (mobile only) */}
      {isMobile && isSidebarOpen && (
        <div className="owner-layout__overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`owner-layout__sidebar ${isSidebarOpen ? 'owner-layout__sidebar--open' : ''}`}>
        <div className="owner-layout__sidebar-header">
          <NavLink to="/owner/dashboard" className="owner-layout__logo">
            <img src="/src/assets/images/logo.png" alt="MAC's" className="owner-layout__logo-image" />
            <span className="owner-layout__logo-text">Owner Portal</span>
          </NavLink>
          
          <button 
            className="owner-layout__sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Owner Profile Summary */}
        <div className="owner-layout__profile">
          <div className="owner-layout__profile-avatar">
            {getUserInitials()}
          </div>
          <div className="owner-layout__profile-info">
            <h4 className="owner-layout__profile-name">{getUserFullName()}</h4>
            <p className="owner-layout__profile-role">Franchise Owner</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="owner-layout__nav">
          {navItems.map((item, index) => (
            <div key={index} className="owner-layout__nav-group">
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `owner-layout__nav-link ${isActive ? 'owner-layout__nav-link--active' : ''}`
                }
                end={item.path === '/owner/jobs'}
              >
                <span className="owner-layout__nav-icon">{item.icon}</span>
                <span className="owner-layout__nav-label">{item.label}</span>
              </NavLink>

              {/* Child navigation items
              {item.children && (
                <div className="owner-layout__nav-children">
                  {item.children.map((child, childIndex) => (
                    <NavLink
                      key={childIndex}
                      to={child.path}
                      className={({ isActive }) => 
                        `owner-layout__nav-child ${isActive ? 'owner-layout__nav-child--active' : ''}`
                      }
                    >
                      <span className="owner-layout__nav-icon">{child.icon}</span>
                      <span className="owner-layout__nav-label">{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )} */}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="owner-layout__sidebar-footer">
          <button className="owner-layout__theme-toggle" onClick={toggleTheme}>
            <span className="owner-layout__theme-icon">{getThemeIcon()}</span>
            <span className="owner-layout__theme-label">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
          
          <button className="owner-layout__logout" onClick={handleLogout}>
            <span className="owner-layout__logout-icon">🚪</span>
            <span className="owner-layout__logout-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="owner-layout__main">
        {/* Header */}
        <header className="owner-layout__header">
          <button 
            className="owner-layout__menu-toggle"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            ☰
          </button>

          <div className="owner-layout__header-title">
            <h1>Franchise Owner Dashboard</h1>
          </div>

          <div className="owner-layout__header-actions">
            {/* Quick Actions Dropdown */}
            <div className="owner-layout__quick-actions">
              <button className="owner-layout__quick-actions-button">
                Quick Actions ▼
              </button>
              <div className="owner-layout__quick-actions-menu">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="owner-layout__quick-action"
                    onClick={action.onClick}
                  >
                    <span>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div className="owner-layout__user">
              <span className="owner-layout__user-name">{getUserFullName()}</span>
              <div className="owner-layout__user-avatar">
                {getUserInitials()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="owner-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;