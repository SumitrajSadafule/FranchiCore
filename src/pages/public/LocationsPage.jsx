import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import franchiseService from '../../services/franchiseService';
import './LocationsPage.css';
import MapView from '../../components/common/MapView';

/// extra 

// Add this right after your imports
console.log('LocationsPage mounted');
console.log('franchiseService:', franchiseService);

//extra ends

// ======================================================
// Locations Page Component
// Public-facing page showing all franchise locations
// Includes search, filters, and map view
// ======================================================

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState('city');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRadius, setNearbyRadius] = useState(10);
  const [showNearby, setShowNearby] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6); // Show 6 items per page
  const [paginatedLocations, setPaginatedLocations] = useState([]);

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [locations, searchQuery, selectedCity, selectedState, sortBy, sortDirection, showNearby, userLocation, nearbyRadius]);
  // Update pagination when filteredLocations changes
  useEffect(() => {
    setPaginatedLocations(paginateLocations(filteredLocations, currentPage));
  }, [filteredLocations, currentPage]);
  
  const fetchLocations = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await franchiseService.getAllFranchises(0, 100, 'city', 'ASC');
    console.log('Raw response:', response);
    
    // Check if response is an array directly
    let franchisesData = [];
    if (Array.isArray(response)) {
      franchisesData = response;
      console.log('Response is direct array with length:', franchisesData.length);
    } else if (response.content && Array.isArray(response.content)) {
      franchisesData = response.content;
      console.log('Response has content array with length:', franchisesData.length);
    } else {
      console.log('Unexpected response structure:', response);
    }
    
    console.log('First item raw:', franchisesData[0]);
    
    // Try to format one item manually to debug
    if (franchisesData.length > 0) {
      const firstItem = franchisesData[0];
      const manualFormat = {
        id: firstItem.id,
        name: firstItem.franchiseName,
        city: firstItem.city,
        state: firstItem.state,
        address: `${firstItem.addressLine1 || ''} ${firstItem.addressLine2 || ''}`.trim(),
        phone: firstItem.phone,
      };
      console.log('Manually formatted:', manualFormat);
    }
    
    const formattedLocations = franchiseService.formatFranchises(franchisesData);
    console.log('Formatted locations length:', formattedLocations.length);
    console.log('First formatted:', formattedLocations[0]);
    
    setLocations(formattedLocations);
    console.log('Locations state after set:', formattedLocations.length);
    console.log('All formatted cities:', formattedLocations.map(l => l.city));

    const uniqueCities = [...new Set(formattedLocations.map(l => l.city))].sort();
    const uniqueStates = [...new Set(formattedLocations.map(l => l.state))].sort();
    setCities(uniqueCities);
    setStates(uniqueStates);
  } catch (err) {
    console.error('Error fetching locations:', err);
    setError('Failed to load locations. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const applyFilters = () => {
    // Add this check - don't apply filters if no locations
    if (locations.length === 0) {
      console.log('No locations to filter yet');
      return;
    }
  
    console.log('Applying filters with', locations.length, 'locations');
    console.log('Current filters:', { searchQuery, selectedCity, selectedState });
    let filtered = [...locations];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query) ||
        location.state.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query)
      );
    }

    // Apply city filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(location => location.city === selectedCity);
    }

    // Apply state filter
    if (selectedState !== 'all') {
      filtered = filtered.filter(location => location.state === selectedState);
    }

    // Apply nearby filter
    if (showNearby && userLocation) {
      const nearby = franchiseService.getNearbyFranchises(
        filtered,
        userLocation.lat,
        userLocation.lng,
        nearbyRadius
      );
      filtered = nearby;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === 'city') {
        aValue = a.city;
        bValue = b.city;
      } else if (sortBy === 'state') {
        aValue = a.state;
        bValue = b.state;
      }

      if (aValue < bValue) return sortDirection === 'ASC' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'ASC' ? 1 : -1;
      return 0;
    });
    console.log('Filtered results:', filtered.length);
    setFilteredLocations(filtered);
    
  setCurrentPage(0); // Reset to first page when filters change
  setPaginatedLocations(paginateLocations(filtered, 0));
  };
  // Add pagination function
  const paginateLocations = (items, page) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const paginated = paginateLocations(filteredLocations, newPage);
    setPaginatedLocations(paginated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowNearby(true);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedState('all');
    setSortBy('city');
    setSortDirection('ASC');
    setShowNearby(false);
    setUserLocation(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortDirection] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  // Sort options
  const sortOptions = [
    { value: 'city-ASC', label: 'City (A to Z)' },
    { value: 'city-DESC', label: 'City (Z to A)' },
    { value: 'state-ASC', label: 'State (A to Z)' },
    { value: 'state-DESC', label: 'State (Z to A)' },
    { value: 'name-ASC', label: 'Name (A to Z)' },
    { value: 'name-DESC', label: 'Name (Z to A)' }
  ];

  return (
    <div className="locations-page">
      {/* Hero Section */}
      <section className="locations-page__hero">
        <div className="locations-page__hero-content container">
          <h1 className="locations-page__hero-title animate-fade-in-down">
            Find a <span className="locations-page__hero-highlight">Location</span>
          </h1>
          <p className="locations-page__hero-subtitle animate-fade-in-up">
            Discover MAC's franchises near you
          </p>
        </div>
      </section>

      <div className="locations-page__container container">
        {/* Search and Filters */}
        <div className="locations-page__filters">
          <div className="locations-page__filters-header">
            <h2 className="locations-page__filters-title">Find Your Nearest MAC's</h2>
            <button className="locations-page__filters-clear" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="locations-page__filters-grid">
            {/* Search */}
            <form onSubmit={handleSearch} className="locations-page__search">
              <input
                type="text"
                placeholder="Search by name, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="locations-page__search-input"
              />
              <button type="submit" className="locations-page__search-button">
                🔍 Search
              </button>
            </form>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="locations-page__filter-select"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="locations-page__filter-select"
            >
              <option value="all">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={handleSortChange}
              className="locations-page__filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>

            {/* Nearby Button */}
            <button
              onClick={getUserLocation}
              className={`locations-page__nearby-btn ${showNearby ? 'locations-page__nearby-btn--active' : ''}`}
            >
              📍 Find Near Me
            </button>
          </div>

          {/* Nearby Radius Slider (shown when nearby is active) */}
          {showNearby && userLocation && (
            <div className="locations-page__radius">
              <label className="locations-page__radius-label">
                Radius: {nearbyRadius} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={nearbyRadius}
                onChange={(e) => setNearbyRadius(Number(e.target.value))}
                className="locations-page__radius-slider"
              />
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="locations-page__view-toggle">
          <button
            className={`locations-page__view-btn ${viewMode === 'grid' ? 'locations-page__view-btn--active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📱 Grid View
          </button>
          <button
            className={`locations-page__view-btn ${viewMode === 'map' ? 'locations-page__view-btn--active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map View
          </button>
        </div>

        {/* Results Count */}
        <div className="locations-page__results">
          Found {filteredLocations.length} {filteredLocations.length === 1 ? 'location' : 'locations'}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="locations-page__loading">
            <div className="locations-page__spinner"></div>
            <p>Finding locations near you...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="locations-page__error">
            <span className="locations-page__error-icon">😕</span>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchLocations} className="locations-page__error-button">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLocations.length === 0 && (
          <div className="locations-page__empty">
            <span className="locations-page__empty-icon">📍</span>
            <h3>No locations found</h3>
            <p>Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="locations-page__empty-button">
              Clear Filters
            </button>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && viewMode === 'grid' && filteredLocations.length > 0 && (
          <div className="locations-page__grid">
            {paginatedLocations.map((location, index) => (
              <div 
                key={location.id} 
                className="locations-page__card animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="locations-page__card-header">
                  <span className="locations-page__card-icon">🏪</span>
                  <h3 className="locations-page__card-name">{location.name}</h3>
                </div>
                
                <div className="locations-page__card-body">
                  <p className="locations-page__card-address">
                    <span className="locations-page__card-icon-small">📍</span>
                    {location.address}
                  </p>
                  
                  <p className="locations-page__card-phone">
                    <span className="locations-page__card-icon-small">📞</span>
                    {location.phone}
                  </p>
                  
                  <p className="locations-page__card-hours">
                    <span className="locations-page__card-icon-small">🕒</span>
                    {location.operatingHours}
                  </p>
                  
                  {location.distance && (
                    <p className="locations-page__card-distance">
                      <span className="locations-page__card-icon-small">📏</span>
                      {location.distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
                
                <div className="locations-page__card-footer">
                  <span className={`locations-page__card-status locations-page__card-status--${location.status.toLowerCase()}`}>
                    {location.statusDisplay?.label}
                  </span>
                  
                  <div className="locations-page__card-actions">
                    <a 
                      href={location.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="locations-page__card-link"
                    >
                      🗺️ Directions
                    </a>
                    <Link to={`/locations/${location.id}`} className="locations-page__card-link">
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        {!loading && !error && filteredLocations.length > itemsPerPage && (
          <div className="locations-page__pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="locations-page__pagination-btn"
            >
              ← Previous
            </button>
            
            <div className="locations-page__pagination-info">
              Page {currentPage + 1} of {Math.ceil(filteredLocations.length / itemsPerPage)}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredLocations.length / itemsPerPage) - 1}
              className="locations-page__pagination-btn"
            >
              Next →
            </button>
          </div>
        )}

        
        {/* Map View - Now with real Google Maps */}
{!loading && !error && viewMode === 'map' && filteredLocations.length > 0 && (
  <div className="locations-page__map">
    <MapView 
      locations={filteredLocations}
      zoom={5}
    />
  </div>
)}
      </div>
    </div>
  );
};

export default LocationsPage;