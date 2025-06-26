using Microsoft.EntityFrameworkCore;
using WemDashboard.Domain.Entities;
using WemDashboard.Infrastructure.Data;

namespace WemDashboard.Infrastructure.Services;

public class DataSeeder
{
    private readonly WemDashboardDbContext _context;

    public DataSeeder(WemDashboardDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            // Note: Users and Sites are already seeded via hardcoded seed data in WemDashboardDbContext
            // We only need to seed additional data that depends on the existing sites
            
            // Check if we have the expected sites from hardcoded seed data
            var existingSiteIds = await _context.Sites.Select(s => s.Id).ToListAsync();
            if (!existingSiteIds.Any())
            {
                Console.WriteLine("⚠️ No sites found, skipping data seeding");
                return;
            }

            Console.WriteLine($"✅ Found {existingSiteIds.Count} existing sites: {string.Join(", ", existingSiteIds)}");

            // Step 1: Seed entities that depend on Sites
            await SeedAssetsAsync(existingSiteIds);
            await SeedPowerDataAsync(existingSiteIds);
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ Assets and PowerData seeded successfully");

            // Step 2: Seed Alerts last (depends on Sites being saved)
            await SeedAlertsAsync(existingSiteIds);
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ Alerts seeded successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ Warning: Data seeding failed: {ex.Message}");
            Console.WriteLine("📝 Note: Application will continue with empty database");
            // Don't throw - let the application start with empty database
        }
    }

    private async Task SeedAssetsAsync(List<string> existingSiteIds)
    {
        if (await _context.Assets.AnyAsync())
            return;

        var assets = new List<Asset>();

        // Create assets for each existing site
        for (int i = 0; i < existingSiteIds.Count && i < 3; i++)
        {
            var siteId = existingSiteIds[i];
            assets.Add(new()
            {
                Id = $"INV-{siteId}-001",
                Name = $"Solar Inverter Unit 1 - {siteId}",
                Type = AssetType.Inverter,
                SiteId = siteId,
                Status = AssetStatus.Online,
                Power = "15.2 kW",
                Efficiency = "96.5%",
                CreatedAt = DateTime.UtcNow.AddDays(-180 + i * 30),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-2),
                LastUpdate = DateTime.UtcNow.AddMinutes(-2)
            });

            if (i < 2) // Add wind turbines for first two sites
            {
                assets.Add(new()
                {
                    Id = $"WIND-{siteId}-001",
                    Name = $"Wind Turbine Generator 1 - {siteId}",
                    Type = AssetType.WindTurbine,
                    SiteId = siteId,
                    Status = AssetStatus.Online,
                    Power = "25.8 kW",
                    Efficiency = "94.2%",
                    CreatedAt = DateTime.UtcNow.AddDays(-150 + i * 30),
                    UpdatedAt = DateTime.UtcNow.AddMinutes(-1),
                    LastUpdate = DateTime.UtcNow.AddMinutes(-1)
                });
            }
        }

        await _context.Assets.AddRangeAsync(assets);
    }

    private async Task SeedPowerDataAsync(List<string> existingSiteIds)
    {
        if (await _context.PowerData.AnyAsync())
            return;

        var powerDataList = new List<PowerData>();
        var random = new Random(42);

        foreach (var siteId in existingSiteIds)
        {
            // Generate 3 days of data (more manageable)
            for (int day = 0; day < 3; day++)
            {
                for (int hour = 0; hour < 24; hour += 4) // Every 4 hours
                {
                    var timestamp = DateTime.UtcNow.AddDays(-day).Date.AddHours(hour);
                    
                    powerDataList.Add(new PowerData
                    {
                        SiteId = siteId,
                        Time = timestamp,
                        Solar = Math.Round(random.NextDouble() * 50, 1),
                        Battery = Math.Round(random.NextDouble() * 20, 1),
                        Grid = Math.Round(random.NextDouble() * 30, 1),
                        Demand = Math.Round(random.NextDouble() * 40 + 20, 1),
                        Wind = siteId == "site-d" ? Math.Round(random.NextDouble() * 35, 1) : null, // Wind for Manufacturing Plant
                        CreatedAt = timestamp.AddMinutes(random.Next(0, 60))
                    });
                }
            }
        }

        await _context.PowerData.AddRangeAsync(powerDataList);
    }

    private async Task SeedAlertsAsync(List<string> existingSiteIds)
    {
        if (await _context.Alerts.AnyAsync())
            return;

        if (!existingSiteIds.Any())
        {
            Console.WriteLine("⚠️ No sites found, skipping alert seeding");
            return;
        }

        var alerts = new List<Alert>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Success,
                Message = "System operating at optimal efficiency",
                SiteId = existingSiteIds[0], // Use first existing site
                Timestamp = DateTime.UtcNow.AddMinutes(-5),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Warning,
                Message = "Battery storage level below 30%",
                SiteId = existingSiteIds[0], // Use first existing site
                Timestamp = DateTime.UtcNow.AddMinutes(-15),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15)
            }
        };

        // Only add alerts for sites that exist
        if (existingSiteIds.Count > 1)
        {
            alerts.Add(new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Info,
                Message = "Maintenance completed successfully",
                SiteId = existingSiteIds[1], // Use second existing site
                Timestamp = DateTime.UtcNow.AddHours(-6),
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddHours(-6)
            });
        }

        if (existingSiteIds.Count > 2)
        {
            alerts.Add(new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Error,
                Message = "Inverter unit requires inspection",
                SiteId = existingSiteIds[2], // Use third existing site
                Timestamp = DateTime.UtcNow.AddHours(-1),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-1)
            });
        }

        await _context.Alerts.AddRangeAsync(alerts);
    }
}
