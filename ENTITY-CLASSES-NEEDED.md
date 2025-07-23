# 🚨 Build Error Fix - Missing Entity Classes

## Problem
Your build is failing because entity classes are missing or have compilation errors.

## Required Entity Classes

Your DbContext references these entities that need to exist in `backend/src/WemDashboard.Domain/Entities/`:

### 1. Site.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class Site
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    public string? Location { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    public virtual ICollection<Alert> Alerts { get; set; } = new List<Alert>();
}
```

### 2. Device.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class Device
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string DeviceType { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? SerialNumber { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Site Site { get; set; } = null!;
    public virtual ICollection<EnergyReading> EnergyReadings { get; set; } = new List<EnergyReading>();
}
```

### 3. EnergyReading.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class EnergyReading
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    
    [Required]
    public decimal Value { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Unit { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? ReadingType { get; set; }
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Device Device { get; set; } = null!;
}
```

### 4. Alert.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class Alert
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string? Message { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Severity { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public virtual Site Site { get; set; } = null!;
}
```

## Fix Steps

### Option 1: Run Automated Script
```bash
check-entity-classes.bat  # Check what's missing
create-missing-entities.bat  # Create basic entities
fix-build-errors.bat  # Verify build works
```

### Option 2: Manual Creation
1. Create the `backend/src/WemDashboard.Domain/Entities/` directory
2. Create each entity class file with the code above
3. Build the solution: `dotnet build`
4. Run the migration script again

## After Creating Entities

1. **Build the solution**:
   ```bash
   dotnet build
   ```

2. **Run migration again**:
   ```bash
   run-full-migration.bat
   ```

## Common Issues

- **Namespace mismatch**: Ensure all entities use `WemDashboard.Domain.Entities`
- **Missing using statements**: Add `System.ComponentModel.DataAnnotations`
- **Project references**: Ensure Infrastructure project references Domain project

**Create these entity classes and your build will succeed!**