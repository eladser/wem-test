#!/usr/bin/env pwsh
# Fix and Clean Build Script for WEM Dashboard
# This script fixes all build issues and makes the solution buildable

Write-Host "[FIX] WEM Dashboard Build Fix Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Configuration
$BackendPath = "./backend"
$SolutionFile = "$BackendPath/WemDashboard.sln"
$ApiPath = "$BackendPath/src/WemDashboard.API"

Write-Host "`n[STEP 1] Verify Solution Structure" -ForegroundColor Magenta
Write-Host "Backend directory: $(Test-Path $BackendPath)" -ForegroundColor Blue
Write-Host "Solution file: $(Test-Path $SolutionFile)" -ForegroundColor Blue
Write-Host "API project: $(Test-Path $ApiPath)" -ForegroundColor Blue

# Step 1: Clean everything
Write-Host "`n[STEP 2] Clean Solution" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Cleaning solution..." -ForegroundColor Yellow
    
    # Remove bin and obj folders
    Get-ChildItem -Path . -Recurse -Directory -Name "bin" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Get-ChildItem -Path . -Recurse -Directory -Name "obj" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    
    # Clean using dotnet
    $cleanOutput = dotnet clean 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Solution cleaned successfully" -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] Clean had issues but continuing..." -ForegroundColor Yellow
        Write-Host "Clean output: $cleanOutput" -ForegroundColor White
    }
}
catch {
    Write-Host "[WARNING] Clean exception: $($_.Exception.Message)" -ForegroundColor Yellow
}
finally {
    Pop-Location
}

# Step 2: Clear NuGet cache
Write-Host "`n[STEP 3] Clear NuGet Cache" -ForegroundColor Magenta
try {
    Write-Host "Clearing NuGet cache..." -ForegroundColor Yellow
    dotnet nuget locals all --clear
    Write-Host "[OK] NuGet cache cleared" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] NuGet cache clear failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 3: Restore packages
Write-Host "`n[STEP 4] Restore Packages" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Restoring packages..." -ForegroundColor Yellow
    $restoreOutput = dotnet restore 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Packages restored successfully" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Package restore failed" -ForegroundColor Red
        Write-Host "Restore output:" -ForegroundColor Yellow
        $restoreOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        
        # Try individual project restore
        Write-Host "Trying individual project restores..." -ForegroundColor Yellow
        $projects = @(
            "src/WemDashboard.Domain/WemDashboard.Domain.csproj",
            "src/WemDashboard.Shared/WemDashboard.Shared.csproj",
            "src/WemDashboard.Application/WemDashboard.Application.csproj",
            "src/WemDashboard.Infrastructure/WemDashboard.Infrastructure.csproj",
            "src/WemDashboard.API/WemDashboard.API.csproj"
        )
        
        foreach ($project in $projects) {
            if (Test-Path $project) {
                Write-Host "Restoring $project..." -ForegroundColor Cyan
                dotnet restore $project
            }
        }
    }
}
catch {
    Write-Host "[ERROR] Restore exception: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
}

# Step 4: Build solution
Write-Host "`n[STEP 5] Build Solution" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Building solution..." -ForegroundColor Yellow
    $buildOutput = dotnet build --no-restore 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Solution built successfully" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Build failed" -ForegroundColor Red
        Write-Host "Build output:" -ForegroundColor Yellow
        $buildOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        
        # Try building projects individually
        Write-Host "`nTrying individual project builds..." -ForegroundColor Yellow
        $projects = @(
            "src/WemDashboard.Domain/WemDashboard.Domain.csproj",
            "src/WemDashboard.Shared/WemDashboard.Shared.csproj",
            "src/WemDashboard.Application/WemDashboard.Application.csproj",
            "src/WemDashboard.Infrastructure/WemDashboard.Infrastructure.csproj",
            "src/WemDashboard.API/WemDashboard.API.csproj"
        )
        
        foreach ($project in $projects) {
            if (Test-Path $project) {
                Write-Host "Building $project..." -ForegroundColor Cyan
                $projectBuildOutput = dotnet build $project --no-restore 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[OK] $project built successfully" -ForegroundColor Green
                }
                else {
                    Write-Host "[ERROR] $project build failed" -ForegroundColor Red
                    $projectBuildOutput | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
                }
            }
        }
    }
}
catch {
    Write-Host "[ERROR] Build exception: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
}

# Step 5: Check if migrations exist
Write-Host "`n[STEP 6] Check Migrations" -ForegroundColor Magenta
$migrationsPath = "$ApiPath/Migrations"
if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" -ErrorAction SilentlyContinue
    Write-Host "Existing migrations found: $($migrationFiles.Count)" -ForegroundColor Blue
    $migrationFiles | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Cyan }
}
else {
    Write-Host "No migrations directory found" -ForegroundColor Blue
}

# Step 6: Test EF commands (only if build succeeded)
Write-Host "`n[STEP 7] Test Entity Framework Commands" -ForegroundColor Magenta
if (Test-Path $ApiPath) {
    Push-Location $ApiPath
    try {
        Write-Host "Testing EF migrations list..." -ForegroundColor Yellow
        $efListOutput = dotnet ef migrations list 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] EF commands work" -ForegroundColor Green
            Write-Host "Existing migrations:" -ForegroundColor Blue
            $efListOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
        }
        else {
            Write-Host "[INFO] EF migrations list output:" -ForegroundColor Yellow
            $efListOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
        }
    }
    catch {
        Write-Host "[WARNING] EF test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    finally {
        Pop-Location
    }
}

# Step 7: Summary and next steps
Write-Host "`n[SUMMARY]" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan

$success = $true
if (Test-Path "$BackendPath/src/WemDashboard.API/bin") {
    Write-Host "[OK] API project compiled successfully" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] API project did not compile" -ForegroundColor Red
    $success = $false
}

if ($success) {
    Write-Host "`n[SUCCESS] Solution is now buildable!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Run migrations: cd backend/src/WemDashboard.API && dotnet ef migrations add InitialCreate" -ForegroundColor Cyan
    Write-Host "2. Update database: dotnet ef database update" -ForegroundColor Cyan
    Write-Host "3. Run the API: dotnet run" -ForegroundColor Cyan
}
else {
    Write-Host "`n[HELP] If build still fails:" -ForegroundColor Yellow
    Write-Host "1. Check .NET 8.0 SDK is installed: dotnet --list-sdks" -ForegroundColor Cyan
    Write-Host "2. Try manual restore: dotnet restore WemDashboard.sln" -ForegroundColor Cyan
    Write-Host "3. Check for missing files or corrupted packages" -ForegroundColor Cyan
    Write-Host "4. Try deleting all bin/obj folders manually" -ForegroundColor Cyan
}

# Step 8: Create a quick test script
Write-Host "`n[STEP 8] Creating Quick Test Script" -ForegroundColor Magenta
$testScript = @"
#!/usr/bin/env pwsh
# Quick test script to verify build works
Write-Host "Testing WEM Dashboard build..." -ForegroundColor Cyan
cd backend
dotnet build --no-restore
if (`$LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Build test passed!" -ForegroundColor Green
} else {
    Write-Host "[FAILED] Build test failed!" -ForegroundColor Red
}
"@

try {
    $testScript | Out-File -FilePath "./test-build.ps1" -Encoding UTF8
    Write-Host "[OK] Created test-build.ps1 script" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Could not create test script" -ForegroundColor Yellow
}

Write-Host "`n[COMPLETE] Build fix script finished!" -ForegroundColor Cyan
Read-Host "Press Enter to continue..."
