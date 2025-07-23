@echo off
echo 🔧 Build Error Diagnosis and Fix Script
echo ========================================
echo This script will diagnose and fix build errors
echo.

REM Navigate to the API project to check build errors
cd /d "C:\Git\wem_test_new\wem-test\backend\src\WemDashboard.API"
if %errorlevel% neq 0 (
    echo ❌ ERROR: Could not navigate to API directory
    pause
    exit /b 1
)

echo 📍 Current directory: %cd%
echo.

echo 🔍 Step 1: Checking API project build...
dotnet build --verbosity detailed
if %errorlevel% neq 0 (
    echo ❌ API project has build errors - see details above
    echo.
    echo 🔧 Common fixes:
    echo 1. Missing using statements in DbContext
    echo 2. Entity classes not found or incorrect namespaces
    echo 3. NuGet packages not restored
    echo.
    pause
)

echo.
echo 🔍 Step 2: Checking Infrastructure project build...
cd ..\WemDashboard.Infrastructure
echo 📍 Current directory: %cd%
echo.
dotnet build --verbosity detailed
if %errorlevel% neq 0 (
    echo ❌ Infrastructure project has build errors - see details above
    echo.
    pause
)

echo.
echo 🔍 Step 3: Checking Domain project build...
cd ..\WemDashboard.Domain
echo 📍 Current directory: %cd%
echo.
dotnet build --verbosity detailed
if %errorlevel% neq 0 (
    echo ❌ Domain project has build errors - see details above
    echo.
    pause
)

echo.
echo 🔍 Step 4: Restoring all NuGet packages...
cd ..\..\..\.
echo 📍 Current directory: %cd%
echo.
dotnet restore
if %errorlevel% neq 0 (
    echo ❌ NuGet restore failed
    pause
    exit /b 1
)

echo.
echo 🔍 Step 5: Clean and rebuild entire solution...
dotnet clean
dotnet build
if %errorlevel% neq 0 (
    echo ❌ Solution still has build errors
    echo Please check the detailed error messages above
    pause
    exit /b 1
)

echo.
echo ✅ Build successful! You can now run the migration.
echo.
pause