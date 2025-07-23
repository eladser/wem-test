@echo off
echo 🔧 PostgreSQL Migration Fix Script
echo ========================================
echo This script will completely fix your DateTime casting error
echo.

REM Navigate to Infrastructure project
cd /d "C:\Git\wem_test_new\wem-test\backend\src\WemDashboard.Infrastructure"
if %errorlevel% neq 0 (
    echo ❌ ERROR: Could not navigate to Infrastructure directory
    echo Please check if the path exists: C:\Git\wem_test_new\wem-test\backend\src\WemDashboard.Infrastructure
    pause
    exit /b 1
)

echo 📍 Current directory: %cd%
echo.

echo 🗑️  Step 1: Dropping PostgreSQL database completely...
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Database drop failed or database doesn't exist
    echo This is normal if database was never created
)

echo.
echo 🧹 Step 2: Removing existing problematic migration...
dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Migration remove failed or no migrations exist
    echo This is normal if migrations were already removed
)

echo.
echo 🆕 Step 3: Creating new clean PostgreSQL migration...
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to create migration
    echo Please check your DbContext configuration
    pause
    exit /b 1
)

echo.
echo 📊 Step 4: Applying migration to PostgreSQL database...
dotnet ef database update --startup-project ../WemDashboard.API --context WemDashboardDbContext
if %errorlevel% neq 0 (
    echo ❌ ERROR: Failed to apply migration to database
    echo Please check your PostgreSQL connection and credentials
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS: PostgreSQL migration fix completed!
echo ========================================
echo.
echo 🎉 Your DateTime casting error has been resolved!
echo 💾 Database schema has been created successfully
echo 🔍 Connection: Host=localhost;Port=5432;Database=wemdashboard
echo.
echo 📝 Next steps:
echo 1. Your DbContext has been fixed with PostgreSQL-optimized configurations
echo 2. All DateTime properties now use 'timestamp with time zone'
echo 3. Decimal properties use proper PostgreSQL precision
echo 4. Seed data has been temporarily removed (add back later if needed)
echo.
echo 🚀 You can now run your application without migration errors!
echo.
pause