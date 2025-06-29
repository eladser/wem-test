@echo off
chcp 65001 >nul
echo ==============================================
echo      WEM DASHBOARD - UNIFIED STARTUP
echo ==============================================
echo.
echo Starting WEM Dashboard with clean configuration:
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:5000
echo   - Database: SQLite (local)
echo.
echo ==============================================

:: Kill any existing processes on these ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :7297') do taskkill /F /PID %%a 2>nul

:: Wait a moment
timeout /t 2 /nobreak >nul

echo.
echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo SUCCESS: Dependencies installed successfully!
echo.
echo Starting Backend (.NET API on port 5000)...
start "WEM Backend" cmd /k "cd /d %~dp0backend\src\WemDashboard.API && dotnet run --urls=http://localhost:5000"

:: Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 10 /nobreak >nul

echo.
echo Starting Frontend (React + Vite on port 5173)...
start "WEM Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ==============================================
echo     WEM DASHBOARD STARTED SUCCESSFULLY!
echo ==============================================
echo.
echo Access your dashboard at:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo   Swagger:  http://localhost:5000
echo   Health:   http://localhost:5000/health
echo.
echo Both services are running in separate windows.
echo Close this window when you're done.
echo.
echo ==============================================
echo.
echo Press any key to continue...
pause >nul
