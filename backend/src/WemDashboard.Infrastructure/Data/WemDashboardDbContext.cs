using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Infrastructure.Data;

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
    public DbSet<User> User { get; set; }
    
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
    public DbSet<RefreshToken> RefreshToken { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure PostgreSQL types to prevent DateTime casting errors
        ConfigurePostgreSQLTypes(modelBuilder);
        
        // Configure entities with proper mappings
        ConfigureCoreEntities(modelBuilder);
        
        // Add seed data
        ConfigureSeedData(modelBuilder);
        
        base.OnModelCreating(modelBuilder);
    }

    private void ConfigurePostgreSQLTypes(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                // Fix DateTime columns
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

    private void ConfigureCoreEntities(ModelBuilder modelBuilder)
    {
        // Site Configuration
        modelBuilder.Entity<Site>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasIndex(e => e.Name);
        });

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserName).HasMaxLength(256);
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
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

        // Alert Configuration
        modelBuilder.Entity<Alert>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasOne(a => a.Site)
                  .WithMany(s => s.Alerts)
                  .HasForeignKey(a => a.SiteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Asset Configuration
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasOne(a => a.Site)
                  .WithMany(s => s.Assets)
                  .HasForeignKey(a => a.SiteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PowerData Configuration
        modelBuilder.Entity<PowerData>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Time).HasColumnType("timestamp with time zone").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone").IsRequired();
            
            entity.HasOne(p => p.Site)
                  .WithMany(s => s.PowerData)
                  .HasForeignKey(p => p.SiteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private void ConfigureSeedData(ModelBuilder modelBuilder)
    {
        // Seed Sites
        modelBuilder.Entity<Site>().HasData(
            new Site
            {
                Id = 1,
                Name = "Main Solar Farm",
                Description = "Primary solar energy production facility",
                Location = "California, USA",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Site
            {
                Id = 2,
                Name = "Wind Farm North",
                Description = "Northern wind energy facility", 
                Location = "Texas, USA",
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Site
            {
                Id = 3,
                Name = "Hybrid Energy Station",
                Description = "Combined solar and wind facility",
                Location = "Arizona, USA", 
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            }
        );

        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = "user-1",
                UserName = "admin@wemdashboard.com",
                NormalizedUserName = "ADMIN@WEMDASHBOARD.COM",
                Email = "admin@wemdashboard.com",
                NormalizedEmail = "ADMIN@WEMDASHBOARD.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            },
            new User
            {
                Id = "user-2", 
                UserName = "operator@wemdashboard.com",
                NormalizedUserName = "OPERATOR@WEMDASHBOARD.COM",
                Email = "operator@wemdashboard.com",
                NormalizedEmail = "OPERATOR@WEMDASHBOARD.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            }
        );
    }
}