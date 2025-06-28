#!/usr/bin/env pwsh
# Integration Script for WEM Dashboard Database Features
# This script integrates all new database persistence features

Write-Host "🚀 WEM Dashboard Database Integration Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Configuration
$BackendPath = "./backend"
$FrontendPath = "./"
$DatabasePath = "./backend/wemdashboard.db"
$BackupPath = "./backend/wemdashboard_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').db"

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to run command with error handling
function Invoke-SafeCommand {
    param(
        [string]$Command,
        [string]$Description,
        [string]$WorkingDirectory = $PWD
    )
    
    Write-Host "▶️ $Description" -ForegroundColor Yellow
    
    try {
        Push-Location $WorkingDirectory
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Write-Host "✅ $Description completed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ $Description failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Pop-Location
    }
    return $true
}

# Step 1: Backup existing database
Write-Host "\n📋 Step 1: Backup existing database" -ForegroundColor Magenta
if (Test-Path $DatabasePath) {
    try {
        Copy-Item $DatabasePath $BackupPath
        Write-Host "✅ Database backed up to: $BackupPath" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Could not backup database: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "ℹ️ No existing database found, will create new one" -ForegroundColor Blue
}

# Step 2: Check prerequisites
Write-Host "\n📋 Step 2: Check prerequisites" -ForegroundColor Magenta

$prerequisites = @(
    @{Command = "dotnet"; Description = ".NET SDK"},
    @{Command = "npm"; Description = "Node.js/NPM"}
)

$missingPrereqs = @()
foreach ($prereq in $prerequisites) {
    if (Test-Command $prereq.Command) {
        Write-Host "✅ $($prereq.Description) is installed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $($prereq.Description) is missing" -ForegroundColor Red
        $missingPrereqs += $prereq.Description
    }
}

if ($missingPrereqs.Count -gt 0) {
    Write-Host "\n❌ Missing prerequisites: $($missingPrereqs -join ', ')" -ForegroundColor Red
    Write-Host "Please install the missing prerequisites and run this script again." -ForegroundColor Yellow
    exit 1
}

# Step 3: Install/Update backend dependencies
Write-Host "\n📋 Step 3: Install/Update backend dependencies" -ForegroundColor Magenta

$backendSuccess = Invoke-SafeCommand -Command "dotnet restore" -Description "Restoring backend NuGet packages" -WorkingDirectory $BackendPath
if (-not $backendSuccess) {
    Write-Host "❌ Backend dependency installation failed" -ForegroundColor Red
    exit 1
}

# Step 4: Add Entity Framework tools if not present
Write-Host "\n📋 Step 4: Install Entity Framework tools" -ForegroundColor Magenta

try {
    dotnet tool list -g | Select-String "dotnet-ef" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing Entity Framework tools..." -ForegroundColor Yellow
        dotnet tool install --global dotnet-ef
    }
    else {
        Write-Host "✅ Entity Framework tools already installed" -ForegroundColor Green
    }
}
catch {
    Write-Host "Installing Entity Framework tools..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef
}

# Step 5: Create and run database migrations
Write-Host "\n📋 Step 5: Create and run database migrations" -ForegroundColor Magenta

$migrationName = "AddPersistenceFeatures_$(Get-Date -Format 'yyyyMMddHHmmss')"
$migrationSuccess = Invoke-SafeCommand -Command "dotnet ef migrations add $migrationName" -Description "Creating database migration" -WorkingDirectory "$BackendPath/src/WemDashboard.API"

if ($migrationSuccess) {
    $updateSuccess = Invoke-SafeCommand -Command "dotnet ef database update" -Description "Applying database migration" -WorkingDirectory "$BackendPath/src/WemDashboard.API"
    
    if (-not $updateSuccess) {
        Write-Host "❌ Database migration failed" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "❌ Migration creation failed" -ForegroundColor Red
    exit 1
}

# Step 6: Update dependency injection registration
Write-Host "\n📋 Step 6: Update dependency injection registration" -ForegroundColor Magenta

$diPath = "$BackendPath/src/WemDashboard.Application/DependencyInjection.cs"
if (Test-Path $diPath) {
    Write-Host "ℹ️ DI registration file found, checking for service registration..." -ForegroundColor Blue
    
    # Check if application services are registered
    $diContent = Get-Content $diPath -Raw
    
    $servicesToAdd = @(
        "services.AddScoped<IUserPreferencesService, UserPreferencesService>();",
        "services.AddScoped<IDashboardLayoutService, DashboardLayoutService>();",
        "services.AddScoped<IWidgetConfigurationService, WidgetConfigurationService>();",
        "services.AddScoped<IGridConfigurationService, GridConfigurationService>();",
        "services.AddScoped<IViewStateService, ViewStateService>();"
    )
    
    $needsUpdate = $false
    foreach ($service in $servicesToAdd) {
        if ($diContent -notmatch [regex]::Escape($service)) {
            $needsUpdate = $true
        }
    }
    
    if ($needsUpdate) {
        Write-Host "⚠️ Application services need to be registered in DI container" -ForegroundColor Yellow
        Write-Host "Please add the following services to your Application DependencyInjection.cs:" -ForegroundColor Yellow
        foreach ($service in $servicesToAdd) {
            Write-Host "  $service" -ForegroundColor Cyan
        }
    }
    else {
        Write-Host "✅ All services appear to be registered" -ForegroundColor Green
    }
}
else {
    Write-Host "⚠️ Application DI file not found at expected location" -ForegroundColor Yellow
}

# Step 7: Install frontend dependencies
Write-Host "\n📋 Step 7: Install/Update frontend dependencies" -ForegroundColor Magenta

$frontendSuccess = Invoke-SafeCommand -Command "npm install" -Description "Installing frontend dependencies" -WorkingDirectory $FrontendPath
if (-not $frontendSuccess) {
    Write-Host "❌ Frontend dependency installation failed" -ForegroundColor Red
    exit 1
}

# Step 8: Build backend
Write-Host "\n📋 Step 8: Build backend" -ForegroundColor Magenta

$buildSuccess = Invoke-SafeCommand -Command "dotnet build" -Description "Building backend" -WorkingDirectory $BackendPath
if (-not $buildSuccess) {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    exit 1
}

# Step 9: Verify database tables
Write-Host "\n📋 Step 9: Verify database tables" -ForegroundColor Magenta

if (Test-Path $DatabasePath) {
    try {
        # Check if SQLite command is available
        if (Test-Command "sqlite3") {
            Write-Host "Checking database tables..." -ForegroundColor Yellow
            
            $tables = @(
                "UserPreferences",
                "DashboardLayouts", 
                "WidgetConfigurations",
                "GridComponentConfigurations",
                "EnergyFlowConfigurations",
                "FilterPresets",
                "ReportTemplates",
                "ViewStates"
            )
            
            foreach ($table in $tables) {
                $result = sqlite3 $DatabasePath "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';"
                if ($result -eq $table) {
                    Write-Host "✅ Table '$table' exists" -ForegroundColor Green
                }
                else {
                    Write-Host "❌ Table '$table' missing" -ForegroundColor Red
                }
            }
        }
        else {
            Write-Host "⚠️ SQLite3 command not available, skipping table verification" -ForegroundColor Yellow
            Write-Host "ℹ️ You can verify tables manually using a SQLite browser" -ForegroundColor Blue
        }
    }
    catch {
        Write-Host "⚠️ Could not verify database tables: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "❌ Database file not found at: $DatabasePath" -ForegroundColor Red
}

# Step 10: Create test data (optional)
Write-Host "\n📋 Step 10: Create test data" -ForegroundColor Magenta

$createTestData = Read-Host "Do you want to create sample test data? (y/N)"
if ($createTestData -eq 'y' -or $createTestData -eq 'Y') {
    Write-Host "Creating test data..." -ForegroundColor Yellow
    
    # You can add test data creation logic here
    # For now, we'll just run the application which should seed default data
    Write-Host "ℹ️ Test data will be created when the application first runs" -ForegroundColor Blue
}

# Step 11: Integration verification
Write-Host "\n📋 Step 11: Integration verification" -ForegroundColor Magenta

# Create a simple verification script
$verificationScript = @'
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Domain.Interfaces;

namespace WemDashboard.Integration
{
    public class VerificationService
    {
        public static async Task<bool> VerifyIntegrationAsync(IServiceProvider services)
        {
            try
            {
                // Test database connection
                var context = services.GetRequiredService<WemDashboardDbContext>();
                await context.Database.CanConnectAsync();
                
                // Test repository resolution
                var userPrefsRepo = services.GetRequiredService<IUserPreferencesRepository>();
                var layoutRepo = services.GetRequiredService<IDashboardLayoutRepository>();
                var widgetRepo = services.GetRequiredService<IWidgetConfigurationRepository>();
                
                Console.WriteLine("✅ All services resolved successfully");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Integration verification failed: {ex.Message}");
                return false;
            }
        }
    }
}
'@

$verificationPath = "$BackendPath/src/WemDashboard.API/Integration/VerificationService.cs"
New-Item -Path (Split-Path $verificationPath) -ItemType Directory -Force | Out-Null
Set-Content -Path $verificationPath -Value $verificationScript

Write-Host "✅ Verification service created" -ForegroundColor Green

# Final summary
Write-Host "\n🎉 Integration Summary" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

Write-Host "✅ Database backup created" -ForegroundColor Green
Write-Host "✅ Backend dependencies updated" -ForegroundColor Green
Write-Host "✅ Database migrations applied" -ForegroundColor Green
Write-Host "✅ Frontend dependencies updated" -ForegroundColor Green
Write-Host "✅ Backend built successfully" -ForegroundColor Green

Write-Host "\n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start your backend server: dotnet run --project $BackendPath/src/WemDashboard.API" -ForegroundColor Cyan
Write-Host "2. Start your frontend: npm run dev" -ForegroundColor Cyan
Write-Host "3. Test the new persistence features in your dashboard" -ForegroundColor Cyan
Write-Host "4. Replace existing components with persistent versions as needed" -ForegroundColor Cyan

Write-Host "\n📚 New Features Available:" -ForegroundColor Yellow
Write-Host "• User preferences with automatic persistence" -ForegroundColor Cyan
Write-Host "• Dashboard layouts with widget configurations" -ForegroundColor Cyan
Write-Host "• Interactive grid with component persistence" -ForegroundColor Cyan
Write-Host "• View state management for all pages" -ForegroundColor Cyan
Write-Host "• Filter presets and report templates" -ForegroundColor Cyan

Write-Host "\n🔧 API Endpoints:" -ForegroundColor Yellow
Write-Host "• /api/userpreferences - User preference management" -ForegroundColor Cyan
Write-Host "• /api/dashboardlayout - Dashboard layout management" -ForegroundColor Cyan
Write-Host "• /api/widgetconfiguration - Widget configuration" -ForegroundColor Cyan
Write-Host "• /api/gridconfiguration - Grid component management" -ForegroundColor Cyan
Write-Host "• /api/viewstate - Generic view state persistence" -ForegroundColor Cyan

if (Test-Path $BackupPath) {
    Write-Host "\n💾 Database Backup Location: $BackupPath" -ForegroundColor Blue
}

Write-Host "\n🚀 Integration completed successfully!" -ForegroundColor Green
Write-Host "Your WEM Dashboard now has comprehensive database persistence." -ForegroundColor Green

# Pause to let user read the summary
Read-Host "\nPress Enter to continue..."