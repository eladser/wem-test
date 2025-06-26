@echo off
REM 🌐 WEM Dashboard - Windows Frontend Start Script
REM Runs the React frontend for development

echo.
echo 🌐 Starting WEM Dashboard Frontend...
echo ===================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    echo 💡 Make sure you can see package.json file
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️ Dependencies not installed!
    echo 📦 Installing npm dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies found
echo 🔧 Starting React development server...
echo.
echo 🌐 Frontend will be available at: http://localhost:5173
echo 🔥 Hot reload enabled - changes will update automatically
echo 🖥️ Make sure backend is running at: http://localhost:5000
echo.
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Start the frontend
npm run dev

echo.
echo 👋 Frontend server stopped
pause
