@echo off
echo ========================================
echo FormAI Project Setup
echo ========================================
echo.

echo Installing backend dependencies...
npm install

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy env.example to .env
echo 2. Update .env with your API keys
echo 3. Start MongoDB
echo 4. Run: npm run dev
echo.
echo For detailed instructions, see README.md
pause
