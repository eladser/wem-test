#!/usr/bin/env pwsh
# Verification Script for WEM Dashboard Database Integration
# This script verifies that all database features are working correctly

Write-Host "🔍 WEM Dashboard Integration Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Configuration
$BackendPath = "./backend"
$DatabasePath = "./backend/wemdashboard.db"
$ApiBaseUrl = "https://localhost:7297" # Update with your API URL
$TestTimeout = 30

# Colors
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"
$Magenta = "Magenta"

# Test results
$TestResults = @()

# Function to add test result
function Add-TestResult {
    param(
        [string]$TestName,
        [bool]$Passed,
        [string]$Details = ""
    )
    
    $TestResults += @{
        Name = $TestName
        Passed = $Passed
        Details = $Details
    }
    
    if ($Passed) {
        Write-Host "✅ $TestName" -ForegroundColor $Green
    } else {
        Write-Host "❌ $TestName" -ForegroundColor $Red
        if ($Details) {
            Write-Host "   $Details" -ForegroundColor $Yellow
        }
    }
}

# Function to test HTTP endpoint
function Test-HttpEndpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response }
    }
    catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Step 1: Database Structure Verification
Write-Host "\n📋 Step 1: Database Structure Verification" -ForegroundColor $Magenta

if (Test-Path $DatabasePath) {
    Add-TestResult "Database file exists" $true
    
    # Check if SQLite command is available
    try {
        $null = Get-Command sqlite3 -ErrorAction Stop
        
        # Check tables
        $requiredTables = @(
            "UserPreferences",
            "DashboardLayouts",
            "WidgetConfigurations",
            "GridComponentConfigurations",
            "EnergyFlowConfigurations",
            "FilterPresets",
            "ReportTemplates",
            "ViewStates"
        )
        
        foreach ($table in $requiredTables) {
            $result = sqlite3 $DatabasePath "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';"
            Add-TestResult "Table '$table' exists" ($result -eq $table)
        }
        
        # Check for seed data
        $userCount = sqlite3 $DatabasePath "SELECT COUNT(*) FROM Users;"
        Add-TestResult "Default users exist" ([int]$userCount -gt 0) "Found $userCount users"
        
    }
    catch {
        Add-TestResult "SQLite3 command available" $false "SQLite3 not found, skipping detailed verification"
    }
}
else {
    Add-TestResult "Database file exists" $false "Database not found at $DatabasePath"
}

# Step 2: Backend Service Resolution
Write-Host "\n📋 Step 2: Backend Service Resolution" -ForegroundColor $Magenta

# Check if backend is running
$backendRunning = $false
try {
    $healthCheck = Test-HttpEndpoint "$ApiBaseUrl/health" -Method "GET"
    if ($healthCheck.Success) {
        $backendRunning = $true
        Add-TestResult "Backend server is running" $true
    }
    else {
        Add-TestResult "Backend server is running" $false "Health check failed"
    }
}
catch {
    Add-TestResult "Backend server is running" $false "Cannot connect to backend"
}

# Step 3: API Endpoint Verification
Write-Host "\n📋 Step 3: API Endpoint Verification" -ForegroundColor $Magenta

if ($backendRunning) {
    # Test API endpoints (without authentication for now)
    $endpoints = @(
        @{ Path = "/api/userpreferences"; Description = "User Preferences API" },
        @{ Path = "/api/dashboardlayout"; Description = "Dashboard Layout API" },
        @{ Path = "/api/widgetconfiguration"; Description = "Widget Configuration API" },
        @{ Path = "/api/gridconfiguration"; Description = "Grid Configuration API" },
        @{ Path = "/api/viewstate"; Description = "View State API" }
    )
    
    foreach ($endpoint in $endpoints) {
        $result = Test-HttpEndpoint "$ApiBaseUrl$($endpoint.Path)"
        # We expect 401 (Unauthorized) for protected endpoints, which means they exist
        $success = $result.Success -or $result.Error -match "401|Unauthorized"
        Add-TestResult $endpoint.Description $success $result.Error
    }
}
else {
    Write-Host "⚠️ Skipping API tests - backend not running" -ForegroundColor $Yellow
}

# Step 4: Frontend Integration Check
Write-Host "\n📋 Step 4: Frontend Integration Check" -ForegroundColor $Magenta

# Check if TypeScript files exist
$frontendFiles = @(
    "./src/types/settings.ts",
    "./src/services/settingsService.ts",
    "./src/services/viewStateService.ts",
    "./src/hooks/useUserPreferences.ts",
    "./src/hooks/useDashboardLayout.ts",
    "./src/hooks/useGridConfiguration.ts",
    "./src/hooks/useViewState.ts",
    "./src/hooks/usePersistentState.ts",
    "./src/components/PersistentInteractiveGrid.tsx"
)

foreach ($file in $frontendFiles) {
    $exists = Test-Path $file
    Add-TestResult "Frontend file: $(Split-Path $file -Leaf)" $exists
}

# Check package.json for required dependencies
if (Test-Path "./package.json") {
    $packageJson = Get-Content "./package.json" | ConvertFrom-Json
    $dependencies = $packageJson.dependencies
    
    # Check for axios (for API calls)
    if ($dependencies.axios) {
        Add-TestResult "Axios dependency" $true
    } else {
        Add-TestResult "Axios dependency" $false "Add 'axios' to dependencies for API calls"
    }
    
    # Check for sonner (for notifications)
    if ($dependencies.sonner) {
        Add-TestResult "Sonner dependency" $true
    } else {
        Add-TestResult "Sonner dependency" $false "Add 'sonner' to dependencies for notifications"
    }
}

# Step 5: Configuration Verification
Write-Host "\n📋 Step 5: Configuration Verification" -ForegroundColor $Magenta

# Check backend configuration
$appSettingsPath = "$BackendPath/src/WemDashboard.API/appsettings.json"
if (Test-Path $appSettingsPath) {
    try {
        $appSettings = Get-Content $appSettingsPath | ConvertFrom-Json
        
        # Check connection string
        if ($appSettings.ConnectionStrings.DefaultConnection) {
            Add-TestResult "Database connection string configured" $true
        } else {
            Add-TestResult "Database connection string configured" $false
        }
        
        Add-TestResult "Backend configuration file exists" $true
    }
    catch {
        Add-TestResult "Backend configuration file valid" $false "Invalid JSON format"
    }
}
else {
    Add-TestResult "Backend configuration file exists" $false
}

# Check for API client configuration
if (Test-Path "./src/services/api.ts") {
    Add-TestResult "API client configuration exists" $true
}
else {
    Add-TestResult "API client configuration exists" $false "Create src/services/api.ts for API client"
}

# Step 6: Migration Status
Write-Host "\n📋 Step 6: Migration Status" -ForegroundColor $Magenta

$migrationsPath = "$BackendPath/src/WemDashboard.API/Migrations"
if (Test-Path $migrationsPath) {
    $migrationFiles = Get-ChildItem $migrationsPath -Filter "*.cs" | Where-Object { $_.Name -match "AddPersistenceFeatures" }
    Add-TestResult "Persistence features migration exists" ($migrationFiles.Count -gt 0)
    
    # Check if migrations are applied
    if (Test-Path $DatabasePath) {
        try {
            $migrationHistory = sqlite3 $DatabasePath "SELECT MigrationId FROM __EFMigrationsHistory WHERE MigrationId LIKE '%AddPersistenceFeatures%';"
            Add-TestResult "Persistence features migration applied" ($migrationHistory.Length -gt 0)
        }
        catch {
            Add-TestResult "Migration history check" $false "Could not check migration history"
        }
    }
}
else {
    Add-TestResult "Migrations folder exists" $false
}

# Generate Test Report
Write-Host "\n📊 Test Report" -ForegroundColor $Cyan
Write-Host "=============" -ForegroundColor $Cyan

$totalTests = $TestResults.Count
$passedTests = ($TestResults | Where-Object { $_.Passed }).Count
$failedTests = $totalTests - $passedTests
$successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

Write-Host "\nTotal Tests: $totalTests" -ForegroundColor $Blue
Write-Host "Passed: $passedTests" -ForegroundColor $Green
Write-Host "Failed: $failedTests" -ForegroundColor $Red
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { $Green } else { $Yellow })

# Failed Tests Summary
if ($failedTests -gt 0) {
    Write-Host "\n❌ Failed Tests:" -ForegroundColor $Red
    $TestResults | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host "• $($_.Name)" -ForegroundColor $Red
        if ($_.Details) {
            Write-Host "  $($_.Details)" -ForegroundColor $Yellow
        }
    }
}

# Recommendations
Write-Host "\n💡 Recommendations:" -ForegroundColor $Magenta

if ($failedTests -eq 0) {
    Write-Host "🎉 All tests passed! Your integration is successful." -ForegroundColor $Green
    Write-Host "\n🚀 You can now:" -ForegroundColor $Green
    Write-Host "• Start using the new persistence features" -ForegroundColor $Cyan
    Write-Host "• Replace existing components with persistent versions" -ForegroundColor $Cyan
    Write-Host "• Test the user experience with automatic state saving" -ForegroundColor $Cyan
}
else {
    Write-Host "⚠️ Some tests failed. Please address the issues above." -ForegroundColor $Yellow
    
    if (-not $backendRunning) {
        Write-Host "\n🔧 To start the backend:" -ForegroundColor $Yellow
        Write-Host "cd $BackendPath/src/WemDashboard.API && dotnet run" -ForegroundColor $Cyan
    }
    
    Write-Host "\n📚 Common fixes:" -ForegroundColor $Yellow
    Write-Host "• Run database migrations: dotnet ef database update" -ForegroundColor $Cyan
    Write-Host "• Install missing dependencies: npm install" -ForegroundColor $Cyan
    Write-Host "• Check configuration files for correct settings" -ForegroundColor $Cyan
}

Write-Host "\n📝 Next Steps:" -ForegroundColor $Blue
Write-Host "1. Address any failed tests above" -ForegroundColor $Cyan
Write-Host "2. Start both backend and frontend servers" -ForegroundColor $Cyan
Write-Host "3. Test the new features in your browser" -ForegroundColor $Cyan
Write-Host "4. Monitor the browser console for any JavaScript errors" -ForegroundColor $Cyan
Write-Host "5. Check network tab for successful API calls" -ForegroundColor $Cyan

Write-Host "\n🔍 Verification completed!" -ForegroundColor $Green

# Save detailed report
$reportPath = "./integration-verification-report.json"
$report = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    TotalTests = $totalTests
    PassedTests = $passedTests
    FailedTests = $failedTests
    SuccessRate = $successRate
    Results = $TestResults
}

$report | ConvertTo-Json -Depth 3 | Set-Content $reportPath
Write-Host "\n📄 Detailed report saved to: $reportPath" -ForegroundColor $Blue