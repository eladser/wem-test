#!/bin/bash

echo "🚀 Complete PostgreSQL Migration Script"
echo "========================================"
echo "This script will run the complete migration process"
echo ""

echo "⚠️  IMPORTANT: This will drop your existing database!"
read -p "Are you sure you want to proceed? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled"
    exit 0
fi

# Navigate to Infrastructure project
cd "$(dirname "$0")/backend/src/WemDashboard.Infrastructure" || {
    echo "❌ ERROR: Could not navigate to Infrastructure directory"
    exit 1
}

echo "📍 Current directory: $(pwd)"
echo ""

echo "🗑️  Step 1: Dropping existing database..."
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo ""

echo "🧹 Step 2: Removing existing migrations..."
dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo ""

echo "🆕 Step 3: Creating new PostgreSQL migration..."
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API --context WemDashboardDbContext
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to create migration"
    echo "Check your DbContext configuration"
    exit 1
fi
echo ""

echo "📊 Step 4: Applying migration to create database..."
dotnet ef database update --startup-project ../WemDashboard.API --context WemDashboardDbContext
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to apply migration"
    echo "Check your PostgreSQL connection"
    exit 1
fi
echo ""

echo "🔍 Step 5: Verifying migration success..."
dotnet ef migrations list --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo ""

echo "📋 Step 6: Checking database schema..."
dotnet ef dbcontext info --startup-project ../WemDashboard.API --context WemDashboardDbContext
echo ""

echo "✅ MIGRATION COMPLETE!"
echo "========================================"
echo ""
echo "🎉 Your PostgreSQL migration has been completed successfully!"
echo ""
echo "📊 What was created:"
echo "- Database: wemdashboard"
echo "- Tables: Sites, Devices, EnergyReadings, Alerts"
echo "- Proper PostgreSQL DateTime types (timestamp with time zone)"
echo "- Proper decimal precision (18,6)"
echo "- Foreign key relationships"
echo "- Performance indexes"
echo ""
echo "🚀 Next steps:"
echo "1. Start your backend API: cd ../WemDashboard.API && dotnet run"
echo "2. Start your frontend: npm run dev"
echo "3. Test creating sites, devices, and energy readings"
echo "4. Verify no DateTime casting errors in logs"
echo ""
echo "🎯 Your WEM Energy Dashboard is now ready with PostgreSQL!"
echo ""
read -p "Press any key to continue..."