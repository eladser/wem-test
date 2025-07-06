# 🪟 WEM Dashboard - Windows Setup Guide

## 🎯 Quick Start for Windows (5 Minutes)

Follow these steps **in order** to get your WEM Dashboard running on Windows:

### **Prerequisites** ✅
Make sure you have these installed:
- **[.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)** - For backend API
- **[Node.js 18+](https://nodejs.org/)** - For frontend development
- **[Git](https://git-scm.com/download/win)** - To clone the repository

---

## 📋 **Step-by-Step Setup**

### **Step 1: Clone the Repository**
Open **Command Prompt** or **PowerShell** and run:
```cmd
git clone https://github.com/eladser/wem-test.git
cd wem-test
```

### **Step 2: Setup SQLite Database with Sample Data**
Run the PowerShell setup script:
```powershell
# Option A: Right-click on setup-sqlite-dev.ps1 and select "Run with PowerShell"
# OR
# Option B: In PowerShell terminal:
PowerShell -ExecutionPolicy Bypass -File setup-sqlite-dev.ps1
```

**What this does:**
- ✅ Creates SQLite database with comprehensive sample data
- ✅ Installs all .NET backend dependencies  
- ✅ Installs all Node.js frontend dependencies
- ✅ Configures development environment files
- ✅ Builds and verifies everything works

### **Step 3: Verify Database Setup (Optional)**
```powershell
# Verify database was created successfully
PowerShell -ExecutionPolicy Bypass -File verify-database.ps1
```

### **Step 4: Start the Backend API**
**Open Command Prompt #1** and run:
```cmd
start-backend.bat
```
**✅ Backend will be running at: http://localhost:5000**

### **Step 5: Start the Frontend Dashboard**
**Open Command Prompt #2** and run:
```cmd
start-frontend.bat
```
**✅ Frontend will be running at: http://localhost:5173**

---

## 🎯 **You're Done! Test Your Setup**

### **🌐 Open Your Browser**
- **Dashboard**: http://localhost:5173
- **API Documentation**: http://localhost:5000/swagger

### **🔐 Login with Test Credentials**
| Email | Password | Role |
|-------|----------|------|
| admin@wemdashboard.com | Admin123! | Admin |
| manager@wemdashboard.com | Manager123! | Manager |
| operator@wemdashboard.com | Operator123! | Operator |
| viewer@wemdashboard.com | Viewer123! | Viewer |
| demo@wemdashboard.com | Demo123! | Demo |

---

## 📁 **Windows Scripts Overview**

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `setup-sqlite-dev.ps1` | **Initial setup** with database and dependencies | **Run once** when first setting up |
| `verify-database.ps1` | **Verify** database contents and structure | After setup to confirm everything worked |
| `start-backend.bat` | **Start** the .NET API server | **Every time** you want to develop |
| `start-frontend.bat` | **Start** the React frontend | **Every time** you want to develop |

---

## 🔄 **Daily Development Workflow**

### **Starting Development**
1. **Double-click** `start-backend.bat` (opens Command Prompt #1)
2. **Double-click** `start-frontend.bat` (opens Command Prompt #2)
3. **Open browser** to http://localhost:5173

### **Stopping Development**
- **Press Ctrl+C** in both Command Prompt windows
- **Close** the Command Prompt windows

---

## 🛠️ **Troubleshooting**

### **PowerShell Execution Policy Error**
If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Database Issues**
```cmd
# Delete database and recreate
del backend\src\WemDashboard.API\wemdashboard-dev.db
PowerShell -ExecutionPolicy Bypass -File setup-sqlite-dev.ps1
```

### **Frontend Won't Start**
```cmd
# Clear and reinstall dependencies
rmdir /s node_modules
del package-lock.json
npm install
start-frontend.bat
```

### **Backend Won't Start**
```cmd
# Rebuild backend
cd backend\src\WemDashboard.API
dotnet clean
dotnet restore
dotnet build
dotnet run
```

---

## 📊 **What Sample Data You Get**

### **🏢 6 Energy Sites**
- California Solar Farm Alpha (45.8 MW)
- Texas Wind & Solar Complex (62.3 MW)
- Berlin Green Energy Hub (28.4 MW, Maintenance)
- Tokyo Bay Offshore Wind (78.9 MW)
- Australian Outback Solar (35.2 MW)
- Scottish Highlands Wind Farm (42.6 MW)

### **⚡ 10 Energy Assets**
- Wind Turbines, Solar Panels, Inverters, Battery Storage

### **📈 Power Data**
- 1,008 hours of realistic power generation data
- 7 days × 24 hours × 6 sites
- Solar/wind generation patterns

### **🚨 Sample Alerts**
- 7 realistic alerts (Success, Warning, Error, Info)

---

## 🎯 **Quick Commands Summary**

```cmd
REM Initial setup (run once)
PowerShell -ExecutionPolicy Bypass -File setup-sqlite-dev.ps1

REM Daily development (run these two)
start-backend.bat      REM Terminal 1 - API Server
start-frontend.bat     REM Terminal 2 - React App

REM Verify setup (optional)
PowerShell -ExecutionPolicy Bypass -File verify-database.ps1
```

---

## ✅ **Success Checklist**

After following these steps, you should have:
- ✅ SQLite database with rich sample data
- ✅ Backend API running at http://localhost:5000
- ✅ Frontend dashboard at http://localhost:5173
- ✅ Swagger API docs at http://localhost:5000/swagger
- ✅ 5 test user accounts ready to use
- ✅ 6 energy sites with real-time data
- ✅ 10 energy assets across all sites

## 🎊 **You're Ready to Develop!**

Your WEM Dashboard is now running with a complete SQLite development environment on Windows! 

**Happy coding! 🚀**
