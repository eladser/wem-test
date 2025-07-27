# Database Management Guide - WEM Dashboard

## 📋 Overview

This guide explains how to add new tables, modify existing tables, and manage database schema changes in the WEM Dashboard project using Entity Framework Core with PostgreSQL.

## 🏗️ Architecture Overview

The project follows **Code-First** approach with Entity Framework Core:

```
Domain Layer (Entities) → EF Core → PostgreSQL Database
```

**Key Components:**
- **Entities**: `backend/src/WemDashboard.Domain/Entities/`
- **Configurations**: `backend/src/WemDashboard.Infrastructure/Data/Configurations/`
- **DbContext**: `backend/src/WemDashboard.Infrastructure/Data/WemDashboardDbContext.cs`
- **Migrations**: `backend/src/WemDashboard.Infrastructure/Migrations/`

---

## 🆕 Adding New Tables to the Database

### Step 1: Create the Entity Class

Create a new entity in `backend/src/WemDashboard.Domain/Entities/`:

```csharp
// Example: backend/src/WemDashboard.Domain/Entities/WeatherData.cs
using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class WeatherData
{
    public int Id { get; set; }
    
    [Required]
    public int SiteId { get; set; }  // Foreign key to Site
    
    [Required]
    public DateTime Timestamp { get; set; }
    
    public double Temperature { get; set; }
    public double Humidity { get; set; }
    public double WindSpeed { get; set; }
    public string? WeatherCondition { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Site Site { get; set; } = null!;
}
```

### Step 2: Create Entity Configuration

Create configuration in `backend/src/WemDashboard.Infrastructure/Data/Configurations/`:

```csharp
// Example: backend/src/WemDashboard.Infrastructure/Data/Configurations/WeatherDataConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data.Configurations;

public class WeatherDataConfiguration : IEntityTypeConfiguration<WeatherData>
{
    public void Configure(EntityTypeBuilder<WeatherData> builder)
    {
        builder.HasKey(w => w.Id);
        
        builder.Property(w => w.SiteId)
            .IsRequired();
        
        builder.Property(w => w.Timestamp)
            .IsRequired();
            
        builder.Property(w => w.Temperature)
            .HasPrecision(5, 2)
            .IsRequired();
            
        builder.Property(w => w.Humidity)
            .HasPrecision(5, 2)
            .IsRequired();
            
        builder.Property(w => w.WindSpeed)
            .HasPrecision(6, 2)
            .IsRequired();
            
        builder.Property(w => w.WeatherCondition)
            .HasMaxLength(100);
            
        builder.Property(w => w.CreatedAt)
            .IsRequired();

        // Configure foreign key relationship
        builder.HasOne(w => w.Site)
            .WithMany() // Add to Site entity if needed: s => s.WeatherData
            .HasForeignKey(w => w.SiteId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Indexes for performance
        builder.HasIndex(w => w.SiteId);
        builder.HasIndex(w => w.Timestamp);
        builder.HasIndex(w => new { w.SiteId, w.Timestamp });
    }
}
```

### Step 3: Add DbSet to DbContext

Update `backend/src/WemDashboard.Infrastructure/Data/WemDashboardDbContext.cs`:

```csharp
public class WemDashboardDbContext : IdentityDbContext<User>
{
    // ... existing DbSets ...
    
    // Add your new DbSet
    public DbSet<WeatherData> WeatherData { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ... existing configurations ...
        
        // Add your new configuration
        modelBuilder.ApplyConfiguration(new WeatherDataConfiguration());
    }
}
```

### Step 4: Update Related Entities (Optional)

If you want navigation properties from other entities:

```csharp
// In backend/src/WemDashboard.Domain/Entities/Site.cs
public class Site
{
    // ... existing properties ...
    
    // Add navigation property
    public virtual ICollection<WeatherData> WeatherData { get; set; } = new List<WeatherData>();
}
```

### Step 5: Create and Apply Migration

```bash
# Navigate to backend directory
cd backend

# Create migration
dotnet ef migrations add AddWeatherDataTable --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Apply migration
dotnet ef database update --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
```

---

## 🔧 Adding Fields to Existing Tables

### Step 1: Modify the Entity

```csharp
// Example: Adding fields to existing PowerData entity
public class PowerData
{
    // ... existing properties ...
    
    // Add new fields
    public double? GridFrequency { get; set; }
    public string? DataQuality { get; set; }
    public DateTime? LastCalibration { get; set; }
}
```

### Step 2: Update Entity Configuration

```csharp
// In PowerDataConfiguration.cs
public void Configure(EntityTypeBuilder<PowerData> builder)
{
    // ... existing configurations ...
    
    // Add new field configurations
    builder.Property(p => p.GridFrequency)
        .HasPrecision(8, 4);
        
    builder.Property(p => p.DataQuality)
        .HasMaxLength(50);
        
    builder.Property(p => p.LastCalibration);
    
    // Add indexes if needed
    builder.HasIndex(p => p.DataQuality);
}
```

### Step 3: Create and Apply Migration

```bash
# Create migration
dotnet ef migrations add AddFieldsToPowerData --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Apply migration
dotnet ef database update --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
```

---

## 📝 Data Types Reference

### Common Entity Framework Data Types

```csharp
// Primary Keys
public int Id { get; set; }                    // Auto-incrementing integer
public string Id { get; set; }                 // String primary key
public Guid Id { get; set; }                   // GUID primary key

// Foreign Keys
public int SiteId { get; set; }                // Required foreign key
public int? SiteId { get; set; }               // Optional foreign key

// Text Fields
public string Name { get; set; }               // Required string (nvarchar(max))
public string? Description { get; set; }       // Optional string
[MaxLength(100)]
public string Code { get; set; }               // Limited length string

// Numbers
public int Count { get; set; }                 // Integer
public long LargeNumber { get; set; }          // Long integer
public double Temperature { get; set; }        // Double precision
public decimal Price { get; set; }             // Decimal (for money)
public float Ratio { get; set; }               // Float

// Dates
public DateTime CreatedAt { get; set; }        // Date and time
public DateOnly Date { get; set; }             // Date only (.NET 6+)
public TimeOnly Time { get; set; }             // Time only (.NET 6+)
public DateTime? UpdatedAt { get; set; }       // Optional datetime

// Booleans
public bool IsActive { get; set; }             // Boolean
public bool? IsVerified { get; set; }          // Optional boolean

// JSON/Complex Types
public string ConfigJson { get; set; }         // Store JSON as string
```

### PostgreSQL-Specific Configuration

```csharp
// In entity configuration
builder.Property(p => p.Price)
    .HasPrecision(18, 2)                       // NUMERIC(18,2)
    .IsRequired();

builder.Property(p => p.Data)
    .HasColumnType("jsonb");                   // PostgreSQL JSONB

builder.Property(p => p.Tags)
    .HasColumnType("text[]");                  // PostgreSQL array
```

---

## 🔄 Repository Pattern Implementation

### Step 1: Create Repository Interface

```csharp
// backend/src/WemDashboard.Domain/Interfaces/IWeatherDataRepository.cs
namespace WemDashboard.Domain.Interfaces;

public interface IWeatherDataRepository
{
    Task<IEnumerable<WeatherData>> GetBySiteIdAsync(int siteId);
    Task<IEnumerable<WeatherData>> GetByDateRangeAsync(DateTime from, DateTime to);
    Task<WeatherData?> GetLatestBySiteAsync(int siteId);
    Task<WeatherData> CreateAsync(WeatherData weatherData);
    Task<WeatherData> UpdateAsync(WeatherData weatherData);
    Task DeleteAsync(int id);
}
```

### Step 2: Implement Repository

```csharp
// backend/src/WemDashboard.Infrastructure/Repositories/WeatherDataRepository.cs
using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Interfaces;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Repositories;

public class WeatherDataRepository : Repository<WeatherData>, IWeatherDataRepository
{
    public WeatherDataRepository(WemDashboardDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<WeatherData>> GetBySiteIdAsync(int siteId)
    {
        return await _dbSet
            .Where(w => w.SiteId == siteId)
            .Include(w => w.Site)
            .OrderByDescending(w => w.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<WeatherData>> GetByDateRangeAsync(DateTime from, DateTime to)
    {
        return await _dbSet
            .Where(w => w.Timestamp >= from && w.Timestamp <= to)
            .Include(w => w.Site)
            .OrderBy(w => w.Timestamp)
            .ToListAsync();
    }

    public async Task<WeatherData?> GetLatestBySiteAsync(int siteId)
    {
        return await _dbSet
            .Where(w => w.SiteId == siteId)
            .Include(w => w.Site)
            .OrderByDescending(w => w.Timestamp)
            .FirstOrDefaultAsync();
    }

    public async Task<WeatherData> CreateAsync(WeatherData weatherData)
    {
        await _dbSet.AddAsync(weatherData);
        await _context.SaveChangesAsync();
        return weatherData;
    }

    public async Task<WeatherData> UpdateAsync(WeatherData weatherData)
    {
        _dbSet.Update(weatherData);
        await _context.SaveChangesAsync();
        return weatherData;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
```

### Step 3: Register in DI Container

```csharp
// In backend/src/WemDashboard.Infrastructure/DependencyInjection.cs
public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
{
    // ... existing registrations ...
    
    // Add your new repository
    services.AddScoped<IWeatherDataRepository, WeatherDataRepository>();
    
    return services;
}
```

---

## 🚀 Migration Commands Reference

### Basic Commands

```bash
# Navigate to backend directory first
cd backend

# Create a new migration
dotnet ef migrations add MigrationName --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Apply migrations to database
dotnet ef database update --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# List all migrations
dotnet ef migrations list --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Remove last migration (if not applied to database)
dotnet ef migrations remove --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Generate SQL script from migrations
dotnet ef migrations script --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
```

### Advanced Commands

```bash
# Rollback to specific migration
dotnet ef database update MigrationName --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Generate script for specific migration range
dotnet ef migrations script FromMigration ToMigration --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Drop database
dotnet ef database drop --context WemDashboardDbContext --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
```

---

## ⚠️ Important Guidelines

### 1. **ALWAYS Follow This Order:**
1. Create/modify entity
2. Create/update configuration
3. Update DbContext if needed
4. Create migration
5. Review migration file
6. Apply migration

### 2. **Foreign Key Consistency:**
- Use `int` for all SiteId foreign keys (matches `Site.Id`)
- Use `string` for UserId foreign keys (matches `User.Id`)

### 3. **Naming Conventions:**
- **Entities**: PascalCase, singular (e.g., `WeatherData`, `PowerReading`)
- **Properties**: PascalCase (e.g., `SiteId`, `CreatedAt`)
- **Tables**: Pluralized by EF (e.g., `WeatherData` → `WeatherData` table)

### 4. **Required vs Optional:**
```csharp
public string Name { get; set; }           // Required (will be NOT NULL)
public string? Description { get; set; }   // Optional (will be NULL allowed)
public int SiteId { get; set; }           // Required foreign key
public int? SiteId { get; set; }          // Optional foreign key
```

### 5. **Index Best Practices:**
- Add indexes on foreign keys
- Add indexes on frequently queried columns
- Consider composite indexes for multi-column queries

---

## 🔍 Testing Your Changes

### 1. **Verify Migration:**
```bash
# Check that migration was created
ls backend/src/WemDashboard.Infrastructure/Migrations/

# Review the generated migration
cat backend/src/WemDashboard.Infrastructure/Migrations/*_YourMigrationName.cs
```

### 2. **Test Database Changes:**
```sql
-- Connect to PostgreSQL
psql -U wem_admin -h localhost -d wemdashboard

-- Check new table was created
\dt

-- Check table structure
\d "YourTableName"

-- Test inserting data
INSERT INTO "YourTableName" (column1, column2) VALUES (value1, value2);
```

### 3. **Test API Integration:**
Create a simple test to ensure your repository works:

```csharp
// In your test project or temporarily in a controller
var newWeatherData = new WeatherData
{
    SiteId = 1,
    Timestamp = DateTime.UtcNow,
    Temperature = 25.5,
    Humidity = 60.0,
    WindSpeed = 5.2
};

var result = await _weatherDataRepository.CreateAsync(newWeatherData);
```

---

## 📚 Additional Resources

- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [EF Core Migrations](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Fluent API Configuration](https://docs.microsoft.com/en-us/ef/core/modeling/)

---

## 🆘 Troubleshooting

### Common Issues:

1. **Migration Fails:**
   - Check entity relationships
   - Verify foreign key types match
   - Ensure required properties are not null

2. **Build Errors After Adding Entity:**
   - Verify namespace imports
   - Check that configuration is applied in DbContext
   - Ensure repository is registered in DI

3. **Foreign Key Violations:**
   - Check that referenced entities exist
   - Verify foreign key data types match
   - Consider using `.OnDelete(DeleteBehavior.Cascade)` appropriately

For additional help, refer to the existing entities in the project as examples.
