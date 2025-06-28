#!/usr/bin/env pwsh
# Simple Database Setup Script
# This script creates a fresh database with the fixed schema

Write-Host "🔧 WEM Dashboard Database Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$RootPath = Get-Location
$ApiPath = Join-Path $RootPath "backend/src/WemDashboard.API"
$InfrastructurePath = Join-Path $RootPath "backend/src/WemDashboard.Infrastructure"

Write-Host "📍 Paths:" -ForegroundColor Yellow
Write-Host "   Root: $RootPath" -ForegroundColor Gray
Write-Host "   API: $ApiPath" -ForegroundColor Gray
Write-Host "   Infrastructure: $InfrastructurePath" -ForegroundColor Gray
Write-Host ""

# Check if paths exist
if (-not (Test-Path $ApiPath)) {
    Write-Host "❌ API project not found at: $ApiPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $InfrastructurePath)) {
    Write-Host "❌ Infrastructure project not found at: $InfrastructurePath" -ForegroundColor Red
    exit 1
}

Write-Host "🧹 Cleaning up old migrations and database files..." -ForegroundColor Yellow

# Remove existing migrations
$migrationsPath = Join-Path $InfrastructurePath "Migrations"
if (Test-Path $migrationsPath) {
    Remove-Item $migrationsPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Removed old migrations" -ForegroundColor Green
}

# Remove existing database files
$dbFiles = @(
    (Join-Path $ApiPath "*.db"),
    (Join-Path $RootPath "*.db"),
    (Join-Path $RootPath "backend" "*.db")
)

foreach ($dbPattern in $dbFiles) {
    Get-ChildItem -Path $dbPattern -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
}

Write-Host "   ✅ Removed old database files" -ForegroundColor Green
Write-Host ""

Write-Host "🔨 Building solution..." -ForegroundColor Yellow
Push-Location (Join-Path $RootPath "backend")
try {
    $buildResult = dotnet build --verbosity quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Build successful" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ Build failed:" -ForegroundColor Red
        $buildResult | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
        Pop-Location
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "📦 Creating fresh migration..." -ForegroundColor Yellow

Push-Location $InfrastructurePath
try {
    $migrationOutput = dotnet ef migrations add InitialCreate --startup-project "$ApiPath" --verbose 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Migration created successfully" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🗄️ Creating database..." -ForegroundColor Yellow
        $updateOutput = dotnet ef database update --startup-project "$ApiPath" --verbose 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Database created successfully" -ForegroundColor Green
        }
        else {
            Write-Host "   ❌ Database creation failed:" -ForegroundColor Red
            $updateOutput | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
            Pop-Location
            exit 1
        }
    }
    else {
        Write-Host "   ❌ Migration creation failed:" -ForegroundColor Red
        $migrationOutput | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
        Pop-Location
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "🔍 Verifying setup..." -ForegroundColor Yellow

# Check for database file
Get-ChildItem -Path $RootPath -Include "*.db" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "   ✅ Database found: $($_.FullName)" -ForegroundColor Green
}

# Check for migration files
$migrationsPath = Join-Path $InfrastructurePath "Migrations"
if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" -ErrorAction SilentlyContinue
    if ($migrationFiles.Count -gt 0) {
        Write-Host "   ✅ Migration files created: $($migrationFiles.Count)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: start-backend.bat" -ForegroundColor White
Write-Host "2. Run: start-frontend.bat (in new terminal)" -ForegroundColor White
Write-Host "3. Access: http://localhost:5173" -ForegroundColor White
Write-Host ""