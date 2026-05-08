import React, { useEffect, useRef } from 'react';
import Button from './Button';
import './Modal.css';

// ======================================================
// Reusable Modal Component
// Used for application details, feedback replies, and confirmation dialogs
// Supports multiple sizes, close on overlay click, and keyboard navigation
// ======================================================

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Save current focus
      previousFocusRef.current = document.activeElement;
      // Focus modal
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Restore focus
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal__overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        <div className="modal__header">
          {title && (
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="modal__close"
              aria-label="Close modal"
            >
              ×
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal__body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Dialog variant
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  size = 'sm',
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
      {...props}
    >
      <p className="modal__message">{message}</p>
    </Modal>
  );
};

// Application Details Modal variant
export const ApplicationModal = ({
  isOpen,
  onClose,
  application,
  onUpdateStatus,
  ...props
}) => {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Details"
      size="lg"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
      {...props}
    >
      <div className="modal__application">
        <div className="modal__section">
          <h3 className="modal__section-title">Personal Information</h3>
          <div className="modal__grid">
            <div className="modal__field">
              <label>Full Name</label>
              <p>{application.fullName}</p>
            </div>
            <div className="modal__field">
              <label>Email</label>
              <p>{application.email}</p>
            </div>
            <div className="modal__field">
              <label>Phone</label>
              <p>{application.phone}</p>
            </div>
            <div className="modal__field">
              <label>Age</label>
              <p>{application.age || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="modal__section">
          <h3 className="modal__section-title">Job Details</h3>
          <div className="modal__grid">
            <div className="modal__field">
              <label>Position</label>
              <p>{application.jobTitle}</p>
            </div>
            <div className="modal__field">
              <label>Experience</label>
              <p>{application.experienceYears} years</p>
            </div>
            <div className="modal__field">
              <label>Qualification</label>
              <p>{application.qualification || 'N/A'}</p>
            </div>
          </div>
        </div>

        {application.coverNote && (
          <div className="modal__section">
            <h3 className="modal__section-title">Cover Note</h3>
            <p className="modal__cover-note">{application.coverNote}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Usage examples:
// <Modal
//   isOpen={showModal}
//   onClose={() => setShowModal(false)}
//   title="Modal Title"
//   size="md"
//   footer={
//     <>
//       <Button variant="outline" onClick={handleCancel}>Cancel</Button>
//       <Button onClick={handleConfirm}>Confirm</Button>
//     </>
//   }
// >
//   <p>Modal content goes here</p>
// </Modal>

// <ConfirmModal
//   isOpen={showConfirm}
//   onClose={() => setShowConfirm(false)}
//   onConfirm={handleDelete}
//   title="Delete Item"
//   message="Are you sure you want to delete this item? This action cannot be undone."
//   variant="error"
// />

// <ApplicationModal
//   isOpen={showApplication}
//   onClose={() => setShowApplication(false)}
//   application={selectedApplication}
// />

// Sizes: sm, md, lg, xl, full

export default Modal;