@echo off
echo ========================================
echo Moving .env file to correct location
echo ========================================
echo.

if exist "backend\.env" (
    echo Moving .env file from backend/ to root directory...
    move "backend\.env" ".env"
    echo .env file moved successfully!
    echo.
    echo Please restart your backend server:
    echo npm run server
) else (
    echo .env file not found in backend/ directory.
    echo Please create a .env file in the root directory with:
    echo MONGODB_URI=your_mongodb_connection_string
    echo JWT_SECRET=your_jwt_secret
    echo GEMINI_API_KEY=your_gemini_api_key
    echo PORT=5000
)

echo.
pause
