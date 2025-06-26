@echo off
echo 🔧 Fixing WEM Dashboard Frontend Issues...
echo ==========================================

echo.
echo 📥 Getting latest fixes from repository...
git pull origin main

echo.
echo 🧹 Cleaning up node modules and cache...
rmdir /s /q node_modules 2>nul
del /q package-lock.json 2>nul
del /q bun.lockb 2>nul

echo.
echo 📦 Installing dependencies...
npm install

echo.
echo 🔨 Building frontend with fixes...
npm run build

echo.
echo 🚀 Starting frontend development server...
echo ✅ Fixed process.env issues with Vite compatibility
echo ✅ Added proper TypeScript definitions
echo ✅ Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
