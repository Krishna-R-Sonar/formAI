// File: formAI/frontend/src/env-test.js
// Environment Variable Test File
// This file helps verify that environment variables are being loaded correctly

import { getApiUrl, getFrontendUrl, API_BASE_URL, FRONTEND_BASE_URL } from './config';

// Test function to verify environment variables
export const testEnvironmentVariables = () => {
  console.log('=== Environment Variables Test ===');
  
  // Check if environment variables are loaded
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('REACT_APP_FRONTEND_URL:', process.env.REACT_APP_FRONTEND_URL);
  
  // Check configuration values
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('FRONTEND_BASE_URL:', FRONTEND_BASE_URL);
  
  // Test URL generation
  console.log('API URL for /api/forms/myforms:', getApiUrl('/api/forms/myforms'));
  console.log('Frontend URL for /form/123:', getFrontendUrl('/form/123'));
  
  // Check if using environment variables or fallbacks
  const isUsingEnvVars = process.env.REACT_APP_API_URL && process.env.REACT_APP_FRONTEND_URL;
  console.log('Using Environment Variables:', isUsingEnvVars ? '✅ Yes' : '❌ No (using fallbacks)');
  
  if (!isUsingEnvVars) {
    console.log('💡 To use environment variables:');
    console.log('1. Copy frontend/src/env.example to frontend/.env.local');
    console.log('2. Update the values in .env.local');
    console.log('3. Restart your development server');
  }
  
  console.log('=== End Test ===');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testEnvironmentVariables = testEnvironmentVariables;
}
