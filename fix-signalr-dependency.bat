@echo off
echo.
echo =================================================
echo   WEM Dashboard - Quick Dependency Fix
echo =================================================
echo.

echo Installing missing SignalR dependency...
npm install @microsoft/signalr@^8.0.7

echo.
echo Clearing Vite cache...
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q dist 2>nul

echo.
echo Dependencies installed successfully!
echo.
echo You can now restart your dev server with:
echo   npm run dev
echo.
echo Or run the complete startup:
echo   start-wem-dashboard.bat
echo.
pause
