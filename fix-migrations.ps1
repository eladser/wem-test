#!/usr/bin/env pwsh
# Simple EF Migration Fix Script
# This script fixes common EF migration issues

Write-Host "[EF FIX] Entity Framework Migration Fix" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

$ApiPath = "./backend/src/WemDashboard.API"
$BackendPath = "./backend"

# Ensure we're in the right directory
Write-Host "`n[STEP 1] Setup" -ForegroundColor Magenta
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Blue
Write-Host "API Path exists: $(Test-Path $ApiPath)" -ForegroundColor Blue

# Install EF tools if needed
Write-Host "`n[STEP 2] Ensure EF Tools" -ForegroundColor Magenta
try {
    $efCheck = dotnet ef --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing EF Tools..." -ForegroundColor Yellow
        dotnet tool install --global dotnet-ef
        Write-Host "[OK] EF Tools installed" -ForegroundColor Green
    }
    else {
        Write-Host "[OK] EF Tools already available" -ForegroundColor Green
    }
}
catch {
    Write-Host "Installing EF Tools..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef
}

# Clean up any existing migrations
Write-Host "`n[STEP 3] Clean Existing Migrations" -ForegroundColor Magenta
$migrationsPath = "$ApiPath/Migrations"
if (Test-Path $migrationsPath) {
    Write-Host "Removing existing migrations..." -ForegroundColor Yellow
    Remove-Item $migrationsPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Existing migrations removed" -ForegroundColor Green
}

# Remove existing database files
Write-Host "`n[STEP 4] Clean Database Files" -ForegroundColor Magenta
$dbFiles = @("$BackendPath/wemdashboard.db", "$ApiPath/wemdashboard.db", "./wemdashboard.db")
foreach ($dbFile in $dbFiles) {
    if (Test-Path $dbFile) {
        Write-Host "Removing $dbFile..." -ForegroundColor Yellow
        Remove-Item $dbFile -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "[OK] Database files cleaned" -ForegroundColor Green

# Create fresh migration
Write-Host "`n[STEP 5] Create Fresh Migration" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        Write-Host "Creating InitialCreate migration..." -ForegroundColor Yellow
        $migrationResult = dotnet ef migrations add InitialCreate 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Migration created successfully" -ForegroundColor Green
            
            # Update database  
            Write-Host "Updating database..." -ForegroundColor Yellow
            $updateResult = dotnet ef database update 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Database updated successfully" -ForegroundColor Green
            }
            else {
                Write-Host "[ERROR] Database update failed:" -ForegroundColor Red
                $updateResult | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
            }
        }
        else {
            Write-Host "[ERROR] Migration creation failed:" -ForegroundColor Red
            $migrationResult | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        }
    }
    catch {
        Write-Host "[ERROR] Migration process failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# Verify results
Write-Host "`n[STEP 6] Verify Results" -ForegroundColor Magenta
$dbPaths = @("$BackendPath/wemdashboard.db", "$ApiPath/wemdashboard.db")
$dbFound = $false

foreach ($dbPath in $dbPaths) {
    if (Test-Path $dbPath) {
        $dbFile = Get-Item $dbPath
        Write-Host "[SUCCESS] Database created: $dbPath (Size: $($dbFile.Length) bytes)" -ForegroundColor Green
        $dbFound = $true
    }
}

if (-not $dbFound) {
    Write-Host "[WARNING] Database file not found in expected locations" -ForegroundColor Yellow
    Write-Host "Checking current directory..." -ForegroundColor Yellow
    $currentDirDb = Get-ChildItem -Filter "*.db" -ErrorAction SilentlyContinue
    if ($currentDirDb) {
        $currentDirDb | ForEach-Object { Write-Host "[FOUND] Database: $($_.FullName)" -ForegroundColor Cyan }
    }
}

# Check migrations folder
$migrationsPath = "$ApiPath/Migrations"
if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" -ErrorAction SilentlyContinue
    Write-Host "[OK] Migration files created: $($migrationFiles.Count)" -ForegroundColor Green
    $migrationFiles | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Cyan }
}

Write-Host "`n[SUMMARY]" -ForegroundColor Cyan
if ($dbFound) {
    Write-Host "[SUCCESS] Migration completed successfully!" -ForegroundColor Green
    Write-Host "You can now run: dotnet run --project backend/src/WemDashboard.API" -ForegroundColor Yellow
}
else {
    Write-Host "[PARTIAL] Migration may have issues. Try manual steps:" -ForegroundColor Yellow
    Write-Host "1. cd backend/src/WemDashboard.API" -ForegroundColor Cyan
    Write-Host "2. dotnet ef migrations add InitialCreate" -ForegroundColor Cyan
    Write-Host "3. dotnet ef database update" -ForegroundColor Cyan
}

Write-Host "`n[COMPLETE]" -ForegroundColor Cyan
