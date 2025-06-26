@echo off
echo =====================================
echo    🚀 WEM Dashboard Complete Setup   
echo =====================================

echo.
echo 📥 Step 1: Getting latest fixes...
git pull origin main

echo.
echo 🧹 Step 2: Cleaning up old files...
del /q backend\src\WemDashboard.API\wemdashboard*.db 2>nul
rmdir /s /q node_modules 2>nul
del /q package-lock.json 2>nul
del /q bun.lockb 2>nul

echo.
echo 📦 Step 3: Installing frontend dependencies...
npm install

echo.
echo 🔨 Step 4: Building backend...
cd backend\src\WemDashboard.API
dotnet clean
dotnet build
if %ERRORLEVEL% neq 0 (
    echo ❌ Backend build failed!
    pause
    exit /b 1
)

echo.
echo 🗄️ Step 5: Initializing database...
echo   Creating SQLite database...
dotnet run --no-build --environment Development &
timeout /t 10 /nobreak >nul
taskkill /f /im WemDashboard.API.exe 2>nul

cd ..\..\..

echo.
echo ✅ Setup Complete!
echo.
echo 🎯 Next Steps:
echo   1. Run: start-backend.bat
echo   2. Run: start-frontend.bat (in another window)
echo   3. Open: http://localhost:5173
echo.
echo 📧 Login: admin@wemdashboard.com
echo 🔐 Pass:  Admin123!
echo.
pause
