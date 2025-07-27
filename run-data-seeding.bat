@echo off
echo 🌱 Running Data Seeding for WEM Dashboard...
echo.

REM Set paths
set "BACKEND_PATH=%~dp0backend"
set "API_PATH=%BACKEND_PATH%\src\WemDashboard.API"

echo 📊 Step 1: Checking current database state...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT COUNT(*) as sites FROM \"Sites\"; SELECT COUNT(*) as users FROM \"User\";"

echo.
echo 🌱 Step 2: Running data seeder via API...
cd /d "%BACKEND_PATH%"

echo Starting API to trigger data seeding...
echo This will run the API which should automatically seed data on startup.
echo.
echo ⏳ Please wait while the API starts and seeds data...
echo Press Ctrl+C after you see "Application started" message to stop the API.
echo.

REM Run the API which will trigger data seeding
dotnet run --project "%API_PATH%"

echo.
echo 📊 Step 3: Checking seeded data results...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT COUNT(*) as sites FROM \"Sites\"; SELECT COUNT(*) as users FROM \"User\";"

echo.
echo ✅ Data seeding process completed!
echo.
pause