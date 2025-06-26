@echo off
REM 🚀 WEM Dashboard - Backend Startup Script
REM Cleans port 5000 and starts the backend API

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

echo 🧹 Cleaning up port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a 2>nul
    )
)

REM Wait for cleanup
timeout /t 2 /nobreak >nul

echo ✅ Port 5000 cleaned

REM Navigate to the API project
cd backend\src\WemDashboard.API

REM Check database
if exist "wemdashboard-dev.db" (
    echo ✅ Database found
) else (
    echo ⚠️ Database will be auto-created
)

echo.
echo 🚀 Starting .NET API server on port 5000...
echo 📊 API: http://localhost:5000
echo 📚 Swagger: http://localhost:5000
echo ❤️ Health: http://localhost:5000/health
echo 🔄 WebSocket: ws://localhost:5000/ws/energy-data
echo.
echo 🛑 Press Ctrl+C to stop
echo.

set ASPNETCORE_URLS=http://localhost:5000
dotnet run --urls "http://localhost:5000"

echo.
echo 👋 Backend stopped
pause