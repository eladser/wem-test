@echo off
REM Quick test to verify the backend builds successfully

echo.
echo 🔧 Testing Backend Build...
echo ==========================

cd backend\src\WemDashboard.API

echo 📦 Restoring packages...
dotnet restore --verbosity quiet

echo 🔨 Building project...
dotnet build --configuration Debug --verbosity quiet

if %ERRORLEVEL% == 0 (
    echo.
    echo ✅ Build Successful!
    echo The compilation errors have been fixed.
    echo.
    echo 🚀 You can now run:
    echo    - start-backend.bat
    echo    - start-frontend.bat
) else (
    echo.
    echo ❌ Build Failed!
    echo Please check the error messages above.
)

echo.
pause
