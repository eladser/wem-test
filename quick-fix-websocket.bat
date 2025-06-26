@echo off
echo ==========================================
echo     WEM Dashboard Quick WebSocket Fix
echo ==========================================
echo.

echo Step 1: Stopping any existing processes...
echo Killing any existing dotnet processes...
taskkill /f /im dotnet.exe 2>nul
echo Killing any existing npm processes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak > nul
echo.

echo Step 2: Ensuring .env file has correct WebSocket URL...
echo VITE_WS_URL="ws://localhost:5000/ws/energy-data" > .env.temp
echo VITE_API_BASE_URL="http://localhost:5000/api" >> .env.temp
echo VITE_ENABLE_REAL_TIME="true" >> .env.temp
echo VITE_DEBUG="true" >> .env.temp
move .env.temp .env
echo ✅ Environment file updated
echo.

echo Step 3: Starting backend server...
start "WEM Backend" cmd /k "cd backend\src\WemDashboard.API && echo Starting backend server... && dotnet run"
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul
echo.

echo Step 4: Testing backend connection...
curl -s http://localhost:5000/health
if %errorlevel% == 0 (
    echo ✅ Backend is running
) else (
    echo ❌ Backend failed to start
    echo Check the backend terminal window for errors
    pause
    exit /b 1
)
echo.

echo Step 5: Starting frontend...
start "WEM Frontend" cmd /k "echo Starting frontend... && npm run dev"
echo.

echo Step 6: Opening browser...
timeout /t 5 /nobreak > nul
start http://localhost:5173
echo.

echo ==========================================
echo     Quick Fix Complete!
echo ==========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo WebSocket: ws://localhost:5000/ws/energy-data
echo.
echo Both servers should now be running in separate windows.
echo Check the browser for WebSocket connection status.
echo.
echo If WebSocket still fails:
echo 1. Check Windows Firewall settings
echo 2. Try a different browser (Chrome recommended)
echo 3. Run debug-websocket.bat for detailed diagnosis
echo.
pause
