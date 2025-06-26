# 🔍 WEM Dashboard Database Verification Script (Windows)
# Verifies SQLite database contents and structure

# Colors for output (Windows PowerShell compatible)
$Green = "Green"
$Blue = "Cyan"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "🔍 WEM Dashboard Database Verification" -ForegroundColor $Blue
Write-Host "=====================================" -ForegroundColor $Blue

# Database file path
$DbPath = "backend\src\WemDashboard.API\wemdashboard-dev.db"

# Check if database exists
if (-not (Test-Path $DbPath)) {
    Write-Host "❌ Database file not found: $DbPath" -ForegroundColor $Red
    Write-Host "💡 Run '.\setup-sqlite-dev.ps1' first to create the database" -ForegroundColor $Yellow
    exit 1
}

Write-Host "✅ Database file found: $DbPath" -ForegroundColor $Green

# Check if sqlite3 is available (Windows might need manual installation)
try {
    $sqliteVersion = sqlite3 -version 2>$null
    Write-Host "✅ SQLite3 available" -ForegroundColor $Green
} catch {
    Write-Host "⚠️ sqlite3 command not found." -ForegroundColor $Yellow
    Write-Host "💡 Download SQLite tools from: https://www.sqlite.org/download.html" -ForegroundColor $Yellow
    Write-Host "   Or install via: winget install SQLite.SQLite" -ForegroundColor $Yellow
    Write-Host ""
    Write-Host "📊 Database file exists but detailed verification requires sqlite3 command" -ForegroundColor $Blue
    
    # Basic file information
    $file = Get-Item $DbPath
    Write-Host ""
    Write-Host "📁 Basic Database Information:" -ForegroundColor $Blue
    Write-Host "────────────────────────────" -ForegroundColor $Blue
    Write-Host "📏 File size: $([math]::Round($file.Length / 1MB, 2)) MB" -ForegroundColor $Green
    Write-Host "📅 Created: $($file.CreationTime)" -ForegroundColor $Green
    Write-Host "📅 Modified: $($file.LastWriteTime)" -ForegroundColor $Green
    
    Write-Host ""
    Write-Host "🎯 Ready for Development!" -ForegroundColor $Green
    Write-Host "   🖥️  Backend API: http://localhost:5000" -ForegroundColor $Blue
    Write-Host "   🌐 Frontend: http://localhost:5173" -ForegroundColor $Blue
    Write-Host "   📚 API Docs: http://localhost:5000/swagger" -ForegroundColor $Blue
    exit 0
}

Write-Host ""
Write-Host "📊 Database Information:" -ForegroundColor $Blue
Write-Host "────────────────────────" -ForegroundColor $Blue

# Database size
$file = Get-Item $DbPath
Write-Host "📏 File size: $([math]::Round($file.Length / 1MB, 2)) MB" -ForegroundColor $Green

# Database tables
Write-Host ""
Write-Host "📋 Database Tables:" -ForegroundColor $Blue
Write-Host "─────────────────" -ForegroundColor $Blue
sqlite3 $DbPath ".tables"

Write-Host ""
Write-Host "👥 Users Data:" -ForegroundColor $Blue
Write-Host "──────────────" -ForegroundColor $Blue
sqlite3 $DbPath "SELECT 
    Email, 
    Role, 
    FirstName || ' ' || LastName AS Name,
    CASE WHEN IsActive = 1 THEN '✅ Active' ELSE '❌ Inactive' END AS Status
FROM Users 
ORDER BY Role;"

Write-Host ""
Write-Host "🏢 Sites Data:" -ForegroundColor $Blue
Write-Host "──────────────" -ForegroundColor $Blue
sqlite3 $DbPath "SELECT 
    Name,
    Location,
    Status,
    printf('%.1f MW', TotalCapacity) AS Capacity,
    printf('%.1f MW', CurrentOutput) AS Output,
    printf('%.1f%%', Efficiency) AS Efficiency
FROM Sites 
ORDER BY TotalCapacity DESC;"

Write-Host ""
Write-Host "⚡ Assets Data:" -ForegroundColor $Blue
Write-Host "───────────────" -ForegroundColor $Blue
sqlite3 $DbPath "SELECT 
    Assets.Name,
    Assets.Type,
    Sites.Name AS Site,
    Assets.Status,
    Assets.Power
FROM Assets 
LEFT JOIN Sites ON Assets.SiteId = Sites.Id
ORDER BY Assets.Type, Assets.Name;"

Write-Host ""
Write-Host "📈 Power Data Statistics:" -ForegroundColor $Blue
Write-Host "──────────────────────────" -ForegroundColor $Blue
sqlite3 $DbPath "SELECT 
    COUNT(*) AS 'Total Records',
    COUNT(DISTINCT SiteId) AS 'Sites',
    MIN(Time) AS 'Earliest Data',
    MAX(Time) AS 'Latest Data',
    printf('%.1f', AVG(Solar)) AS 'Avg Solar (MW)',
    printf('%.1f', AVG(CASE WHEN Wind IS NOT NULL THEN Wind END)) AS 'Avg Wind (MW)',
    printf('%.1f', AVG(Battery)) AS 'Avg Battery (MW)',
    printf('%.1f', AVG(Demand)) AS 'Avg Demand (MW)'
FROM PowerData;"

Write-Host ""
Write-Host "🚨 Alerts Data:" -ForegroundColor $Blue
Write-Host "───────────────" -ForegroundColor $Blue
sqlite3 $DbPath "SELECT 
    Type,
    COUNT(*) AS Count,
    COUNT(CASE WHEN IsRead = 0 THEN 1 END) AS Unread
FROM Alerts 
GROUP BY Type 
ORDER BY Type;"

Write-Host ""
Write-Host "📊 Recent Power Data Sample:" -ForegroundColor $Blue
Write-Host "─────────────────────────────" -ForegroundColor $Blue
sqlite3 $DbPath "SELECT 
    Sites.Name AS Site,
    datetime(PowerData.Time) AS Time,
    printf('%.1f', Solar) AS Solar,
    CASE WHEN Wind IS NOT NULL THEN printf('%.1f', Wind) ELSE 'N/A' END AS Wind,
    printf('%.1f', Battery) AS Battery,
    printf('%.1f', Demand) AS Demand
FROM PowerData 
LEFT JOIN Sites ON PowerData.SiteId = Sites.Id
ORDER BY PowerData.Time DESC 
LIMIT 10;"

Write-Host ""
Write-Host "✅ Database Verification Complete!" -ForegroundColor $Green
Write-Host "=======================================" -ForegroundColor $Green
Write-Host ""
Write-Host "💡 Quick Stats Summary:" -ForegroundColor $Yellow

# Quick stats
$userCount = sqlite3 $DbPath "SELECT COUNT(*) FROM Users;"
$siteCount = sqlite3 $DbPath "SELECT COUNT(*) FROM Sites;"
$assetCount = sqlite3 $DbPath "SELECT COUNT(*) FROM Assets;"
$powerDataCount = sqlite3 $DbPath "SELECT COUNT(*) FROM PowerData;"
$alertCount = sqlite3 $DbPath "SELECT COUNT(*) FROM Alerts;"

Write-Host "   👥 Users: $userCount accounts" -ForegroundColor $Blue
Write-Host "   🏢 Sites: $siteCount energy sites" -ForegroundColor $Blue
Write-Host "   ⚡ Assets: $assetCount energy assets" -ForegroundColor $Blue
Write-Host "   📊 Power Data: $powerDataCount hourly records" -ForegroundColor $Blue
Write-Host "   🚨 Alerts: $alertCount notifications" -ForegroundColor $Blue

Write-Host ""
Write-Host "🎯 Ready for Development!" -ForegroundColor $Green
Write-Host "   🖥️  Backend API: http://localhost:5000" -ForegroundColor $Blue
Write-Host "   🌐 Frontend: http://localhost:5173" -ForegroundColor $Blue
Write-Host "   📚 API Docs: http://localhost:5000/swagger" -ForegroundColor $Blue
Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor $Yellow
Write-Host "   admin@wemdashboard.com / Admin123!" -ForegroundColor $Green
Write-Host "   manager@wemdashboard.com / Manager123!" -ForegroundColor $Green
Write-Host "   operator@wemdashboard.com / Operator123!" -ForegroundColor $Green
Write-Host "   viewer@wemdashboard.com / Viewer123!" -ForegroundColor $Green
Write-Host "   demo@wemdashboard.com / Demo123!" -ForegroundColor $Green
