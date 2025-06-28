@echo off
echo ========================================
echo Starting WEM Dashboard Backend
echo ========================================
echo.

echo Checking if .NET is installed...
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: .NET SDK not found. Please install .NET 8.0 SDK.
    echo Download from: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

echo ✅ .NET SDK found
echo.

echo Navigating to API project...
cd backend\src\WemDashboard.API

echo.
echo Starting backend server...
echo Backend will be available at:
echo   - HTTPS: https://localhost:7087
echo   - HTTP:  http://localhost:5087
echo   - Swagger: https://localhost:7087/swagger
echo.
echo Press Ctrl+C to stop the server
echo ========================================

dotnet run

echo.
echo Backend stopped.
pause