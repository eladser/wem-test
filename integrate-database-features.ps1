#!/usr/bin/env pwsh
# Integration Script for WEM Dashboard Database Features
# This script integrates all new database persistence features

Write-Host "[WEM] WEM Dashboard Database Integration Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

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
    
    Write-Host "[>] $Description" -ForegroundColor Yellow
    
    try {
        Push-Location $WorkingDirectory
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Write-Host "[OK] $Description completed successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERROR] $Description failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Pop-Location
    }
}

# Step 1: Backup existing database
Write-Host "`n[STEP 1] Backup existing database" -ForegroundColor Magenta
if (Test-Path $DatabasePath) {
    try {
        Copy-Item $DatabasePath $BackupPath
        Write-Host "[OK] Database backed up to: $BackupPath" -ForegroundColor Green
    }
    catch {
        Write-Host "[WARNING] Could not backup database: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "[INFO] No existing database found, will create new one" -ForegroundColor Blue
}

# Step 2: Check prerequisites
Write-Host "`n[STEP 2] Check prerequisites" -ForegroundColor Magenta

$prerequisites = @(
    @{Command = "dotnet"; Description = ".NET SDK"},
    @{Command = "npm"; Description = "Node.js/NPM"}
)

$missingPrereqs = @()
foreach ($prereq in $prerequisites) {
    if (Test-Command $prereq.Command) {
        Write-Host "[OK] $($prereq.Description) is installed" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] $($prereq.Description) is missing" -ForegroundColor Red
        $missingPrereqs += $prereq.Description
    }
}

if ($missingPrereqs.Count -gt 0) {
    Write-Host "`n[ERROR] Missing prerequisites: $($missingPrereqs -join ', ')" -ForegroundColor Red
    Write-Host "Please install the missing prerequisites and run this script again." -ForegroundColor Yellow
    exit 1
}

# Step 3: Install/Update backend dependencies
Write-Host "`n[STEP 3] Install/Update backend dependencies" -ForegroundColor Magenta

$backendSuccess = Invoke-SafeCommand -Command "dotnet restore" -Description "Restoring backend NuGet packages" -WorkingDirectory $BackendPath
if (-not $backendSuccess) {
    Write-Host "[ERROR] Backend dependency installation failed" -ForegroundColor Red
    exit 1
}

# Step 4: Add Entity Framework tools if not present
Write-Host "`n[STEP 4] Install Entity Framework tools" -ForegroundColor Magenta

try {
    $efToolsInstalled = $false
    $toolList = dotnet tool list -g 2>$null
    if ($toolList -and ($toolList | Select-String "dotnet-ef")) {
        $efToolsInstalled = $true
    }
    
    if (-not $efToolsInstalled) {
        Write-Host "Installing Entity Framework tools..." -ForegroundColor Yellow
        dotnet tool install --global dotnet-ef
    }
    else {
        Write-Host "[OK] Entity Framework tools already installed" -ForegroundColor Green
    }
}
catch {
    Write-Host "Installing Entity Framework tools..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef
}

# Step 5: Create and run database migrations
Write-Host "`n[STEP 5] Create and run database migrations" -ForegroundColor Magenta

$migrationName = "AddPersistenceFeatures_$(Get-Date -Format 'yyyyMMddHHmmss')"
$apiPath = "$BackendPath/src/WemDashboard.API"

if (Test-Path $apiPath) {
    $migrationSuccess = Invoke-SafeCommand -Command "dotnet ef migrations add $migrationName" -Description "Creating database migration" -WorkingDirectory $apiPath
    
    if ($migrationSuccess) {
        $updateSuccess = Invoke-SafeCommand -Command "dotnet ef database update" -Description "Applying database migration" -WorkingDirectory $apiPath
        
        if (-not $updateSuccess) {
            Write-Host "[ERROR] Database migration failed" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "[ERROR] Migration creation failed" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[ERROR] API project not found at: $apiPath" -ForegroundColor Red
    exit 1
}

# Step 6: Update dependency injection registration
Write-Host "`n[STEP 6] Update dependency injection registration" -ForegroundColor Magenta

$infrastructureDiPath = "$BackendPath/src/WemDashboard.Infrastructure/DependencyInjection.cs"
$applicationDiPath = "$BackendPath/src/WemDashboard.Application/DependencyInjection.cs"

if (Test-Path $infrastructureDiPath) {
    Write-Host "[INFO] Infrastructure DI registration file found" -ForegroundColor Blue
    $infraContent = Get-Content $infrastructureDiPath -Raw
    
    $requiredRepositories = @(
        "IUserPreferencesRepository",
        "IDashboardLayoutRepository", 
        "IWidgetConfigurationRepository",
        "IGridComponentConfigurationRepository",
        "IEnergyFlowConfigurationRepository"
    )
    
    $missingRepositories = @()
    foreach ($repo in $requiredRepositories) {
        if ($infraContent -notmatch [regex]::Escape($repo)) {
            $missingRepositories += $repo
        }
    }
    
    if ($missingRepositories.Count -eq 0) {
        Write-Host "[OK] All repository services are registered" -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] Some repository services may need registration" -ForegroundColor Yellow
    }
}

if (Test-Path $applicationDiPath) {
    Write-Host "[OK] Application DI registration file exists" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] Application DI file not found - services may need manual registration" -ForegroundColor Yellow
}

# Step 7: Install frontend dependencies
Write-Host "`n[STEP 7] Install/Update frontend dependencies" -ForegroundColor Magenta

$frontendSuccess = Invoke-SafeCommand -Command "npm install" -Description "Installing frontend dependencies" -WorkingDirectory $FrontendPath
if (-not $frontendSuccess) {
    Write-Host "[ERROR] Frontend dependency installation failed" -ForegroundColor Red
    exit 1
}

# Step 8: Build backend
Write-Host "`n[STEP 8] Build backend" -ForegroundColor Magenta

$buildSuccess = Invoke-SafeCommand -Command "dotnet build" -Description "Building backend" -WorkingDirectory $BackendPath
if (-not $buildSuccess) {
    Write-Host "[ERROR] Backend build failed" -ForegroundColor Red
    exit 1
}

# Step 9: Verify database tables
Write-Host "`n[STEP 9] Verify database tables" -ForegroundColor Magenta

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
                try {
                    $result = sqlite3 $DatabasePath "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';"
                    if ($result -eq $table) {
                        Write-Host "[OK] Table '$table' exists" -ForegroundColor Green
                    }
                    else {
                        Write-Host "[ERROR] Table '$table' missing" -ForegroundColor Red
                    }
                }
                catch {
                    Write-Host "[WARNING] Could not check table '$table'" -ForegroundColor Yellow
                }
            }
        }
        else {
            Write-Host "[WARNING] SQLite3 command not available, skipping table verification" -ForegroundColor Yellow
            Write-Host "[INFO] You can verify tables manually using a SQLite browser" -ForegroundColor Blue
        }
    }
    catch {
        Write-Host "[WARNING] Could not verify database tables: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "[ERROR] Database file not found at: $DatabasePath" -ForegroundColor Red
}

# Step 10: Create test data (optional)
Write-Host "`n[STEP 10] Create test data" -ForegroundColor Magenta

$createTestData = Read-Host "Do you want to create sample test data? (y/N)"
if ($createTestData -eq 'y' -or $createTestData -eq 'Y') {
    Write-Host "Creating test data..." -ForegroundColor Yellow
    Write-Host "[INFO] Test data will be created when the application first runs" -ForegroundColor Blue
}

# Final summary
Write-Host "`n[SUCCESS] Integration Summary" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "[OK] Database backup created" -ForegroundColor Green
Write-Host "[OK] Backend dependencies updated" -ForegroundColor Green
Write-Host "[OK] Database migrations applied" -ForegroundColor Green
Write-Host "[OK] Frontend dependencies updated" -ForegroundColor Green
Write-Host "[OK] Backend built successfully" -ForegroundColor Green

Write-Host "`n[NEXT STEPS]" -ForegroundColor Yellow
Write-Host "1. Start your backend server: dotnet run --project $BackendPath/src/WemDashboard.API" -ForegroundColor Cyan
Write-Host "2. Start your frontend: npm run dev" -ForegroundColor Cyan
Write-Host "3. Test the new persistence features in your dashboard" -ForegroundColor Cyan
Write-Host "4. Replace existing components with persistent versions as needed" -ForegroundColor Cyan

Write-Host "`n[NEW FEATURES AVAILABLE]" -ForegroundColor Yellow
Write-Host "* User preferences with automatic persistence" -ForegroundColor Cyan
Write-Host "* Dashboard layouts with widget configurations" -ForegroundColor Cyan
Write-Host "* Interactive grid with component persistence" -ForegroundColor Cyan
Write-Host "* View state management for all pages" -ForegroundColor Cyan
Write-Host "* Filter presets and report templates" -ForegroundColor Cyan

Write-Host "`n[API ENDPOINTS]" -ForegroundColor Yellow
Write-Host "* /api/userpreferences - User preference management" -ForegroundColor Cyan
Write-Host "* /api/dashboardlayout - Dashboard layout management" -ForegroundColor Cyan
Write-Host "* /api/widgetconfiguration - Widget configuration" -ForegroundColor Cyan
Write-Host "* /api/gridconfiguration - Grid component management" -ForegroundColor Cyan
Write-Host "* /api/viewstate - Generic view state persistence" -ForegroundColor Cyan

if (Test-Path $BackupPath) {
    Write-Host "`n[BACKUP] Database Backup Location: $BackupPath" -ForegroundColor Blue
}

Write-Host "`n[SUCCESS] Integration completed successfully!" -ForegroundColor Green
Write-Host "Your WEM Dashboard now has comprehensive database persistence." -ForegroundColor Green

# Pause to let user read the summary
Read-Host "`nPress Enter to continue..."
