#!/usr/bin/env pwsh
# Entity Framework Migration Diagnostic Script
# This script diagnoses and fixes EF migration issues

Write-Host "[EF DEBUG] Entity Framework Migration Debug" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

$ApiPath = "./backend/src/WemDashboard.API"
$BackendPath = "./backend"

Write-Host "`n[STEP 1] Environment Check" -ForegroundColor Magenta
Write-Host "API Path exists: $(Test-Path $ApiPath)" -ForegroundColor Blue
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Blue

# Check EF tools
Write-Host "`n[STEP 2] EF Tools Check" -ForegroundColor Magenta
try {
    $efVersion = dotnet ef --version 2>&1
    Write-Host "EF Tools version: $efVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] EF Tools not available: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Installing EF Tools..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef
}

# Test basic EF connection
Write-Host "`n[STEP 3] Test EF Connection" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        Write-Host "Testing EF dbcontext info..." -ForegroundColor Yellow
        $dbContextInfo = dotnet ef dbcontext info --verbose 2>&1
        
        Write-Host "DbContext Info Output:" -ForegroundColor Blue
        $dbContextInfo | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] EF DbContext is accessible" -ForegroundColor Green
        }
        else {
            Write-Host "[ERROR] EF DbContext has issues" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "[ERROR] EF DbContext test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# Check existing migrations
Write-Host "`n[STEP 4] Check Existing Migrations" -ForegroundColor Magenta
$migrationsPath = "$ApiPath/Migrations"
if (Test-Path $migrationsPath) {
    $migrations = Get-ChildItem $migrationsPath -Filter "*.cs" -ErrorAction SilentlyContinue
    Write-Host "Existing migrations: $($migrations.Count)" -ForegroundColor Blue
    $migrations | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Cyan }
    
    # If migrations exist, try to remove them
    if ($migrations.Count -gt 0) {
        $removeOld = Read-Host "Remove existing migrations and start fresh? (y/N)"
        if ($removeOld -eq 'y' -or $removeOld -eq 'Y') {
            Write-Host "Removing existing migrations..." -ForegroundColor Yellow
            Remove-Item $migrationsPath -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "[OK] Existing migrations removed" -ForegroundColor Green
        }
    }
}
else {
    Write-Host "No existing migrations directory" -ForegroundColor Blue
}

# Try to create new migration with verbose output
Write-Host "`n[STEP 5] Create New Migration" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        $migrationName = "InitialCreate_$(Get-Date -Format 'yyyyMMddHHmmss')"
        Write-Host "Creating migration: $migrationName" -ForegroundColor Yellow
        
        $migrationOutput = dotnet ef migrations add $migrationName --verbose 2>&1
        
        Write-Host "Migration Output:" -ForegroundColor Blue
        $migrationOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Migration created successfully" -ForegroundColor Green
            
            # Try to update database
            Write-Host "`nUpdating database..." -ForegroundColor Yellow
            $updateOutput = dotnet ef database update --verbose 2>&1
            
            Write-Host "Database Update Output:" -ForegroundColor Blue
            $updateOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Database updated successfully" -ForegroundColor Green
            }
            else {
                Write-Host "[ERROR] Database update failed" -ForegroundColor Red
            }
        }
        else {
            Write-Host "[ERROR] Migration creation failed" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "[ERROR] Migration process failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# Check if database file was created
Write-Host "`n[STEP 6] Verify Database Creation" -ForegroundColor Magenta
$dbPaths = @(
    "$BackendPath/wemdashboard.db",
    "$ApiPath/wemdashboard.db",
    "./wemdashboard.db"
)

foreach ($dbPath in $dbPaths) {
    if (Test-Path $dbPath) {
        $dbFile = Get-Item $dbPath
        Write-Host "[FOUND] Database at: $dbPath (Size: $($dbFile.Length) bytes)" -ForegroundColor Green
    }
    else {
        Write-Host "[NOT FOUND] No database at: $dbPath" -ForegroundColor Yellow
    }
}

# Manual migration steps
Write-Host "`n[MANUAL STEPS] If automated migration fails:" -ForegroundColor Yellow
Write-Host "1. cd backend/src/WemDashboard.API" -ForegroundColor Cyan
Write-Host "2. dotnet ef migrations add InitialCreate --verbose" -ForegroundColor Cyan
Write-Host "3. dotnet ef database update --verbose" -ForegroundColor Cyan
Write-Host "4. Check for database file in backend/ directory" -ForegroundColor Cyan

Write-Host "`n[DEBUG COMPLETE]" -ForegroundColor Cyan
Read-Host "Press Enter to continue..."
