import React, { createContext, useState, useEffect, useContext } from 'react';

// ======================================================
// Theme Context
// Manages dark/light theme throughout the app
// Uses CSS variables for theming as per requirements
// ======================================================

// Create context
const ThemeContext = createContext(null);

// Custom hook to use theme context
// NOTICE: No 'export' keyword here - we'll export at the bottom
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
// NOTICE: No 'export' keyword here - we'll export at the bottom
const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Add theme class to body for any additional styling
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If using system theme, update to match
      if (localStorage.getItem('theme') === 'system') {
        setTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  /**
   * Set specific theme
   * @param {string} newTheme - 'light' or 'dark'
   */
  const setThemeMode = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  /**
   * Set to follow system theme
   */
  const followSystemTheme = () => {
    localStorage.setItem('theme', 'system');
    setTheme(systemTheme);
  };

  /**
   * Check if current theme is dark
   * @returns {boolean} - Is dark theme
   */
  const isDark = () => theme === 'dark';

  /**
   * Check if current theme is light
   * @returns {boolean} - Is light theme
   */
  const isLight = () => theme === 'light';

  /**
   * Get theme display name
   * @returns {string} - Display name
   */
  const getThemeDisplay = () => {
    return theme === 'light' ? 'Light' : 'Dark';
  };

  /**
   * Get theme icon
   * @returns {string} - Theme icon
   */
  const getThemeIcon = () => {
    return theme === 'light' ? '☀️' : '🌙';
  };

  /**
   * Get opposite theme
   * @returns {string} - Opposite theme
   */
  const getOppositeTheme = () => {
    return theme === 'light' ? 'dark' : 'light';
  };

  /**
   * Get CSS variables for current theme
   * @returns {Object} - Theme CSS variables
   */
  const getThemeVariables = () => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    
    return {
      primary: styles.getPropertyValue('--color-primary').trim(),
      secondary: styles.getPropertyValue('--color-secondary').trim(),
      background: styles.getPropertyValue('--bg-primary').trim(),
      text: styles.getPropertyValue('--text-primary').trim()
    };
  };

  // Context value
  const value = {
    theme,
    systemTheme,
    toggleTheme,
    setThemeMode,
    followSystemTheme,
    isDark,
    isLight,
    getThemeDisplay,
    getThemeIcon,
    getOppositeTheme,
    getThemeVariables
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ONLY ONE EXPORT STATEMENT - AT THE BOTTOM
export { ThemeProvider, useTheme };