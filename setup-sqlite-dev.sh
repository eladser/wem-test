#!/bin/bash

# 🗄️ WEM Dashboard - Enhanced SQLite Development Setup
# Perfect for development, testing, and GitHub publishing!

set -e  # Exit on any error

echo "🗄️ WEM Dashboard SQLite Development Setup"
echo "============================================="
echo "📦 Setting up SQLite with comprehensive data for development and testing..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ .NET 8.0 not found. Please install:${NC}"
    echo "   📥 Download: https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
fi

echo -e "${GREEN}✅ .NET $(dotnet --version) found${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install:${NC}"
    echo "   📥 Download: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
echo ""

echo -e "${BLUE}🔧 Configuring SQLite database...${NC}"

# Ensure we're in the right directory
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Navigate to API project
cd backend/src/WemDashboard.API

# Remove existing database if it exists
if [ -f "wemdashboard-dev.db" ]; then
    echo -e "${YELLOW}🗑️ Removing existing database...${NC}"
    rm -f wemdashboard-dev.db
    rm -f wemdashboard-dev.db-shm
    rm -f wemdashboard-dev.db-wal
fi

# Create comprehensive appsettings for SQLite development
cat > appsettings.Development.json << 'EOF'
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
EOF

echo -e "${GREEN}✅ SQLite development configuration created${NC}"

# Install/restore .NET packages
echo -e "${BLUE}📦 Installing .NET packages...${NC}"
dotnet restore --verbosity quiet

echo -e "${BLUE}🔨 Building the application...${NC}"
dotnet build --configuration Debug --verbosity quiet

echo -e "${BLUE}🌱 Creating and seeding the database...${NC}"
dotnet run --no-build &
API_PID=$!

# Wait for the API to start and seed the database
echo "⏳ Waiting for database initialization..."
sleep 10

# Stop the API
kill $API_PID 2>/dev/null || true
wait $API_PID 2>/dev/null || true

# Go back to project root
cd ../../../

# Setup frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install --silent

# Create .env.local for frontend if it doesn't exist
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_APP_NAME=WEM Dashboard
VITE_APP_VERSION=1.0.0
EOF
    echo -e "${GREEN}✅ Frontend environment configuration created${NC}"
fi

echo ""
echo -e "${GREEN}🎉 SQLite Development Environment Ready!${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}🚀 Quick Start Commands:${NC}"
echo ""
echo "1. 🖥️  Start the Backend (in terminal 1):"
echo "   cd backend/src/WemDashboard.API"
echo "   dotnet run"
echo ""
echo "2. 🌐 Start the Frontend (in terminal 2, from project root):"
echo "   npm run dev"
echo ""
echo "3. 🔐 Ready-to-Use Login Credentials:"
echo "   👨‍💼 Admin:    admin@wemdashboard.com    / Admin123!"
echo "   👩‍💼 Manager:  manager@wemdashboard.com  / Manager123!"
echo "   👨‍🔧 Operator: operator@wemdashboard.com / Operator123!"
echo "   👁️  Viewer:   viewer@wemdashboard.com   / Viewer123!"
echo "   🎯 Demo:     demo@wemdashboard.com     / Demo123!"
echo ""
echo -e "${GREEN}📊 Pre-loaded Sample Data:${NC}"
echo "   • 6 Energy Sites across the globe"
echo "     📍 California Solar Farm Alpha"
echo "     📍 Texas Wind & Solar Complex"
echo "     📍 Berlin Green Energy Hub (Maintenance)"
echo "     📍 Tokyo Bay Offshore Wind"
echo "     📍 Australian Outback Solar"
echo "     📍 Scottish Highlands Wind Farm"
echo ""
echo "   • 10 Energy Assets (Wind Turbines, Solar Panels, Inverters, Batteries)"
echo "   • 1,008 Hours of Realistic Power Data (7 days × 24 hours × 6 sites)"
echo "   • 7 Realistic Alerts (Success, Warning, Error, Info)"
echo "   • 5 User Accounts with different permission levels"
echo ""
echo -e "${GREEN}🗄️ SQLite Database Details:${NC}"
echo "   📄 File: backend/src/WemDashboard.API/wemdashboard-dev.db"
echo "   📊 Size: ~1MB with all sample data"
echo "   🔄 GitHub Ready: Database can be committed to repository"
echo "   🛠️  Reset: Delete .db file and re-run this script"
echo ""
echo -e "${YELLOW}🌐 Application URLs:${NC}"
echo "   🖥️  Backend API:     http://localhost:5000"
echo "   📚 API Documentation: http://localhost:5000/swagger"
echo "   🌐 Frontend App:    http://localhost:5173"
echo "   ❤️  Health Check:   http://localhost:5000/health"
echo ""
echo -e "${PURPLE}💡 Pro Development Tips:${NC}"
echo "   • Database persists between API restarts"
echo "   • Use SQLite Browser to inspect data directly"
echo "   • Hot reload works for both frontend and backend"
echo "   • All API endpoints documented in Swagger UI"
echo "   • JWT tokens expire after 60 minutes"
echo "   • CORS enabled for frontend development"
echo ""
echo -e "${GREEN}✨ Happy Coding! Your WEM Dashboard is ready for development!${NC}"
echo ""
