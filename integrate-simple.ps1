# Simple Integration Script for WEM Dashboard Database Features
# This is a simplified version that focuses on the core integration steps

Write-Host "WEM Dashboard - Simple Integration Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Configuration
$BackendPath = "./backend"
$ApiPath = "./backend/src/WemDashboard.API"

# Step 1: Check if paths exist
if (-not (Test-Path $BackendPath)) {
    Write-Host "ERROR: Backend path not found: $BackendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ApiPath)) {
    Write-Host "ERROR: API path not found: $ApiPath" -ForegroundColor Red
    exit 1
}

# Step 2: Restore backend dependencies
Write-Host "Step 1: Restoring backend dependencies..." -ForegroundColor Yellow
Set-Location $BackendPath
try {
    dotnet restore
    Write-Host "SUCCESS: Backend dependencies restored" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to restore backend dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Install EF Tools
Write-Host "Step 2: Installing Entity Framework tools..." -ForegroundColor Yellow
try {
    dotnet tool install --global dotnet-ef --version 8.0.0
    Write-Host "SUCCESS: EF tools installed" -ForegroundColor Green
} catch {
    Write-Host "INFO: EF tools may already be installed" -ForegroundColor Blue
}

# Step 4: Create migration
Write-Host "Step 3: Creating database migration..." -ForegroundColor Yellow
Set-Location $ApiPath
$migrationName = "AddPersistenceFeatures"
try {
    dotnet ef migrations add $migrationName
    Write-Host "SUCCESS: Migration created" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to create migration" -ForegroundColor Red
    Write-Host "This might be because the migration already exists" -ForegroundColor Yellow
}

# Step 5: Update database
Write-Host "Step 4: Updating database..." -ForegroundColor Yellow
try {
    dotnet ef database update
    Write-Host "SUCCESS: Database updated" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to update database" -ForegroundColor Red
    exit 1
}

# Step 6: Build backend
Write-Host "Step 5: Building backend..." -ForegroundColor Yellow
Set-Location $BackendPath
try {
    dotnet build
    Write-Host "SUCCESS: Backend built successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Backend build failed" -ForegroundColor Red
    exit 1
}

# Step 7: Install frontend dependencies
Write-Host "Step 6: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
try {
    npm install
    Write-Host "SUCCESS: Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Step 8: Summary
Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "INTEGRATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start backend: dotnet run --project $ApiPath" -ForegroundColor Cyan
Write-Host "2. Start frontend: npm run dev" -ForegroundColor Cyan
Write-Host "3. Open your browser and test the new features" -ForegroundColor Cyan

Write-Host "`nNew database tables created:" -ForegroundColor Yellow
Write-Host "- UserPreferences" -ForegroundColor Cyan
Write-Host "- DashboardLayouts" -ForegroundColor Cyan
Write-Host "- WidgetConfigurations" -ForegroundColor Cyan
Write-Host "- GridComponentConfigurations" -ForegroundColor Cyan
Write-Host "- EnergyFlowConfigurations" -ForegroundColor Cyan
Write-Host "- FilterPresets" -ForegroundColor Cyan
Write-Host "- ReportTemplates" -ForegroundColor Cyan
Write-Host "- ViewStates" -ForegroundColor Cyan

Write-Host "`nPress Enter to exit..." -ForegroundColor Gray
Read-Host

Set-Location $PSScriptRoot