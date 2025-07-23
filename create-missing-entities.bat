@echo off
echo 🔧 Creating Missing Entity Classes
echo ========================================
echo This will create basic entity classes if they don't exist
echo.

set /p confirm="Create missing entity classes? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Entity creation cancelled
    pause
    exit /b 0
)

REM Create Entities directory if it doesn't exist
if not exist "backend\src\WemDashboard.Domain\Entities" (
    mkdir "backend\src\WemDashboard.Domain\Entities"
    echo ✅ Created Entities directory
)

REM Check and create Site.cs
if not exist "backend\src\WemDashboard.Domain\Entities\Site.cs" (
    echo 📝 Creating Site.cs...
    (
    echo using System.ComponentModel.DataAnnotations;
    echo.
    echo namespace WemDashboard.Domain.Entities;
    echo.
    echo public class Site
    echo {
    echo     public int Id { get; set; }
    echo     [Required]
    echo     [MaxLength(200)]
    echo     public string Name { get; set; } = string.Empty;
    echo     [MaxLength(1000)]
    echo     public string? Description { get; set; }
    echo     [MaxLength(500)]
    echo     public string? Location { get; set; }
    echo     public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    echo     public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    echo.
    echo     // Navigation properties
    echo     public virtual ICollection^<Device^> Devices { get; set; } = new List^<Device^>^(^);
    echo     public virtual ICollection^<Alert^> Alerts { get; set; } = new List^<Alert^>^(^);
    echo }
    ) > "backend\src\WemDashboard.Domain\Entities\Site.cs"
    echo ✅ Site.cs created
)

REM Check and create Device.cs
if not exist "backend\src\WemDashboard.Domain\Entities\Device.cs" (
    echo 📝 Creating Device.cs...
    (
    echo using System.ComponentModel.DataAnnotations;
    echo.
    echo namespace WemDashboard.Domain.Entities;
    echo.
    echo public class Device
    echo {
    echo     public int Id { get; set; }
    echo     public int SiteId { get; set; }
    echo     [Required]
    echo     [MaxLength(200)]
    echo     public string Name { get; set; } = string.Empty;
    echo     [Required]
    echo     [MaxLength(100)]
    echo     public string DeviceType { get; set; } = string.Empty;
    echo     [MaxLength(100)]
    echo     public string? SerialNumber { get; set; }
    echo     public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    echo     public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    echo.
    echo     // Navigation properties
    echo     public virtual Site Site { get; set; } = null!;
    echo     public virtual ICollection^<EnergyReading^> EnergyReadings { get; set; } = new List^<EnergyReading^>^(^);
    echo }
    ) > "backend\src\WemDashboard.Domain\Entities\Device.cs"
    echo ✅ Device.cs created
)

echo.
echo ✅ Basic entity creation complete!
echo 📝 Additional entities (EnergyReading, Alert) may need to be created manually
echo 🛠️  Try running the build fix script again
echo.
pause