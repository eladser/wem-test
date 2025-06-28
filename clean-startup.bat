@echo off
echo ========================================
echo WEM Dashboard - Complete Startup
echo ========================================
echo.

echo This will start both backend and frontend servers.
echo Make sure you have:
echo   - .NET 8.0 SDK installed
echo   - Node.js 18+ installed
echo.

echo Starting backend server in new window...
start "WEM Backend" cmd /c "start-backend.bat"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 >nul

echo Starting frontend server in new window...
start "WEM Frontend" cmd /c "start-frontend.bat"

echo.
echo ✅ Both servers are starting!
echo.
echo Access the application at:
echo   Frontend: http://localhost:5173
echo   Backend:  https://localhost:7087
echo   API Docs: https://localhost:7087/swagger
echo.
echo Press any key to close this window...
pause >nul