import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import menuService from '../../services/menuService';
import './AdminMenu.css';

// ======================================================
// Admin Menu Page Component
// Super admin menu management interface
// Allows CRUD operations on menu items
// ======================================================

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    calories: '',
    preparationTimeMinutes: ''
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [currentPage, selectedCategory, searchQuery]);

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
          'name',
          'ASC'
        );
      } else if (selectedCategory !== 'all') {
        response = await menuService.getMenuItemsByCategory(
          selectedCategory,
          currentPage,
          itemsPerPage,
          'name',
          'ASC'
        );
      } else {
        response = await menuService.getAllMenuItems(
          currentPage,
          itemsPerPage,
          'name',
          'ASC'
        );
      }

      setMenuItems(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalItems(response.totalElements || 0);
    } catch (err) {
      setError('Failed to load menu items. Please try again.');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await menuService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      isAvailable: true,
      isVegetarian: false,
      isSpicy: false,
      calories: '',
      preparationTimeMinutes: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || '',
      imageUrl: item.imageUrl || '',
      // CHANGED: API uses 'available' not 'isAvailable'
      isAvailable: item.available !== undefined ? item.available : true,
      // CHANGED: API uses 'vegetarian' not 'isVegetarian'
      isVegetarian: item.vegetarian || false,
      // CHANGED: API uses 'spicy' not 'isSpicy'
      isSpicy: item.spicy || false,
      calories: item.calories || '',
      preparationTimeMinutes: item.preparationTimeMinutes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await menuService.deleteMenuItem(id);
      await fetchMenuItems();
    } catch (err) {
      alert('Failed to delete menu item. Please try again.');
      console.error('Error deleting menu item:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = menuService.validateMenuItem(formData);
      if (!validation.isValid) {
        alert(Object.values(validation.errors).join('\n'));
        setLoading(false);
        return;
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        calories: formData.calories ? parseInt(formData.calories) : null,
        preparationTimeMinutes: formData.preparationTimeMinutes ? parseInt(formData.preparationTimeMinutes) : null
      };

      // CHANGED: Rename properties for API
      if ('isAvailable' in itemData) {
        itemData.available = itemData.isAvailable;
        delete itemData.isAvailable;
      }
      if ('isVegetarian' in itemData) {
        itemData.vegetarian = itemData.isVegetarian;
        delete itemData.isVegetarian;
      }
      if ('isSpicy' in itemData) {
        itemData.spicy = itemData.isSpicy;
        delete itemData.isSpicy;
      }

      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, itemData);
      } else {
        await menuService.createMenuItem(itemData);
      }

      setShowModal(false);
      await fetchMenuItems();
    } catch (err) {
      alert(err.message || 'Failed to save menu item. Please try again.');
      console.error('Error saving menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const item = menuItems.find(i => i.id === id);
      // CHANGED: Use 'available' instead of 'isAvailable' for API
      await menuService.updateMenuItem(id, {
        ...item,
        available: !currentStatus
      });
      await fetchMenuItems();
    } catch (err) {
      alert('Failed to update availability. Please try again.');
      console.error('Error updating availability:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchMenuItems();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setCurrentPage(0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="admin-menu">
      {/* Header */}
      <div className="admin-menu__header">
        <div>
          <h1 className="admin-menu__title">Menu Management</h1>
          <p className="admin-menu__subtitle">
            Manage all menu items across franchises
          </p>
        </div>
        <button onClick={handleAddNew} className="admin-menu__add-button">
          <span className="admin-menu__add-icon">+</span>
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="admin-menu__filters">
        <form onSubmit={handleSearch} className="admin-menu__search">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-menu__search-input"
          />
          <button type="submit" className="admin-menu__search-button">
            🔍 Search
          </button>
        </form>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="admin-menu__filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {menuService.getCategoryDisplayName(category)}
            </option>
          ))}
        </select>

        {(searchQuery || selectedCategory !== 'all') && (
          <button onClick={clearFilters} className="admin-menu__clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      <div className="admin-menu__results-info">
        Showing {menuItems.length} of {totalItems} items
      </div>

      {/* Loading State */}
      {loading && (
        <div className="admin-menu__loading">
          <div className="admin-menu__spinner"></div>
          <p>Loading menu items...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-menu__error">
          <span className="admin-menu__error-icon">😕</span>
          <p>{error}</p>
          <button onClick={fetchMenuItems} className="admin-menu__retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Menu Items Table */}
      {!loading && !error && (
        <>
          <div className="admin-menu__table-container">
            <table className="admin-menu__table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Dietary</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.imageUrl || '/images/default-food.jpg'}
                        alt={item.name}
                        className="admin-menu__item-image"
                        onError={(e) => {
                          if (!e.target.hasAttribute('data-error')) {
                            e.target.setAttribute('data-error', 'true');
                            e.target.src = '/images/default-food.jpg';
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div className="admin-menu__item-name">{item.name}</div>
                      <div className="admin-menu__item-description">{item.description}</div>
                    </td>
                    <td>
                      <span className="admin-menu__item-category">
                        {menuService.getCategoryDisplayName(item.category)}
                      </span>
                    </td>
                    <td className="admin-menu__item-price">
                      {formatPrice(item.price)}
                    </td>
                    <td>
                      <button
                        // CHANGED: Use 'available' from API
                        onClick={() => handleToggleAvailability(item.id, item.available)}
                        className={`admin-menu__status-badge ${
                          item.available ? 'admin-menu__status-badge--active' : 'admin-menu__status-badge--inactive'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-menu__dietary-icons">
                        {/* CHANGED: Use 'vegetarian' from API */}
                        {item.vegetarian && (
                          <span className="admin-menu__dietary-icon" title="Vegetarian">🌱</span>
                        )}
                        {/* CHANGED: Use 'spicy' from API */}
                        {item.spicy && (
                          <span className="admin-menu__dietary-icon" title="Spicy">🔥</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-menu__item-details">
                        {item.calories && (
                          <span className="admin-menu__item-detail" title="Calories">
                            🔥 {item.calories} cal
                          </span>
                        )}
                        {item.preparationTimeMinutes && (
                          <span className="admin-menu__item-detail" title="Prep Time">
                            ⏱️ {item.preparationTimeMinutes} min
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="admin-menu__actions">
                        <button
                          onClick={() => handleEdit(item)}
                          className="admin-menu__action-btn admin-menu__action-btn--edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="admin-menu__action-btn admin-menu__action-btn--delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-menu__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="admin-menu__pagination-btn"
              >
                ← Previous
              </button>
              <span className="admin-menu__pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="admin-menu__pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-menu__modal-overlay">
          <div className="admin-menu__modal">
            <div className="admin-menu__modal-header">
              <h2 className="admin-menu__modal-title">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="admin-menu__modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-menu__modal-form">
              <div className="admin-menu__form-row">
                <div className="admin-menu__form-group">
                  <label className="admin-menu__form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="admin-menu__form-input"
                    required
                  />
                </div>

                <div className="admin-menu__form-group">
                  <label className="admin-menu__form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="admin-menu__form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {menuService.getCategoryDisplayName(category)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-menu__form-group">
                <label className="admin-menu__form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-menu__form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="admin-menu__form-row">
                <div className="admin-menu__form-group">
                  <label className="admin-menu__form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="admin-menu__form-input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="admin-menu__form-group">
                  <label className="admin-menu__form-label">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="admin-menu__form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="admin-menu__form-row">
                <div className="admin-menu__form-group">
                  <label className="admin-menu__form-label">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    className="admin-menu__form-input"
                    min="0"
                  />
                </div>

                <div className="admin-menu__form-group">
                  <label className="admin-menu__form-label">Prep Time (minutes)</label>
                  <input
                    type="number"
                    name="preparationTimeMinutes"
                    value={formData.preparationTimeMinutes}
                    onChange={handleInputChange}
                    className="admin-menu__form-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="admin-menu__form-checkbox-group">
                <label className="admin-menu__form-checkbox">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  Available
                </label>

                <label className="admin-menu__form-checkbox">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                  />
                  Vegetarian
                </label>

                <label className="admin-menu__form-checkbox">
                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleInputChange}
                  />
                  Spicy
                </label>
              </div>

              <div className="admin-menu__form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-menu__form-button admin-menu__form-button--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-menu__form-button admin-menu__form-button--primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;