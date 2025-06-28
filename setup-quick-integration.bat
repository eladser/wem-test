@echo off
REM Quick Integration Setup for WEM Dashboard Database Features
REM This batch file runs the PowerShell integration script

echo 🚀 WEM Dashboard - Quick Integration Setup
echo ==========================================
echo.

REM Check if PowerShell is available
powershell -Command "Write-Host 'PowerShell available' -ForegroundColor Green"
if %errorlevel% neq 0 (
    echo ❌ PowerShell is not available
    echo Please install PowerShell or run the integration manually
    pause
    exit /b 1
)

echo ▶️ Running integration script...
echo.

REM Set execution policy temporarily and run the script
powershell -ExecutionPolicy Bypass -File "integrate-database-features.ps1"

echo.
echo 🎉 Integration setup completed!
echo.
echo 📝 Next steps:
echo 1. Review any warnings or errors above
echo 2. Start your backend: dotnet run --project backend/src/WemDashboard.API
echo 3. Start your frontend: npm run dev
echo 4. Test the new database persistence features
echo.

pause