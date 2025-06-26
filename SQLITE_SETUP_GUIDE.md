# 🗄️ SQLite Development Setup Guide

## 🚀 Quick Start (2 Minutes)

### **One-Command Setup**
```bash
git clone https://github.com/eladser/wem-test.git
cd wem-test
chmod +x setup-sqlite-dev.sh
./setup-sqlite-dev.sh
```

## 🎯 What You Get

### **📊 Rich Sample Data (Ready to Use)**
- **6 Global Energy Sites** across North America, Europe, and Asia-Pacific
- **10 Energy Assets** (Wind Turbines, Solar Panels, Inverters, Batteries)  
- **1,008 Hours of Power Data** (7 days × 24 hours × 6 sites)
- **7 Realistic Alerts** (Success, Warning, Error, Info notifications)
- **5 User Accounts** with different permission levels

### **🔐 Ready-to-Use Login Credentials**
| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@wemdashboard.com | Admin123! | Admin | Full system access |
| manager@wemdashboard.com | Manager123! | Manager | Site management |
| operator@wemdashboard.com | Operator123! | Operator | Operations control |
| viewer@wemdashboard.com | Viewer123! | Viewer | Read-only access |
| demo@wemdashboard.com | Demo123! | Demo | Demo account |

## 🏃‍♂️ Start Development

### **Terminal 1 - Backend API**
```bash
cd backend/src/WemDashboard.API
dotnet run
```
**✅ API will be running at http://localhost:5000**
**📚 Swagger UI at http://localhost:5000/swagger**

### **Terminal 2 - Frontend Dashboard**
```bash
npm run dev
```
**✅ Dashboard will be running at http://localhost:5173**

## 🗄️ SQLite Database Details

### **📁 Location**
```
backend/src/WemDashboard.API/wemdashboard-dev.db
```

### **📊 Database Contents**
```sql
-- Check what's in your database
sqlite3 wemdashboard-dev.db

-- View all tables
.tables

-- Check user accounts
SELECT Email, Role, FirstName, LastName FROM Users;

-- Check energy sites
SELECT Name, Location, Status, TotalCapacity FROM Sites;

-- Check recent power data
SELECT SiteId, Time, Solar, Wind, Battery, Demand 
FROM PowerData 
ORDER BY Time DESC 
LIMIT 10;

-- Check alerts
SELECT Type, Message, Timestamp FROM Alerts ORDER BY Timestamp DESC;
```

### **🔄 Database Management**
```bash
# Reset database (delete and recreate with fresh data)
rm backend/src/WemDashboard.API/wemdashboard-dev.db*
./setup-sqlite-dev.sh

# View database with SQLite Browser
# Download: https://sqlitebrowser.org/

# Backup database
cp backend/src/WemDashboard.API/wemdashboard-dev.db wemdashboard-backup.db
```

## 🧪 Test Your Setup

### **1. Test Backend Health**
```bash
curl http://localhost:5000/health
# Expected: {"status":"Healthy","totalDuration":"00:00:00.0123456"}
```

### **2. Test Authentication**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wemdashboard.com","password":"Admin123!"}'
# Expected: JWT token response
```

### **3. Test Sites API**
```bash
# Use the token from step 2
curl http://localhost:5000/api/sites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Expected: Array of 6 energy sites
```

### **4. Test Power Data**
```bash
curl http://localhost:5000/api/sites/site-ca-001/power-data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Expected: Array of hourly power data
```

## 🎨 Frontend Testing

### **Login Flow**
1. Open http://localhost:5173
2. Click "Login" (if not automatically redirected)
3. Use any credentials from the table above
4. Explore the dashboard with real data!

### **Features to Test**
- **📊 Dashboard** - Overview with real-time metrics
- **🏢 Sites** - 6 energy sites with detailed information
- **⚡ Assets** - 10 energy assets across all sites
- **📈 Analytics** - Charts with 7 days of power data
- **🚨 Alerts** - 7 sample alerts with different types
- **👥 Users** - User management (Admin only)

## 🐛 Troubleshooting

### **Database Issues**
```bash
# If database seems corrupted
rm backend/src/WemDashboard.API/wemdashboard-dev.db*
./setup-sqlite-dev.sh

# If API won't start
cd backend/src/WemDashboard.API
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### **Frontend Issues**
```bash
# If frontend won't start
rm -rf node_modules package-lock.json
npm install
npm run dev

# If API calls fail
# Check CORS settings in appsettings.Development.json
# Verify backend is running on port 5000
```

### **Permission Issues**
```bash
# If script won't run
chmod +x setup-sqlite-dev.sh

# If database file is read-only
chmod 644 backend/src/WemDashboard.API/wemdashboard-dev.db
```

## 📊 Sample Data Details

### **Energy Sites**
1. **California Solar Farm Alpha** (Riverside County, USA)
   - 45.8 MW capacity, 38.2 MW current output
   - Assets: Solar Inverter, Battery Storage

2. **Texas Wind & Solar Complex** (West Texas, USA)
   - 62.3 MW capacity, 51.7 MW current output
   - Assets: Wind Turbine, Solar Panel Array

3. **Berlin Green Energy Hub** (Brandenburg, Germany)
   - 28.4 MW capacity, 8.1 MW current output (Maintenance)
   - Assets: Inverter Unit (Maintenance)

4. **Tokyo Bay Offshore Wind** (Japan)
   - 78.9 MW capacity, 72.1 MW current output
   - Assets: 2 Offshore Wind Turbines

5. **Australian Outback Solar** (Northern Territory)
   - 35.2 MW capacity, 29.8 MW current output
   - Assets: Solar Array

6. **Scottish Highlands Wind Farm** (Scotland, UK)
   - 42.6 MW capacity, 38.9 MW current output
   - Assets: Highland Wind Turbine

### **Power Data Patterns**
- **Solar sites**: Peak generation 10 AM - 4 PM
- **Wind sites**: Variable generation with realistic patterns
- **Battery systems**: Charge/discharge cycles
- **Grid demand**: Higher during day, lower at night
- **All data**: 7-day history with hourly granularity

## ✅ GitHub Integration

### **Commitable Database**
The SQLite database file can be safely committed to your repository:

```bash
git add backend/src/WemDashboard.API/wemdashboard-dev.db
git commit -m "Add development database with sample data"
git push
```

### **CI/CD Testing**
The project includes GitHub Actions that automatically:
- ✅ Test SQLite database creation
- ✅ Verify sample data loading
- ✅ Test API endpoints
- ✅ Build frontend application

## 🚀 Next Steps

### **Development**
- Start building new features with the existing data
- Add more sample data if needed
- Customize the database schema
- Deploy to production with PostgreSQL/SQL Server

### **Deployment**
- **Railway**: One-click deployment with PostgreSQL
- **Render**: Free tier with PostgreSQL database
- **Docker**: Use included docker-compose.yml
- **Azure/AWS**: Deploy with managed databases

### **Documentation**
- **[README.md](README.md)** - Complete project overview
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing scenarios
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Full API reference

---

**🎉 Your WEM Dashboard SQLite development environment is ready!**

**💡 Need help?** Check the [TESTING_GUIDE.md](TESTING_GUIDE.md) or open an issue on GitHub.
