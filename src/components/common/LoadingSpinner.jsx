import React from 'react';
import './LoadingSpinner.css';

// ======================================================
// Reusable Loading Spinner Component
// Used for loading states across the application
// Supports multiple sizes, variants, and full page overlay
// ======================================================

const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  text,
  fullPage = false,
  overlay = false,
  className = '',
  ...props
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    `loading-spinner--${variant}`,
    fullPage ? 'loading-spinner--full-page' : '',
    overlay ? 'loading-spinner--overlay' : '',
    className
  ].filter(Boolean).join(' ');

  const spinner = (
    <div className={spinnerClasses} {...props}>
      <div className="loading-spinner__container">
        <div className="loading-spinner__circle">
          <div className="loading-spinner__dot"></div>
          <div className="loading-spinner__dot"></div>
          <div className="loading-spinner__dot"></div>
          <div className="loading-spinner__dot"></div>
        </div>
        {text && <p className="loading-spinner__text">{text}</p>}
      </div>
    </div>
  );

  if (fullPage || overlay) {
    return spinner;
  }

  return spinner;
};

// Inline spinner for buttons and small areas
export const InlineSpinner = ({ size = 'sm', variant = 'current', className = '', ...props }) => {
  return (
    <span
      className={`inline-spinner inline-spinner--${size} inline-spinner--${variant} ${className}`}
      {...props}
    >
      <span className="inline-spinner__dot"></span>
      <span className="inline-spinner__dot"></span>
      <span className="inline-spinner__dot"></span>
    </span>
  );
};

// Page loader with skeleton effect
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton skeleton--card">
            <div className="skeleton__image"></div>
            <div className="skeleton__content">
              <div className="skeleton__line skeleton__line--title"></div>
              <div className="skeleton__line skeleton__line--text"></div>
              <div className="skeleton__line skeleton__line--text"></div>
              <div className="skeleton__line skeleton__line--button"></div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="skeleton skeleton--list">
            <div className="skeleton__avatar"></div>
            <div className="skeleton__content">
              <div className="skeleton__line skeleton__line--title"></div>
              <div className="skeleton__line skeleton__line--text"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="skeleton skeleton--table">
            <div className="skeleton__header">
              <div className="skeleton__line"></div>
              <div className="skeleton__line"></div>
              <div className="skeleton__line"></div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton__row">
                <div className="skeleton__line"></div>
                <div className="skeleton__line"></div>
                <div className="skeleton__line"></div>
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className="skeleton skeleton--form">
            <div className="skeleton__line skeleton__line--label"></div>
            <div className="skeleton__line skeleton__line--input"></div>
            <div className="skeleton__line skeleton__line--label"></div>
            <div className="skeleton__line skeleton__line--input"></div>
            <div className="skeleton__line skeleton__line--button"></div>
          </div>
        );

      default:
        return (
          <div className="skeleton">
            <div className="skeleton__line"></div>
          </div>
        );
    }
  };

  return (
    <div className={`skeleton-loader ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-loader__item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Usage examples:
// <LoadingSpinner size="md" variant="primary" />
// <LoadingSpinner size="lg" text="Loading please wait..." />
// <LoadingSpinner fullPage overlay text="Loading application..." />
// <InlineSpinner /> (for buttons)
// <PageLoader />
// <SkeletonLoader type="card" count={3} />
// <SkeletonLoader type="table" />

export default LoadingSpinner;