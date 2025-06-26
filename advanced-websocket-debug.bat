@echo off
echo ===============================================
echo    ADVANCED WebSocket Diagnostic Tool
echo ===============================================
echo.

echo 🔍 STEP 1: System Environment Check...
echo Node.js version:
node --version 2>nul || echo ❌ Node.js not found
echo.
echo npm version:
npm --version 2>nul || echo ❌ npm not found
echo.
echo .NET version:
dotnet --version 2>nul || echo ❌ .NET not found
echo.

echo 🔍 STEP 2: Port Availability Check...
echo Checking port 5000 (Backend):
netstat -ano | find ":5000" || echo ✅ Port 5000 available
echo.
echo Checking port 5173 (Frontend):
netstat -ano | find ":5173" || echo ✅ Port 5173 available
echo.
echo Checking port 24678 (HMR):
netstat -ano | find ":24678" || echo ✅ Port 24678 available
echo.

echo 🔍 STEP 3: Backend Health Check...
curl -s -o nul -w "Backend HTTP Status: %%{http_code}" http://localhost:5000/health
if %errorlevel% == 0 (
    echo ✅ Backend responding
) else (
    echo ❌ Backend not responding
    echo Starting backend in new window...
    start "WEM Backend Debug" cmd /k "cd backend\src\WemDashboard.API && echo Backend Debug Mode && dotnet run --verbosity detailed"
    timeout /t 15 /nobreak > nul
)
echo.

echo 🔍 STEP 4: WebSocket Endpoint Tests...
echo Testing WebSocket handshake:
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: dGVzdA==" http://localhost:5000/ws/energy-data 2>nul | find "101"
if %errorlevel% == 0 (
    echo ✅ WebSocket handshake successful
) else (
    echo ❌ WebSocket handshake failed
)
echo.

echo 🔍 STEP 5: Environment Configuration...
if exist .env (
    echo ✅ .env file exists
    echo Contents:
    type .env
    echo.
    
    find "VITE_WS_URL" .env >nul
    if %errorlevel% == 0 (
        echo ✅ VITE_WS_URL found
    ) else (
        echo ❌ VITE_WS_URL missing - fixing...
        echo VITE_WS_URL=ws://localhost:5173/ws/energy-data >> .env
        echo VITE_WS_URL_DIRECT=ws://localhost:5000/ws/energy-data >> .env
    )
) else (
    echo ❌ .env file missing - creating...
    echo VITE_WS_URL=ws://localhost:5173/ws/energy-data > .env
    echo VITE_WS_URL_DIRECT=ws://localhost:5000/ws/energy-data >> .env
    echo VITE_API_BASE_URL=http://localhost:5000/api >> .env
    echo VITE_ENABLE_REAL_TIME=true >> .env
    echo VITE_DEBUG=true >> .env
    echo NODE_ENV=development >> .env
    echo VITE_WEBSOCKET_DEBUG=true >> .env
    echo VITE_HMR_PORT=24678 >> .env
    echo ✅ .env file created
)
echo.

echo 🔍 STEP 6: Vite Configuration Check...
if exist vite.config.ts (
    echo ✅ vite.config.ts exists
    find "proxy" vite.config.ts >nul
    if %errorlevel% == 0 (
        echo ✅ Proxy configuration found
    ) else (
        echo ⚠️  Proxy configuration might be missing
    )
    
    find "hmr" vite.config.ts >nul
    if %errorlevel% == 0 (
        echo ✅ HMR configuration found
    ) else (
        echo ⚠️  HMR configuration might be missing
    )
) else (
    echo ❌ vite.config.ts missing
)
echo.

echo 🔍 STEP 7: Network Connectivity Test...
echo Testing localhost connectivity:
ping -n 1 localhost >nul && echo ✅ localhost reachable || echo ❌ localhost unreachable
echo.
echo Testing 127.0.0.1 connectivity:
ping -n 1 127.0.0.1 >nul && echo ✅ 127.0.0.1 reachable || echo ❌ 127.0.0.1 unreachable
echo.

echo 🔍 STEP 8: Firewall & Security Check...
echo Checking Windows Firewall status:
netsh advfirewall show currentprofile | find "State" || echo Unable to check firewall
echo.
echo Common issues:
echo - Windows Defender may block WebSocket connections
echo - Corporate firewalls may restrict local WebSocket traffic
echo - Antivirus software may interfere with local connections
echo.

echo 🔍 STEP 9: Frontend Dependencies...
if exist node_modules (
    echo ✅ node_modules exists
    if exist node_modules\vite (
        echo ✅ Vite installed
    ) else (
        echo ❌ Vite missing - running npm install...
        npm install
    )
) else (
    echo ❌ node_modules missing - running npm install...
    npm install
)
echo.

echo 🔍 STEP 10: Starting Services...
echo Ensuring backend is running...
curl -s http://localhost:5000/health >nul
if %errorlevel% neq 0 (
    echo Starting backend...
    start "WEM Backend" cmd /k "cd backend\src\WemDashboard.API && dotnet run"
    echo Waiting for backend to start...
    :wait_backend
    timeout /t 2 /nobreak > nul
    curl -s http://localhost:5000/health >nul
    if %errorlevel% neq 0 goto wait_backend
    echo ✅ Backend started
)

echo Starting frontend with proxy...
start "WEM Frontend" cmd /k "npm run dev"
echo.

echo 🎯 TESTING RECOMMENDATIONS:
echo.
echo 1. Open Chrome DevTools (F12)
echo 2. Go to Network tab ^> WS filter
echo 3. Navigate to http://localhost:5173
echo 4. Look for WebSocket connections
echo 5. Check browser console for errors
echo.
echo Expected URLs to try:
echo - ws://localhost:5173/ws/energy-data (Proxied)
echo - ws://localhost:5000/ws/energy-data (Direct)
echo.
echo 6. Test in browser console:
echo    console.log('WebSocket URL:', import.meta.env.VITE_WS_URL);
echo.
echo 7. Manual WebSocket test:
echo    const ws = new WebSocket('ws://localhost:5173/ws/energy-data');
echo    ws.onopen = () =^> console.log('Connected via proxy');
echo.

echo ===============================================
echo Opening browser for testing...
timeout /t 5 /nobreak > nul
start http://localhost:5173
echo ===============================================
pause
