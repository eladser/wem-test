@echo off
echo 🔧 Starting PostgreSQL Migration Fix...
echo ⚠️  This will completely reset your database migrations and recreate them
echo 🔹 Make sure PostgreSQL is running and the database user has proper permissions
echo.

REM Get the current directory (should be project root)
set "PROJECT_ROOT=%~dp0"
echo 🔹 Project root: %PROJECT_ROOT%

REM Set paths
set "BACKEND_PATH=%PROJECT_ROOT%backend"
set "INFRASTRUCTURE_PATH=%BACKEND_PATH%\src\WemDashboard.Infrastructure"  
set "API_PATH=%BACKEND_PATH%\src\WemDashboard.API"

echo 🔹 Infrastructure project: %INFRASTRUCTURE_PATH%
echo 🔹 API project: %API_PATH%

REM Change to backend directory for operations
cd /d "%BACKEND_PATH%"
echo 🔹 Working directory: %cd%

echo.
echo 🗑️ Dropping existing database...
dotnet ef database drop --force --context WemDashboardDbContext --project "%INFRASTRUCTURE_PATH%" --startup-project "%API_PATH%"

echo.
echo 🗑️ Removing any existing migrations...
if exist "%INFRASTRUCTURE_PATH%\Migrations" (
    rmdir /s /q "%INFRASTRUCTURE_PATH%\Migrations"
    echo ✅ Removed existing Migrations folder
) else (
    echo ℹ️ No existing Migrations folder found
)

echo.
echo 🗑️ Clearing EF Core tools cache...
dotnet ef --help > nul 2>&1
if errorlevel 1 (
    echo ⚠️ Installing EF Core tools...
    dotnet tool install --global dotnet-ef
)
dotnet nuget locals all --clear

echo.
echo 🔧 Restoring NuGet packages...
cd /d "%PROJECT_ROOT%"
dotnet restore

echo.
echo 🔧 Building the solution...
dotnet build --no-restore

if errorlevel 1 (
    echo ❌ Build failed! Please fix compilation errors before running migrations.
    pause
    exit /b 1
)

REM Change back to backend directory for EF operations
cd /d "%BACKEND_PATH%"

echo.
echo 🔄 Creating new initial migration...
dotnet ef migrations add InitialCreate --context WemDashboardDbContext --project "%INFRASTRUCTURE_PATH%" --startup-project "%API_PATH%" --output-dir Migrations

if errorlevel 1 (
    echo ❌ Migration creation failed!
    pause
    exit /b 1
)

echo.
echo 📊 Updating database with new migration...
dotnet ef database update --context WemDashboardDbContext --project "%INFRASTRUCTURE_PATH%" --startup-project "%API_PATH%"

if errorlevel 1 (
    echo ❌ Database update failed!
    pause
    exit /b 1
)

echo.
echo ✅ PostgreSQL migration fix completed successfully!
echo 🎉 Database has been recreated with proper schema
echo.
pause