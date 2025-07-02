# PowerShell script to organize documentation
Write-Host "Organizing WEM Dashboard Documentation..." -ForegroundColor Green

# Create docs directory
if (!(Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs"
    Write-Host "Created docs directory" -ForegroundColor Yellow
}

# Create subdirectories
$subdirs = @("setup", "features", "troubleshooting", "development", "archive")
foreach ($dir in $subdirs) {
    if (!(Test-Path "docs/$dir")) {
        New-Item -ItemType Directory -Path "docs/$dir"
        Write-Host "Created docs/$dir directory" -ForegroundColor Yellow
    }
}

# Move files to appropriate locations
$fileMappings = @{
    # Setup and Installation
    "MANUAL-SETUP.md" = "docs/setup/manual-setup.md"
    "WINDOWS_SETUP_GUIDE.md" = "docs/setup/windows-setup.md"
    "SQLITE_SETUP_GUIDE.md" = "docs/setup/sqlite-setup.md"
    "SQLITE_SETUP_COMPLETE.md" = "docs/setup/sqlite-complete.md"
    "UPDATE_INSTRUCTIONS.md" = "docs/setup/update-instructions.md"
    
    # Features and Implementation
    "ADVANCED_FEATURES_SUMMARY.md" = "docs/features/advanced-features.md"
    "FUNCTIONALITY_IMPLEMENTATION_GUIDE.md" = "docs/features/implementation-guide.md"
    "MISSING_FUNCTIONALITY_IMPLEMENTED.md" = "docs/features/missing-functionality.md"
    "DATABASE_INTEGRATION.md" = "docs/features/database-integration.md"
    "LOGGING_AND_ERROR_HANDLING.md" = "docs/features/logging-error-handling.md"
    
    # Troubleshooting
    "WINDOWS_TROUBLESHOOTING.md" = "docs/troubleshooting/windows-issues.md"
    "WEBSOCKET_TROUBLESHOOTING.md" = "docs/troubleshooting/websocket-issues.md"
    "DEBUG_LOGIN.md" = "docs/troubleshooting/login-debug.md"
    "DEPENDENCY_FIX.md" = "docs/troubleshooting/dependency-fixes.md"
    
    # Development
    "TESTING_GUIDE.md" = "docs/development/testing.md"
    "LOGIN_CREDENTIALS.md" = "docs/development/login-credentials.md"
    
    # Archive (completed fixes)
    "ALL_FIXES_COMPLETE.md" = "docs/archive/all-fixes-complete.md"
    "AUTHENTICATION_FIX.md" = "docs/archive/authentication-fix.md"
    "BACKEND_SETTINGS_FIX.md" = "docs/archive/backend-settings-fix.md"
    "CLEANUP_SUMMARY.md" = "docs/archive/cleanup-summary.md"
    "COMPLETE_LAYOUT_OVERHAUL.md" = "docs/archive/layout-overhaul.md"
    "COMPLETE_OVERHAUL_SUMMARY.md" = "docs/archive/overhaul-summary.md"
    "CRITICAL_ISSUES_FIXED.md" = "docs/archive/critical-issues-fixed.md"
    "ERROR_FIXES.md" = "docs/archive/error-fixes.md"
    "EXPORT_FIX.md" = "docs/archive/export-fix.md"
    "FIXES_IMPLEMENTED.md" = "docs/archive/fixes-implemented.md"
    "FRONTEND_API_FIXES.md" = "docs/archive/frontend-api-fixes.md"
    "FRONTEND_ISSUES_FIXED.md" = "docs/archive/frontend-issues-fixed.md"
    "IMPLEMENTATION_SUMMARY.md" = "docs/archive/implementation-summary.md"
    "IMPROVEMENTS_SUMMARY.md" = "docs/archive/improvements-summary.md"
    "LAYOUT_FIXES_SUMMARY.md" = "docs/archive/layout-fixes-summary.md"
    "UI_UX_IMPROVEMENTS_SUMMARY.md" = "docs/archive/ui-ux-improvements.md"
    "WORKING_ERROR_SYSTEM.md" = "docs/archive/working-error-system.md"
}

# Move files
foreach ($file in $fileMappings.Keys) {
    if (Test-Path $file) {
        Move-Item $file $fileMappings[$file] -Force
        Write-Host "Moved $file to $($fileMappings[$file])" -ForegroundColor Cyan
    }
}

# Create new organized README
$newReadme = @"
# WEM Dashboard Documentation

## Quick Start
- [Main README](../README.md) - Primary setup and overview
- [API Documentation](../API_DOCUMENTATION.md) - API endpoints and usage

## Setup & Installation
- [Manual Setup](setup/manual-setup.md) - Step-by-step manual installation
- [Windows Setup](setup/windows-setup.md) - Windows-specific setup guide
- [SQLite Setup](setup/sqlite-setup.md) - Database setup instructions
- [Update Instructions](setup/update-instructions.md) - How to update the application

## Features & Implementation
- [Advanced Features](features/advanced-features.md) - Overview of advanced capabilities
- [Implementation Guide](features/implementation-guide.md) - How to implement new features
- [Database Integration](features/database-integration.md) - Database setup and usage
- [Logging & Error Handling](features/logging-error-handling.md) - Error handling implementation

## Development
- [Testing Guide](development/testing.md) - How to run tests
- [Login Credentials](development/login-credentials.md) - Development login info

## Troubleshooting
- [Windows Issues](troubleshooting/windows-issues.md) - Common Windows problems
- [WebSocket Issues](troubleshooting/websocket-issues.md) - WebSocket connection problems
- [Login Debug](troubleshooting/login-debug.md) - Login troubleshooting
- [Dependency Fixes](troubleshooting/dependency-fixes.md) - Dependency resolution

## Archive
The [archive](archive/) folder contains documentation for completed fixes and historical changes.

---

**Need help?** Check the main [README](../README.md) or create an issue.
"@

$newReadme | Out-File "docs/README.md" -Encoding UTF8

Write-Host "Documentation organization complete!" -ForegroundColor Green
Write-Host "Created docs/README.md with organized structure" -ForegroundColor Yellow
