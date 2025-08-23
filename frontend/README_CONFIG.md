# Configuration Setup

This project now supports both local development and production deployment using environment variables for flexible configuration.

## Configuration Files

### `src/config.js`
The main configuration file that reads URLs from environment variables with fallbacks to localhost.

### Environment Files
- `backend/env.example` - Backend environment variables including URL configurations
- `frontend/src/env.example` - Frontend environment variables template

## How It Works

### Environment Variable Based Configuration
The configuration reads URLs from environment variables with automatic fallbacks:

- **Development**: Uses `http://localhost:5000` for API and `http://localhost:3000` for frontend (default fallbacks)
- **Production**: Uses environment variables `REACT_APP_API_URL` and `REACT_APP_FRONTEND_URL`

### Environment Variable Logic
```javascript
const getEnvVar = (key, fallback) => {
  return process.env[key] || fallback;
};
```

## Usage

### Import Configuration
```javascript
import { getApiUrl, getFrontendUrl, API_BASE_URL, FRONTEND_BASE_URL } from '../config';
```

### API Calls
Instead of hardcoded localhost URLs:
```javascript
// ❌ Old way
const res = await axios.get('http://localhost:5000/api/forms/myforms');

// ✅ New way
const res = await axios.get(getApiUrl('/api/forms/myforms'));
```

### Frontend URLs
For generating shareable links or QR codes:
```javascript
// ❌ Old way
const shareUrl = `http://localhost:3000/form/${formId}`;

// ✅ New way
const shareUrl = getFrontendUrl(`/form/${formId}`);
```

## Environment Setup

### 1. Create Frontend Environment File
Copy the example file and create `.env.local` in the frontend root:
```bash
cd frontend
cp src/env.example .env.local
```

### 2. Update Frontend Environment Variables
Edit `.env.local` with your URLs:
```env
# For local development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FRONTEND_URL=http://localhost:3000

# For production (uncomment and update)
# REACT_APP_API_URL=https://formai-u50u.onrender.com
# REACT_APP_FRONTEND_URL=https://form-ai-gamma.vercel.app
```

### 3. Backend Environment
Copy `backend/env.example` to `backend/.env` and update values:
```env
# Frontend URLs for different environments
FRONTEND_URL_LOCAL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://form-ai-gamma.vercel.app

# Backend URLs for different environments  
BACKEND_URL_LOCAL=http://localhost:5000
BACKEND_URL_PRODUCTION=https://formai-u50u.onrender.com
```

### 4. Restart Servers
After updating environment files, restart both frontend and backend servers for changes to take effect.

## Available Functions

- `getApiUrl(endpoint)` - Returns full API URL for a given endpoint
- `getFrontendUrl(route)` - Returns full frontend URL for a given route
- `API_BASE_URL` - Current API base URL
- `FRONTEND_BASE_URL` - Current frontend base URL
- `LOCAL_CONFIG` - Local development configuration
- `PRODUCTION_CONFIG` - Production configuration

## Deployment URLs

- **Frontend**: https://form-ai-gamma.vercel.app
- **Backend**: https://formai-u50u.onrender.com

## Local Development

When running locally:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

These are the default fallback URLs used when environment variables are not set.

## Benefits

1. **Environment Variable Based**: Flexible configuration through environment variables
2. **Consistent API Calls**: All API calls use the same configuration
3. **Easy Maintenance**: Update URLs through environment variables
4. **Environment Agnostic**: Works seamlessly in both development and production
5. **Shareable Links**: Generated links automatically use the correct domain
6. **Secure Configuration**: URLs can be managed securely through environment variables

## Testing Environment Variables

### Frontend Testing
Open your browser console and run:
```javascript
// Import the test function
import { testEnvironmentVariables } from './src/env-test';

// Run the test
testEnvironmentVariables();
```

### Backend Testing
Check your backend console logs to see if CORS is properly configured with the environment variables.

## Troubleshooting

### Environment Variables Not Loading
1. **Frontend**: Ensure `.env.local` is in the frontend root directory (not in src/)
2. **Backend**: Ensure `.env` is in the backend root directory
3. **Restart**: Restart both servers after making changes
4. **Naming**: Frontend variables must start with `REACT_APP_`

### CORS Issues
1. Check that `FRONTEND_URL_LOCAL` and `FRONTEND_URL_PRODUCTION` are set in backend `.env`
2. Verify the URLs match exactly (including protocol and port)
3. Restart the backend server after changes
