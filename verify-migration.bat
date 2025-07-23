@echo off
echo 🔍 PostgreSQL Migration Verification Script
echo ========================================
echo This script will verify your migration was successful
echo.

REM Navigate to Infrastructure project
cd /d "C:\Git\wem_test_new\wem-test\backend\src\WemDashboard.Infrastructure"
if %errorlevel% neq 0 (
    echo ❌ ERROR: Could not navigate to Infrastructure directory
    pause
    exit /b 1
)

echo 📍 Current directory: %cd%
echo.

echo 🔍 Step 1: Checking if database exists...
dotnet ef dbcontext info --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ❌ ERROR: DbContext not properly configured
    echo Please check your connection string and PostgreSQL server
    pause
    exit /b 1
)

echo.
echo 🔍 Step 2: Listing applied migrations...
dotnet ef migrations list --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ❌ ERROR: Could not list migrations
    pause
    exit /b 1
)

echo.
echo 🔍 Step 3: Checking database schema...
echo Connecting to PostgreSQL to verify tables...
psql -h localhost -p 5432 -U wem_admin -d wemdashboard -c "\dt"
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Could not connect with psql command
    echo This is normal if psql is not in your PATH
    echo Database may still be working correctly
)

echo.
echo 🔍 Step 4: Testing basic database connection...
dotnet ef dbcontext info --startup-project ../WemDashboard.API --context WemDashboardDbContext --verbose

echo.
echo ✅ Verification complete!
echo.
echo 📊 Expected results:
echo - DbContext should be properly configured
echo - InitialPostgreSQLMigration should be listed
echo - Tables: Sites, Devices, EnergyReadings, Alerts should exist
echo - No DateTime casting errors in the output
echo.
echo 🚀 If all checks passed, your migration is successful!
echo You can now start your application without migration errors.
echo.
pause