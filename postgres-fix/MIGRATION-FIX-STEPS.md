# PostgreSQL Migration Fix

## Error Fixed
`Unable to cast object of type 'System.DateTime' to type 'System.String'`

## Solution Steps

1. **Replace your DbContext** with the fixed version
2. **Drop database**: `dotnet ef database drop --force --startup-project ../WemDashboard.API --context WemDashboardDbContext`
3. **Remove migration**: `dotnet ef migrations remove --startup-project ../WemDashboard.API --context WemDashboardDbContext`
4. **Create new migration**: `dotnet ef migrations add InitialPostgreSQLMigration --startup-project ../WemDashboard.API --context WemDashboardDbContext`
5. **Update database**: `dotnet ef database update --startup-project ../WemDashboard.API --context WemDashboardDbContext`

## Key Fix
The fixed DbContext configures all DateTime properties as PostgreSQL `timestamp with time zone` and removes seed data that was causing the casting error.