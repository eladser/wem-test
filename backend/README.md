# WEM Dashboard Backend

A production-ready ASP.NET Core backend for the Wind Energy Management Dashboard, built with clean architecture principles and designed for easy database switching.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── WemDashboard.API/              # Web API layer
│   ├── WemDashboard.Application/      # Business logic
│   ├── WemDashboard.Domain/           # Domain models
│   ├── WemDashboard.Infrastructure/   # Data access & external services
│   └── WemDashboard.Shared/           # Shared utilities
└── tests/
    ├── WemDashboard.UnitTests/
    └── WemDashboard.IntegrationTests/
```

## 🚀 Features

- **Clean Architecture**: Separation of concerns with clear boundaries
- **Database Agnostic**: Easy switching between SQL Server, PostgreSQL, MySQL, SQLite
- **RepositoryPattern**: Abstracted data access layer
- **JWT Authentication**: Secure token-based authentication
- **OpenAPI/Swagger**: Complete API documentation
- **Health Checks**: Monitor application and database health
- **Caching**: Redis integration for performance
- **Rate Limiting**: Prevent API abuse
- **CORS Support**: Frontend integration ready
- **Logging**: Structured logging with Serilog
- **Unit & Integration Tests**: Comprehensive test coverage
- **Docker Support**: Containerization ready

## 🛠️ Technology Stack

- **Framework**: ASP.NET Core 8.0
- **Database**: Entity Framework Core 8.0
- **Authentication**: JWT Bearer tokens
- **Documentation**: Swagger/OpenAPI
- **Caching**: Redis (optional)
- **Logging**: Serilog
- **Testing**: xUnit, FluentAssertions, Testcontainers
- **Validation**: FluentValidation
- **Mapping**: AutoMapper

## 🗄️ Database Support

The application supports multiple databases through configuration:

- **SQL Server** (default)
- **PostgreSQL**
- **MySQL**
- **SQLite** (development)

## 📦 Quick Start

### Prerequisites
- .NET 8.0 SDK
- Docker (optional, for database)
- Visual Studio 2022 or VS Code

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Configure Database
Update `appsettings.json` in `WemDashboard.API`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=WemDashboard;Trusted_Connection=true;"
  },
  "DatabaseProvider": "SqlServer"
}
```

### 3. Run Migrations
```bash
dotnet ef database update --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
```

### 4. Start the API
```bash
dotnet run --project src/WemDashboard.API
```

### 5. Access Swagger UI
Open `https://localhost:7001/swagger` in your browser

## 🔧 Configuration

### Database Providers

#### SQL Server
```json
{
  "DatabaseProvider": "SqlServer",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=WemDashboard;Trusted_Connection=true;"
  }
}
```

#### PostgreSQL
```json
{
  "DatabaseProvider": "PostgreSQL",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=WemDashboard;Username=user;Password=pass"
  }
}
```

#### SQLite (Development)
```json
{
  "DatabaseProvider": "SQLite",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=wemdashboard.db"
  }
}
```

### JWT Configuration
```json
{
  "Jwt": {
    "Key": "your-super-secret-jwt-key-here-minimum-32-characters",
    "Issuer": "WemDashboard",
    "Audience": "WemDashboard",
    "ExpirationInMinutes": 60
  }
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Sites
- `GET /api/sites` - Get all sites
- `GET /api/sites/{id}` - Get site by ID
- `POST /api/sites` - Create new site
- `PUT /api/sites/{id}` - Update site
- `DELETE /api/sites/{id}` - Delete site
- `PATCH /api/sites/{id}/status` - Update site status

### Assets
- `GET /api/sites/{siteId}/assets` - Get site assets
- `GET /api/assets/{id}` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

### Power Data
- `GET /api/sites/{siteId}/power-data` - Get power data
- `POST /api/sites/{siteId}/power-data` - Add power data

### Analytics
- `GET /api/sites/{siteId}/analytics` - Get site analytics
- `GET /api/sites/{siteId}/metrics` - Get site metrics

## 🧪 Testing

### Run Unit Tests
```bash
dotnet test tests/WemDashboard.UnitTests/
```

### Run Integration Tests
```bash
dotnet test tests/WemDashboard.IntegrationTests/
```

### Run All Tests
```bash
dotnet test
```

## 🐳 Docker Support

### Build Docker Image
```bash
docker build -t wemdashboard-api .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

## 📊 Monitoring

### Health Checks
- `/health` - Application health
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

### Metrics
- Application metrics via built-in endpoints
- Database connection monitoring
- Custom business metrics

## 🔒 Security

- JWT token authentication
- HTTPS enforcement
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection headers

## 🚀 Deployment

### Cloud Deployment Options

1. **Azure App Service** with Azure SQL Database
2. **AWS Elastic Beanstalk** with RDS
3. **Google Cloud Run** with Cloud SQL
4. **Docker** to any cloud provider

### Environment Variables

```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection="your-connection-string"
Jwt__Key="your-jwt-secret-key"
Redis__ConnectionString="your-redis-connection"
```

## 📝 Development Guidelines

### Adding New Features
1. Create domain models in `Domain` project
2. Add business logic in `Application` project
3. Implement data access in `Infrastructure` project
4. Create API endpoints in `API` project
5. Write tests for all layers

### Code Style
- Follow Microsoft C# coding conventions
- Use meaningful names
- Keep methods small and focused
- Write comprehensive tests
- Document public APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
