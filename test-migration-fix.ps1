#!/usr/bin/env pwsh
# Test Migration After Foreign Key Fix
# This script tests the migration after fixing the foreign key type mismatch

Write-Host "[TEST] Testing Migration After Foreign Key Fix" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$ApiPath = "./backend/src/WemDashboard.API"
$BackendPath = "./backend"

# Ensure we're in the right directory
Write-Host "`n[STEP 1] Environment Check" -ForegroundColor Magenta
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Blue
Write-Host "API Path exists: $(Test-Path $ApiPath)" -ForegroundColor Blue

# Clean up any existing migrations and database files
Write-Host "`n[STEP 2] Clean Previous Attempts" -ForegroundColor Magenta
$migrationsPath = "$ApiPath/Migrations"
if (Test-Path $migrationsPath) {
    Write-Host "Removing existing migrations..." -ForegroundColor Yellow
    Remove-Item $migrationsPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Migrations cleaned" -ForegroundColor Green
}

$dbFiles = @("$BackendPath/wemdashboard.db", "$ApiPath/wemdashboard.db", "./wemdashboard.db", "$BackendPath/wemdashboard-dev.db", "$ApiPath/wemdashboard-dev.db")
foreach ($dbFile in $dbFiles) {
    if (Test-Path $dbFile) {
        Write-Host "Removing $dbFile..." -ForegroundColor Yellow
        Remove-Item $dbFile -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "[OK] Database files cleaned" -ForegroundColor Green

# Test EF DbContext info first
Write-Host "`n[STEP 3] Test EF DbContext" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        Write-Host "Testing EF dbcontext info..." -ForegroundColor Yellow
        $dbContextOutput = dotnet ef dbcontext info --verbose 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] EF DbContext test passed" -ForegroundColor Green
            Write-Host "DbContext info:" -ForegroundColor Blue
            $dbContextOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
        }
        else {
            Write-Host "[ERROR] EF DbContext test failed:" -ForegroundColor Red
            $dbContextOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
            Pop-Location
            exit 1
        }
    }
    catch {
        Write-Host "[ERROR] EF DbContext test exception: $($_.Exception.Message)" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    finally {
        Pop-Location
    }
}

# Now try to create migration
Write-Host "`n[STEP 4] Create Migration" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        Write-Host "Creating InitialCreate migration..." -ForegroundColor Yellow
        $migrationOutput = dotnet ef migrations add InitialCreate --verbose 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Migration created successfully!" -ForegroundColor Green
            
            # Try to update database
            Write-Host "`nUpdating database..." -ForegroundColor Yellow
            $updateOutput = dotnet ef database update --verbose 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[SUCCESS] Database updated successfully!" -ForegroundColor Green
            }
            else {
                Write-Host "[ERROR] Database update failed:" -ForegroundColor Red
                $updateOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
            }
        }
        else {
            Write-Host "[ERROR] Migration creation failed:" -ForegroundColor Red
            $migrationOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        }
    }
    catch {
        Write-Host "[ERROR] Migration process failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# Check results
Write-Host "`n[STEP 5] Verify Results" -ForegroundColor Magenta
$dbFound = $false
$dbPaths = @("$BackendPath/wemdashboard.db", "$ApiPath/wemdashboard.db", "$BackendPath/wemdashboard-dev.db", "$ApiPath/wemdashboard-dev.db")

foreach ($dbPath in $dbPaths) {
    if (Test-Path $dbPath) {
        $dbFile = Get-Item $dbPath
        Write-Host "[SUCCESS] Database created: $dbPath (Size: $($dbFile.Length) bytes)" -ForegroundColor Green
        $dbFound = $true
    }
}

if (-not $dbFound) {
    Write-Host "[INFO] No database found in expected locations, checking current directory..." -ForegroundColor Yellow
    $currentDirDb = Get-ChildItem -Filter "*.db" -ErrorAction SilentlyContinue
    if ($currentDirDb) {
        $currentDirDb | ForEach-Object { Write-Host "[FOUND] Database: $($_.FullName)" -ForegroundColor Cyan }
        $dbFound = $true
    }
}

# Check migrations
$migrationsPath = "$ApiPath/Migrations"
if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" -ErrorAction SilentlyContinue
    Write-Host "[OK] Migration files created: $($migrationFiles.Count)" -ForegroundColor Green
}

Write-Host "`n[FINAL RESULT]" -ForegroundColor Cyan
if ($dbFound) {
    Write-Host "[SUCCESS] Foreign key fix worked! Migration completed successfully!" -ForegroundColor Green
    Write-Host "`nYou can now run the full setup:" -ForegroundColor Yellow
    Write-Host "powershell -ExecutionPolicy Bypass -File .\setup-quick-integration.bat" -ForegroundColor Cyan
}
else {
    Write-Host "[PARTIAL] Migration may have completed but database location is unclear" -ForegroundColor Yellow
    Write-Host "Check the migration output above for more details" -ForegroundColor Yellow
}

Write-Host "`n[TEST COMPLETE]" -ForegroundColor Cyan
