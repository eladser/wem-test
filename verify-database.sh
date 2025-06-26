#!/bin/bash

# 🔍 WEM Dashboard Database Verification Script
# Verifies SQLite database contents and structure

set -e

echo "🔍 WEM Dashboard Database Verification"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database file path
DB_PATH="backend/src/WemDashboard.API/wemdashboard-dev.db"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Database file not found: $DB_PATH${NC}"
    echo -e "${YELLOW}💡 Run './setup-sqlite-dev.sh' first to create the database${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database file found: $DB_PATH${NC}"

# Check if sqlite3 is available
if ! command -v sqlite3 &> /dev/null; then
    echo -e "${YELLOW}⚠️ sqlite3 command not found. Installing...${NC}"
    
    # Try to install sqlite3 based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sqlite3
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install sqlite3
    else
        echo -e "${RED}❌ Unable to install sqlite3 automatically${NC}"
        echo "Please install sqlite3 manually for your operating system"
        exit 1
    fi
fi

echo -e "${BLUE}📊 Database Information:${NC}"
echo "────────────────────────"

# Database size
DB_SIZE=$(stat -f%z "$DB_PATH" 2>/dev/null || stat -c%s "$DB_PATH" 2>/dev/null || echo "unknown")
echo "📏 File size: $(echo $DB_SIZE | awk '{print $1/1024/1024 " MB"}')"

# Database tables
echo ""
echo -e "${BLUE}📋 Database Tables:${NC}"
echo "─────────────────"
sqlite3 "$DB_PATH" ".tables"

echo ""
echo -e "${BLUE}👥 Users Data:${NC}"
echo "──────────────"
sqlite3 "$DB_PATH" "SELECT 
    Email, 
    Role, 
    FirstName || ' ' || LastName AS Name,
    CASE WHEN IsActive = 1 THEN '✅ Active' ELSE '❌ Inactive' END AS Status
FROM Users 
ORDER BY Role;"

echo ""
echo -e "${BLUE}🏢 Sites Data:${NC}"
echo "──────────────"
sqlite3 "$DB_PATH" "SELECT 
    Name,
    Location,
    Status,
    printf('%.1f MW', TotalCapacity) AS Capacity,
    printf('%.1f MW', CurrentOutput) AS Output,
    printf('%.1f%%', Efficiency) AS Efficiency
FROM Sites 
ORDER BY TotalCapacity DESC;"

echo ""
echo -e "${BLUE}⚡ Assets Data:${NC}"
echo "───────────────"
sqlite3 "$DB_PATH" "SELECT 
    Assets.Name,
    Assets.Type,
    Sites.Name AS Site,
    Assets.Status,
    Assets.Power
FROM Assets 
LEFT JOIN Sites ON Assets.SiteId = Sites.Id
ORDER BY Assets.Type, Assets.Name;"

echo ""
echo -e "${BLUE}📈 Power Data Statistics:${NC}"
echo "──────────────────────────"
sqlite3 "$DB_PATH" "SELECT 
    COUNT(*) AS 'Total Records',
    COUNT(DISTINCT SiteId) AS 'Sites',
    MIN(Time) AS 'Earliest Data',
    MAX(Time) AS 'Latest Data',
    printf('%.1f', AVG(Solar)) AS 'Avg Solar (MW)',
    printf('%.1f', AVG(CASE WHEN Wind IS NOT NULL THEN Wind END)) AS 'Avg Wind (MW)',
    printf('%.1f', AVG(Battery)) AS 'Avg Battery (MW)',
    printf('%.1f', AVG(Demand)) AS 'Avg Demand (MW)'
FROM PowerData;"

echo ""
echo -e "${BLUE}🚨 Alerts Data:${NC}"
echo "───────────────"
sqlite3 "$DB_PATH" "SELECT 
    Type,
    COUNT(*) AS Count,
    COUNT(CASE WHEN IsRead = 0 THEN 1 END) AS Unread
FROM Alerts 
GROUP BY Type 
ORDER BY Type;"

echo ""
echo -e "${BLUE}📊 Recent Power Data Sample:${NC}"
echo "─────────────────────────────"
sqlite3 "$DB_PATH" "SELECT 
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

echo ""
echo -e "${GREEN}✅ Database Verification Complete!${NC}"
echo "======================================="
echo ""
echo -e "${YELLOW}💡 Quick Stats Summary:${NC}"

# Quick stats
USER_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Users;")
SITE_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Sites;")
ASSET_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Assets;")
POWER_DATA_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM PowerData;")
ALERT_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Alerts;")

echo "   👥 Users: $USER_COUNT accounts"
echo "   🏢 Sites: $SITE_COUNT energy sites"
echo "   ⚡ Assets: $ASSET_COUNT energy assets"
echo "   📊 Power Data: $POWER_DATA_COUNT hourly records"
echo "   🚨 Alerts: $ALERT_COUNT notifications"

echo ""
echo -e "${GREEN}🎯 Ready for Development!${NC}"
echo "   🖥️  Backend API: http://localhost:5000"
echo "   🌐 Frontend: http://localhost:5173"
echo "   📚 API Docs: http://localhost:5000/swagger"
echo ""
echo -e "${YELLOW}🔐 Test Credentials:${NC}"
echo "   admin@wemdashboard.com / Admin123!"
echo "   manager@wemdashboard.com / Manager123!"
echo "   operator@wemdashboard.com / Operator123!"
echo "   viewer@wemdashboard.com / Viewer123!"
echo "   demo@wemdashboard.com / Demo123!"
