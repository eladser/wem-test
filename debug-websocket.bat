@echo off
echo ==============================================
echo    WEM Dashboard WebSocket Troubleshooting
echo ==============================================
echo.

echo 1. Checking if backend is running...
curl -s -o nul -w "HTTP Status: %%{http_code}" http://localhost:5000/health
if %errorlevel% == 0 (
    echo ✅ Backend API is responding
) else (
    echo ❌ Backend API is not responding
    echo    Run: cd backend/src/WemDashboard.API ^&^& dotnet run
    echo.
    pause
    exit /b 1
)
echo.

echo 2. Checking WebSocket endpoint...
echo Attempting WebSocket connection to ws://localhost:5000/ws/energy-data
echo.

echo 3. Testing with curl WebSocket upgrade request...
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" http://localhost:5000/ws/energy-data
echo.

echo 4. Checking environment variables...
echo VITE_WS_URL should be: ws://localhost:5000/ws/energy-data
echo Current VITE_WS_URL: %VITE_WS_URL%
echo.

echo 5. Common Solutions:
echo    • Make sure both backend (port 5000) and frontend (port 5173) are running
echo    • Check that .env file contains: VITE_WS_URL="ws://localhost:5000/ws/energy-data"
echo    • Restart frontend after changing .env: npm run dev
echo    • Check Windows Firewall/Antivirus isn't blocking WebSocket connections
echo    • Try different browser (Chrome DevTools shows WebSocket connections)
echo.

echo 6. Browser Testing:
echo    • Open Chrome DevTools ^> Network ^> WS to see WebSocket connections
echo    • Frontend URL: http://localhost:5173
echo    • Look for WebSocket connection attempts in the WS tab
echo.

pause
