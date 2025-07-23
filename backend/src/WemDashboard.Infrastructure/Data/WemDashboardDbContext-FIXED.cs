using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data;

public class WemDashboardDbContext : DbContext
{
    public WemDashboardDbContext(DbContextOptions<WemDashboardDbContext> options) : base(options)
    {
    }

    public DbSet<Site> Sites { get; set; }
    public DbSet<EnergyReading> EnergyReadings { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<Alert> Alerts { get; set; }

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

        // SEED DATA REMOVED TO FIX MIGRATION
        base.OnModelCreating(modelBuilder);
    }
}