#!/usr/bin/env pwsh
# Diagnostic Script for WEM Dashboard Build Issues
# This script helps diagnose build and migration problems

Write-Host "[DIAGNOSTIC] WEM Dashboard Build Diagnostic" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Configuration
$BackendPath = "./backend"
$ApiPath = "$BackendPath/src/WemDashboard.API"
$SolutionFile = "$BackendPath/WemDashboard.sln"

Write-Host "`n[STEP 1] Environment Check" -ForegroundColor Magenta
Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Blue
Write-Host "Backend Path: $BackendPath" -ForegroundColor Blue
Write-Host "API Path: $ApiPath" -ForegroundColor Blue

# Check if paths exist
Write-Host "`n[PATH CHECK]" -ForegroundColor Yellow
Write-Host "Backend directory exists: $(Test-Path $BackendPath)" -ForegroundColor Blue
Write-Host "API project exists: $(Test-Path $ApiPath)" -ForegroundColor Blue
Write-Host "Solution file exists: $(Test-Path $SolutionFile)" -ForegroundColor Blue

# Check .NET version
Write-Host "`n[.NET VERSION]" -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host ".NET SDK Version: $dotnetVersion" -ForegroundColor Green
    
    # Check if .NET 8.0 is available
    $sdks = dotnet --list-sdks
    Write-Host "Available SDKs:" -ForegroundColor Blue
    $sdks | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
}
catch {
    Write-Host "[ERROR] Failed to get .NET version: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Entity Framework tools
Write-Host "`n[EF TOOLS CHECK]" -ForegroundColor Yellow
try {
    $efVersion = dotnet ef --version 2>$null
    if ($efVersion) {
        Write-Host "Entity Framework Tools: $efVersion" -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] Entity Framework tools not found" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[WARNING] Entity Framework tools check failed" -ForegroundColor Yellow
}

# Try to restore packages with detailed output
Write-Host "`n[STEP 2] Package Restore Diagnosis" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Running: dotnet restore --verbosity detailed" -ForegroundColor Yellow
    $restoreOutput = dotnet restore --verbosity detailed 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Package restore successful" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Package restore failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Restore output:" -ForegroundColor Yellow
        $restoreOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    }
}
catch {
    Write-Host "[ERROR] Exception during restore: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
}

# Try to build with detailed output
Write-Host "`n[STEP 3] Build Diagnosis" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Running: dotnet build --verbosity detailed" -ForegroundColor Yellow
    $buildOutput = dotnet build --verbosity detailed 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Build successful" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Build output:" -ForegroundColor Yellow
        $buildOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    }
}
catch {
    Write-Host "[ERROR] Exception during build: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
}

# Check migration files
Write-Host "`n[STEP 4] Migration Check" -ForegroundColor Magenta
$migrationsPath = "$ApiPath/Migrations"
Write-Host "Migrations directory: $migrationsPath" -ForegroundColor Blue
Write-Host "Migrations directory exists: $(Test-Path $migrationsPath)" -ForegroundColor Blue

if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" 2>$null
    Write-Host "Migration files found: $($migrationFiles.Count)" -ForegroundColor Blue
    $migrationFiles | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Cyan }
}

# Try EF commands diagnosis
Write-Host "`n[STEP 5] Entity Framework Diagnosis" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        Write-Host "Testing EF migrations list..." -ForegroundColor Yellow
        $migrationsList = dotnet ef migrations list 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] EF migrations command works" -ForegroundColor Green
            Write-Host "Existing migrations:" -ForegroundColor Blue
            $migrationsList | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
        }
        else {
            Write-Host "[ERROR] EF migrations list failed with exit code: $LASTEXITCODE" -ForegroundColor Red
            Write-Host "EF output:" -ForegroundColor Yellow
            $migrationsList | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        }
    }
    catch {
        Write-Host "[ERROR] Exception during EF diagnosis: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# Check project references
Write-Host "`n[STEP 6] Project References Check" -ForegroundColor Magenta
$projectDirs = @(
    "WemDashboard.API",
    "WemDashboard.Application", 
    "WemDashboard.Domain",
    "WemDashboard.Infrastructure",
    "WemDashboard.Shared"
)

foreach ($projectDir in $projectDirs) {
    $projectPath = "$BackendPath/src/$projectDir"
    $csprojFile = "$projectPath/$projectDir.csproj"
    
    Write-Host "Project: $projectDir" -ForegroundColor Blue
    Write-Host "  Directory exists: $(Test-Path $projectPath)" -ForegroundColor Cyan
    Write-Host "  .csproj exists: $(Test-Path $csprojFile)" -ForegroundColor Cyan
}

# Summary and recommendations
Write-Host "`n[RECOMMENDATIONS]" -ForegroundColor Yellow
Write-Host "Based on the diagnostic results above:" -ForegroundColor Cyan

Write-Host "`n1. If package restore failed:" -ForegroundColor Green
Write-Host "   - Check your internet connection" -ForegroundColor White
Write-Host "   - Clear NuGet cache: dotnet nuget locals all --clear" -ForegroundColor White
Write-Host "   - Try restoring from the solution file: dotnet restore WemDashboard.sln" -ForegroundColor White

Write-Host "`n2. If build failed:" -ForegroundColor Green
Write-Host "   - Check the detailed build output above for specific errors" -ForegroundColor White
Write-Host "   - Look for missing using statements or namespace issues" -ForegroundColor White
Write-Host "   - Ensure all project references are correct" -ForegroundColor White

Write-Host "`n3. If EF migrations failed:" -ForegroundColor Green
Write-Host "   - Make sure the build is successful first" -ForegroundColor White
Write-Host "   - Check that DbContext is properly configured" -ForegroundColor White
Write-Host "   - Verify connection string in appsettings.json" -ForegroundColor White

Write-Host "`n4. Manual steps to try:" -ForegroundColor Green
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   dotnet clean" -ForegroundColor White
Write-Host "   dotnet restore" -ForegroundColor White
Write-Host "   dotnet build" -ForegroundColor White
Write-Host "   cd src/WemDashboard.API" -ForegroundColor White
Write-Host "   dotnet ef migrations add InitialCreate" -ForegroundColor White
Write-Host "   dotnet ef database update" -ForegroundColor White

Write-Host "`n[DIAGNOSTIC COMPLETE]" -ForegroundColor Cyan
Read-Host "Press Enter to continue..."
