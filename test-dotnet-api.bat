@echo off
echo 🧪 Testing .NET API on port 5000...
echo.

REM Create a temporary test API
echo Creating minimal test API...
mkdir test-api 2>nul
cd test-api

REM Create a simple Program.cs
echo var builder = WebApplication.CreateBuilder(args); > Program.cs
echo var app = builder.Build(); >> Program.cs
echo. >> Program.cs
echo app.MapGet("/", () =^> "Hello! .NET API is working on port 5000!"); >> Program.cs
echo app.MapGet("/test", () =^> new { status = "OK", timestamp = DateTime.Now }); >> Program.cs
echo. >> Program.cs
echo Console.WriteLine("🚀 Test API running on http://localhost:5000"); >> Program.cs
echo app.Run("http://localhost:5000"); >> Program.cs

REM Create project file
echo ^<Project Sdk="Microsoft.NET.Sdk.Web"^> > test-api.csproj
echo   ^<PropertyGroup^> >> test-api.csproj
echo     ^<TargetFramework^>net8.0^</TargetFramework^> >> test-api.csproj
echo     ^<Nullable^>enable^</Nullable^> >> test-api.csproj
echo     ^<ImplicitUsings^>enable^</ImplicitUsings^> >> test-api.csproj
echo   ^</PropertyGroup^> >> test-api.csproj
echo ^</Project^> >> test-api.csproj

echo.
echo 🚀 Starting test API...
echo 📍 Open browser to: http://localhost:5000
echo 📍 Test endpoint: http://localhost:5000/test
echo.
echo 🛑 Press Ctrl+C to stop
echo.

dotnet run

echo.
echo Cleaning up...
cd ..
rmdir /s /q test-api 2>nul
echo Done.
pause