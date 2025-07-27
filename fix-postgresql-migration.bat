@echo off
echo 🚀 Starting PostgreSQL Migration Fix...
echo ⚠️  This will completely reset your database migrations and recreate them
echo 📋 Make sure PostgreSQL is running and the database user has proper permissions
echo.

REM Change to the Infrastructure project directory
cd backend\src\WemDashboard.Infrastructure

echo 📁 Current directory: %cd%
echo.

REM Step 1: Drop the database (if it exists)
echo 🗑️  Dropping existing database...
dotnet ef database drop --force --startup-project ..\WemDashboard.API --context WemDashboardDbContext --verbose

REM Step 2: Remove all existing migrations
echo 🧹 Removing any existing migrations...
if exist "Migrations" (
    rmdir /s /q Migrations
    echo ✅ Removed Migrations folder
) else (
    echo ℹ️  No existing Migrations folder found
)

REM Clear Entity Framework cache
echo 🧹 Clearing EF Core tools cache...
dotnet ef --version
dotnet nuget locals all --clear

REM Step 3: Restore packages to ensure everything is up to date
echo 📦 Restoring NuGet packages...
cd ..\..\..
dotnet restore
cd backend\src\WemDashboard.Infrastructure

REM Step 4: Build the solution to ensure no compilation errors
echo 🔨 Building the solution...
dotnet build ..\WemDashboard.API --configuration Debug --no-restore

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed! Please fix compilation errors before running migrations.
    pause
    exit /b 1
)

REM Step 5: Create the initial migration for PostgreSQL
echo 📝 Creating initial PostgreSQL migration...
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ..\WemDashboard.API --context WemDashboardDbContext --verbose

if %ERRORLEVEL% neq 0 (
    echo ❌ Migration creation failed!
    echo 💡 Common issues:
    echo    - Check your connection string in appsettings.json
    echo    - Ensure PostgreSQL server is running
    echo    - Verify the database user has proper permissions
    echo    - Check for compilation errors in your DbContext
    pause
    exit /b 1
)

REM Step 6: Apply the migration to create the database
echo 🗄️  Applying migration to create PostgreSQL database...
dotnet ef database update --startup-project ..\WemDashboard.API --context WemDashboardDbContext --verbose

if %ERRORLEVEL% equ 0 (
    echo.
    echo 🎉 PostgreSQL Migration Completed Successfully!
    echo.
    echo ✅ Database created: wemdashboard
    echo ✅ All tables created with proper PostgreSQL types
    echo ✅ DateTime columns configured as 'timestamp with time zone'
    echo ✅ Decimal columns configured with proper precision
    echo.
    echo 🔗 Connection Details:
    echo    Host: localhost
    echo    Port: 5432
    echo    Database: wemdashboard
    echo    Username: wem_admin
    echo.
    echo 🚀 You can now start your application!
    echo    Run: cd ..\..\..\.. ^&^& npm run start-backend
    echo.
) else (
    echo.
    echo ❌ Migration failed!
    echo.
    echo 🔧 Troubleshooting steps:
    echo 1. Verify PostgreSQL is running ^(check services^)
    echo.
    echo 2. Check if database user exists and has permissions:
    echo    Connect to PostgreSQL as superuser and run:
    echo    CREATE USER wem_admin WITH PASSWORD 'WemEnergy2024';
    echo    ALTER USER wem_admin CREATEDB;
    echo.
    echo 3. Test connection manually with pgAdmin or psql
    echo.
    echo 4. Check your connection string in appsettings.json
    echo.
    pause
    exit /b 1
)

echo.
echo ✨ Migration script completed!
echo 🎯 Next steps:
echo 1. Start your backend API: cd ..\..\..\.. ^&^& npm run start-backend
echo 2. Start your frontend: npm run dev
echo 3. Test your application to ensure everything works
echo.
pause
