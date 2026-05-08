import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLayout.css';

// ======================================================
// Admin Layout Component
// Layout for super admin dashboard
// Includes sidebar navigation and header
// ======================================================

const AdminLayout = () => {
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
    { 
      path: '/admin/dashboard', 
      icon: '📊', 
      label: 'Dashboard',
      description: 'Overview & statistics'
    },
    { 
      path: '/admin/users', 
      icon: '👥', 
      label: 'Users',
      description: 'Manage owners & users'
    },
    { 
      path: '/admin/franchises', 
      icon: '🏪', 
      label: 'Franchises',
      description: 'Manage all franchise locations'
    },
    { 
      path: '/admin/applications', 
      icon: '📝', 
      label: 'Franchise Applications',
      description: 'Review & process applications'
      // badge: 'new'
    },
    { 
      path: '/admin/menu', 
      icon: '🍔', 
      label: 'Menu Management',
      description: 'Manage food items & categories'
    },
    { 
      path: '/admin/jobs', 
      icon: '💼', 
      label: 'Jobs Management',
      description: 'View & manage all job postings'
      // badge: 'all'  // Optional: you can remove this if not needed
    },
    { 
      path: '/admin/feedback', 
      icon: '💬', 
      label: 'Feedback Management',
      description: 'View & manage all Feedback'
    },
    { 
      path: '/admin/settings', 
      icon: '⚙️', 
      label: 'Settings',
      description: 'System configuration'
    }
  ];

  // const quickStats = [
  //   { label: 'Total Franchises', value: '12', icon: '🏪', change: '+2' },
  //   { label: 'Applications', value: '24', icon: '📝', change: '+5' },
  //   { label: 'Active Owners', value: '8', icon: '👤', change: '+1' },
  //   { label: 'Menu Items', value: '45', icon: '🍔', change: '+3' }
  // ];

  const quickActions = [
    { icon: '➕', label: 'Add Menu Item', onClick: () => navigate('/admin/menu') },
    { icon: '📝', label: 'Review Applications', onClick: () => navigate('/admin/applications') },
    { icon: '👤', label: 'Create Owner', onClick: () => navigate('/admin/users') },
    { icon: '🏪', label: 'Add Franchise', onClick: () => navigate('/admin/franchises') }
  ];

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'admin-layout--sidebar-open' : 'admin-layout--sidebar-closed'}`}>
      {/* Sidebar Overlay (mobile only) */}
      {isMobile && isSidebarOpen && (
        <div className="admin-layout__overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-layout__sidebar ${isSidebarOpen ? 'admin-layout__sidebar--open' : ''}`}>
        <div className="admin-layout__sidebar-header">
          <NavLink to="/admin/dashboard" className="admin-layout__logo">
            <img src="/src/assets/images/logo.png" alt="MAC's" className="admin-layout__logo-image" />
            <span className="admin-layout__logo-text">Admin Portal</span>
          </NavLink>
          
          <button 
            className="admin-layout__sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Admin Profile Summary */}
        <div className="admin-layout__profile">
          <div className="admin-layout__profile-avatar">
            {getUserInitials()}
          </div>
          <div className="admin-layout__profile-info">
            <h4 className="admin-layout__profile-name">{getUserFullName()}</h4>
            <p className="admin-layout__profile-role">Super Administrator</p>
          </div>
        </div>

        {/* Quick Stats (collapsed view) */}
        {/* {!isSidebarOpen && (
          <div className="admin-layout__quick-stats-mini">
            <div className="admin-layout__stat-mini" title="Total Franchises">
              <span className="admin-layout__stat-mini-icon">🏪</span>
              <span className="admin-layout__stat-mini-value">12</span>
            </div>
            <div className="admin-layout__stat-mini" title="Applications">
              <span className="admin-layout__stat-mini-icon">📝</span>
              <span className="admin-layout__stat-mini-value">24</span>
            </div>
          </div>
        )} */}

        {/* Navigation */}
        <nav className="admin-layout__nav">
          {navItems.map((item, index) => (
            <NavLink 
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `admin-layout__nav-link ${isActive ? 'admin-layout__nav-link--active' : ''}`
              }
              end={item.path === '/admin/dashboard'}
            >
              <span className="admin-layout__nav-icon">{item.icon}</span>
              <div className="admin-layout__nav-content">
                <span className="admin-layout__nav-label">{item.label}</span>
                {isSidebarOpen && (
                  <>
                    <span className="admin-layout__nav-description">{item.description}</span>
                    {item.badge && (
                      <span className={`admin-layout__nav-badge admin-layout__nav-badge--${item.badge}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-layout__sidebar-footer">
          <button className="admin-layout__logout" onClick={handleLogout}>
            <span className="admin-layout__logout-icon">🚪</span>
            {isSidebarOpen && <span className="admin-layout__logout-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-layout__main">
        {/* Header */}
        <header className="admin-layout__header">
          <button 
            className="admin-layout__menu-toggle"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            ☰
          </button>

          <div className="admin-layout__header-title">
            <h1>Super Admin Dashboard</h1>
          </div>

          <div className="admin-layout__header-actions">
            {/* Quick Stats */}
            {/* {isSidebarOpen && (
              <div className="admin-layout__header-stats">
                {quickStats.map((stat, index) => (
                  <div key={index} className="admin-layout__header-stat">
                    <span className="admin-layout__header-stat-icon">{stat.icon}</span>
                    <div className="admin-layout__header-stat-info">
                      <span className="admin-layout__header-stat-value">{stat.value}</span>
                      <span className="admin-layout__header-stat-label">{stat.label}</span>
                      <span className="admin-layout__header-stat-change">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
            <button 
              className="admin-layout__header-theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="admin-layout__header-theme-icon">{getThemeIcon()}</span>
            </button>
            {/* Quick Actions Dropdown */}
            <div className="admin-layout__quick-actions">
              <button className="admin-layout__quick-actions-button">
                Quick Actions ▼
              </button>
              <div className="admin-layout__quick-actions-menu">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="admin-layout__quick-action"
                    onClick={action.onClick}
                  >
                    <span>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div className="admin-layout__user">
              <span className="admin-layout__user-name">{getUserFullName()}</span>
              <div className="admin-layout__user-avatar">
                {getUserInitials()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;