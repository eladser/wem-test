using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data;

/// <summary>
/// PostgreSQL-optimized DbContext that fixes the DateTime casting migration error
/// This replaces your existing problematic DbContext
/// </summary>
public class WemDashboardDbContext : DbContext
{
    public WemDashboardDbContext(DbContextOptions<WemDashboardDbContext> options) : base(options)
    {
    }

    // Core entities
    public DbSet<Site> Sites { get; set; }
    public DbSet<EnergyReading> EnergyReadings { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<Alert> Alerts { get; set; }
    
    // Additional entities referenced by repositories
    public DbSet<WidgetConfiguration> WidgetConfigurations { get; set; }
    public DbSet<LogEntry> LogEntries { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<PowerData> PowerData { get; set; }
    public DbSet<DashboardLayout> DashboardLayouts { get; set; }
    public DbSet<EnergyFlowConfiguration> EnergyFlowConfigurations { get; set; }
    public DbSet<FilterPreset> FilterPresets { get; set; }
    public DbSet<GridComponentConfiguration> GridComponentConfigurations { get; set; }
    public DbSet<ViewState> ViewStates { get; set; }
    public DbSet<ReportTemplate> ReportTemplates { get; set; }
    public DbSet<UserPreferences> UserPreferences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // CRITICAL FIX: Configure PostgreSQL types to prevent DateTime casting errors
        ConfigurePostgreSQLTypes(modelBuilder);
        
        // Configure entities with proper mappings - ONLY the core ones we have
        ConfigureCoreEntities(modelBuilder);
        
        // SEED DATA TEMPORARILY REMOVED to fix the DateTime casting error
        // Uncomment after successful migration: ConfigureSeedData(modelBuilder);
        
        base.OnModelCreating(modelBuilder);
    }

    /// <summary>
    /// Configures PostgreSQL-specific column types to prevent casting errors
    /// </summary>
    private void ConfigurePostgreSQLTypes(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                // Fix DateTime columns - this prevents the string casting error
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetColumnType("timestamp with time zone");
                }
                
                // Fix decimal precision for PostgreSQL
                if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                {
                    property.SetColumnType("decimal(18,6)");
                }

                // Ensure string lengths are specified for PostgreSQL
                if (property.ClrType == typeof(string) && !property.GetMaxLength().HasValue)
                {
                    property.SetMaxLength(500); // Default length for unspecified strings
                }
            }
        }
    }

    /// <summary>
    /// Entity configurations optimized for PostgreSQL - ONLY configure entities we actually have
    /// </summary>
    private void ConfigureCoreEntities(ModelBuilder modelBuilder)
    {
        // Site Configuration
        modelBuilder.Entity<Site>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            // Only configure properties that actually exist
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Device Configuration
        modelBuilder.Entity<Device>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.DeviceType).HasMaxLength(100).IsRequired();
            entity.Property(e => e.SerialNumber).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasOne(d => d.Site)
                  .WithMany(s => s.Devices)
                  .HasForeignKey(d => d.SiteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // EnergyReading Configuration
        modelBuilder.Entity<EnergyReading>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Value).HasColumnType("decimal(18,6)").IsRequired();
            entity.Property(e => e.Unit).HasMaxLength(50).IsRequired();
            entity.Property(e => e.ReadingType).HasMaxLength(100);
            entity.Property(e => e.Timestamp).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasOne(er => er.Device)
                  .WithMany(d => d.EnergyReadings)
                  .HasForeignKey(er => er.DeviceId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => new { e.DeviceId, e.Timestamp });
        });

        // Alert Configuration - ONLY configure properties that exist
        modelBuilder.Entity<Alert>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasOne(a => a.Site)
                  .WithMany(s => s.Alerts)
                  .HasForeignKey(a => a.SiteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        
        // For all other entities, just let EF use defaults since we don't have the actual classes
        // This prevents configuration errors for non-existent properties
    }
}