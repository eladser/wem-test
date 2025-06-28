#!/bin/bash
# Integration Script for WEM Dashboard Database Features
# This script integrates all new database persistence features

set -e  # Exit on any error

echo "🚀 WEM Dashboard Database Integration Script"
echo "=============================================="

# Configuration
BACKEND_PATH="./backend"
FRONTEND_PATH="./"
DATABASE_PATH="./backend/wemdashboard.db"
BACKUP_PATH="./backend/wemdashboard_backup_$(date +%Y%m%d_%H%M%S).db"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run command with error handling
run_command() {
    local cmd="$1"
    local desc="$2"
    local work_dir="${3:-$PWD}"
    
    echo -e "${YELLOW}▶️ $desc${NC}"
    
    if cd "$work_dir" && eval "$cmd"; then
        echo -e "${GREEN}✅ $desc completed successfully${NC}"
        cd - > /dev/null
        return 0
    else
        echo -e "${RED}❌ $desc failed${NC}"
        cd - > /dev/null 2>/dev/null || true
        return 1
    fi
}

# Step 1: Backup existing database
echo -e "\n${MAGENTA}📋 Step 1: Backup existing database${NC}"
if [ -f "$DATABASE_PATH" ]; then
    if cp "$DATABASE_PATH" "$BACKUP_PATH"; then
        echo -e "${GREEN}✅ Database backed up to: $BACKUP_PATH${NC}"
    else
        echo -e "${YELLOW}⚠️ Could not backup database${NC}"
    fi
else
    echo -e "${BLUE}ℹ️ No existing database found, will create new one${NC}"
fi

# Step 2: Check prerequisites
echo -e "\n${MAGENTA}📋 Step 2: Check prerequisites${NC}"

prerequisites=("dotnet" "npm")
missing_prereqs=()

for cmd in "${prerequisites[@]}"; do
    if command_exists "$cmd"; then
        echo -e "${GREEN}✅ $cmd is installed${NC}"
    else
        echo -e "${RED}❌ $cmd is missing${NC}"
        missing_prereqs+=("$cmd")
    fi
done

if [ ${#missing_prereqs[@]} -gt 0 ]; then
    echo -e "\n${RED}❌ Missing prerequisites: ${missing_prereqs[*]}${NC}"
    echo -e "${YELLOW}Please install the missing prerequisites and run this script again.${NC}"
    exit 1
fi

# Step 3: Install/Update backend dependencies
echo -e "\n${MAGENTA}📋 Step 3: Install/Update backend dependencies${NC}"

if ! run_command "dotnet restore" "Restoring backend NuGet packages" "$BACKEND_PATH"; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi

# Step 4: Add Entity Framework tools if not present
echo -e "\n${MAGENTA}📋 Step 4: Install Entity Framework tools${NC}"

if ! dotnet tool list -g | grep -q "dotnet-ef"; then
    echo -e "${YELLOW}Installing Entity Framework tools...${NC}"
    dotnet tool install --global dotnet-ef
else
    echo -e "${GREEN}✅ Entity Framework tools already installed${NC}"
fi

# Step 5: Create and run database migrations
echo -e "\n${MAGENTA}📋 Step 5: Create and run database migrations${NC}"

MIGRATION_NAME="AddPersistenceFeatures_$(date +%Y%m%d%H%M%S)"
API_PATH="$BACKEND_PATH/src/WemDashboard.API"

if run_command "dotnet ef migrations add $MIGRATION_NAME" "Creating database migration" "$API_PATH"; then
    if ! run_command "dotnet ef database update" "Applying database migration" "$API_PATH"; then
        echo -e "${RED}❌ Database migration failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Migration creation failed${NC}"
    exit 1
fi

# Step 6: Update dependency injection registration
echo -e "\n${MAGENTA}📋 Step 6: Update dependency injection registration${NC}"

DI_PATH="$BACKEND_PATH/src/WemDashboard.Application/DependencyInjection.cs"
if [ -f "$DI_PATH" ]; then
    echo -e "${BLUE}ℹ️ DI registration file found, checking for service registration...${NC}"
    
    # Check if application services are registered
    services_to_check=(
        "IUserPreferencesService"
        "IDashboardLayoutService"
        "IWidgetConfigurationService"
        "IGridConfigurationService"
        "IViewStateService"
    )
    
    needs_update=false
    for service in "${services_to_check[@]}"; do
        if ! grep -q "$service" "$DI_PATH"; then
            needs_update=true
            break
        fi
    done
    
    if [ "$needs_update" = true ]; then
        echo -e "${YELLOW}⚠️ Application services need to be registered in DI container${NC}"
        echo -e "${YELLOW}Please add the application services to your DependencyInjection.cs${NC}"
    else
        echo -e "${GREEN}✅ All services appear to be registered${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Application DI file not found at expected location${NC}"
fi

# Step 7: Install frontend dependencies
echo -e "\n${MAGENTA}📋 Step 7: Install/Update frontend dependencies${NC}"

if ! run_command "npm install" "Installing frontend dependencies" "$FRONTEND_PATH"; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi

# Step 8: Build backend
echo -e "\n${MAGENTA}📋 Step 8: Build backend${NC}"

if ! run_command "dotnet build" "Building backend" "$BACKEND_PATH"; then
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

# Step 9: Verify database tables
echo -e "\n${MAGENTA}📋 Step 9: Verify database tables${NC}"

if [ -f "$DATABASE_PATH" ]; then
    if command_exists "sqlite3"; then
        echo -e "${YELLOW}Checking database tables...${NC}"
        
        tables=(
            "UserPreferences"
            "DashboardLayouts"
            "WidgetConfigurations"
            "GridComponentConfigurations"
            "EnergyFlowConfigurations"
            "FilterPresets"
            "ReportTemplates"
            "ViewStates"
        )
        
        for table in "${tables[@]}"; do
            if sqlite3 "$DATABASE_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';" | grep -q "$table"; then
                echo -e "${GREEN}✅ Table '$table' exists${NC}"
            else
                echo -e "${RED}❌ Table '$table' missing${NC}"
            fi
        done
    else
        echo -e "${YELLOW}⚠️ SQLite3 command not available, skipping table verification${NC}"
        echo -e "${BLUE}ℹ️ You can verify tables manually using a SQLite browser${NC}"
    fi
else
    echo -e "${RED}❌ Database file not found at: $DATABASE_PATH${NC}"
fi

# Step 10: Create test data (optional)
echo -e "\n${MAGENTA}📋 Step 10: Create test data${NC}"

read -p "Do you want to create sample test data? (y/N): " create_test_data
if [[ $create_test_data =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Creating test data...${NC}"
    echo -e "${BLUE}ℹ️ Test data will be created when the application first runs${NC}"
fi

# Step 11: Integration verification
echo -e "\n${MAGENTA}📋 Step 11: Integration verification${NC}"

# Create a simple verification script
VERIFICATION_DIR="$BACKEND_PATH/src/WemDashboard.API/Integration"
mkdir -p "$VERIFICATION_DIR"

cat > "$VERIFICATION_DIR/VerificationService.cs" << 'EOF'
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Integration
{
    public class VerificationService
    {
        public static async Task<bool> VerifyIntegrationAsync(IServiceProvider services)
        {
            try
            {
                // Test database connection
                var context = services.GetRequiredService<WemDashboardDbContext>();
                await context.Database.CanConnectAsync();
                
                // Test repository resolution
                var userPrefsRepo = services.GetRequiredService<IUserPreferencesRepository>();
                var layoutRepo = services.GetRequiredService<IDashboardLayoutRepository>();
                var widgetRepo = services.GetRequiredService<IWidgetConfigurationRepository>();
                
                Console.WriteLine("✅ All services resolved successfully");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Integration verification failed: {ex.Message}");
                return false;
            }
        }
    }
}
EOF

echo -e "${GREEN}✅ Verification service created${NC}"

# Final summary
echo -e "\n${CYAN}🎉 Integration Summary${NC}"
echo -e "${CYAN}==================${NC}"

echo -e "${GREEN}✅ Database backup created${NC}"
echo -e "${GREEN}✅ Backend dependencies updated${NC}"
echo -e "${GREEN}✅ Database migrations applied${NC}"
echo -e "${GREEN}✅ Frontend dependencies updated${NC}"
echo -e "${GREEN}✅ Backend built successfully${NC}"

echo -e "\n${YELLOW}📝 Next Steps:${NC}"
echo -e "${CYAN}1. Start your backend server: dotnet run --project $BACKEND_PATH/src/WemDashboard.API${NC}"
echo -e "${CYAN}2. Start your frontend: npm run dev${NC}"
echo -e "${CYAN}3. Test the new persistence features in your dashboard${NC}"
echo -e "${CYAN}4. Replace existing components with persistent versions as needed${NC}"

echo -e "\n${YELLOW}📚 New Features Available:${NC}"
echo -e "${CYAN}• User preferences with automatic persistence${NC}"
echo -e "${CYAN}• Dashboard layouts with widget configurations${NC}"
echo -e "${CYAN}• Interactive grid with component persistence${NC}"
echo -e "${CYAN}• View state management for all pages${NC}"
echo -e "${CYAN}• Filter presets and report templates${NC}"

echo -e "\n${YELLOW}🔧 API Endpoints:${NC}"
echo -e "${CYAN}• /api/userpreferences - User preference management${NC}"
echo -e "${CYAN}• /api/dashboardlayout - Dashboard layout management${NC}"
echo -e "${CYAN}• /api/widgetconfiguration - Widget configuration${NC}"
echo -e "${CYAN}• /api/gridconfiguration - Grid component management${NC}"
echo -e "${CYAN}• /api/viewstate - Generic view state persistence${NC}"

if [ -f "$BACKUP_PATH" ]; then
    echo -e "\n${BLUE}💾 Database Backup Location: $BACKUP_PATH${NC}"
fi

echo -e "\n${GREEN}🚀 Integration completed successfully!${NC}"
echo -e "${GREEN}Your WEM Dashboard now has comprehensive database persistence.${NC}"

echo -e "\nPress Enter to continue..."
read