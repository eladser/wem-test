@echo off
echo 🚀 Complete PostgreSQL Migration Script
echo ========================================
echo This script will run the complete migration process
echo.

echo ⚠️  IMPORTANT: This will drop your existing database!
set /p confirm="Are you sure you want to proceed? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Migration cancelled
    pause
    exit /b 0
)

REM Navigate to Infrastructure project
cd /d "C:\Git\wem_test_new\wem-test\backend\src\WemDashboard.Infrastructure"
if %errorlevel% neq 0 (
    echo ❌ ERROR: Could not navigate to Infrastructure directory
    pause
    exit /b 1
)

echo 📍 Current directory: %cd%
echo.

echo 🗑️  Step 1: Dropping existing database...
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo.

echo 🧹 Step 2: Removing existing migrations...
dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo.

echo 🆕 Step 3: Creating new PostgreSQL migration...
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to create migration
    echo Check your DbContext configuration
    pause
    exit /b 1
)
echo.

echo 📊 Step 4: Applying migration to create database...
dotnet ef database update --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to apply migration
    echo Check your PostgreSQL connection
    pause
    exit /b 1
)
echo.

echo 🔍 Step 5: Verifying migration success...
dotnet ef migrations list --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo.

echo 📋 Step 6: Checking database schema...
dotnet ef dbcontext info --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo.

echo ✅ MIGRATION COMPLETE!
echo ========================================
echo.
echo 🎉 Your PostgreSQL migration has been completed successfully!
echo.
echo 📊 What was created:
echo - Database: wemdashboard
echo - Tables: Sites, Devices, EnergyReadings, Alerts
echo - Proper PostgreSQL DateTime types (timestamp with time zone)
echo - Proper decimal precision (18,6)
echo - Foreign key relationships
echo - Performance indexes
echo.
echo 🚀 Next steps:
echo 1. Start your backend API: cd ../WemDashboard.API && dotnet run
echo 2. Start your frontend: npm run dev
echo 3. Test creating sites, devices, and energy readings
echo 4. Verify no DateTime casting errors in logs
echo.
echo 🎯 Your WEM Energy Dashboard is now ready with PostgreSQL!
echo.
pause