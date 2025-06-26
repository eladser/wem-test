@echo off
echo 🧪 Testing different ports for .NET API...
echo.

for %%p in (5000 5001 5002 8080 8081) do (
    echo Testing port %%p...
    netstat -an | findstr :%%p
    if errorlevel 1 (
        echo ✅ Port %%p is available
    ) else (
        echo ❌ Port %%p is in use
    )
    echo.
)

echo 💡 Try using one of the available ports above
pause