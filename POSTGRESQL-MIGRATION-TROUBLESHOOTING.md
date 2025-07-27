# 🐛 PostgreSQL Migration Troubleshooting Guide

## Quick Fix Steps

### 🚀 **Easy Solution - Run the Fix Script**

**Windows:**
```bash
./fix-postgresql-migration.bat
```

**Linux/macOS:**
```bash
chmod +x fix-postgresql-migration.sh
./fix-postgresql-migration.sh
```

---

## 🔧 Manual Migration Steps

If the scripts don't work, follow these manual steps:

### 1. **Prerequisites Check**

**Verify PostgreSQL is running:**
```bash
# Linux
sudo systemctl status postgresql

# Windows (check Services)
# Look for "postgresql" service

# macOS
brew services list | grep postgresql
```

**Check database user exists:**
```sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Check if user exists
\du

-- Create user if missing
CREATE USER wem_admin WITH PASSWORD 'WemEnergy2024';
ALTER USER wem_admin CREATEDB;

-- Exit
\q
```

### 2. **Reset and Create Migrations**

```bash
cd backend/src/WemDashboard.Infrastructure

# Drop existing database
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext

# Remove migrations folder
rm -rf Migrations/  # Linux/macOS
rmdir /s /q Migrations  # Windows

# Clear EF cache
dotnet nuget locals all --clear

# Build project
dotnet build ../WemDashboard.API

# Create initial migration
dotnet ef migrations add InitialPostgreSQLMigration \
    --startup-project ../WemDashboard.API \
    --context WemDashboardDbContext

# Apply migration
dotnet ef database update \
    --startup-project ../WemDashboard.API \
    --context WemDashboardDbContext
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: "Connection String Error"**
**Error:** `Npgsql.NpgsqlException: Failed to connect to server`

**Solution:**
1. Check PostgreSQL is running
2. Verify connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=wemdashboard;Username=wem_admin;Password=WemEnergy2024"
  }
}
```

### **Issue 2: "User does not exist"**
**Error:** `role "wem_admin" does not exist`

**Solution:**
```sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Create the user
CREATE USER wem_admin WITH PASSWORD 'WemEnergy2024';
ALTER USER wem_admin CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE wemdashboard TO wem_admin;
```

### **Issue 3: "DateTime Casting Error"**
**Error:** `Cannot cast DateTime to String`

**Solution:** Your DbContext is already fixed for this! The `ConfigurePostgreSQLTypes` method handles this.

### **Issue 4: "Build Errors"**
**Error:** Compilation failures during migration

**Solution:**
```bash
# Clean and restore
dotnet clean
dotnet restore
dotnet build

# Check for missing dependencies
cd backend/src/WemDashboard.Infrastructure
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.0
```

### **Issue 5: "Migrations Already Exist"**
**Error:** Migration with same name exists

**Solution:**
```bash
# Remove ALL migrations and start fresh
rm -rf Migrations/
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API
```

---

## 🏥 Health Checks

### **Test Database Connection**
```bash
# Test with psql
psql -h localhost -U wem_admin -d wemdashboard

# Test with .NET
dotnet run --project backend/src/WemDashboard.API
```

### **Verify Tables Created**
```sql
-- Connect to database
psql -h localhost -U wem_admin -d wemdashboard

-- List all tables
\dt

-- Should see:
-- Sites, Devices, EnergyReadings, Alerts, etc.
```

---

## 📋 Success Checklist

- ✅ PostgreSQL service is running
- ✅ Database user `wem_admin` exists with proper permissions
- ✅ Connection string is correct in appsettings.json
- ✅ Migrations folder created in WemDashboard.Infrastructure
- ✅ Database `wemdashboard` created successfully
- ✅ All expected tables exist in database
- ✅ Application starts without errors
- ✅ No DateTime casting errors in logs

---

## 🎯 **Still Having Issues?**

### **Get Detailed Logs:**
```bash
# Enable verbose EF Core logging
dotnet ef database update --startup-project ../WemDashboard.API --verbose
```

### **Check What's Running:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check which processes are using port 5432
sudo netstat -tulpn | grep 5432
```

### **Environment Variables:**
Make sure no conflicting environment variables are set:
```bash
echo $ASPNETCORE_ENVIRONMENT
echo $ConnectionStrings__DefaultConnection
```

---

## 💡 **Pro Tips**

1. **Always backup before migration** (though we're starting fresh)
2. **Use pgAdmin** for visual database inspection
3. **Check PostgreSQL logs** if connection fails:
   ```bash
   # Linux
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```
4. **Test connection separately** before running migrations

---

**After successful migration, your PostgreSQL database will be fully operational! 🎉**
