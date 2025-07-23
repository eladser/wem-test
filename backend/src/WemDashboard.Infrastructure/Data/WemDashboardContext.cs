using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Infrastructure.Data;

public class WemDashboardContext : DbContext
{
    public WemDashboardContext(DbContextOptions<WemDashboardContext> options) : base(options) 
    { 
    }

    public DbSet<Site> Sites { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure PostgreSQL extensions
        modelBuilder.HasPostgresExtension("uuid-ossp");
        
        // Site configuration
        modelBuilder.Entity<Site>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Location).HasMaxLength(500);
            entity.Property(e => e.Region).HasMaxLength(100);
            entity.Property(e => e.TotalCapacity).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Indexes for performance
            entity.HasIndex(e => e.Region);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed sites with fixed GUIDs for consistency
        var siteAId = new Guid("11111111-1111-1111-1111-111111111111");
        var siteBId = new Guid("22222222-2222-2222-2222-222222222222");
        var siteCId = new Guid("33333333-3333-3333-3333-333333333333");
        var siteDId = new Guid("44444444-4444-4444-4444-444444444444");

        modelBuilder.Entity<Site>().HasData(
            new Site
            {
                Id = siteAId,
                Name = "Main Campus",
                Location = "California, USA",
                Region = "North America",
                TotalCapacity = 150.5m,
                Status = SiteStatus.Online,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Site
            {
                Id = siteBId,
                Name = "Silicon Valley Plant",
                Location = "San Jose, California, USA",
                Region = "North America",
                TotalCapacity = 200.0m,
                Status = SiteStatus.Online,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Site
            {
                Id = siteCId,
                Name = "Warehouse Complex",
                Location = "Texas, USA",
                Region = "North America",
                TotalCapacity = 75.3m,
                Status = SiteStatus.Maintenance,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Site
            {
                Id = siteDId,
                Name = "Dallas Distribution Center",
                Location = "Dallas, Texas, USA",
                Region = "North America",
                TotalCapacity = 120.8m,
                Status = SiteStatus.Online,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}