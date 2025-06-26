using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Infrastructure.Data.Configurations;

namespace WemDashboard.Infrastructure.Data;

public class WemDashboardDbContext : DbContext
{
    public WemDashboardDbContext(DbContextOptions<WemDashboardDbContext> options) : base(options)
    {
    }

    public DbSet<Site> Sites { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<PowerData> PowerData { get; set; }
    public DbSet<Alert> Alerts { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

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

        // Global query filters for soft delete (if implemented later)
        // modelBuilder.Entity<Site>().HasQueryFilter(e => !e.IsDeleted);

        // Seed data (optional)
        SeedData(modelBuilder);
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
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow
        };

        modelBuilder.Entity<User>().HasData(adminUser);

        // Seed sample sites
        var sites = new[]
        {
            new Site
            {
                Id = "site-a",
                Name = "Main Campus",
                Location = "California, USA",
                Region = "north-america",
                Status = SiteStatus.Online,
                TotalCapacity = 25.5,
                CurrentOutput = 18.2,
                Efficiency = 94.2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            },
            new Site
            {
                Id = "site-b",
                Name = "Warehouse Complex",
                Location = "Texas, USA",
                Region = "north-america",
                Status = SiteStatus.Online,
                TotalCapacity = 15.8,
                CurrentOutput = 12.1,
                Efficiency = 91.5,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            },
            new Site
            {
                Id = "site-c",
                Name = "Office Complex",
                Location = "Berlin, Germany",
                Region = "europe",
                Status = SiteStatus.Maintenance,
                TotalCapacity = 12.3,
                CurrentOutput = 0,
                Efficiency = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow.AddHours(-2)
            },
            new Site
            {
                Id = "site-d",
                Name = "Manufacturing Plant",
                Location = "Tokyo, Japan",
                Region = "asia-pacific",
                Status = SiteStatus.Online,
                TotalCapacity = 32.1,
                CurrentOutput = 28.7,
                Efficiency = 96.8,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            }
        };

        modelBuilder.Entity<Site>().HasData(sites);
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
