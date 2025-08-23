// File: formAI/frontend/src/config.js
// Configuration for API and Frontend URLs
// Uses environment variables for flexible configuration

// Get environment variables with fallbacks
const getEnvVar = (key, fallback) => {
  return process.env[key] || fallback;
};

// API URLs
export const API_BASE_URL = getEnvVar('REACT_APP_API_URL', 'http://localhost:5000');

// Frontend URLs  
export const FRONTEND_BASE_URL = getEnvVar('REACT_APP_FRONTEND_URL', 'http://localhost:3000');

// Helper function to get API URL for a specific endpoint
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Helper function to get frontend URL for a specific route
export const getFrontendUrl = (route) => `${FRONTEND_BASE_URL}${route}`;

// Export individual configs for specific use cases
export const LOCAL_CONFIG = {
  api: 'http://localhost:5000',
  frontend: 'http://localhost:3000'
};

export const PRODUCTION_CONFIG = {
  api: 'https://formai-u50u.onrender.com',
  frontend: 'https://form-ai-gamma.vercel.app'
};

export default {
  API_BASE_URL,
  FRONTEND_BASE_URL,
  getApiUrl,
  getFrontendUrl,
  LOCAL_CONFIG,
  PRODUCTION_CONFIG
};
