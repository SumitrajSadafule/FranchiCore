import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './PublicLayout.css';

// ======================================================
// Public Layout Component
// Wrapper for all public-facing pages
// Includes Header and Footer
// ======================================================

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Header />
      
      <main className="public-layout__main">
        <div className="public-layout__content">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;