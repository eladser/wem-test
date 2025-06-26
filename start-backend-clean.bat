@echo off
REM 🧹 Clean Port 5000 and Start WEM Dashboard Backend
echo.
echo 🧹 Cleaning up port 5000 and starting WEM Dashboard Backend...
echo ========================================

REM Check if we're in the right directory
if not exist "backend\src\WemDashboard.API" (
    echo ❌ Error: Please run this script from the project root directory
    echo 💡 Make sure you can see the 'backend' folder
    pause
    exit /b 1
)

echo 🔍 Checking what's using port 5000...
netstat -ano | findstr :5000

echo.
echo 🛑 Killing processes using port 5000...

REM Get all PIDs using port 5000 and kill them
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        echo Killing process %%a
        taskkill /F /PID %%a 2>nul
    )
)

REM Wait a moment for processes to fully terminate
echo ⏳ Waiting for cleanup...
timeout /t 2 /nobreak >nul

echo.
echo 🔍 Checking port 5000 again...
netstat -ano | findstr :5000
if errorlevel 1 (
    echo ✅ Port 5000 is now free
) else (
    echo ⚠️ Some processes may still be using port 5000
    echo 💡 They should clear up shortly...
)

echo.
echo 🚀 Starting WEM Dashboard Backend...
echo ========================================

REM Navigate to the API project
cd backend\src\WemDashboard.API

REM Check database
set DB_FOUND=0
if exist "wemdashboard-dev.db" set DB_FOUND=1
if exist "wemdashboard.db" set DB_FOUND=1

if %DB_FOUND%==0 (
    echo ⚠️ Database not found - will be auto-created
) else (
    echo ✅ Database found
)

echo.
echo 🔧 Starting .NET API server on port 5000...
echo 📊 API will be available at: http://localhost:5000
echo 📚 Swagger documentation: http://localhost:5000
echo ❤️ Health check: http://localhost:5000/health
echo 🔄 WebSocket: ws://localhost:5000/ws/energy-data
echo.
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Force the application to listen on port 5000
set ASPNETCORE_URLS=http://localhost:5000

REM Start the API with explicit URL binding
dotnet run --urls "http://localhost:5000"

echo.
echo 👋 Backend API stopped
pause