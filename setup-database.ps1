#!/usr/bin/env pwsh

Write-Host "🔧 WEM Dashboard Database Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$RootPath = Get-Location
$ApiPath = Join-Path $RootPath "backend/src/WemDashboard.API"
$InfrastructurePath = Join-Path $RootPath "backend/src/WemDashboard.Infrastructure"

Write-Host "📍 Checking paths..." -ForegroundColor Yellow
Write-Host "   Root: $RootPath" -ForegroundColor Gray
Write-Host "   API: $ApiPath" -ForegroundColor Gray
Write-Host "   Infrastructure: $InfrastructurePath" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $ApiPath)) {
    Write-Host "❌ API project not found at: $ApiPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $InfrastructurePath)) {
    Write-Host "❌ Infrastructure project not found at: $InfrastructurePath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All paths found" -ForegroundColor Green
Write-Host ""

Write-Host "🧹 Cleaning up old files..." -ForegroundColor Yellow

# Remove existing migrations
$migrationsPath = Join-Path $InfrastructurePath "Migrations"
if (Test-Path $migrationsPath) {
    Remove-Item $migrationsPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Removed old migrations" -ForegroundColor Green
}

# Remove existing database files
$dbFiles = Get-ChildItem -Path $RootPath -Include "*.db" -Recurse -ErrorAction SilentlyContinue
foreach ($dbFile in $dbFiles) {
    Remove-Item $dbFile.FullName -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Removed: $($dbFile.Name)" -ForegroundColor Green
}

Write-Host ""

Write-Host "🔨 Building solution..." -ForegroundColor Yellow
Set-Location (Join-Path $RootPath "backend")

$buildResult = dotnet build --verbosity quiet 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build failed:" -ForegroundColor Red
    $buildResult | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
    Set-Location $RootPath
    exit 1
}

Set-Location $RootPath
Write-Host ""

Write-Host "📦 Creating migration..." -ForegroundColor Yellow
Set-Location $InfrastructurePath

$migrationResult = dotnet ef migrations add InitialCreate --startup-project $ApiPath --verbose 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Migration created successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Migration creation failed:" -ForegroundColor Red
    $migrationResult | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
    Set-Location $RootPath
    exit 1
}

Write-Host ""
Write-Host "🗄️ Creating database..." -ForegroundColor Yellow

$updateResult = dotnet ef database update --startup-project $ApiPath --verbose 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database created successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Database creation failed:" -ForegroundColor Red
    $updateResult | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
    Set-Location $RootPath
    exit 1
}

Set-Location $RootPath
Write-Host ""

Write-Host "🔍 Verifying setup..." -ForegroundColor Yellow

# Check for database file
$dbFiles = Get-ChildItem -Path $RootPath -Include "*.db" -Recurse -ErrorAction SilentlyContinue
if ($dbFiles.Count -gt 0) {
    foreach ($dbFile in $dbFiles) {
        Write-Host "   ✅ Database found: $($dbFile.FullName)" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️ No database files found" -ForegroundColor Yellow
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