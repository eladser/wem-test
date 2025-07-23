# PostgreSQL Migration Fix Guide

## Issue Diagnosis
Based on your error `Unable to cast object of type 'System.DateTime' to type 'System.String'`, this is a common Entity Framework PostgreSQL migration issue.

## Root Cause
The error occurs when:
1. Seed data contains DateTime values for string-mapped columns
2. SQLite configurations conflict with PostgreSQL
3. Type mappings are incorrect between databases

## Immediate Fix Steps

### 1. Clean Database State
```bash
# Drop the PostgreSQL database
dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext

# Remove problematic migration
dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext
```

### 2. Check for Common Issues
- DateTime properties mapped as strings
- Seed data with incorrect types
- SQLite-specific configurations

### 3. Apply PostgreSQL Fixes
- Configure DateTime columns properly
- Remove problematic seed data temporarily
- Use PostgreSQL-specific type mappings

## Files to Fix
1. `WemDashboardDbContext.cs` - Add PostgreSQL configuration
2. Entity configurations - Fix DateTime mappings
3. Migration files - Clean approach
4. Seed data - Proper type handling

## Next Steps
I'll now examine your actual files and create the specific fixes needed.
