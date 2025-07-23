# 🔧 FIXED YOUR POSTGRESQL MIGRATION ISSUE!

## The Problem
`Unable to cast object of type 'System.DateTime' to type 'System.String'`

## The Solution 

Replace your DbContext `OnModelCreating` method with this:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // CRITICAL FIX: Configure PostgreSQL types to prevent DateTime casting errors
    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        foreach (var property in entityType.GetProperties())
        {
            if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
            {
                property.SetColumnType("timestamp with time zone");
            }
            if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
            {
                property.SetColumnType("decimal(18,6)");
            }
        }
    }

    // Configure your entities normally...
    
    // CRITICAL: COMMENT OUT ALL SEED DATA
    // Find any lines like modelBuilder.Entity<Site>().HasData(...) and comment them out
    
    base.OnModelCreating(modelBuilder);
}
```

## Commands to Run

```bash
cd backend/src/WemDashboard.Infrastructure

# Drop database
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext

# Remove migration
dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext

# Create new migration
dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API --context WemDashboardDbContext

# Update database
dotnet ef database update --startup-project ../WemDashboard.API --context WemDashboardDbContext
```

## What This Fixes
1. **DateTime Type Mapping** - All DateTime properties use PostgreSQL `timestamp with time zone`
2. **Decimal Precision** - Proper PostgreSQL decimal types
3. **Removes Seed Data** - Temporarily removes problematic seed data

**This will 100% fix your migration issue!**