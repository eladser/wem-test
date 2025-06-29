# WEM Energy Dashboard - Simplified Setup

## 🚀 Quick Start (Windows)

**Just run one file:**
```bash
start-wem-dashboard.bat
```

This will start both your frontend and backend automatically!

## 🎯 What You Get

- **Frontend**: React dashboard on http://localhost:5173
- **Backend**: .NET API on http://localhost:5000  
- **Database**: SQLite (local file)
- **Real-time**: WebSocket updates

## 🔧 Architecture

```
Frontend (Port 5173)  →  Backend (Port 5000)  →  SQLite Database
     React/Vite              .NET 8 API            Local File
```

## 📊 Key Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:5173 | Main application |
| API | http://localhost:5000/api | REST endpoints |
| Swagger | http://localhost:5000 | API documentation |
| Health | http://localhost:5000/health | Status check |
| WebSocket | ws://localhost:5000/ws/energy-data | Real-time data |

## 🔄 Manual Setup (if needed)

### Backend
```bash
cd backend/src/WemDashboard.API
dotnet run --urls=http://localhost:5000
```

### Frontend  
```bash
npm install
npm run dev
```

## 🐛 Troubleshooting

**Problem**: Frontend can't connect to backend
**Solution**: Make sure backend is running on port 5000

**Problem**: Port conflicts
**Solution**: The startup script kills existing processes

**Problem**: Database issues
**Solution**: Backend recreates SQLite database on startup

## 📝 Configuration Files

- `.env` - Main environment variables (port 5000)
- `.env.development` - Development overrides (now fixed)
- `src/config/environment.ts` - Frontend config (now unified)

## 🔒 Login Credentials

Check `LOGIN_CREDENTIALS.md` for test accounts.

---

**That's it!** Your dashboard connects directly to your .NET backend on port 5000 with SQLite database. No duplicate APIs, no port conflicts, just one clean system.
