@echo off
echo ========================================
echo WEM Dashboard WebSocket Debug Tool
echo ========================================
echo.

REM Check if backend is running
echo 🔍 Checking if backend API is running...
curl -s -o nul -w "Backend API (HTTP): %%{http_code}" http://localhost:5000/health
echo.

REM Check if frontend is running  
echo 🔍 Checking if frontend is running...
curl -s -o nul -w "Frontend (HTTP): %%{http_code}" http://localhost:5173
echo.

echo.
echo 📋 Expected URLs:
echo   Backend API: http://localhost:5000
echo   Backend WebSocket: ws://localhost:5000/ws/energy-data
echo   Frontend: http://localhost:5173
echo.

echo 🔧 Troubleshooting Steps:
echo   1. Make sure backend is running: run start-backend.bat
echo   2. Make sure frontend is running: run start-frontend.bat  
echo   3. Check .env file has: VITE_WS_URL=ws://localhost:5000/ws/energy-data
echo   4. Open browser console to see WebSocket connection details
echo.

echo 🌐 Opening browser for testing...
start http://localhost:5173

echo.
echo Press any key to exit...
pause >nul