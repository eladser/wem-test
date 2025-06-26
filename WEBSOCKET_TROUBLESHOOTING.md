# 🔧 WebSocket Connection Troubleshooting Guide

## 🚨 **Quick Fix (Most Common Issues)**

If you're seeing WebSocket connection errors, try this **one-click fix**:

```bash
# Windows
quick-fix-websocket.bat

# Alternative: Manual steps
# 1. Kill existing processes
taskkill /f /im dotnet.exe /im node.exe

# 2. Set environment variables
echo VITE_WS_URL="ws://localhost:5000/ws/energy-data" > .env

# 3. Start backend
cd backend/src/WemDashboard.API && dotnet run

# 4. Start frontend (new terminal)
npm run dev
```

---

## 🔍 **Identify the Problem**

### **Check Connection Status**
1. **Frontend:** Look for connection status in the top-right corner of the dashboard
2. **Browser DevTools:** Open Chrome DevTools > Network > WS tab
3. **Backend Logs:** Check the terminal running the backend for WebSocket messages

### **Common Error Messages**
- 🔴 **"Connection Lost"** - Backend is not running or wrong URL
- 🔴 **"WebSocket connection failed"** - CORS or firewall issue
- 🔴 **"Connection Error"** - Backend crashed or port conflict

---

## 🛠️ **Step-by-Step Solutions**

### **Solution 1: Backend Not Running**
```bash
# Check if backend is running
curl http://localhost:5000/health

# If no response, start backend
cd backend/src/WemDashboard.API
dotnet run
```

**Expected output:**
```
🚀 WEM Dashboard API is running!
🔄 WebSocket: ws://localhost:5000/ws/energy-data
```

### **Solution 2: Wrong WebSocket URL**
```bash
# Check your .env file
cat .env

# Should contain:
VITE_WS_URL="ws://localhost:5000/ws/energy-data"
```

### **Solution 3: Port Conflicts**
```bash
# Check what's using port 5000
netstat -ano | find ":5000"

# Kill conflicting processes
taskkill /f /pid [PID_NUMBER]
```

### **Solution 4: Firewall/Antivirus Blocking**
- **Windows Defender:** Add exception for ports 5000 and 5173
- **Antivirus:** Temporarily disable real-time protection
- **Corporate Firewall:** Contact IT department

### **Solution 5: Browser-Specific Issues**
- **Try Chrome:** Best WebSocket support and debugging tools
- **Clear Cache:** Ctrl+Shift+Delete > Clear browsing data
- **Disable Extensions:** Test in incognito mode

---

## 🔧 **Advanced Diagnostics**

### **Manual WebSocket Test**
```javascript
// Test in browser console
const ws = new WebSocket('ws://localhost:5000/ws/energy-data');
ws.onopen = () => console.log('✅ Connected');
ws.onmessage = (e) => console.log('📥 Message:', e.data);
ws.onerror = (e) => console.log('❌ Error:', e);
ws.onclose = (e) => console.log('🔌 Closed:', e.code, e.reason);
```

### **Check Backend WebSocket Handler**
```bash
# Backend should show these messages when working:
🔌 New WebSocket connection established
📤 Sent: 89.2% efficiency, 245.3 MW, 1 alerts
```

### **Environment Variables Debug**
```bash
# Check all environment variables
npm run dev -- --debug

# Or check manually
node -e "console.log('WebSocket URL:', process.env.VITE_WS_URL)"
```

---

## 🌐 **Network & Infrastructure**

### **Local Development**
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173  
- **WebSocket:** ws://localhost:5000/ws/energy-data

### **Alternative Ports**
```bash
# If port 5000 is taken, use 5001
dotnet run --urls="http://localhost:5001"

# Update .env accordingly
VITE_WS_URL="ws://localhost:5001/ws/energy-data"
```

### **Docker Issues**
```bash
# Check Docker containers
docker ps

# Restart containers
docker-compose down && docker-compose up --build
```

---

## 📋 **Complete Checklist**

**Before reporting issues, verify:**

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] .env file has correct `VITE_WS_URL`
- [ ] No firewall/antivirus blocking connections
- [ ] Using Chrome browser for testing
- [ ] No other applications using port 5000
- [ ] Both terminals show no error messages

**Health Check Commands:**
```bash
# 1. Backend health
curl http://localhost:5000/health

# 2. WebSocket endpoint
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:5000/ws/energy-data

# 3. Frontend loading
curl http://localhost:5173
```

---

## 🆘 **Still Not Working?**

### **Get Detailed Logs**
```bash
# Run with debug mode
DEBUG=* npm run dev

# Backend verbose logging
dotnet run --verbosity detailed
```

### **Common Environment Issues**
- **Windows:** Use PowerShell or Command Prompt (not Git Bash)
- **Node.js:** Ensure version 18+ (`node --version`)
- **.NET:** Ensure version 8.0+ (`dotnet --version`)
- **Ports:** Make sure 5000 and 5173 are available

### **Report Issues**
If none of these solutions work, please provide:
1. Browser console errors (F12 > Console)
2. Backend terminal output
3. Environment details (OS, Node version, .NET version)
4. Network configuration (corporate network, VPN, etc.)

---

## ✅ **Success Indicators**

When everything works correctly, you should see:

**Backend Terminal:**
```
🔌 New WebSocket connection established
📤 Sent: 87.5% efficiency, 234.1 MW, 2 alerts
```

**Frontend Dashboard:**
- Green "Connected" status in top-right
- Real-time data updates every 5 seconds
- No error notifications

**Browser DevTools (F12 > Network > WS):**
- WebSocket connection showing "101 Switching Protocols"
- Continuous message flow every 5 seconds

---

**Need more help?** Run `debug-websocket.bat` for automated diagnostics!
