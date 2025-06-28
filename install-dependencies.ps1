# Install Dependencies Script for WEM Dashboard
# This script installs all required dependencies for the new database features

Write-Host "Installing WEM Dashboard Dependencies" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Check if running as Administrator (Windows)
if ($IsWindows) {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    $isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Host "WARNING: Running without Administrator privileges" -ForegroundColor Yellow
        Write-Host "Some operations may fail" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to install via winget (Windows)
function Install-ViaWinget($packageName, $appName) {
    if (Test-Command "winget") {
        Write-Host "Installing $appName via winget..." -ForegroundColor Yellow
        try {
            winget install $packageName --accept-source-agreements --accept-package-agreements
            return $true
        } catch {
            return $false
        }
    }
    return $false
}

# Function to install via Chocolatey (Windows)
function Install-ViaChocolatey($packageName, $appName) {
    if (Test-Command "choco") {
        Write-Host "Installing $appName via Chocolatey..." -ForegroundColor Yellow
        try {
            choco install $packageName -y
            return $true
        } catch {
            return $false
        }
    }
    return $false
}

# Check and install .NET SDK
Write-Host "Checking .NET SDK..." -ForegroundColor Cyan
if (Test-Command "dotnet") {
    $dotnetVersion = dotnet --version
    Write-Host "SUCCESS: .NET SDK is installed (version: $dotnetVersion)" -ForegroundColor Green
} else {
    Write-Host "ERROR: .NET SDK not found" -ForegroundColor Red
    Write-Host "Attempting to install .NET SDK..." -ForegroundColor Yellow
    
    $installed = $false
    if ($IsWindows) {
        $installed = Install-ViaWinget "Microsoft.DotNet.SDK.8" ".NET SDK 8.0" 
        if (-not $installed) {
            $installed = Install-ViaChocolatey "dotnet-sdk" ".NET SDK"
        }
    }
    
    if (-not $installed) {
        Write-Host "MANUAL INSTALLATION REQUIRED:" -ForegroundColor Red
        Write-Host "Please download and install .NET SDK 8.0 from:" -ForegroundColor Yellow
        Write-Host "https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Cyan
        $continue = Read-Host "Press Enter after installing .NET SDK, or 'q' to quit"
        if ($continue -eq 'q') { exit 1 }
    }
}

# Check and install Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "SUCCESS: Node.js is installed (version: $nodeVersion)" -ForegroundColor Green
} else {
    Write-Host "ERROR: Node.js not found" -ForegroundColor Red
    Write-Host "Attempting to install Node.js..." -ForegroundColor Yellow
    
    $installed = $false
    if ($IsWindows) {
        $installed = Install-ViaWinget "OpenJS.NodeJS" "Node.js"
        if (-not $installed) {
            $installed = Install-ViaChocolatey "nodejs" "Node.js"
        }
    }
    
    if (-not $installed) {
        Write-Host "MANUAL INSTALLATION REQUIRED:" -ForegroundColor Red
        Write-Host "Please download and install Node.js from:" -ForegroundColor Yellow
        Write-Host "https://nodejs.org/" -ForegroundColor Cyan
        $continue = Read-Host "Press Enter after installing Node.js, or 'q' to quit"
        if ($continue -eq 'q') { exit 1 }
    }
}

# Check and install Git (optional but recommended)
Write-Host "Checking Git..." -ForegroundColor Cyan
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "SUCCESS: Git is installed ($gitVersion)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Git not found (recommended for development)" -ForegroundColor Yellow
    $installGit = Read-Host "Would you like to install Git? (y/N)"
    if ($installGit -eq 'y' -or $installGit -eq 'Y') {
        $installed = $false
        if ($IsWindows) {
            $installed = Install-ViaWinget "Git.Git" "Git"
            if (-not $installed) {
                $installed = Install-ViaChocolatey "git" "Git"
            }
        }
        
        if (-not $installed) {
            Write-Host "Please download Git from: https://git-scm.com/" -ForegroundColor Cyan
        }
    }
}

# Install Entity Framework tools
Write-Host "Installing Entity Framework tools..." -ForegroundColor Cyan
try {
    dotnet tool install --global dotnet-ef
    Write-Host "SUCCESS: Entity Framework tools installed" -ForegroundColor Green
} catch {
    Write-Host "INFO: Entity Framework tools may already be installed" -ForegroundColor Blue
}

# Install SQLite tools (optional)
Write-Host "Checking SQLite tools..." -ForegroundColor Cyan
if (Test-Command "sqlite3") {
    Write-Host "SUCCESS: SQLite3 is available" -ForegroundColor Green
} else {
    Write-Host "INFO: SQLite3 not found (optional for database inspection)" -ForegroundColor Blue
    $installSQLite = Read-Host "Would you like to install SQLite3? (y/N)"
    if ($installSQLite -eq 'y' -or $installSQLite -eq 'Y') {
        if ($IsWindows) {
            $installed = Install-ViaChocolatey "sqlite" "SQLite"
            if (-not $installed) {
                Write-Host "Please download SQLite from: https://www.sqlite.org/download.html" -ForegroundColor Cyan
            }
        }
    }
}

# Install global npm packages
Write-Host "Installing global npm packages..." -ForegroundColor Cyan
try {
    npm install -g npm@latest
    Write-Host "SUCCESS: npm updated to latest version" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Could not update npm" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=======================================" -ForegroundColor Green
Write-Host "DEPENDENCY INSTALLATION COMPLETED!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "`nInstalled/Verified:" -ForegroundColor Yellow
if (Test-Command "dotnet") { Write-Host "✓ .NET SDK" -ForegroundColor Green } else { Write-Host "✗ .NET SDK" -ForegroundColor Red }
if (Test-Command "node") { Write-Host "✓ Node.js" -ForegroundColor Green } else { Write-Host "✗ Node.js" -ForegroundColor Red }
if (Test-Command "npm") { Write-Host "✓ npm" -ForegroundColor Green } else { Write-Host "✗ npm" -ForegroundColor Red }
if (Test-Command "git") { Write-Host "✓ Git" -ForegroundColor Green } else { Write-Host "○ Git (optional)" -ForegroundColor Yellow }
if (Test-Command "sqlite3") { Write-Host "✓ SQLite3" -ForegroundColor Green } else { Write-Host "○ SQLite3 (optional)" -ForegroundColor Yellow }

Write-Host "`nNext step: Run the integration script" -ForegroundColor Yellow
Write-Host "./integrate-simple.ps1" -ForegroundColor Cyan

Write-Host "`nPress Enter to exit..." -ForegroundColor Gray
Read-Host