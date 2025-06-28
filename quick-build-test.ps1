#!/usr/bin/env pwsh
# Quick Build Test Script
# This script quickly tests if the build is now working

Write-Host "[TEST] Quick Build Test" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

$BackendPath = "./backend"

Write-Host "`n[STEP 1] Testing Build" -ForegroundColor Magenta
Push-Location $BackendPath
try {
    Write-Host "Running: dotnet build --no-restore" -ForegroundColor Yellow
    $buildOutput = dotnet build --no-restore 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Build completed successfully!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Yellow
        Write-Host "1. cd backend/src/WemDashboard.API" -ForegroundColor Cyan
        Write-Host "2. dotnet ef migrations add InitialCreate" -ForegroundColor Cyan
        Write-Host "3. dotnet ef database update" -ForegroundColor Cyan
        Write-Host "4. dotnet run" -ForegroundColor Cyan
    }
    else {
        Write-Host "[FAILED] Build still has issues:" -ForegroundColor Red
        $buildOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    }
}
catch {
    Write-Host "[ERROR] Build test failed: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pop-Location
}

Write-Host "`n[TEST COMPLETE]" -ForegroundColor Cyan
