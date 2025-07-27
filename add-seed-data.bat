@echo off
echo 🌱 Adding Seed Data to Database...
echo.

REM Set paths
set "BACKEND_PATH=%~dp0backend"
set "INFRASTRUCTURE_PATH=%BACKEND_PATH%\src\WemDashboard.Infrastructure"
set "API_PATH=%BACKEND_PATH%\src\WemDashboard.API"

cd /d "%BACKEND_PATH%"

echo 📊 Step 1: Creating migration for seed data...
dotnet ef migrations add AddSeedData --context WemDashboardDbContext --project "%INFRASTRUCTURE_PATH%" --startup-project "%API_PATH%" --output-dir Migrations

if errorlevel 1 (
    echo ❌ Migration creation failed!
    pause
    exit /b 1
)

echo.
echo 📊 Step 2: Applying seed data migration...
dotnet ef database update --context WemDashboardDbContext --project "%INFRASTRUCTURE_PATH%" --startup-project "%API_PATH%"

if errorlevel 1 (
    echo ❌ Database update failed!
    pause
    exit /b 1
)

echo.
echo 📊 Step 3: Checking seeded data...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT COUNT(*) as sites FROM \"Sites\"; SELECT COUNT(*) as users FROM \"User\";"

echo.
echo ✅ Seed data migration completed!
echo.
pause