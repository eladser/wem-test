#!/bin/bash

echo "🧹 Repository Cleanup Script"
echo "========================================"
echo "This will delete all the temporary fix files and scripts"
echo ""

read -p "Are you sure you want to delete all temp files? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 0
fi

echo ""
echo "🗑️  Deleting temporary fix files..."

# Delete all the Claude test files
if [ -f "claude-mcp-test.md" ]; then
    rm "claude-mcp-test.md"
    echo "✅ Deleted claude-mcp-test.md"
fi

# Delete PostgreSQL fix guide files
if [ -f "postgresql-migration-fix-guide.md" ]; then
    rm "postgresql-migration-fix-guide.md"
    echo "✅ Deleted postgresql-migration-fix-guide.md"
fi

if [ -f "POSTGRESQL-FIX-COMPLETE.md" ]; then
    rm "POSTGRESQL-FIX-COMPLETE.md"
    echo "✅ Deleted POSTGRESQL-FIX-COMPLETE.md"
fi

if [ -f "POSTGRESQL-MIGRATION-COMPLETE-FIX.md" ]; then
    rm "POSTGRESQL-MIGRATION-COMPLETE-FIX.md"
    echo "✅ Deleted POSTGRESQL-MIGRATION-COMPLETE-FIX.md"
fi

if [ -f "FINAL-POSTGRESQL-FIX.md" ]; then
    rm "FINAL-POSTGRESQL-FIX.md"
    echo "✅ Deleted FINAL-POSTGRESQL-FIX.md"
fi

# Delete duplicate DbContext files
if [ -f "DbContext-FIXED.cs" ]; then
    rm "DbContext-FIXED.cs"
    echo "✅ Deleted DbContext-FIXED.cs"
fi

if [ -f "WemDashboardDbContext-POSTGRESQL-FIXED.cs" ]; then
    rm "WemDashboardDbContext-POSTGRESQL-FIXED.cs"
    echo "✅ Deleted WemDashboardDbContext-POSTGRESQL-FIXED.cs"
fi

if [ -f "WemDashboardDbContext-COMPLETE-FIX.cs" ]; then
    rm "WemDashboardDbContext-COMPLETE-FIX.cs"
    echo "✅ Deleted WemDashboardDbContext-COMPLETE-FIX.cs"
fi

if [ -f "backend/src/WemDashboard.Infrastructure/Data/WemDashboardDbContext-FIXED.cs" ]; then
    rm "backend/src/WemDashboard.Infrastructure/Data/WemDashboardDbContext-FIXED.cs"
    echo "✅ Deleted backend DbContext-FIXED.cs"
fi

# Delete postgres-fix directory
if [ -d "postgres-fix" ]; then
    rm -rf "postgres-fix"
    echo "✅ Deleted postgres-fix directory"
fi

# Delete backend-fixes directory
if [ -d "backend-fixes" ]; then
    rm -rf "backend-fixes"
    echo "✅ Deleted backend-fixes directory"
fi

# Delete test files
if [ -f "test-fix.txt" ]; then
    rm "test-fix.txt"
    echo "✅ Deleted test-fix.txt"
fi

# Delete other temp files
if [ -f "fix-postgresql-migration.bat" ]; then
    rm "fix-postgresql-migration.bat"
    echo "✅ Deleted fix-postgresql-migration.bat"
fi

if [ -f "fix-postgresql-migration.sh" ]; then
    rm "fix-postgresql-migration.sh"
    echo "✅ Deleted fix-postgresql-migration.sh"
fi

echo ""
echo "✅ Repository cleanup complete!"
echo ""
echo "📋 Files kept (these are useful):"
echo "- run-postgresql-fix.bat (automation script)"
echo "- run-postgresql-fix.sh (automation script for Linux/Mac)"
echo "- backend/src/WemDashboard.Infrastructure/Data/WemDashboardDbContext.cs (your FIXED DbContext)"
echo ""
echo "🗑️  All temporary and duplicate files have been removed!"
echo ""
read -p "Delete this cleanup script too? (y/N): " delete_self
if [[ "$delete_self" =~ ^[Yy]$ ]]; then
    echo "Deleting cleanup script..."
    rm "$0"
else
    echo "Cleanup script kept"
fi