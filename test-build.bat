@echo off
echo 🔨 Testing compilation after fixes...
echo 📁 Navigating to API project directory...

cd backend\src\WemDashboard.API

echo 🧹 Cleaning previous builds...
dotnet clean --verbosity quiet

echo 📦 Restoring packages...
dotnet restore --verbosity quiet

echo 🔨 Building project...
dotnet build --configuration Debug --verbosity normal

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ 🎉 BUILD SUCCESSFUL!
    echo ✅ All compilation errors have been fixed
    echo ✅ Ready to run PostgreSQL migrations
    echo.
    echo 🚀 Next steps:
    echo 1. Run the migration script: ..\..\..\fix-postgresql-migration.bat
    echo 2. Start your application: npm run start-backend
    echo.
) else (
    echo.
    echo ❌ Build failed - there may be additional issues to fix
    echo 📋 Please review the error messages above
    echo.
    pause
    exit /b 1
)

pause
