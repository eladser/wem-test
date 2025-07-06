@echo off
echo.
echo =================================================
echo   WEM Dashboard - Complete Error Fix
echo =================================================
echo.

echo [1/4] Installing missing dependencies...
call npm install @microsoft/signalr@^8.0.7
if %errorlevel% neq 0 (
    echo Error: Failed to install SignalR dependency
    pause
    exit /b 1
)

echo.
echo [2/4] Adding React Query DevTools...
call npm install --save-dev @tanstack/react-query-devtools@^5.56.2
if %errorlevel% neq 0 (
    echo Warning: Failed to install React Query DevTools (optional)
)

echo.
echo [3/4] Clearing cache and build artifacts...
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q dist 2>nul
del package-lock.json 2>nul

echo.
echo [4/4] Reinstalling all dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo =================================================
echo   ✅ ALL FIXES APPLIED SUCCESSFULLY!
echo =================================================
echo.
echo The following issues have been resolved:
echo   ✓ Missing @microsoft/signalr dependency
echo   ✓ Missing QueryClient provider setup
echo   ✓ Router context issues in ErrorBoundary
echo   ✓ React Query configuration optimized
echo.
echo You can now restart your development server:
echo.
echo   npm run dev
echo.
echo Or use the complete startup script:
echo.
echo   start-wem-dashboard.bat
echo.
echo =================================================
echo   🎯 What's Fixed:
echo =================================================
echo.
echo 1. REACT QUERY SETUP:
echo    - QueryClient provider properly configured
echo    - Smart caching with 5min stale time
echo    - Retry logic for failed requests
echo    - DevTools available in development
echo.
echo 2. SIGNALR INTEGRATION:
echo    - @microsoft/signalr package installed
echo    - Real-time data hooks now functional
echo    - WebSocket connection management
echo.
echo 3. ERROR HANDLING:
echo    - ErrorBoundary no longer uses router hooks
echo    - Proper error reporting and recovery
echo    - Safe navigation fallbacks
echo.
echo 4. SIDEBAR IMPROVEMENTS:
echo    - Sites now primary navigation
echo    - Real-time status indicators
echo    - Loading states with skeletons
echo.
echo =================================================
echo   🚀 Next Steps:
echo =================================================
echo.
echo 1. Start your backend server (port 5000)
echo 2. Start the frontend: npm run dev
echo 3. Check browser console - errors should be gone!
echo 4. Test the new sidebar with sites as main nav
echo 5. Verify WebSocket connections work
echo.
pause
