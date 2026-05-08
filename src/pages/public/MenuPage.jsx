import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import menuService from '../../services/menuService';
import './MenuPage.css';

// ======================================================
// Menu Page Component
// Public-facing menu page with categories, search, and filters
// Displays all menu items with pagination
// ======================================================

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    available: false
  });
  useEffect(() => {
  console.log('Filters changed:', filters);
}, [filters]);

  const itemsPerPage = 12;

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
      useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  // Fetch menu items when filters change
  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, searchQuery, priceRange, sortBy, sortDirection, currentPage, filters]);

  // Add this after your existing useEffects
useEffect(() => {
  const updateSliderFill = () => {
    const minSlider = document.querySelector('.menu-page__slider--min');
    const maxSlider = document.querySelector('.menu-page__slider--max');
    const fillBar = document.querySelector('.menu-page__slider-fill');
    
    if (minSlider && maxSlider && fillBar) {
      const minVal = parseFloat(minSlider.value);
      const maxVal = parseFloat(maxSlider.value);
      const minPercent = (minVal / 500) * 100;
      const maxPercent = (maxVal / 500) * 100;
      
      fillBar.style.left = `${minPercent}%`;
      fillBar.style.width = `${maxPercent - minPercent}%`;
    }
  };
  
  // Initial update
  updateSliderFill();
  
  // Add event listeners
  const minSlider = document.querySelector('.menu-page__slider--min');
  const maxSlider = document.querySelector('.menu-page__slider--max');
  
  const handleInput = () => updateSliderFill();
  
  if (minSlider) {
    minSlider.addEventListener('input', handleInput);
  }
  if (maxSlider) {
    maxSlider.addEventListener('input', handleInput);
  }
  
  return () => {
    if (minSlider) minSlider.removeEventListener('input', handleInput);
    if (maxSlider) maxSlider.removeEventListener('input', handleInput);
  };
}, []);

  const fetchCategories = async () => {
    try {
      const data = await menuService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

 const fetchMenuItems = async () => {
  setLoading(true);
  setError(null);
  
  try {
    let response;
    
    if (searchQuery) {
      response = await menuService.searchMenuItems(
        searchQuery, 
        currentPage, 
        itemsPerPage, 
        sortBy, 
        sortDirection
      );
    } else if (selectedCategory !== 'all') {
      response = await menuService.getMenuItemsByCategory(
        selectedCategory,
        currentPage,
        itemsPerPage,
        sortBy,
        sortDirection
      );
    } else {
      response = await menuService.getAllMenuItems(
        currentPage,
        itemsPerPage,
        sortBy,
        sortDirection
      );
    }

    // 🔴 FIX: Get items array correctly (handle both formats)
    let items = [];
    if (response && response.content) {
      items = response.content;
    } else if (Array.isArray(response)) {
      items = response;
    } else {
      items = [];
    }

    console.log('Raw items from API:', items.length);
    console.log('Spicy items in raw:', items.filter(i => i.spicy === true).length);

    // 🔴 FIX: Apply filters using correct property names
    let filteredItems = [...items];

    if (filters.vegetarian) {
      filteredItems = filteredItems.filter(item => item.vegetarian === true);
      console.log('After vegetarian filter:', filteredItems.length);
    }

    if (filters.spicy) {
      filteredItems = filteredItems.filter(item => item.spicy === true);
      console.log('After spicy filter:', filteredItems.length);
    }

    if (filters.available) {
      filteredItems = filteredItems.filter(item => item.available === true);
      console.log('After available filter:', filteredItems.length);
    }

    // Apply price range filter
    filteredItems = filteredItems.filter(
      item => item.price >= priceRange.min && item.price <= priceRange.max
    );
    console.log('After price filter:', filteredItems.length);
    console.log('Final spicy items:', filteredItems.filter(i => i.spicy === true).map(i => i.name));

    setMenuItems(filteredItems);
    setTotalPages(response.totalPages || Math.ceil(filteredItems.length / itemsPerPage));
    setTotalItems(response.totalElements || filteredItems.length);
    
  } catch (err) {
    setError('Failed to load menu items. Please try again.');
    console.error('Error fetching menu items:', err);
  } finally {
    setLoading(false);
  }
};

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchMenuItems();
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortDirection] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
    setCurrentPage(0);
  };

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
    setCurrentPage(0);
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: Number(value)
    }));
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 500 });
    setSortBy('name');
    setSortDirection('ASC');
    setFilters({
      vegetarian: false,
      spicy: false,
      available: false
    });
    setCurrentPage(0);
  };

  // Sort options
  const sortOptions = [
    { value: 'name-ASC', label: 'Name (A to Z)' },
    { value: 'name-DESC', label: 'Name (Z to A)' },
    { value: 'price-ASC', label: 'Price (Low to High)' },
    { value: 'price-DESC', label: 'Price (High to Low)' },
    { value: 'category-ASC', label: 'Category' }
  ];

  return (
    <div className="menu-page">
      {/* Hero Section */}
      <section className="menu-page__hero">
        <div className="menu-page__hero-content container">
          <h1 className="menu-page__hero-title animate-fade-in-down">
            Our <span className="menu-page__hero-highlight">Menu</span>
          </h1>
          <p className="menu-page__hero-subtitle animate-fade-in-up">
            Discover delicious meals crafted with love
          </p>
        </div>
      </section>

      <div className="menu-page__container container">
        {/* Filters Sidebar */}
        <aside className="menu-page__filters">
          <div className="menu-page__filters-header">
            <h3 className="menu-page__filters-title">Filters</h3>
            <button className="menu-page__filters-clear" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="menu-page__filter-section">
            <h4 className="menu-page__filter-title">Search</h4>
            <form onSubmit={handleSearch} className="menu-page__search-form">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-page__search-input"
              />
              <button type="submit" className="menu-page__search-button">
                🔍
              </button>
            </form>
          </div>

          {/* Categories */}
          <div className="menu-page__filter-section">
            <h4 className="menu-page__filter-title">Categories</h4>
            <div className="menu-page__category-list">
              <button
                className={`menu-page__category-btn ${selectedCategory === 'all' ? 'menu-page__category-btn--active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Items
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`menu-page__category-btn ${selectedCategory === category ? 'menu-page__category-btn--active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {menuService.getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="menu-page__filter-section">
            <h4 className="menu-page__filter-title">Price Range</h4>
            <div className="menu-page__price-range">
              <div className="menu-page__price-inputs">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="menu-page__price-input"
                  placeholder="Min"
                />
                <span className="menu-page__price-separator">-</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="menu-page__price-input"
                  placeholder="Max"
                />
              </div>
              <div className="menu-page__price-slider">
                <div className="menu-page__slider-track"></div>
  {/* Colored fill that connects both sliders */}
  <div className="menu-page__slider-fill"></div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="menu-page__slider menu-page__slider--min"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="menu-page__slider menu-page__slider--max"
                />
              </div>
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="menu-page__filter-section">
            <h4 className="menu-page__filter-title">Dietary</h4>
            <div className="menu-page__checkbox-group">
              <label className="menu-page__checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.vegetarian}
                  onChange={() => handleFilterChange('vegetarian')}
                  className="menu-page__checkbox"
                />
                <span className="menu-page__checkbox-text">🌱 Vegetarian</span>
              </label>
              <label className="menu-page__checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.spicy}
                  onChange={() => handleFilterChange('spicy')}
                  className="menu-page__checkbox"
                />
                <span className="menu-page__checkbox-text">🔥 Spicy</span>
              </label>
              <label className="menu-page__checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.available}
                  onChange={() => handleFilterChange('available')}
                  className="menu-page__checkbox"
                />
                <span className="menu-page__checkbox-text">✅ Available Now</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="menu-page__content">
          {/* Sort Bar */}
          <div className="menu-page__sort-bar">
            <div className="menu-page__results-info">
              Showing {menuItems.length} of {totalItems} items
            </div>
            <div className="menu-page__sort-selector">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={`${sortBy}-${sortDirection}`}
                onChange={handleSortChange}
                className="menu-page__select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="menu-page__loading">
              <div className="menu-page__spinner"></div>
              <p>Loading delicious items...</p>
            </div>
          ) : error ? (
            <div className="menu-page__error">
              <span className="menu-page__error-icon">😕</span>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button onClick={fetchMenuItems} className="menu-page__error-button">
                Try Again
              </button>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="menu-page__empty">
              <span className="menu-page__empty-icon">🍔</span>
              <h3>No items found</h3>
              <p>Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="menu-page__empty-button">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="menu-page__grid">
                {menuItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="menu-page__item animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="menu-page__item-image">
                      <img 
                        src={item.imageUrl || '/images/default-food.jpg'} 
                        alt={item.name}
                        onError={(e) => {
                          // Set a flag to prevent infinite loops
                          if (!e.target.hasAttribute('data-error')) {
                            e.target.setAttribute('data-error', 'true');
                            e.target.src = '/images/default-food.jpg';
                          }
                        }}
                      />
                      <div className="menu-page__item-badges">
                        {!item.available && (
                          <span className="menu-page__item-badge menu-page__item-badge--sold">Unavailable</span>
                      )}
                      {item.spicy && (
                          <span className="menu-page__item-badge menu-page__item-badge--spicy">🌶️</span>
                      )}
                      {item.vegetarian && (
                         <span className="menu-page__item-badge menu-page__item-badge--veg">🌱</span>
                      )}
                      </div>
                      
                    </div>
                    <div className="menu-page__item-content">
                      <div className="menu-page__item-header">
                        <h3 className="menu-page__item-name">{item.name}</h3>
                        <span className="menu-page__item-price">₹{item.price?.toFixed(2)}</span>
                      </div>
                      <p className="menu-page__item-description">{item.description}</p>
                      <div className="menu-page__item-footer">
                        <span className="menu-page__item-category">
                          {menuService.getCategoryDisplayName(item.category)}
                        </span>
                        <Link to={`/menu/${item.id}`} className="menu-page__item-link">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="menu-page__pagination">
                  <button
                    className="menu-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    ← Previous
                  </button>
                  
                  <div className="menu-page__pagination-numbers">
                    {[...Array(totalPages).keys()].map(pageNum => (
                      <button
                        key={pageNum}
                        className={`menu-page__pagination-number ${
                          currentPage === pageNum ? 'menu-page__pagination-number--active' : ''
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="menu-page__pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MenuPage;