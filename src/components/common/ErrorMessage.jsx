import React from 'react';
import Button from '../ui/Button';
import './ErrorMessage.css';

// ======================================================
// Reusable Error Message Component
// Used for consistent error displays across forms and data fetching
// Supports multiple variants, retry functionality, and icons
// ======================================================

const ErrorMessage = ({
  message = 'An error occurred. Please try again.',
  variant = 'error',
  size = 'md',
  title,
  icon,
  retry,
  onRetry,
  dismissible = false,
  onDismiss,
  showDetails = false,
  details,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [showFullDetails, setShowFullDetails] = React.useState(false);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  const toggleDetails = () => {
    setShowFullDetails(!showFullDetails);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case '404':
        return '🔍';
      case '403':
        return '🔒';
      case '500':
        return '🔧';
      default:
        return '⚠️';
    }
  };

  const getTitle = () => {
    if (title) return title;

    switch (variant) {
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      case 'success':
        return 'Success';
      case '404':
        return 'Not Found';
      case '403':
        return 'Access Denied';
      case '500':
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  const messageClasses = [
    'error-message',
    `error-message--${variant}`,
    `error-message--${size}`,
    dismissible ? 'error-message--dismissible' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={messageClasses} role="alert" {...props}>
      <div className="error-message__content">
        <div className="error-message__icon" aria-hidden="true">
          {getIcon()}
        </div>

        <div className="error-message__text">
          <h3 className="error-message__title">{getTitle()}</h3>
          <p className="error-message__message">{message}</p>
          
          {showDetails && details && (
            <div className="error-message__details">
              <button
                type="button"
                onClick={toggleDetails}
                className="error-message__details-toggle"
              >
                {showFullDetails ? 'Hide details' : 'Show details'}
              </button>
              {showFullDetails && (
                <pre className="error-message__details-content">
                  {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="error-message__actions">
          {retry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="error-message__retry"
            >
              Try Again
            </Button>
          )}
          
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className="error-message__dismiss"
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Form error component for displaying validation errors
export const FormError = ({ errors, className = '', ...props }) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className={`form-error ${className}`} {...props}>
      <div className="form-error__icon">⚠️</div>
      <div className="form-error__content">
        <h4 className="form-error__title">Please fix the following errors:</h4>
        <ul className="form-error__list">
          {Object.entries(errors).map(([field, message]) => (
            <li key={field} className="form-error__item">
              <strong>{field}:</strong> {message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// API error component with status code
export const ApiError = ({ status, message, details, onRetry, ...props }) => {
  const variant = 
    status === 404 ? '404' :
    status === 403 ? '403' :
    status >= 500 ? '500' : 'error';

  return (
    <ErrorMessage
      variant={variant}
      title={`Error ${status}`}
      message={message || 'An API error occurred'}
      details={details}
      retry={!!onRetry}
      onRetry={onRetry}
      {...props}
    />
  );
};

// Network error component
export const NetworkError = ({ onRetry, ...props }) => {
  return (
    <ErrorMessage
      variant="error"
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      icon="📡"
      retry={!!onRetry}
      onRetry={onRetry}
      {...props}
    />
  );
};

// Empty state component (for no data)
export const EmptyState = ({ message = 'No data found', icon = '📭', action, onAction, ...props }) => {
  return (
    <div className="empty-state" {...props}>
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{message}</h3>
      {action && (
        <Button onClick={onAction} className="empty-state__action">
          {action}
        </Button>
      )}
    </div>
  );
};

// Usage examples:
// <ErrorMessage
//   message="Failed to load data. Please try again."
//   retry
//   onRetry={fetchData}
// />

// <ErrorMessage
//   variant="warning"
//   title="Warning"
//   message="Your session is about to expire."
//   dismissible
//   onDismiss={() => setShowWarning(false)}
// />

// <FormError errors={validationErrors} />

// <ApiError status={404} message="User not found" />

// <NetworkError onRetry={() => window.location.reload()} />

// <EmptyState
//   message="No applications found"
//   action="Post a Job"
//   onAction={() => navigate('/owner/jobs/create')}
// />

export default ErrorMessage;