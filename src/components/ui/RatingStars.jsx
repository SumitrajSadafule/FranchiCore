import React, { useState } from 'react';
import './RatingStars.css';

// ======================================================
// Reusable Rating Stars Component
// Used for displaying and selecting ratings in feedback and reviews
// Supports read-only, interactive, and half-star modes
// ======================================================

const RatingStars = ({
  value = 0,
  max = 5,
  size = 'md',
  readOnly = false,
  interactive = true,
  halfStars = false,
  showValue = false,
  showLabel = false,
  labelPosition = 'right',
  onChange,
  className = '',
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [currentValue, setCurrentValue] = useState(value);

  const handleMouseEnter = (index) => {
    if (!readOnly && interactive) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly && interactive) {
      setHoverValue(null);
    }
  };

  const handleClick = (index) => {
    if (!readOnly && interactive) {
      const newValue = index + 1;
      setCurrentValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleHalfClick = (index, isHalf) => {
    if (!readOnly && interactive && halfStars) {
      const newValue = isHalf ? index + 0.5 : index + 1;
      setCurrentValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const getStarType = (index) => {
    const displayValue = hoverValue !== null ? hoverValue : currentValue;
    
    if (halfStars) {
      const starValue = index + 1;
      const difference = displayValue - index;
      
      if (difference >= 1) {
        return 'full';
      } else if (difference >= 0.5) {
        return 'half';
      }
      return 'empty';
    } else {
      return index < displayValue ? 'full' : 'empty';
    }
  };

  const getStarClass = (index) => {
    const type = getStarType(index);
    return `rating-stars__star rating-stars__star--${type}`;
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'rating-stars--sm';
      case 'lg': return 'rating-stars--lg';
      case 'xl': return 'rating-stars--xl';
      default: return 'rating-stars--md';
    }
  };

  const getLabel = () => {
    const displayValue = hoverValue !== null ? hoverValue : currentValue;
    
    if (displayValue === 0) return 'No rating';
    if (displayValue === 1) return 'Poor';
    if (displayValue === 2) return 'Fair';
    if (displayValue === 3) return 'Good';
    if (displayValue === 4) return 'Very Good';
    if (displayValue === 5) return 'Excellent';
    return `${displayValue} Stars`;
  };

  return (
    <div
      className={`rating-stars ${getSizeClass()} ${className}`}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="rating-stars__container">
        {[...Array(max)].map((_, index) => (
          <div
            key={index}
            className={getStarClass(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
            onMouseMove={(e) => {
              if (halfStars && !readOnly && interactive) {
                const rect = e.currentTarget.getBoundingClientRect();
                const isHalf = (e.clientX - rect.left) < rect.width / 2;
                e.currentTarget.style.cursor = isHalf ? 'w-resize' : 'e-resize';
              }
            }}
            onClickCapture={(e) => {
              if (halfStars && !readOnly && interactive) {
                const rect = e.currentTarget.getBoundingClientRect();
                const isHalf = (e.clientX - rect.left) < rect.width / 2;
                handleHalfClick(index, isHalf);
              }
            }}
            role="button"
            tabIndex={readOnly ? -1 : 0}
            aria-label={`Rate ${index + 1} star${index + 1 > 1 ? 's' : ''}`}
            aria-pressed={index < currentValue}
          >
            <span className="rating-stars__star-icon">
              {getStarType(index) === 'half' ? '⭐' : ''}
            </span>
          </div>
        ))}
      </div>

      {showValue && (
        <span className="rating-stars__value">
          {hoverValue !== null ? hoverValue.toFixed(1) : currentValue.toFixed(1)}
          <span className="rating-stars__max">/{max}</span>
        </span>
      )}

      {showLabel && (
        <span className={`rating-stars__label rating-stars__label--${labelPosition}`}>
          {getLabel()}
        </span>
      )}
    </div>
  );
};

// Read-only display component for showing ratings
export const RatingDisplay = ({ value, size = 'md', showValue = true, ...props }) => {
  return (
    <RatingStars
      value={value}
      size={size}
      readOnly={true}
      interactive={false}
      showValue={showValue}
      {...props}
    />
  );
};

// Interactive rating component for forms
export const RatingInput = ({ value, onChange, size = 'md', ...props }) => {
  return (
    <RatingStars
      value={value}
      size={size}
      readOnly={false}
      interactive={true}
      halfStars={true}
      showValue={true}
      onChange={onChange}
      {...props}
    />
  );
};

// Summary component showing average rating
export const RatingSummary = ({ average, total, size = 'md' }) => {
  return (
    <div className="rating-summary">
      <div className="rating-summary__average">
        <span className="rating-summary__value">{average.toFixed(1)}</span>
        <RatingDisplay value={average} size={size} showValue={false} />
      </div>
      <span className="rating-summary__total">
        Based on {total} {total === 1 ? 'review' : 'reviews'}
      </span>
    </div>
  );
};

// Distribution bars for rating breakdown
export const RatingDistribution = ({ distribution, total }) => {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="rating-distribution">
      {stars.map((star) => {
        const count = distribution[star] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={star} className="rating-distribution__row">
            <span className="rating-distribution__label">{star} stars</span>
            <div className="rating-distribution__bar-container">
              <div
                className="rating-distribution__bar"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="rating-distribution__count">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

// Usage examples:
// <RatingStars value={4} size="md" />
// <RatingStars value={3.5} halfStars showValue />
// <RatingInput value={rating} onChange={setRating} />
// <RatingDisplay value={4.2} size="lg" />
// <RatingSummary average={4.2} total={156} />
// <RatingDistribution distribution={{5: 120, 4: 30, 3: 5, 2: 1, 1: 0}} total={156} />

export default RatingStars;