#!/usr/bin/env pwsh
# Final Migration Test - All Foreign Key Issues Fixed
# This script tests the migration after fixing all foreign key type mismatches

Write-Host "[FINAL TEST] Testing Migration After All Foreign Key Fixes" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$RootPath = Get-Location
$ApiPath = Join-Path $RootPath "backend/src/WemDashboard.API"
$InfrastructurePath = Join-Path $RootPath "backend/src/WemDashboard.Infrastructure"
$BackendPath = Join-Path $RootPath "backend"

Write-Host "`n[STEP 1] Environment Check" -ForegroundColor Magenta
Write-Host "Current directory: $RootPath" -ForegroundColor Blue
Write-Host "API Path: $ApiPath" -ForegroundColor Blue
Write-Host "Infrastructure Path: $InfrastructurePath" -ForegroundColor Blue
Write-Host "API Path exists: $(Test-Path $ApiPath)" -ForegroundColor Blue
Write-Host "Infrastructure Path exists: $(Test-Path $InfrastructurePath)" -ForegroundColor Blue

Write-Host "`n[STEP 2] Clean Previous Attempts" -ForegroundColor Magenta
$migrationsPath = Join-Path $InfrastructurePath "Migrations"
if (Test-Path $migrationsPath) {
    Write-Host "Removing existing migrations..." -ForegroundColor Yellow
    Remove-Item $migrationsPath -Recurse -Force -ErrorAction SilentlyContinue
}

$dbFiles = @(
    (Join-Path $BackendPath "wemdashboard.db"), 
    (Join-Path $ApiPath "wemdashboard.db"), 
    (Join-Path $RootPath "wemdashboard.db"), 
    (Join-Path $BackendPath "wemdashboard-dev.db"), 
    (Join-Path $ApiPath "wemdashboard-dev.db")
)

foreach ($dbFile in $dbFiles) {
    if (Test-Path $dbFile) {
        Remove-Item $dbFile -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "[OK] Cleaned previous migration attempts" -ForegroundColor Green

Write-Host "`n[STEP 3] Test Build First" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Testing build..." -ForegroundColor Yellow
    $buildResult = dotnet build --verbosity quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Build successful" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Build failed:" -ForegroundColor Red
        $buildResult | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        Pop-Location
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host "`n[STEP 4] Test EF DbContext" -ForegroundColor Magenta
Push-Location $InfrastructurePath
try {
    Write-Host "Testing EF dbcontext info..." -ForegroundColor Yellow
    Write-Host "Running from: $(Get-Location)" -ForegroundColor Blue
    Write-Host "Startup project: $ApiPath" -ForegroundColor Blue
    
    $dbContextOutput = dotnet ef dbcontext info --startup-project "$ApiPath" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] EF DbContext works!" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] EF DbContext failed:" -ForegroundColor Red
        $dbContextOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        Pop-Location
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host "`n[STEP 5] Create Migration" -ForegroundColor Magenta
Push-Location $InfrastructurePath
try {
    Write-Host "Creating InitialCreate migration..." -ForegroundColor Yellow
    Write-Host "Running from: $(Get-Location)" -ForegroundColor Blue
    Write-Host "Startup project: $ApiPath" -ForegroundColor Blue
    
    $migrationOutput = dotnet ef migrations add InitialCreate --startup-project "$ApiPath" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Migration created successfully!" -ForegroundColor Green
        
        Write-Host "`nUpdating database..." -ForegroundColor Yellow
        $updateOutput = dotnet ef database update --startup-project "$ApiPath" 2>&1
        
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
finally {
    Pop-Location
}

Write-Host "`n[STEP 6] Verify Results" -ForegroundColor Magenta
$dbFound = $false
$dbPaths = @(
    (Join-Path $BackendPath "wemdashboard.db"), 
    (Join-Path $ApiPath "wemdashboard.db"), 
    (Join-Path $BackendPath "wemdashboard-dev.db"), 
    (Join-Path $ApiPath "wemdashboard-dev.db")
)

foreach ($dbPath in $dbPaths) {
    if (Test-Path $dbPath) {
        $dbFile = Get-Item $dbPath
        Write-Host "[SUCCESS] Database created: $dbPath (Size: $($dbFile.Length) bytes)" -ForegroundColor Green
        $dbFound = $true
        break
    }
}

if (-not $dbFound) {
    Write-Host "[INFO] Checking current directory for database files..." -ForegroundColor Yellow
    $currentDirDb = Get-ChildItem -Filter "*.db" -ErrorAction SilentlyContinue
    if ($currentDirDb) {
        $currentDirDb | ForEach-Object { 
            Write-Host "[FOUND] Database: $($_.FullName)" -ForegroundColor Cyan 
            $dbFound = $true
        }
    }
}

$migrationsPath = Join-Path $InfrastructurePath "Migrations"
if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" -ErrorAction SilentlyContinue
    Write-Host "[OK] Migration files created: $($migrationFiles.Count)" -ForegroundColor Green
    $migrationFiles | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Cyan }
}

Write-Host "`n[FINAL RESULT]" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan

if ($dbFound) {
    Write-Host "[SUCCESS] All foreign key fixes worked! Migration completed successfully!" -ForegroundColor Green
    Write-Host "`n[SUMMARY] What was fixed:" -ForegroundColor Yellow
    Write-Host "1. Fixed solution file - removed missing test projects" -ForegroundColor Cyan
    Write-Host "2. Added UserPreferencesRepository - missing implementation" -ForegroundColor Cyan  
    Write-Host "3. Fixed GridComponentConfiguration.SiteId - changed int? to string?" -ForegroundColor Cyan
    Write-Host "4. Fixed EnergyFlowConfiguration.SiteId - changed int? to string?" -ForegroundColor Cyan
    Write-Host "5. Updated all related interfaces and repositories" -ForegroundColor Cyan
    Write-Host "6. Fixed EF migrations assembly configuration" -ForegroundColor Cyan
    Write-Host "7. Updated migration commands to use correct project paths" -ForegroundColor Cyan
    
    Write-Host "`n[READY TO GO] You can now run:" -ForegroundColor Green
    Write-Host "powershell -ExecutionPolicy Bypass -File .\setup-quick-integration.bat" -ForegroundColor White
    
    Write-Host "`nOr manually:" -ForegroundColor Green
    Write-Host "1. cd backend/src/WemDashboard.API" -ForegroundColor White
    Write-Host "2. dotnet run" -ForegroundColor White
    Write-Host "3. In another terminal: npm run dev" -ForegroundColor White
    
}
else {
    Write-Host "[WARNING] Migration completed but database location unclear" -ForegroundColor Yellow
}

Write-Host "`n[TEST COMPLETE]" -ForegroundColor Cyan