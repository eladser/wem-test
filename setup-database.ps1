# WEM Dashboard Database Setup Script
# Simple script to create fresh database with fixed schema

Write-Host "WEM Dashboard Database Setup" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$CurrentDir = Get-Location
Write-Host "Current directory: $CurrentDir" -ForegroundColor Gray

# Define paths
$ApiProjectPath = "$CurrentDir\backend\src\WemDashboard.API"
$InfraProjectPath = "$CurrentDir\backend\src\WemDashboard.Infrastructure"
$BackendPath = "$CurrentDir\backend"

Write-Host "API Project: $ApiProjectPath" -ForegroundColor Gray
Write-Host "Infrastructure: $InfraProjectPath" -ForegroundColor Gray
Write-Host ""

# Check if projects exist
if (!(Test-Path $ApiProjectPath)) {
    Write-Host "ERROR: API project not found at $ApiProjectPath" -ForegroundColor Red
    Write-Host "Make sure you're running this from the project root directory" -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path $InfraProjectPath)) {
    Write-Host "ERROR: Infrastructure project not found at $InfraProjectPath" -ForegroundColor Red
    exit 1
}

Write-Host "Projects found successfully" -ForegroundColor Green
Write-Host ""

# Clean up old files
Write-Host "Cleaning up old database files..." -ForegroundColor Yellow

$MigrationsDir = "$InfraProjectPath\Migrations"
if (Test-Path $MigrationsDir) {
    Remove-Item $MigrationsDir -Recurse -Force
    Write-Host "Removed old migrations" -ForegroundColor Green
}

# Remove database files
Get-ChildItem -Path $CurrentDir -Include "*.db" -Recurse | Remove-Item -Force
Write-Host "Removed old database files" -ForegroundColor Green
Write-Host ""

# Build solution
Write-Host "Building solution..." -ForegroundColor Yellow
Set-Location $BackendPath

$BuildOutput = dotnet build --verbosity quiet 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed:" -ForegroundColor Red
    Write-Host $BuildOutput -ForegroundColor White
    Set-Location $CurrentDir
    exit 1
}

Write-Host "Build successful" -ForegroundColor Green
Set-Location $CurrentDir
Write-Host ""

# Create migration
Write-Host "Creating fresh migration..." -ForegroundColor Yellow
Set-Location $InfraProjectPath

$MigrationOutput = dotnet ef migrations add InitialCreate --startup-project $ApiProjectPath 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Migration creation failed:" -ForegroundColor Red
    Write-Host $MigrationOutput -ForegroundColor White
    Set-Location $CurrentDir
    exit 1
}

Write-Host "Migration created successfully" -ForegroundColor Green
Write-Host ""

# Update database
Write-Host "Creating database..." -ForegroundColor Yellow

$UpdateOutput = dotnet ef database update --startup-project $ApiProjectPath 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database update failed:" -ForegroundColor Red
    Write-Host $UpdateOutput -ForegroundColor White
    Set-Location $CurrentDir
    exit 1
}

Write-Host "Database created successfully" -ForegroundColor Green
Set-Location $CurrentDir
Write-Host ""

# Verify
Write-Host "Verifying setup..." -ForegroundColor Yellow

$DatabaseFiles = Get-ChildItem -Path $CurrentDir -Include "*.db" -Recurse
if ($DatabaseFiles.Count -gt 0) {
    foreach ($DbFile in $DatabaseFiles) {
        Write-Host "Database found: $($DbFile.FullName)" -ForegroundColor Green
    }
} else {
    Write-Host "Warning: No database files found" -ForegroundColor Yellow
}

if (Test-Path $MigrationsDir) {
    $MigrationFiles = Get-ChildItem $MigrationsDir -Filter "*.cs"
    Write-Host "Migration files created: $($MigrationFiles.Count)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: start-backend.bat" -ForegroundColor White
Write-Host "2. Run: start-frontend.bat" -ForegroundColor White
Write-Host "3. Open: http://localhost:5173" -ForegroundColor White
Write-Host ""