import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

// ======================================================
// Login Page Component
// Only for Super Admin and Franchise Owners
// No public registration - accounts are created by Admin
// ======================================================

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await login(data.usernameOrEmail, data.password);
      
      if (result.success) {
        // Redirect based on user role
        const userRole = result.data.roles[0];
        
        switch (userRole) {
          case 'ROLE_SUPER_ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'ROLE_FRANCHISE_OWNER':
            navigate('/owner/dashboard');
            break;
          default:
            setError('Invalid user role. Please contact administrator.');
        }
      } else {
        setError(result.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (role) => {
    const credentials = {
      admin: { usernameOrEmail: 'admin', password: 'admin123' },
      owner: { usernameOrEmail: 'owner', password: 'owner123' }
    };

    onSubmit(credentials[role]);
  };

  return (
    <div className="login-page">
      {/* Hero Section */}
      <section className="login-page__hero">
        <div className="login-page__hero-content container">
          <h1 className="login-page__hero-title animate-fade-in-down">
            Welcome <span className="login-page__hero-highlight">Back</span>
          </h1>
          <p className="login-page__hero-subtitle animate-fade-in-up">
            Sign in to access your dashboard
          </p>
          <span className="login-page__hero-goHome" >
              <Link to="/" style={{color: 'white'}}> ← Back to Home</Link>
        </span>
        </div>
      </section>

      <div className="login-page__container container">
        <div className="login-page__grid">
          {/* Login Form */}
          <div className="login-page__form-container animate-fade-in-left">
            <div className="login-page__form-header">
              <h2 className="login-page__form-title">Sign In</h2>
              <p className="login-page__form-subtitle">
                Only for authorized personnel
              </p>
            </div>

            {error && (
              <div className="login-page__form-error">
                <span className="login-page__form-error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="login-page__form">
              <div className="login-page__form-group">
                <label htmlFor="usernameOrEmail" className="login-page__form-label">
                  Username or Email *
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  className={`login-page__form-input ${errors.usernameOrEmail ? 'login-page__form-input--error' : ''}`}
                  placeholder="Enter your username or email"
                  {...register('usernameOrEmail', { 
                    required: 'Username or email is required'
                  })}
                />
                {errors.usernameOrEmail && (
                  <span className="login-page__form-error-message">
                    {errors.usernameOrEmail.message}
                  </span>
                )}
              </div>

              <div className="login-page__form-group">
                <label htmlFor="password" className="login-page__form-label">
                  Password *
                </label>
                <div className="login-page__password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`login-page__form-input ${errors.password ? 'login-page__form-input--error' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', { 
                      required: 'Password is required'
                    })}
                  />
                  <button
                    type="button"
                    className="login-page__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="login-page__form-error-message">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="login-page__submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-page__submit-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Accounts - Only Admin and Owner */}
            {/* <div className="login-page__demo">
              <p className="login-page__demo-title">Demo Accounts:</p>
              <div className="login-page__demo-buttons">
                <button
                  onClick={() => handleTestLogin('admin')}
                  className="login-page__demo-button login-page__demo-button--admin"
                  disabled={loading}
                >
                  👑 Admin
                </button>
                <button
                  onClick={() => handleTestLogin('owner')}
                  className="login-page__demo-button login-page__demo-button--owner"
                  disabled={loading}
                >
                  🏪 Owner
                </button>
              </div>
            </div> */}
          </div>

          {/* Info Sidebar */}
          <div className="login-page__info animate-fade-in-right">
            <h2 className="login-page__info-title">Authorized Access Only</h2>
            
            <div className="login-page__info-list">
              <div className="login-page__info-item">
                <span className="login-page__info-icon">👑</span>
                <div className="login-page__info-content">
                  <h3>Super Admin</h3>
                  <p>Full system access • Manage franchises, menu, and applications</p>
                </div>
              </div>

              <div className="login-page__info-item">
                <span className="login-page__info-icon">🏪</span>
                <div className="login-page__info-content">
                  <h3>Franchise Owner</h3>
                  <p>Manage your jobs, feedback, and franchise details</p>
                </div>
              </div>
            </div>

            <div className="login-page__info-note">
              <span className="login-page__info-note-icon">🔒</span>
              <p>
                Accounts are created by administrators only. 
                If you need access, please contact your supervisor.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;