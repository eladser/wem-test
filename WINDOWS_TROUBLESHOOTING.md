# 🛠️ Windows Troubleshooting Guide

## ✅ **Fixed Issues**

I've fixed all the problems you encountered:

1. **✅ Fixed NuGet Package Errors**
   - Changed `Microsoft.EntityFrameworkCore.PostgreSQL` to `Npgsql.EntityFrameworkCore.PostgreSQL`
   - Removed unavailable `Microsoft.AspNetCore.RateLimiting` package
   - Updated `System.IdentityModel.Tokens.Jwt` to version 8.0.0 (removes security warning)

2. **✅ Fixed PowerShell Script Issues**
   - Replaced `Stop-Job -Force` with `Start-Process` for better compatibility
   - Fixed database seeding process for Windows

3. **✅ Fixed Package.json Scripts**
   - Removed Linux/Mac commands (`cp`, `true`)
   - Made all scripts Windows-compatible

## 🚀 **Now Try Again**

### **Step 1: Get Latest Updates**
```cmd
git pull origin main
```

### **Step 2: Run Fixed Setup Script**
```powershell
PowerShell -ExecutionPolicy Bypass -File setup-sqlite-dev.ps1
```

## 🎯 **What Should Happen Now**

The script should now run successfully and:
- ✅ Install all .NET packages without errors
- ✅ Install all frontend dependencies  
- ✅ Create SQLite database with sample data
- ✅ Build everything successfully
- ✅ Show completion message

## 📋 **After Successful Setup**

1. **Start Backend**: Double-click `start-backend.bat`
2. **Start Frontend**: Double-click `start-frontend.bat`  
3. **Open Browser**: Go to http://localhost:5173

## 🔐 **Test Login**
- **Email**: admin@wemdashboard.com
- **Password**: Admin123!

## 🆘 **If You Still Have Issues**

### **Clear Everything and Start Fresh**
```cmd
# Delete node_modules and package locks
rmdir /s /q node_modules
del package-lock.json

# Delete any existing database
del backend\src\WemDashboard.API\wemdashboard-dev.db

# Pull latest updates
git pull origin main

# Run setup again
PowerShell -ExecutionPolicy Bypass -File setup-sqlite-dev.ps1
```

### **Check Prerequisites**
- ✅ .NET 8.0 SDK installed
- ✅ Node.js 18+ installed  
- ✅ PowerShell execution policy allows script execution

### **Manual Setup (If Script Fails)**
```cmd
# 1. Install frontend dependencies
npm install

# 2. Go to backend and restore packages
cd backend\src\WemDashboard.API
dotnet restore
dotnet build

# 3. Run to create database
dotnet run

# 4. Stop with Ctrl+C when you see "Now listening on: http://localhost:5000"

# 5. Go back to root and start development
cd ..\..\..
```

The fixed scripts should work perfectly now! Let me know if you encounter any other issues.
