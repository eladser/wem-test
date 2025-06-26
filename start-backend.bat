@echo off
REM 🚀 WEM Dashboard - Windows Quick Start Script
REM Runs the backend API for development

echo.
echo 🖥️ Starting WEM Dashboard Backend API...
echo ========================================

REM Check if we're in the right directory
if not exist "backend\src\WemDashboard.API" (
    echo ❌ Error: Please run this script from the project root directory
    echo 💡 Make sure you can see the 'backend' folder
    pause
    exit /b 1
)

REM Navigate to the API project
cd backend\src\WemDashboard.API

REM Check if either database file exists (Development or Production)
set DB_FOUND=0
if exist "wemdashboard-dev.db" set DB_FOUND=1
if exist "wemdashboard.db" set DB_FOUND=1

if %DB_FOUND%==0 (
    echo ⚠️ Database not found! 
    echo 💡 Please run setup-sqlite-dev.ps1 first
    echo 📝 Note: The application will create the database automatically if it doesn't exist
    echo.
    echo 🚀 Starting anyway - database will be auto-created...
    echo.
) else (
    echo ✅ Database found
)

echo 🔧 Starting .NET API server on port 5001...
echo.
echo 📊 API will be available at: http://localhost:5001
echo 📚 Swagger documentation: http://localhost:5001
echo ❤️ Health check: http://localhost:5001/health
echo 🔄 WebSocket: ws://localhost:5001/ws/energy-data
echo.
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Force the application to listen on port 5001
set ASPNETCORE_URLS=http://localhost:5001

REM Start the API with explicit URL binding
dotnet run --urls "http://localhost:5001"

echo.
echo 👋 Backend API stopped
pause