@echo off
echo 🔍 Entity Classes Verification Script
echo ========================================
echo Checking if all entity classes exist and are properly defined
echo.

REM Check if entity files exist
echo 📋 Checking entity files...

if exist "backend\src\WemDashboard.Domain\Entities\Site.cs" (
    echo ✅ Site.cs found
) else (
    echo ❌ Site.cs MISSING - this will cause build errors
)

if exist "backend\src\WemDashboard.Domain\Entities\Device.cs" (
    echo ✅ Device.cs found
) else (
    echo ❌ Device.cs MISSING - this will cause build errors
)

if exist "backend\src\WemDashboard.Domain\Entities\EnergyReading.cs" (
    echo ✅ EnergyReading.cs found
) else (
    echo ❌ EnergyReading.cs MISSING - this will cause build errors
)

if exist "backend\src\WemDashboard.Domain\Entities\Alert.cs" (
    echo ✅ Alert.cs found
) else (
    echo ❌ Alert.cs MISSING - this will cause build errors
)

echo.
echo 🔍 Checking DbContext file...
if exist "backend\src\WemDashboard.Infrastructure\Data\WemDashboardDbContext.cs" (
    echo ✅ WemDashboardDbContext.cs found
) else (
    echo ❌ WemDashboardDbContext.cs MISSING
)

echo.
echo 📋 If any files are missing, the build will fail.
echo Entity classes need to be created in the Domain project.
echo.
pause