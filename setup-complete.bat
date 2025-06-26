@echo off
echo =====================================
echo    🚀 WEM Dashboard Simple Setup   
echo =====================================

echo.
echo 📥 Step 1: Getting latest fixes...
git pull origin main

echo.
echo 🧹 Step 2: Cleaning up old files...
del /q backend\src\WemDashboard.API\wemdashboard*.db 2>nul
del /q package-lock.json 2>nul

echo.
echo 📦 Step 3: Installing frontend dependencies...
call npm install
echo ✅ NPM install completed

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
echo ✅ Backend build completed

cd ..\..\..

echo.
echo ✅ Setup Complete!
echo.
echo 🎯 To start the application:
echo   1. Double-click: start-backend.bat
echo   2. Double-click: start-frontend.bat (in another window)
echo   3. Open browser: http://localhost:5173
echo.
echo 📧 Login: admin@wemdashboard.com
echo 🔐 Pass:  Admin123!
echo.
echo Press any key to continue...
pause >nul
