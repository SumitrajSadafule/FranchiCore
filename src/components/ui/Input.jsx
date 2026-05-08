import React, { useState, forwardRef } from 'react';
import './Input.css';

// ======================================================
// Reusable Input Component
// Used for consistent form inputs across all forms
// Supports various types, validation states, and icons
// ======================================================

const Input = forwardRef(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  disabled = false,
  readOnly = false,
  required = false,
  icon,
  iconPosition = 'left',
  helperText,
  maxLength,
  minLength,
  pattern,
  autoComplete = 'off',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = (e) => {
    setFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = [
    'input',
    `input--${type}`,
    error ? 'input--error' : '',
    success ? 'input--success' : '',
    disabled ? 'input--disabled' : '',
    readOnly ? 'input--readonly' : '',
    icon ? `input--has-icon input--icon-${iconPosition}` : '',
    focused ? 'input--focused' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-container',
    containerClassName
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <span className={`input__icon input__icon--${iconPosition}`}>
        {icon}
      </span>
    );
  };

  const renderPasswordToggle = () => {
    if (type !== 'password') return null;

    return (
      <button
        type="button"
        className="input__password-toggle"
        onClick={togglePasswordVisibility}
        tabIndex="-1"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
    );
  };

  const renderTextarea = () => {
    return (
      <textarea
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        className={inputClasses}
        rows={props.rows || 4}
        {...props}
      />
    );
  };

  const renderInput = () => {
    return (
      <input
        ref={ref}
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        autoComplete={autoComplete}
        className={inputClasses}
        {...props}
      />
    );
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}

      <div className="input__wrapper">
        {renderIcon()}
        {type === 'textarea' ? renderTextarea() : renderInput()}
        {renderPasswordToggle()}
      </div>

      {(error || success || helperText) && (
        <div className="input__footer">
          {error && (
            <span className="input__error-message">
              <span className="input__error-icon">⚠️</span>
              {error}
            </span>
          )}
          {success && !error && (
            <span className="input__success-message">
              <span className="input__success-icon">✅</span>
              {success}
            </span>
          )}
          {helperText && !error && !success && (
            <span className="input__helper-text">{helperText}</span>
          )}
          {maxLength && (
            <span className="input__char-count">
              {value?.length || 0}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

// Search Input variant
export const SearchInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="search"
      icon="🔍"
      iconPosition="left"
      placeholder="Search..."
      {...props}
    />
  );
});

// Phone Input variant
export const PhoneInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="tel"
      icon="📞"
      iconPosition="left"
      placeholder="Enter phone number"
      pattern="[0-9]{10}"
      maxLength={10}
      {...props}
    />
  );
});

// Email Input variant
export const EmailInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="email"
      icon="✉️"
      iconPosition="left"
      placeholder="Enter email address"
      {...props}
    />
  );
});

// Password Input variant
export const PasswordInput = forwardRef((props, ref) => {
  return (
    <Input
      ref={ref}
      type="password"
      icon="🔒"
      iconPosition="left"
      placeholder="Enter password"
      {...props}
    />
  );
});

// Usage examples:
// <Input
//   label="Username"
//   name="username"
//   value={username}
//   onChange={handleChange}
//   placeholder="Enter username"
//   required
// />

// <Input
//   type="email"
//   label="Email"
//   name="email"
//   value={email}
//   onChange={handleChange}
//   error={errors.email}
//   icon="✉️"
// />

// <Input
//   type="textarea"
//   label="Description"
//   name="description"
//   value={description}
//   onChange={handleChange}
//   rows={5}
//   maxLength={500}
// />

// <PhoneInput
//   label="Phone Number"
//   name="phone"
//   value={phone}
//   onChange={handleChange}
// />

Input.displayName = 'Input';
SearchInput.displayName = 'SearchInput';
PhoneInput.displayName = 'PhoneInput';
EmailInput.displayName = 'EmailInput';
PasswordInput.displayName = 'PasswordInput';

export default Input;