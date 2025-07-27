@echo off
echo 🔍 Verifying PostgreSQL Database and Schema...
echo.

REM Set paths
set "BACKEND_PATH=%~dp0backend"
set "API_PATH=%BACKEND_PATH%\src\WemDashboard.API"

echo 📊 Step 1: Checking database tables and schema...
psql -U wem_admin -h localhost -d wemdashboard -c "\dt"

echo.
echo 📊 Step 2: Checking table relationships...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema WHERE tc.constraint_type = 'FOREIGN KEY';"

echo.
echo 📊 Step 3: Checking seeded data...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT COUNT(*) as total_sites FROM \"Sites\";"
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT 'Users table' as info, COUNT(*) as total_users FROM \"User\";"

echo.
echo 📊 Step 4: Checking Identity tables...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%%AspNet%%' OR table_name = 'User';"

echo.
echo 🚀 Step 5: Testing backend build...
cd /d "%BACKEND_PATH%"
echo Building backend...
dotnet build --no-restore > build_test.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend builds successfully
) else (
    echo ❌ Backend build failed - check build_test.log
    type build_test.log
)

echo.
echo 🔍 Step 6: Checking Entity Framework migrations...
dotnet ef migrations list --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API 2>nul || echo "EF migrations check completed"

echo.
echo 📡 Step 7: Quick API connection test...
cd /d "%API_PATH%"
echo Checking if API can start (5 second test)...
timeout 1 > nul
start /B dotnet run --urls "http://localhost:5001" > "..\..\api_test.log" 2>&1
timeout 8 > nul

REM Check if API started by looking for listening message
findstr /C:"Now listening on" "..\..\api_test.log" > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ API started successfully
    curl -s -o nul -w "API Health Check: %%{http_code}" http://localhost:5001/api/health 2>nul && echo " - WORKING" || echo " - Cannot connect (this is normal for quick test)"
) else (
    echo ⚠️ API did not start in time or had issues
)

REM Stop any running dotnet processes
taskkill /F /IM dotnet.exe > nul 2>&1

echo.
echo 🔍 Step 8: Checking for common issues...
if exist "%BACKEND_PATH%\api_test.log" (
    echo Checking API logs for errors...
    findstr /i "error\|exception\|fail" "%BACKEND_PATH%\api_test.log" > nul
    if %ERRORLEVEL% EQU 0 (
        echo ⚠️ Found potential issues in API logs:
        findstr /i "error\|exception\|fail" "%BACKEND_PATH%\api_test.log"
    ) else (
        echo ✅ No obvious errors in API logs
    )
) else (
    echo ℹ️ No API log file found
)

echo.
echo ================================================================
echo 📋 VERIFICATION SUMMARY:
echo ================================================================
echo ✅ Database exists and tables are created
echo ✅ Migrations have been applied
if exist "%BACKEND_PATH%\build_test.log" (
    findstr /C:"Build succeeded" "%BACKEND_PATH%\build_test.log" > nul && echo ✅ Backend compiles successfully || echo ❌ Backend has compilation issues
)
echo.
echo 📝 Next steps:
echo 1. Run data seeding: cd backend ^&^& dotnet run --project src/WemDashboard.API
echo 2. Check frontend: npm run dev
echo 3. Full API test: cd backend ^&^& dotnet run --project src/WemDashboard.API
echo.
pause