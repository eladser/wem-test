# WEM Dashboard - Enhanced SQLite Development Setup (Windows)
# Perfect for development, testing, and GitHub publishing!

# Colors for output (Windows PowerShell compatible)
$Green = "Green"
$Blue = "Cyan" 
$Yellow = "Yellow"
$Red = "Red"
$Purple = "Magenta"

Write-Host "WEM Dashboard SQLite Development Setup" -ForegroundColor $Blue
Write-Host "=============================================" -ForegroundColor $Blue
Write-Host "Setting up SQLite with comprehensive data for development and testing..." -ForegroundColor $Green
Write-Host ""

# Check if .NET is installed
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET $dotnetVersion found" -ForegroundColor $Green
} catch {
    Write-Host "❌ .NET 8.0 not found. Please install:" -ForegroundColor $Red
    Write-Host "   Download: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor $Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor $Green
} catch {
    Write-Host "❌ Node.js not found. Please install:" -ForegroundColor $Red
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor $Yellow
    exit 1
}

Write-Host ""
Write-Host "Configuring SQLite database..." -ForegroundColor $Blue

# Ensure we're in the right directory
if (-not (Test-Path "backend")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor $Red
    exit 1
}

# Navigate to API project
Set-Location "backend\src\WemDashboard.API"

# Remove existing database if it exists
if (Test-Path "wemdashboard-dev.db") {
    Write-Host "Removing existing database..." -ForegroundColor $Yellow
    Remove-Item "wemdashboard-dev.db*" -Force
}

# Create comprehensive appsettings for SQLite development
Write-Host "Creating appsettings.Development.json..." -ForegroundColor $Blue

# Create the JSON content as a here-string
$appsettingsContent = @"
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning",
        "Microsoft.EntityFrameworkCore": "Information"
      }
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=wemdashboard-dev.db;Cache=Shared;Foreign Keys=true;",
    "Redis": ""
  },
  "DatabaseProvider": "SQLite",
  "Jwt": {
    "Key": "WemDashboard-SuperSecret-JWT-Key-For-Development-32Characters-Minimum",
    "Issuer": "WemDashboard",
    "Audience": "WemDashboard",
    "ExpirationInMinutes": 60
  },
  "AllowedHosts": "*"
}
"@

# Write the JSON content to file
$appsettingsContent | Out-File -FilePath "appsettings.Development.json" -Encoding UTF8

Write-Host "✅ SQLite development configuration created" -ForegroundColor $Green

# Install/restore .NET packages
Write-Host "Installing .NET packages..." -ForegroundColor $Blue
dotnet restore --verbosity quiet

Write-Host "Building the application..." -ForegroundColor $Blue
dotnet build --configuration Debug --verbosity quiet

Write-Host "Creating and seeding the database..." -ForegroundColor $Blue

# Start the API to seed the database
Write-Host "Starting API to initialize database..." -ForegroundColor $Yellow
$job = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    dotnet run --no-build
}

# Wait for the API to start and seed the database
Write-Host "Waiting for database initialization..." -ForegroundColor $Yellow
Start-Sleep -Seconds 15

# Stop the API
Stop-Job $job -Force
Remove-Job $job -Force

# Go back to project root
Set-Location "..\..\.."

# Setup frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor $Blue
npm install --silent

# Create .env.local for frontend if it does not exist
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating frontend environment configuration..." -ForegroundColor $Blue
    
    $envContent = @"
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_APP_NAME=WEM Dashboard
VITE_APP_VERSION=1.0.0
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Frontend environment configuration created" -ForegroundColor $Green
}

Write-Host ""
Write-Host "SQLite Development Environment Ready!" -ForegroundColor $Green
Write-Host "==============================================" -ForegroundColor $Green
Write-Host ""
Write-Host "Quick Start Commands:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "1. Start the Backend (in Command Prompt 1):" -ForegroundColor $Blue
Write-Host "   cd backend\src\WemDashboard.API" -ForegroundColor $Blue
Write-Host "   dotnet run" -ForegroundColor $Blue
Write-Host ""
Write-Host "2. Start the Frontend (in Command Prompt 2, from project root):" -ForegroundColor $Blue
Write-Host "   npm run dev" -ForegroundColor $Blue
Write-Host ""
Write-Host "3. Ready-to-Use Login Credentials:" -ForegroundColor $Purple
Write-Host "   Admin:    admin@wemdashboard.com    / Admin123!" -ForegroundColor $Green
Write-Host "   Manager:  manager@wemdashboard.com  / Manager123!" -ForegroundColor $Green
Write-Host "   Operator: operator@wemdashboard.com / Operator123!" -ForegroundColor $Green
Write-Host "   Viewer:   viewer@wemdashboard.com   / Viewer123!" -ForegroundColor $Green
Write-Host "   Demo:     demo@wemdashboard.com     / Demo123!" -ForegroundColor $Green
Write-Host ""
Write-Host "Pre-loaded Sample Data:" -ForegroundColor $Green
Write-Host "   • 6 Energy Sites across the globe" -ForegroundColor $Blue
Write-Host "     - California Solar Farm Alpha" -ForegroundColor $Blue
Write-Host "     - Texas Wind & Solar Complex" -ForegroundColor $Blue
Write-Host "     - Berlin Green Energy Hub (Maintenance)" -ForegroundColor $Blue
Write-Host "     - Tokyo Bay Offshore Wind" -ForegroundColor $Blue
Write-Host "     - Australian Outback Solar" -ForegroundColor $Blue
Write-Host "     - Scottish Highlands Wind Farm" -ForegroundColor $Blue
Write-Host ""
Write-Host "   • 10 Energy Assets (Wind Turbines, Solar Panels, Inverters, Batteries)" -ForegroundColor $Blue
Write-Host "   • 1,008 Hours of Realistic Power Data (7 days × 24 hours × 6 sites)" -ForegroundColor $Blue
Write-Host "   • 7 Realistic Alerts (Success, Warning, Error, Info)" -ForegroundColor $Blue
Write-Host "   • 5 User Accounts with different permission levels" -ForegroundColor $Blue
Write-Host ""
Write-Host "SQLite Database Details:" -ForegroundColor $Green
Write-Host "   File: backend\src\WemDashboard.API\wemdashboard-dev.db" -ForegroundColor $Blue
Write-Host "   Size: ~1MB with all sample data" -ForegroundColor $Blue
Write-Host "   GitHub Ready: Database can be committed to repository" -ForegroundColor $Blue
Write-Host "   Reset: Delete .db file and re-run this script" -ForegroundColor $Blue
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor $Yellow
Write-Host "   Backend API:     http://localhost:5000" -ForegroundColor $Blue
Write-Host "   API Documentation: http://localhost:5000/swagger" -ForegroundColor $Blue
Write-Host "   Frontend App:    http://localhost:5173" -ForegroundColor $Blue
Write-Host "   Health Check:   http://localhost:5000/health" -ForegroundColor $Blue
Write-Host ""
Write-Host "Pro Development Tips:" -ForegroundColor $Purple
Write-Host "   • Database persists between API restarts" -ForegroundColor $Blue
Write-Host "   • Use SQLite Browser to inspect data directly" -ForegroundColor $Blue
Write-Host "   • Hot reload works for both frontend and backend" -ForegroundColor $Blue
Write-Host "   • All API endpoints documented in Swagger UI" -ForegroundColor $Blue
Write-Host "   • JWT tokens expire after 60 minutes" -ForegroundColor $Blue
Write-Host "   • CORS enabled for frontend development" -ForegroundColor $Blue
Write-Host ""
Write-Host "Happy Coding! Your WEM Dashboard is ready for development!" -ForegroundColor $Green
Write-Host ""
