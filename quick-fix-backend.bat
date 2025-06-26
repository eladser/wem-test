@echo off
echo 🔧 Fixing WEM Dashboard Database Issue...
echo ========================================

echo.
echo 📥 Getting latest fixes from repository...
git pull origin main

echo.
echo 🧹 Cleaning up any old database files...
del /q backend\src\WemDashboard.API\wemdashboard.db 2>nul
del /q backend\src\WemDashboard.API\wemdashboard-dev.db 2>nul

echo.
echo 🔨 Cleaning and rebuilding backend...
cd backend\src\WemDashboard.API
dotnet clean
dotnet build

echo.
echo 🚀 Starting backend with fixed configuration...
echo ✅ Database will be auto-created with SQLite
echo ✅ API will be available at: http://localhost:5000
echo ✅ Swagger documentation: http://localhost:5000/swagger
echo.
echo Press Ctrl+C to stop the server
echo.

dotnet run
