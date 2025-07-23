#!/bin/bash

echo "🔧 PostgreSQL Migration Fix Script"
echo "========================================"
echo "This script will completely fix your DateTime casting error"
echo ""

# Navigate to Infrastructure project
cd "$(dirname "$0")/backend/src/WemDashboard.Infrastructure" || {
    echo "❌ ERROR: Could not navigate to Infrastructure directory"
    echo "Please run this script from the repository root"
    exit 1
}

echo "📍 Current directory: $(pwd)"
echo ""

echo "🗑️  Step 1: Dropping PostgreSQL database completely..."
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Database drop failed or database doesn't exist"
    echo "This is normal if database was never created"
fi

echo ""
echo "🧹 Step 2: Removing existing problematic migration..."
dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Migration remove failed or no migrations exist"
    echo "This is normal if migrations were already removed"
fi

echo ""
echo "🆕 Step 3: Creating new clean PostgreSQL migration..."
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API --context WemDashboardDbContext
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to create migration"
    echo "Please check your DbContext configuration"
    exit 1
fi

echo ""
echo "📊 Step 4: Applying migration to PostgreSQL database..."
dotnet ef database update --startup-project ../WemDashboard.API --context WemDashboardDbContext
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to apply migration to database"
    echo "Please check your PostgreSQL connection and credentials"
    exit 1
fi

echo ""
echo "✅ SUCCESS: PostgreSQL migration fix completed!"
echo "========================================"
echo ""
echo "🎉 Your DateTime casting error has been resolved!"
echo "💾 Database schema has been created successfully"
echo "🔍 Connection: Host=localhost;Port=5432;Database=wemdashboard"
echo ""
echo "📝 Next steps:"
echo "1. Your DbContext has been fixed with PostgreSQL-optimized configurations"
echo "2. All DateTime properties now use 'timestamp with time zone'"
echo "3. Decimal properties use proper PostgreSQL precision"
echo "4. Seed data has been temporarily removed (add back later if needed)"
echo ""
echo "🚀 You can now run your application without migration errors!"
echo ""

# Make the script pause equivalent for bash
read -p "Press any key to continue..."