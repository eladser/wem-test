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
psql -U wem_admin -h localhost -d wemdashboard -c "
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';"

echo.
echo 📊 Step 3: Checking seeded data...
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT COUNT(*) as total_sites FROM \"Sites\";"
psql -U wem_admin -h localhost -d wemdashboard -c "SELECT COUNT(*) as total_users FROM \"AspNetUsers\";"

echo.
echo 🚀 Step 4: Testing API startup (this will take a moment)...
cd /d "%BACKEND_PATH%"
echo Starting API server - Press Ctrl+C to stop after verification
timeout 3 > nul
start /B dotnet run --project "%API_PATH%" > api_test.log 2>&1

echo Waiting for API to start...
timeout 10 > nul

echo.
echo 📡 Step 5: Testing API endpoints...
curl -s -o nul -w "%%{http_code}" http://localhost:5000/api/health && echo " - Health endpoint: WORKING" || echo " - Health endpoint: FAILED"
curl -s -o nul -w "%%{http_code}" http://localhost:5000/api/sites && echo " - Sites endpoint: WORKING" || echo " - Sites endpoint: FAILED"

echo.
echo 🔍 Step 6: Checking API logs for errors...
if exist api_test.log (
    echo Recent API logs:
    type api_test.log | findstr /i "error\|exception\|fail" && echo "⚠️ Errors found in logs" || echo "✅ No errors in logs"
) else (
    echo "ℹ️ No log file found"
)

echo.
echo ✅ Verification complete! 
echo 📋 Check the results above to ensure everything is working properly.
echo.
pause