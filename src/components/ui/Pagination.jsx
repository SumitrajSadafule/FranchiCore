import React from 'react';
import Button from './Button';
import './Pagination.css';

// ======================================================
// Reusable Pagination Component
// Used across all list pages for consistent navigation
// Supports mobile responsive design and accessibility
// ======================================================

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showPageNumbers = true,
  showFirstLast = true,
  siblingCount = 1,
  className = '',
  ...props
}) => {
  // Don't render if only one page
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(0);
  };

  const handleLast = () => {
    onPageChange(totalPages - 1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalNumbers = siblingCount * 2 + 3; // siblingCount on each side + current + first + last
    const totalBlocks = totalNumbers + 2; // +2 for first and last

    if (totalPages <= totalBlocks) {
      // Show all pages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 0);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);
      const showLeftDots = leftSiblingIndex > 1;
      const showRightDots = rightSiblingIndex < totalPages - 2;

      if (!showLeftDots && showRightDots) {
        // Show left side without dots
        for (let i = 0; i < 3 + 2 * siblingCount; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages - 1);
      } else if (showLeftDots && !showRightDots) {
        // Show right side without dots
        pageNumbers.push(0);
        pageNumbers.push('...');
        for (let i = totalPages - (3 + 2 * siblingCount); i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        // Show both sides with dots
        pageNumbers.push(0);
        pageNumbers.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages - 1);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className={`pagination ${className}`} {...props}>
      {/* Items info - visible on desktop */}
      {totalItems > 0 && (
        <div className="pagination__info">
          Showing {startItem} to {endItem} of {totalItems} items
        </div>
      )}

      <div className="pagination__controls">
        {/* First page button */}
        {showFirstLast && (
          <button
            onClick={handleFirst}
            disabled={currentPage === 0}
            className="pagination__btn pagination__btn--first"
            aria-label="First page"
          >
            <span className="pagination__btn-icon">«</span>
            <span className="pagination__btn-text">First</span>
          </button>
        )}

        {/* Previous page button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="pagination__btn pagination__btn--prev"
          aria-label="Previous page"
        >
          <span className="pagination__btn-icon">‹</span>
          <span className="pagination__btn-text">Previous</span>
        </button>

        {/* Page numbers */}
        {showPageNumbers && (
          <div className="pagination__numbers">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`dots-${index}`} className="pagination__dots">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`pagination__number ${
                    currentPage === page ? 'pagination__number--active' : ''
                  }`}
                  aria-label={`Page ${page + 1}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>
        )}

        {/* Next page button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          className="pagination__btn pagination__btn--next"
          aria-label="Next page"
        >
          <span className="pagination__btn-text">Next</span>
          <span className="pagination__btn-icon">›</span>
        </button>

        {/* Last page button */}
        {showFirstLast && (
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages - 1}
            className="pagination__btn pagination__btn--last"
            aria-label="Last page"
          >
            <span className="pagination__btn-text">Last</span>
            <span className="pagination__btn-icon">»</span>
          </button>
        )}
      </div>

      {/* Mobile simple view */}
      <div className="pagination__mobile">
        <span className="pagination__mobile-info">
          Page {currentPage + 1} of {totalPages}
        </span>
        <div className="pagination__mobile-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="pagination__mobile-btn"
          >
            ← Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="pagination__mobile-btn"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact version for simple use cases
export const SimplePagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination pagination--simple">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        ← Previous
      </Button>
      <span className="pagination__simple-info">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next →
      </Button>
    </div>
  );
};

// Usage examples:
// <Pagination
//   currentPage={0}
//   totalPages={10}
//   totalItems={95}
//   pageSize={10}
//   onPageChange={(page) => setCurrentPage(page)}
// />

// <SimplePagination
//   currentPage={0}
//   totalPages={10}
//   onPageChange={(page) => setCurrentPage(page)}
// />

export default Pagination;