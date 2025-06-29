@echo off
echo ==============================================
echo        WEM DASHBOARD - QUICK START
echo ==============================================
echo.
echo This will install dependencies and start your dashboard
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies for the first time...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

:: Kill existing processes
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a 2>nul
timeout /t 1 /nobreak >nul

echo.
echo Starting services...
echo.

:: Start backend in new window
echo Starting Backend on http://localhost:5000...
start "WEM Backend" cmd /k "cd /d %~dp0backend\src\WemDashboard.API && dotnet run --urls=http://localhost:5000"

:: Wait for backend
echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

:: Start frontend in new window  
echo Starting Frontend on http://localhost:5173...
start "WEM Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ==============================================
echo           DASHBOARD READY!
echo ==============================================
echo.
echo Your WEM Dashboard is starting up:
echo.
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo  Swagger:  http://localhost:5000
echo  Health:   http://localhost:5000/health
echo.
echo Both services are running in separate windows.
echo You can close this window now.
echo.
echo ==============================================
echo.
pause
