@echo off
echo 🧹 Repository Cleanup Script
echo ========================================
echo This will delete all the temporary fix files and scripts
echo.

set /p confirm="Are you sure you want to delete all temp files? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Cleanup cancelled
    pause
    exit /b 0
)

echo.
echo 🗑️  Deleting temporary fix files...

REM Delete all the Claude test files
if exist "claude-mcp-test.md" (
    del "claude-mcp-test.md"
    echo ✅ Deleted claude-mcp-test.md
)

REM Delete PostgreSQL fix guide files
if exist "postgresql-migration-fix-guide.md" (
    del "postgresql-migration-fix-guide.md"
    echo ✅ Deleted postgresql-migration-fix-guide.md
)

if exist "POSTGRESQL-FIX-COMPLETE.md" (
    del "POSTGRESQL-FIX-COMPLETE.md"
    echo ✅ Deleted POSTGRESQL-FIX-COMPLETE.md
)

if exist "POSTGRESQL-MIGRATION-COMPLETE-FIX.md" (
    del "POSTGRESQL-MIGRATION-COMPLETE-FIX.md"
    echo ✅ Deleted POSTGRESQL-MIGRATION-COMPLETE-FIX.md
)

if exist "FINAL-POSTGRESQL-FIX.md" (
    del "FINAL-POSTGRESQL-FIX.md"
    echo ✅ Deleted FINAL-POSTGRESQL-FIX.md
)

REM Delete duplicate DbContext files
if exist "DbContext-FIXED.cs" (
    del "DbContext-FIXED.cs"
    echo ✅ Deleted DbContext-FIXED.cs
)

if exist "WemDashboardDbContext-POSTGRESQL-FIXED.cs" (
    del "WemDashboardDbContext-POSTGRESQL-FIXED.cs"
    echo ✅ Deleted WemDashboardDbContext-POSTGRESQL-FIXED.cs
)

if exist "WemDashboardDbContext-COMPLETE-FIX.cs" (
    del "WemDashboardDbContext-COMPLETE-FIX.cs"
    echo ✅ Deleted WemDashboardDbContext-COMPLETE-FIX.cs
)

if exist "backend\src\WemDashboard.Infrastructure\Data\WemDashboardDbContext-FIXED.cs" (
    del "backend\src\WemDashboard.Infrastructure\Data\WemDashboardDbContext-FIXED.cs"
    echo ✅ Deleted backend DbContext-FIXED.cs
)

REM Delete postgres-fix directory
if exist "postgres-fix" (
    rmdir /s /q "postgres-fix"
    echo ✅ Deleted postgres-fix directory
)

REM Delete backend-fixes directory
if exist "backend-fixes" (
    rmdir /s /q "backend-fixes"
    echo ✅ Deleted backend-fixes directory
)

REM Delete test files
if exist "test-fix.txt" (
    del "test-fix.txt"
    echo ✅ Deleted test-fix.txt
)

REM Delete other temp files
if exist "fix-postgresql-migration.bat" (
    del "fix-postgresql-migration.bat"
    echo ✅ Deleted fix-postgresql-migration.bat
)

if exist "fix-postgresql-migration.sh" (
    del "fix-postgresql-migration.sh"
    echo ✅ Deleted fix-postgresql-migration.sh
)

echo.
echo ✅ Repository cleanup complete!
echo.
echo 📋 Files kept (these are useful):
echo - run-postgresql-fix.bat (automation script)
echo - run-postgresql-fix.sh (automation script for Linux/Mac)
echo - backend\src\WemDashboard.Infrastructure\Data\WemDashboardDbContext.cs (your FIXED DbContext)
echo.
echo 🗑️  All temporary and duplicate files have been removed!
echo.
set /p delete_self="Delete this cleanup script too? (y/N): "
if /i "%delete_self%"=="y" (
    echo Deleting cleanup script...
    timeout /t 2 /nobreak >nul
    del "%~f0"
) else (
    echo Cleanup script kept
    pause
)