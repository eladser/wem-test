@echo off
echo =========================================
echo    🚀 WEM Dashboard Complete Setup       
echo =========================================

echo.
echo 📥 Step 1: Getting latest updates...
git pull origin main

echo.
echo 🧹 Step 2: Cleaning up old files...
del /q backend\src\WemDashboard.API\wemdashboard*.db 2>nul
del /q package-lock.json 2>nul
rmdir /s /q node_modules 2>nul

echo.
echo 📦 Step 3: Installing frontend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

echo.
echo 🔨 Step 4: Building backend...
cd backend\src\WemDashboard.API
call dotnet clean
call dotnet build
if %ERRORLEVEL% neq 0 (
    echo ❌ Backend build failed!
    cd ..\..\..
    pause
    exit /b 1
)
echo ✅ Backend built successfully

cd ..\..\..

echo.
echo ✅ Setup Complete!
echo.
echo 🎯 To start the application:
echo   1. Run: start-backend.bat (starts API + WebSocket + Database)
echo   2. Run: start-frontend.bat (starts React frontend)
echo   3. Open: http://localhost:5173
echo.
echo 🔌 Backend Features:
echo   • REST API: http://localhost:5000
echo   • Swagger Docs: http://localhost:5000/swagger
echo   • WebSocket: ws://localhost:5000/ws/energy-data
echo   • SQLite Database with sample data
echo.
echo 📧 Login: admin@wemdashboard.com
echo 🔐 Pass:  Admin123!
echo.
echo Press any key to continue...
pause >nul
