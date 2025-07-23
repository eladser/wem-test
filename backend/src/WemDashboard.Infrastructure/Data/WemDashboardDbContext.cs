using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;
using WemDashboard.Infrastructure.Data.Configurations;

namespace WemDashboard.Infrastructure.Data;

public class WemDashboardDbContext : DbContext
{
    public WemDashboardDbContext(DbContextOptions<WemDashboardDbContext> options) : base(options)
    {
    }

    // Original entities
    public DbSet<Site> Sites { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<PowerData> PowerData { get; set; }
    public DbSet<Alert> Alerts { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    
    // New settings and configuration entities
    public DbSet<UserPreferences> UserPreferences { get; set; }
    public DbSet<DashboardLayout> DashboardLayouts { get; set; }
    public DbSet<WidgetConfiguration> WidgetConfigurations { get; set; }
    public DbSet<GridComponentConfiguration> GridComponentConfigurations { get; set; }
    public DbSet<EnergyFlowConfiguration> EnergyFlowConfigurations { get; set; }
    public DbSet<FilterPreset> FilterPresets { get; set; }
    public DbSet<ReportTemplate> ReportTemplates { get; set; }
    public DbSet<ViewState> ViewStates { get; set; }
    
    // Logging entity
    public DbSet<LogEntry> LogEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations
        modelBuilder.ApplyConfiguration(new SiteConfiguration());
        modelBuilder.ApplyConfiguration(new AssetConfiguration());
        modelBuilder.ApplyConfiguration(new PowerDataConfiguration());
        modelBuilder.ApplyConfiguration(new AlertConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new LogEntryConfiguration());

        // Configure new entities relationships
        ConfigureUserPreferences(modelBuilder);
        ConfigureDashboardLayouts(modelBuilder);
        ConfigureWidgetConfigurations(modelBuilder);
        ConfigureGridComponentConfigurations(modelBuilder);
        ConfigureEnergyFlowConfigurations(modelBuilder);
        ConfigureFilterPresets(modelBuilder);
        ConfigureReportTemplates(modelBuilder);
        ConfigureViewStates(modelBuilder);

        // Global query filters for soft delete (if implemented later)
        // modelBuilder.Entity<Site>().HasQueryFilter(e => !e.IsDeleted);

        // Seed data (optional)
        SeedData(modelBuilder);
    }

    private static void ConfigureUserPreferences(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserPreferences>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.Theme).HasMaxLength(50).HasDefaultValue("dark");
            entity.Property(e => e.Language).HasMaxLength(10).HasDefaultValue("en");
            entity.Property(e => e.TimeZone).HasMaxLength(100).HasDefaultValue("UTC");
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureDashboardLayouts(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DashboardLayout>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.PageName, e.LayoutName });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.LayoutName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PageName).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureWidgetConfigurations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WidgetConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.WidgetId });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.WidgetId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.WidgetType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PageName).HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.DashboardLayout)
                .WithMany()
                .HasForeignKey(e => e.DashboardLayoutId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureGridComponentConfigurations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GridComponentConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ComponentId });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.ComponentId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ComponentType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Status).HasMaxLength(50);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Site)
                .WithMany()
                .HasForeignKey(e => e.SiteId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureEnergyFlowConfigurations(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EnergyFlowConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.FlowId });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.FlowId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FromComponentId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ToComponentId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(20);
            entity.Property(e => e.LineStyle).HasMaxLength(20);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Site)
                .WithMany()
                .HasForeignKey(e => e.SiteId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureFilterPresets(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FilterPreset>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.PageName, e.Name });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PageName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureReportTemplates(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ReportTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.Name });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ReportType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ExportFormat).HasMaxLength(20);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureViewStates(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ViewState>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.PageName, e.StateKey });
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.PageName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.StateKey).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void SeedData(ModelBuilder modelBuilder)
{
    // Seed default admin user
    var adminUser = new User
    {
        Id = "admin-user-id",
        Email = "admin@wemdashboard.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
        FirstName = "System",
        LastName = "Administrator",
        Role = UserRole.Admin,
        IsActive = true,
        CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        LastLogin = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
    };

    modelBuilder.Entity<User>().HasData(adminUser);

    // Seed sample sites - use double for TotalCapacity
    var sites = new[]
    {
        new Site
        {
            Id = "site-a",
            Name = "Main Campus",
            Location = "California, USA",
            Region = "north-america",
            Status = SiteStatus.Online,
            TotalCapacity = 25.5,  // Changed from 25.5m to 25.5 (double)
            CurrentOutput = 18.2,
            Efficiency = 94.2,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            LastUpdate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        },
        new Site
        {
            Id = "site-b",
            Name = "Warehouse Complex",
            Location = "Texas, USA",
            Region = "north-america",
            Status = SiteStatus.Online,
            TotalCapacity = 15.8,  // Changed from 15.8m to 15.8 (double)
            CurrentOutput = 12.1,
            Efficiency = 91.5,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            LastUpdate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        },
        new Site
        {
            Id = "site-c",
            Name = "Office Complex",
            Location = "Berlin, Germany",
            Region = "europe",
            Status = SiteStatus.Maintenance,
            TotalCapacity = 12.3,  // Changed from 12.3m to 12.3 (double)
            CurrentOutput = 0,
            Efficiency = 0,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            LastUpdate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddHours(-2)
        },
        new Site
        {
            Id = "site-d",
            Name = "Manufacturing Plant",
            Location = "Tokyo, Japan",
            Region = "asia-pacific",
            Status = SiteStatus.Online,
            TotalCapacity = 32.1,  // Changed from 32.1m to 32.1 (double)
            CurrentOutput = 28.7,
            Efficiency = 96.8,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            LastUpdate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        }
    };

    modelBuilder.Entity<Site>().HasData(sites);

    // Seed default user preferences for admin
    var adminPreferences = new UserPreferences
    {
        Id = 1,
        UserId = "admin-user-id",
        Theme = "dark",
        Language = "en",
        TimeZone = "UTC",
        CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
    };

    modelBuilder.Entity<UserPreferences>().HasData(adminPreferences);
}

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Update timestamps
        var entries = ChangeTracker.Entries()
            .Where(e => e.State is EntityState.Added or EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity.GetType().GetProperty("UpdatedAt") != null)
            {
                entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
            }

            if (entry.State == EntityState.Added &&
                entry.Entity.GetType().GetProperty("CreatedAt") != null)
            {
                entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
