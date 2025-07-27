# WEM Energy Dashboard

A comprehensive energy management dashboard built with React, TypeScript, .NET Core, and Entity Framework with real-time data visualization capabilities.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **.NET 8 SDK**
- **PostgreSQL** (v12+)
- **Git**

### PostgreSQL Setup
Before running the application, ensure PostgreSQL is installed and create the database user:

```sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Create user for the application
CREATE USER wem_admin WITH PASSWORD 'WemEnergy2024';
ALTER USER wem_admin CREATEDB;

-- Exit
\q
```

### Quick Setup

**Option 1: Automated Setup (Recommended)**
```bash
# Clone the repository
git clone https://github.com/eladser/wem-test.git
cd wem-test

# Run the PostgreSQL migration fix script
# Windows:
./fix-postgresql-migration.bat

# Linux/macOS:
chmod +x fix-postgresql-migration.sh
./fix-postgresql-migration.sh

# Start the application
npm run quick-start
```

**Option 2: Manual Setup**
```bash
# Clone the repository
git clone https://github.com/eladser/wem-test.git
cd wem-test

# Install frontend dependencies
npm install

# Run PostgreSQL migrations
cd backend/src/WemDashboard.Infrastructure
dotnet ef database update --startup-project ../WemDashboard.API

# Start both frontend and backend
cd ../../..
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
DatabaseProvider=postgresql
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=wemdashboard;Username=wem_admin;Password=WemEnergy2024
```

### Backend Configuration

The backend uses `appsettings.json` for configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=wemdashboard;Username=wem_admin;Password=WemEnergy2024"
  },
  "DatabaseProvider": "postgresql",
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

## 📊 Database

The application uses **Entity Framework Core** with **PostgreSQL** as the primary database provider.

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

### Migration Commands

```bash
# Navigate to Infrastructure project
cd backend/src/WemDashboard.Infrastructure

# Create a new migration
dotnet ef migrations add MigrationName --startup-project ../WemDashboard.API

# Apply migrations
dotnet ef database update --startup-project ../WemDashboard.API

# Drop database (careful!)
dotnet ef database drop --force --startup-project ../WemDashboard.API
```

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

1. **PostgreSQL Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Verify user exists
   sudo -u postgres psql -c "\du"
   ```

2. **Migration Issues**
   ```bash
   # Run the migration fix script
   ./fix-postgresql-migration.sh  # Linux/macOS
   ./fix-postgresql-migration.bat # Windows
   ```

3. **Frontend build failures**
   ```bash
   npm run clean
   npm install
   npm run build
   ```

4. **Backend startup issues**
   ```bash
   npm run check-health
   # Check if port 5000 is available
   ```

### Additional Help

- 📋 See [POSTGRESQL-MIGRATION-TROUBLESHOOTING.md](./POSTGRESQL-MIGRATION-TROUBLESHOOTING.md) for detailed migration help
- 🔧 Check the logs in the console for specific error messages
- 🗄️ Use pgAdmin to visually inspect your PostgreSQL database

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
- Consult the [PostgreSQL Migration Troubleshooting Guide](./POSTGRESQL-MIGRATION-TROUBLESHOOTING.md)

---

**Note**: This application now fully supports PostgreSQL with proper migrations and no more SQLite dependencies. All DateTime handling has been optimized for PostgreSQL's timestamp types.
