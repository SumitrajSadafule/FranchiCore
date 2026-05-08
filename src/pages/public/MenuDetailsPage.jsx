import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import menuService from '../../services/menuService';
import './MenuDetailsPage.css';

const MenuDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

      useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const fetchMenuItem = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await menuService.getMenuItemById(id);
      setItem(response);
    } catch (err) {
      setError('Failed to load menu item details. Please try again.');
      console.error('Error fetching menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-details">
        <div className="menu-details__loading">
          <div className="menu-details__spinner"></div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="menu-details">
        <div className="menu-details__error">
          <span className="menu-details__error-icon">😕</span>
          <h3>Item Not Found</h3>
          <p>{error || 'The menu item you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/menu')} className="menu-details__error-button">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-details">
      <div className="menu-details__container container">
        <Link to="/menu" className="menu-details__back-link">
          ← Back to Menu
        </Link>

        <div className="menu-details__grid">
          <div className="menu-details__image">
            <img 
              src={item.imageUrl || '/images/default-food.jpg'} 
              alt={item.name}
              onError={(e) => {
                if (!e.target.hasAttribute('data-error')) {
                  e.target.setAttribute('data-error', 'true');
                  e.target.src = '/images/default-food.jpg';
                }
              }}
            />
            <div className="menu-details__badges">
              {!item.available && (
                <span className="menu-details__badge menu-details__badge--sold">Unavailable</span>
              )}
              {item.vegetarian && (
                <span className="menu-details__badge menu-details__badge--veg">🌱</span>
              )}
              {item.spicy && (
                <span className="menu-details__badge menu-details__badge--spicy">🌶️ Spicy</span>
              )}
            </div>
          </div>

          <div className="menu-details__info">
            <h1 className="menu-details__title">{item.name}</h1>
            <div className="menu-details__category">
              {menuService.getCategoryDisplayName(item.category)}
            </div>
            <p className="menu-details__description">{item.description}</p>
            
            <div className="menu-details__details-grid">
              <div className="menu-details__detail-item">
                <span className="menu-details__detail-label">💰 Price:</span>
                <span className="menu-details__detail-value">₹{item.price?.toFixed(2)}</span>
              </div>
              {item.calories && (
                <div className="menu-details__detail-item">
                  <span className="menu-details__detail-label">🔥 Calories:</span>
                  <span className="menu-details__detail-value">{item.calories} cal</span>
                </div>
              )}
              {item.preparationTimeMinutes && (
                <div className="menu-details__detail-item">
                  <span className="menu-details__detail-label">⏱️ Prep Time:</span>
                  <span className="menu-details__detail-value">{item.preparationTimeMinutes} min</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/menu')}
              className="menu-details__order-button"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailsPage;