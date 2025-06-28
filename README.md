# WEM Dashboard

A comprehensive Web Energy Management (WEM) dashboard for monitoring and managing energy assets.

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ (or Bun)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eladser/wem-test.git
   cd wem-test
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start backend**
   ```bash
   # Windows
   start-backend.bat
   
   # Or manually:
   cd backend/src/WemDashboard.API
   dotnet run
   ```

4. **Start frontend (in a new terminal)**
   ```bash
   # Windows
   start-frontend.bat
   
   # Or manually:
   npm run dev
   # or
   bun run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7087
- **Backend API (HTTP)**: http://localhost:5087

## Project Structure

```
wem-test/
├── backend/                 # .NET 8 Web API
│   ├── src/
│   │   ├── WemDashboard.API/          # API Controllers & Startup
│   │   ├── WemDashboard.Application/  # Business Logic & Services
│   │   ├── WemDashboard.Domain/       # Domain Models & Entities
│   │   └── WemDashboard.Infrastructure/ # Data Access & External Services
│   └── WemDashboard.sln     # Solution file
├── src/                     # React/TypeScript Frontend
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── public/                  # Static assets
└── package.json            # Frontend dependencies
```

## Key Features

### 🏭 **Asset Management**
- Real-time asset monitoring
- Asset hierarchy and relationships
- Performance metrics and KPIs
- Maintenance scheduling

### ⚡ **Energy Monitoring**
- Real-time power consumption data
- Energy flow visualization
- Historical data analysis
- Demand forecasting

### 🚨 **Alert System**
- Real-time alert notifications
- Configurable alert rules
- Alert prioritization and escalation
- WebSocket-based live updates

### 📊 **Dashboard & Analytics**
- Customizable dashboards
- Interactive charts and graphs
- Data export capabilities
- Report generation

### 🔐 **User Management**
- Role-based access control
- User preferences and settings
- Multi-site support
- Audit logging

## Technology Stack

### Backend
- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM with SQLite
- **SignalR** - Real-time WebSocket communication
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Recharts** - Data visualization
- **React Query** - Data fetching and caching

### Database
- **SQLite** - Development database
- **SQL Server/PostgreSQL** - Production options

## Development

### Backend Development

```bash
# Navigate to API project
cd backend/src/WemDashboard.API

# Run with hot reload
dotnet watch run

# Run tests
cd ../../
dotnet test
```

### Frontend Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

### Database

The application uses SQLite by default for development. The database is automatically created when you first run the backend.

**Database location**: `backend/src/WemDashboard.API/wemdashboard-dev.db`

## API Documentation

Once the backend is running, you can access:

- **Swagger UI**: http://localhost:7087/swagger
- **API Endpoints**: http://localhost:7087/api/

### Key API Endpoints

- `GET /api/sites` - List all sites
- `GET /api/assets` - List all assets
- `GET /api/power-data` - Get power consumption data
- `GET /api/alerts` - List alerts
- `GET /api/users` - User management

## WebSocket Features

The application uses SignalR for real-time updates:

- **Real-time alerts** - Instant notification of new alerts
- **Live data updates** - Power consumption and asset status
- **User presence** - Show active users
- **System notifications** - Maintenance windows, updates

**WebSocket Hub**: `http://localhost:7087/hubs/dashboard`

## Configuration

### Backend Configuration

Edit `backend/src/WemDashboard.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=wemdashboard-dev.db;"
  },
  "DatabaseProvider": "sqlite",
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Frontend Configuration

Edit `.env` file:

```env
VITE_API_BASE_URL=http://localhost:7087
VITE_WS_BASE_URL=http://localhost:7087
```

## Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build backend
cd backend
dotnet publish -c Release -o publish
```

### Environment Variables

For production deployment, set:

- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection=<your-db-connection>`
- `DatabaseProvider=sqlserver` (or postgresql)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the [Issues](https://github.com/eladser/wem-test/issues) page
2. Create a new issue with detailed information
3. Include error logs and reproduction steps

---

**Happy coding! 🚀**