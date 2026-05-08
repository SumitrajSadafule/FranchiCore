import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ======================================================
// Protected Route Component
// Protects routes based on authentication and roles
// Redirects to login if not authenticated
// Shows unauthorized if wrong role
// ======================================================

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/' }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="protected-route__loading">
        <div className="protected-route__spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = hasRole(allowedRoles);
    
    if (!hasAllowedRole) {
      // User doesn't have required role - show unauthorized
      return (
        <div className="protected-route__unauthorized">
          <div className="unauthorized__content">
            <span className="unauthorized__icon">🔒</span>
            <h2 className="unauthorized__title">Access Denied</h2>
            <p className="unauthorized__message">
              You don't have permission to access this page.
            </p>
            <button 
              className="unauthorized__button"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // Authenticated and authorized - render children or outlet
  return children || <Outlet />;
};

// ======================================================
// Role-based route components for convenience
// ======================================================

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
    {children}
  </ProtectedRoute>
);

export const OwnerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['ROLE_FRANCHISE_OWNER']}>
    {children}
  </ProtectedRoute>
);

export const AdminOrOwnerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_FRANCHISE_OWNER']}>
    {children}
  </ProtectedRoute>
);

export const CustomerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;