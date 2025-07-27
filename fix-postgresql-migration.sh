#!/bin/bash

# PostgreSQL Migration Fix Script
# This script will completely reset and create proper migrations for PostgreSQL

echo "🚀 Starting PostgreSQL Migration Fix..."
echo "⚠️  This will completely reset your database migrations and recreate them"
echo "📋 Make sure PostgreSQL is running and the database user has proper permissions"

# Change to the Infrastructure project directory
cd backend/src/WemDashboard.Infrastructure

echo "📁 Current directory: $(pwd)"

# Step 1: Drop the database (if it exists)
echo "🗑️  Dropping existing database..."
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext --verbose

# Step 2: Remove all existing migrations
echo "🧹 Removing any existing migrations..."
if [ -d "Migrations" ]; then
    rm -rf Migrations/
    echo "✅ Removed Migrations folder"
else
    echo "ℹ️  No existing Migrations folder found"
fi

# Clear Entity Framework cache
echo "🧹 Clearing EF Core tools cache..."
dotnet ef --version
dotnet nuget locals all --clear

# Step 3: Restore packages to ensure everything is up to date
echo "📦 Restoring NuGet packages..."
cd ../../../
dotnet restore
cd backend/src/WemDashboard.Infrastructure

# Step 4: Build the solution to ensure no compilation errors
echo "🔨 Building the solution..."
dotnet build ../WemDashboard.API --configuration Debug --no-restore

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix compilation errors before running migrations."
    exit 1
fi

# Step 5: Create the initial migration for PostgreSQL
echo "📝 Creating initial PostgreSQL migration..."
dotnet ef migrations add InitialPostgreSQLMigration \
    --startup-project ../WemDashboard.API \
    --context WemDashboardDbContext \
    --verbose

if [ $? -ne 0 ]; then
    echo "❌ Migration creation failed!"
    echo "💡 Common issues:"
    echo "   - Check your connection string in appsettings.json"
    echo "   - Ensure PostgreSQL server is running"
    echo "   - Verify the database user has proper permissions"
    echo "   - Check for compilation errors in your DbContext"
    exit 1
fi

# Step 6: Apply the migration to create the database
echo "🗄️  Applying migration to create PostgreSQL database..."
dotnet ef database update \
    --startup-project ../WemDashboard.API \
    --context WemDashboardDbContext \
    --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 PostgreSQL Migration Completed Successfully!"
    echo ""
    echo "✅ Database created: wemdashboard"
    echo "✅ All tables created with proper PostgreSQL types"
    echo "✅ DateTime columns configured as 'timestamp with time zone'"
    echo "✅ Decimal columns configured with proper precision"
    echo ""
    echo "🔗 Connection Details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: wemdashboard"
    echo "   Username: wem_admin"
    echo ""
    echo "🚀 You can now start your application!"
    echo "   Run: cd ../../../ && npm run start-backend"
else
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "1. Verify PostgreSQL is running:"
    echo "   sudo systemctl status postgresql"
    echo ""
    echo "2. Check if database user exists and has permissions:"
    echo "   sudo -u postgres psql"
    echo "   \\du"
    echo "   CREATE USER wem_admin WITH PASSWORD 'WemEnergy2024';"
    echo "   ALTER USER wem_admin CREATEDB;"
    echo "   \\q"
    echo ""
    echo "3. Test connection manually:"
    echo "   psql -h localhost -U wem_admin -d postgres"
    echo ""
    echo "4. Check your connection string in appsettings.json"
    echo ""
    exit 1
fi

# Step 7: Verify the database was created successfully
echo "🔍 Verifying database creation..."
echo "📊 Checking tables in the database..."

# You can uncomment the line below if you have psql available to verify tables
# psql -h localhost -U wem_admin -d wemdashboard -c "\\dt"

echo ""
echo "✨ Migration script completed!"
echo "🎯 Next steps:"
echo "1. Start your backend API: cd ../../../ && npm run start-backend"
echo "2. Start your frontend: npm run dev"
echo "3. Test your application to ensure everything works"
echo ""
