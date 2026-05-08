import React from 'react';
import './Button.css';

// ======================================================
// Reusable Button Component
// Supports multiple variants, sizes, and states
// Used throughout the application for consistent styling
// ======================================================

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    loading ? 'btn--loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn__spinner"></span>
          <span className="btn__text">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Variant examples:
// <Button variant="primary">Primary</Button>
// <Button variant="secondary">Secondary</Button>
// <Button variant="success">Success</Button>
// <Button variant="warning">Warning</Button>
// <Button variant="error">Error</Button>
// <Button variant="outline">Outline</Button>
// <Button variant="ghost">Ghost</Button>

// Size examples:
// <Button size="sm">Small</Button>
// <Button size="md">Medium</Button>
// <Button size="lg">Large</Button>

// Other examples:
// <Button fullWidth>Full Width</Button>
// <Button disabled>Disabled</Button>
// <Button loading>Loading</Button>

export default Button;