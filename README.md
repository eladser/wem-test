# WEM Energy Dashboard

A comprehensive energy management dashboard built with React, TypeScript, .NET Core, and Entity Framework with real-time data visualization capabilities.

> **✅ Test Update**: This line was added by Claude to test repository edit permissions on July 27, 2025.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **.NET 8 SDK**
- **Git**

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/eladser/wem-test.git
cd wem-test

# Full setup (installs dependencies, builds backend, sets up database)
npm run full-setup

# Start both frontend and backend
npm run quick-start
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/swagger

## 🛠️ Development Scripts

### Frontend
```bash
npm run dev                 # Start frontend development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking
npm run test               # Run Jest tests
```

### Backend
```bash
npm run start-backend        # Start backend server
npm run start-backend-watch  # Start backend with auto-reload
npm run build-backend       # Build backend
npm run test-backend        # Run backend tests
```

### Database
```bash
npm run setup-db            # Apply database migrations
npm run reset-db            # Drop and recreate database
npm run add-migration NAME  # Add new migration
```

### Utilities
```bash
npm run check-health        # Check backend health
npm run clean              # Clean build artifacts
npm run install-deps       # Install dependencies
```

## 📁 Project Structure

```
wem-test/
├── backend/                    # .NET Core Backend
│   ├── src/
│   │   ├── WemDashboard.API/          # Web API controllers
│   │   ├── WemDashboard.Application/   # Business logic & services
│   │   ├── WemDashboard.Domain/       # Domain entities & interfaces
│   │   ├── WemDashboard.Infrastructure/ # Data access & repositories
│   │   └── WemDashboard.Shared/       # Shared models & constants
│   └── WemDashboard.sln              # Solution file
├── src/                        # React Frontend
│   ├── components/            # Reusable UI components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services
│   ├── types/                # TypeScript definitions
│   └── utils/                # Utility functions
├── public/                    # Static assets
└── docs/                     # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5173/ws/energy-data

# Development
VITE_DEBUG=true
VITE_ENABLE_REAL_TIME=true
NODE_ENV=development

# Database (for backend)
ASPNETCORE_ENVIRONMENT=Development
DatabaseProvider=sqlite
ConnectionStrings__DefaultConnection=Data Source=wemdashboard.db;
```

### Backend Configuration

The backend uses `appsettings.json` for configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=wemdashboard.db;"
  },
  "DatabaseProvider": "sqlite",
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

## 📊 Database

The application uses **Entity Framework Core** with support for multiple database providers:

- **SQLite** (default for development)
- **SQL Server**
- **PostgreSQL** 
- **MySQL**

### Database Schema

Key entities:
- **Sites**: Energy generation sites
- **Assets**: Equipment and infrastructure
- **PowerData**: Real-time energy data
- **Alerts**: System notifications
- **Users**: Authentication and authorization
- **UserPreferences**: User settings and configurations

### Sample Data

The application includes seed data with:
- 4 sample sites across different regions
- Admin user account (admin@wemdashboard.com / Admin123!)
- Sample configurations and preferences

## 🔌 API Endpoints

### Sites API
- `GET /api/sites` - Get all sites (supports region filtering)
- `GET /api/sites/{id}` - Get site by ID
- `POST /api/sites` - Create new site
- `PUT /api/sites/{id}` - Update site
- `PATCH /api/sites/{id}/status` - Update site status
- `DELETE /api/sites/{id}` - Delete site

### Other APIs
- `/api/assets` - Asset management
- `/api/power-data` - Energy data
- `/api/alerts` - Alert management
- `/api/auth` - Authentication
- `/api/dashboard-layout` - Dashboard configuration

## 🔄 Real-time Features

The application supports real-time updates via:
- **SignalR** for WebSocket connections
- **React Query** for efficient data caching
- **Automatic reconnection** handling

## 🎨 UI Components

Built with modern UI components:
- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization
- **React Hook Form** for form handling

## 🧪 Testing

### Frontend Testing
```bash
npm run test                # Run Jest tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Generate coverage report
```

### Backend Testing
```bash
npm run test-backend        # Run .NET tests
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build backend
npm run build-backend

# The built files will be in:
# - Frontend: ./dist/
# - Backend: ./backend/src/WemDashboard.API/bin/Release/
```

### Docker Support
```bash
# Build and run with Docker Compose
cd backend
docker-compose up --build
```

## 🛡️ Security

- **JWT Authentication** with refresh tokens
- **Role-based authorization** (Admin, Manager, Operator, Viewer)
- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **SQL injection protection** via Entity Framework

## 🔍 Troubleshooting

### Common Issues

1. **Backend not starting**
   ```bash
   npm run check-health
   # Check if port 5000 is available
   ```

2. **Database issues**
   ```bash
   npm run reset-db
   # This will recreate the database with fresh data
   ```

3. **Frontend build failures**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

4. **WebSocket connection issues**
   - Check that backend is running on port 5000
   - Verify VITE_WS_URL in .env file
   - Check browser console for connection errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/swagger` when running locally
- Review the troubleshooting section above

---

**Note**: This repository has been cleaned up to remove redundant batch files and scripts. All functionality is now available through npm scripts for better cross-platform compatibility.
