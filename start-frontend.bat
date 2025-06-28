@echo off
echo ========================================
echo Starting WEM Dashboard Frontend
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

echo Checking if dependencies are installed...
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo Starting development server...
echo Frontend will be available at:
echo   - http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================

npm run dev

echo.
echo Frontend stopped.
pause