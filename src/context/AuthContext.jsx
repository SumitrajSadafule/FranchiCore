import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// ======================================================
// Auth Context
// Manages authentication state for Admin and Franchise Owners only
// No customer registration - accounts created by Admin
// ======================================================

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const userData = authService.getCurrentUser();
          setUser(userData);
          
          // Validate token with server
          await authService.validateToken();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user (Admin or Owner only)
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - Password
   * @returns {Promise} - Login result
   */
  const login = async (usernameOrEmail, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(usernameOrEmail, password);
      setUser(response);
      
      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Role or roles to check
   * @returns {boolean} - Has role
   */
  const hasRole = (roles) => {
    if (!user || !user.roles) return false;
    
    if (Array.isArray(roles)) {
      return roles.some(role => user.roles.includes(role));
    }
    return user.roles.includes(roles);
  };

  /**
   * Check if user is admin
   * @returns {boolean} - Is admin
   */
  const isAdmin = () => {
    return hasRole('ROLE_SUPER_ADMIN');
  };

  /**
   * Check if user is franchise owner
   * @returns {boolean} - Is owner
   */
  const isOwner = () => {
    return hasRole('ROLE_FRANCHISE_OWNER');
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} - Is authenticated
   */
  const isAuthenticated = () => {
    return !!user;
  };

  /**
   * Get user role display name
   * @returns {string} - Role display name
   */
  const getRoleDisplay = () => {
    if (!user || !user.roles || !user.roles.length) return 'Guest';
    
    const role = user.roles[0];
    const roleMap = {
      'ROLE_SUPER_ADMIN': 'Super Admin',
      'ROLE_FRANCHISE_OWNER': 'Franchise Owner'
    };
    
    return roleMap[role] || role;
  };

  /**
   * Get user initials for avatar
   * @returns {string} - Initials
   */
  const getUserInitials = () => {
    if (!user) return '';
    
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    
    return (first + last).toUpperCase() || user.username?.[0]?.toUpperCase() || '';
  };

  /**
   * Get user full name
   * @returns {string} - Full name
   */
  const getUserFullName = () => {
    if (!user) return '';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return `${firstName} ${lastName}`.trim() || user.username || 'User';
  };

  /**
   * Get user email
   * @returns {string} - Email
   */
  const getUserEmail = () => {
    return user?.email || '';
  };

  /**
   * Get user ID
   * @returns {number|null} - User ID
   */
  const getUserId = () => {
    return user?.id || null;
  };

  /**
   * Get user role
   * @returns {string|null} - Role
   */
  const getUserRole = () => {
    return user?.roles?.[0] || null;
  };

  /**
   * Get user franchise ID (if owner)
   * @returns {number|null} - Franchise ID
   */
  const getFranchiseId = () => {
    return user?.franchiseId || null;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isOwner,
    isAuthenticated,
    getRoleDisplay,
    getUserInitials,
    getUserFullName,
    getUserEmail,
    getUserId,
    getUserRole,
    getFranchiseId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ONLY ONE EXPORT STATEMENT - AT THE BOTTOM
export { AuthProvider, useAuth };