# 🌊 WEM Energy Dashboard - **Complete Full-Stack Application**

<div align="center">

![WEM Dashboard](https://img.shields.io/badge/WEM-Dashboard-green?style=for-the-badge&logo=energy)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![C#](https://img.shields.io/badge/C%23-.NET_8-purple?style=for-the-badge&logo=dotnet)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue?style=for-the-badge&logo=sqlite)

**A production-ready Wind Energy Management dashboard with React frontend and C# backend**

[🚀 **Start Testing Now**](#-quick-start) • [📖 **Full Documentation**](TESTING_GUIDE.md) • [🗄️ **SQLite Setup**](#-enhanced-sqlite-development-setup)

</div>

---

## 🎉 **What's New - Enhanced SQLite Development Setup!**

### ✅ **Perfect for Development & Testing**
- **🗄️ SQLite Database** - Zero configuration, works immediately
- **🌱 Rich Sample Data** - 6 global sites, 10 assets, 1000+ hours of power data
- **🎯 Ready-to-Use Users** - 5 accounts with different permission levels
- **🔄 GitHub Ready** - Database can be committed to repository
- **⚡ Lightning Fast** - Instant setup with comprehensive data

---

## 🚀 **Quick Start (2 Minutes)**

### **🗄️ Enhanced SQLite Development Setup** (Recommended)

```bash
# Clone the repository
git clone https://github.com/eladser/wem-test.git
cd wem-test

# One-command setup with rich sample data
chmod +x setup-sqlite-dev.sh
./setup-sqlite-dev.sh
```

**This single script will:**
- ✅ Configure SQLite database with comprehensive sample data
- ✅ Install all backend dependencies
- ✅ Install all frontend dependencies
- ✅ Create development environment files
- ✅ Build and verify everything works

### **🚀 Start Development**

**Terminal 1 - Backend API:**
```bash
cd backend/src/WemDashboard.API
dotnet run
```

**Terminal 2 - Frontend Dashboard:**
```bash
npm run dev
```

---

## 🎯 **Test Your Complete Application**

### **🌐 Access Points**
- **📊 Frontend Dashboard**: http://localhost:5173
- **📚 API Documentation**: http://localhost:5000/swagger
- **❤️ Health Check**: http://localhost:5000/health

### **🔐 Ready-to-Use Login Credentials**
| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| 👨‍💼 **Admin** | admin@wemdashboard.com | Admin123! | Full system access |
| 👩‍💼 **Manager** | manager@wemdashboard.com | Manager123! | Site management |
| 👨‍🔧 **Operator** | operator@wemdashboard.com | Operator123! | Operations control |
| 👁️ **Viewer** | viewer@wemdashboard.com | Viewer123! | Read-only access |
| 🎯 **Demo** | demo@wemdashboard.com | Demo123! | Demo account |

### **📊 Rich Pre-loaded Sample Data**

#### **🏢 6 Global Energy Sites**
- 📍 **California Solar Farm Alpha** - Riverside County, USA (45.8 MW capacity)
- 📍 **Texas Wind & Solar Complex** - West Texas, USA (62.3 MW capacity)
- 📍 **Berlin Green Energy Hub** - Brandenburg, Germany (28.4 MW capacity, maintenance)
- 📍 **Tokyo Bay Offshore Wind** - Japan (78.9 MW capacity)
- 📍 **Australian Outback Solar** - Northern Territory (35.2 MW capacity)
- 📍 **Scottish Highlands Wind Farm** - Scotland, UK (42.6 MW capacity)

#### **⚡ 10 Energy Assets**
- Wind Turbines with real-time performance data
- Solar Panel Arrays with efficiency tracking
- Inverter Units with monitoring
- Battery Storage Systems with charge/discharge cycles

#### **📈 1,008 Hours of Power Data**
- 7 days × 24 hours × 6 sites of realistic energy data
- Solar generation patterns based on time of day
- Wind generation with natural variability
- Battery storage and discharge cycles
- Grid demand patterns

#### **🚨 7 Realistic Alerts**
- Success notifications (efficiency records)
- Warning alerts (low battery, maintenance needed)
- Error alerts (equipment failures)
- Info notifications (system updates)

---

## 🗄️ **SQLite Database Details**

### **📁 Database Location**
```
backend/src/WemDashboard.API/wemdashboard-dev.db
```

### **📊 Database Contents**
| Table | Records | Description |
|-------|---------|-------------|
| **Users** | 5 | Complete user accounts with hashed passwords |
| **Sites** | 6 | Global energy sites with real-time status |
| **Assets** | 10 | Various energy assets across all sites |
| **PowerData** | 1,008 | Hourly power generation/consumption data |
| **Alerts** | 7 | Recent system alerts and notifications |

### **🔄 Database Management**
```bash
# Reset database (delete and recreate)
rm backend/src/WemDashboard.API/wemdashboard-dev.db
./setup-sqlite-dev.sh

# View database with SQLite Browser
# Download: https://sqlitebrowser.org/

# Or use command line
sqlite3 backend/src/WemDashboard.API/wemdashboard-dev.db
.tables
SELECT COUNT(*) FROM Sites;
```

### **✅ GitHub Integration**
- **Commitable**: SQLite database can be committed to repository
- **Portable**: Works identically across all development environments
- **Zero Config**: No database server setup required
- **CI/CD Ready**: Automated testing includes database verification

---

## 🏗️ **Complete Architecture**

```
🎨 React Frontend (Port 5173)
├── Dashboard UI with Real-time Charts
├── JWT Authentication System
├── Role-based Access Control
└── Responsive Design (Mobile-first)
           ↕ HTTP/REST API
⚡ C# Backend API (Port 5000)
├── JWT Authentication & Authorization
├── RESTful API Endpoints
├── Clean Architecture (Domain/Application/Infrastructure)
├── Entity Framework Core ORM
├── FluentValidation for Input Validation
├── Serilog for Structured Logging
└── Swagger/OpenAPI Documentation
           ↕ Entity Framework Core
🗄️ SQLite Database
├── Users (Authentication & Authorization)
├── Sites (Energy Generation Sites)
├── Assets (Wind Turbines, Solar Panels, etc.)
├── PowerData (Time-series Energy Data)
└── Alerts (System Notifications)
```

---

## 📋 **Complete API Reference**

### **🔐 Authentication Endpoints**
```http
POST /api/auth/login     # Authenticate user and get JWT token
POST /api/auth/refresh   # Refresh expired JWT token
GET  /api/auth/me        # Get current user profile
```

### **🏢 Sites Management**
```http
GET    /api/sites              # Get all energy sites
GET    /api/sites/{id}         # Get specific site details
POST   /api/sites              # Create new energy site
PUT    /api/sites/{id}         # Update site information
PATCH  /api/sites/{id}/status  # Update site operational status
DELETE /api/sites/{id}         # Delete energy site
```

### **⚡ Assets & Equipment**
```http
GET    /api/sites/{id}/assets         # Get all assets for a site
GET    /api/assets/{id}               # Get specific asset details
POST   /api/sites/{id}/assets         # Add new asset to site
PUT    /api/assets/{id}               # Update asset information
DELETE /api/assets/{id}               # Remove asset
```

### **📊 Power Data & Analytics**
```http
GET /api/sites/{id}/power-data        # Get power generation data
GET /api/sites/{id}/power-data/recent # Get last 24 hours data
GET /api/sites/{id}/metrics           # Get site performance metrics
GET /api/analytics/dashboard          # Get dashboard overview data
```

### **🚨 Alerts & Notifications**
```http
GET  /api/alerts/recent    # Get recent alerts (last 7 days)
GET  /api/alerts/unread    # Get unread alerts for current user
POST /api/alerts/{id}/read # Mark alert as read
GET  /api/alerts/stats     # Get alert statistics
```

### **👥 User Management** (Admin Only)
```http
GET    /api/users           # Get all users
GET    /api/users/{id}      # Get specific user
POST   /api/users           # Create new user
PUT    /api/users/{id}      # Update user information
DELETE /api/users/{id}      # Delete user
```

**🔍 All endpoints fully documented with examples in Swagger UI!**

---

## 🧪 **Comprehensive Testing & CI/CD**

### **✅ Automated Testing**
- **GitHub Actions** workflow for continuous integration
- **Cross-platform testing** (Ubuntu, Windows, macOS)
- **Database creation verification**
- **API endpoint testing**
- **Frontend build validation**

### **🔍 Manual Testing**
```bash
# Test backend health
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wemdashboard.com","password":"Admin123!"}'

# Test sites API (use token from login response)
curl http://localhost:5000/api/sites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test power data
curl http://localhost:5000/api/sites/site-ca-001/power-data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **📊 Test Coverage**
- ✅ Authentication & Authorization flows
- ✅ CRUD operations for all entities
- ✅ Data persistence and retrieval
- ✅ API security (rate limiting, validation)
- ✅ Error handling and responses
- ✅ Database schema validation

---

## 🌐 **Deployment Options**

### **☁️ Cloud Deployment**
| Platform | Database | Effort | Cost |
|----------|----------|--------|------|
| **Railway** | PostgreSQL | ⭐ | Free tier |
| **Render** | PostgreSQL | ⭐⭐ | Free tier |
| **Vercel + Supabase** | PostgreSQL | ⭐⭐ | Free tier |
| **Azure App Service** | SQL Server | ⭐⭐⭐ | Pay-as-go |
| **AWS Elastic Beanstalk** | RDS | ⭐⭐⭐ | Pay-as-go |

### **🔄 Database Migration**
Switch from SQLite to any database by updating connection string:

```bash
# PostgreSQL
export DATABASE_PROVIDER="PostgreSQL"
export CONNECTION_STRING="Host=localhost;Database=WemDashboard;Username=user;Password=pass"

# SQL Server
export DATABASE_PROVIDER="SqlServer"
export CONNECTION_STRING="Server=localhost;Database=WemDashboard;Trusted_Connection=true"
```

### **🐳 Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 🔒 **Production-Ready Security**

### **🛡️ Backend Security Features**
- ✅ **JWT Authentication** with configurable expiration
- ✅ **Role-based Authorization** (Admin, Manager, Operator, Viewer)
- ✅ **Input Validation** with FluentValidation
- ✅ **Rate Limiting** (1000 requests/hour per user)
- ✅ **CORS Protection** with configurable origins
- ✅ **SQL Injection Prevention** via Entity Framework
- ✅ **Password Hashing** with BCrypt
- ✅ **Request Logging** with Serilog

### **🔐 Frontend Security Features**
- ✅ **Secure Token Storage** (httpOnly cookies recommended)
- ✅ **XSS Protection** with input sanitization
- ✅ **CSRF Protection** with token validation
- ✅ **Secure Headers** configuration
- ✅ **Route Guards** for protected pages

---

## 📈 **Performance Optimization**

### **⚡ Backend Performance**
- **Async/Await** throughout the application
- **Entity Framework Core** with optimized queries
- **Response Caching** for frequently accessed data
- **Connection Pooling** for database efficiency
- **Health Checks** for monitoring and diagnostics

### **🚀 Frontend Performance**
- **Code Splitting** and lazy loading
- **React.memo** for component optimization
- **Tailwind CSS** for minimal bundle size
- **Vite** for lightning-fast development builds
- **Tree Shaking** for production optimization

---

## 📖 **Complete Documentation**

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing instructions
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[backend/README_BACKEND.md](backend/README_BACKEND.md)** - Backend architecture
- **[backend/DATABASE_DEPLOYMENT.md](backend/DATABASE_DEPLOYMENT.md)** - Database setup guide
- **[backend/FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** - Integration guide
- **Swagger UI** - Interactive API documentation at `/swagger`

---

## 🛠️ **Development Workflow**

### **🔄 Daily Development**
```bash
# Start development environment
./setup-sqlite-dev.sh

# Terminal 1: Backend with hot reload
cd backend/src/WemDashboard.API
dotnet watch run

# Terminal 2: Frontend with hot reload
npm run dev

# Terminal 3: Run tests
npm run test:watch
```

### **🧪 Testing Workflow**
```bash
# Run all tests
npm run test

# Test backend
cd backend/src/WemDashboard.API
dotnet test

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format
```

---

## 🏆 **What You Get - Complete Package**

### **✅ Production-Ready Application**
- 🎨 **Modern React Frontend** with TypeScript and Tailwind CSS
- ⚡ **Scalable C# Backend** with Clean Architecture
- 🗄️ **SQLite Database** with rich sample data
- 🔒 **JWT Authentication** with role-based access
- 📚 **Interactive API Documentation** via Swagger
- 🐳 **Docker Containerization** for easy deployment
- ☁️ **Cloud Deployment Ready** for multiple platforms

### **✅ Developer Experience**
- 🚀 **One-Command Setup** - `./setup-sqlite-dev.sh`
- 🔥 **Hot Reload** for both frontend and backend
- 📊 **Rich Sample Data** - 6 sites, 10 assets, 1000+ data points
- 🧪 **Comprehensive Testing** with GitHub Actions CI/CD
- 📖 **Extensive Documentation** with examples
- 🔍 **Interactive API Explorer** in Swagger UI

### **✅ Production Features**
- 🛡️ **Enterprise Security** (Authentication, Authorization, Validation)
- 📈 **Performance Optimized** (Caching, Connection Pooling, Async)
- 🚨 **Error Handling** with detailed logging
- 📊 **Monitoring & Health Checks** for operations
- 🔄 **Database Flexibility** (SQLite → PostgreSQL/SQL Server)
- 🌍 **Internationalization Ready**

---

## 🎊 **Ready to Start Developing!**

**Your WEM Dashboard is now a complete, production-ready application with rich sample data!**

### **🚀 Get Started in 2 Minutes**
```bash
git clone https://github.com/eladser/wem-test.git
cd wem-test
chmod +x setup-sqlite-dev.sh
./setup-sqlite-dev.sh
```

### **🎯 What Happens Next**
1. ✅ SQLite database created with comprehensive sample data
2. ✅ Backend API running at http://localhost:5000
3. ✅ Frontend dashboard at http://localhost:5173
4. ✅ 5 ready-to-use accounts with different permission levels
5. ✅ 6 global energy sites with real-time data
6. ✅ Interactive API documentation at /swagger

### **📚 Deep Dive**
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing scenarios
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **Swagger UI** - Interactive API exploration at http://localhost:5000/swagger

---

<div align="center">

**🌟 Built with ❤️ using React 18, .NET 8, and SQLite**

**Perfect for Development • Testing • Demos • Production**

[⭐ Star this repo](https://github.com/eladser/wem-test) • [🐛 Report Issues](https://github.com/eladser/wem-test/issues) • [💡 Request Features](https://github.com/eladser/wem-test/discussions)

</div>
