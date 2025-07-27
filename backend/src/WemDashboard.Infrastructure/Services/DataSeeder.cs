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

    private async Task SeedAssetsAsync(List<int> existingSiteIds)
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
                Name = $"Solar Inverter Unit 1 - Site {siteId}",
                SiteId = siteId.ToString(), // Convert int to string
                CreatedAt = DateTime.UtcNow.AddDays(-180 + i * 30),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-2)
            });

            if (i < 2) // Add wind turbines for first two sites
            {
                assets.Add(new()
                {
                    Name = $"Wind Turbine Generator 1 - Site {siteId}",
                    SiteId = siteId.ToString(), // Convert int to string
                    CreatedAt = DateTime.UtcNow.AddDays(-150 + i * 30),
                    UpdatedAt = DateTime.UtcNow.AddMinutes(-1)
                });
            }
        }

        await _context.Assets.AddRangeAsync(assets);
    }

    private async Task SeedPowerDataAsync(List<int> existingSiteIds)
    {
        if (await _context.PowerData.AnyAsync())
            return;

        var powerDataList = new List<PowerData>();
        var random = new Random(42);

        for (int siteIndex = 0; siteIndex < existingSiteIds.Count; siteIndex++)
        {
            var siteId = existingSiteIds[siteIndex];
            
            // Generate 3 days of data (more manageable)
            for (int day = 0; day < 3; day++)
            {
                for (int hour = 0; hour < 24; hour += 4) // Every 4 hours
                {
                    var timestamp = DateTime.UtcNow.AddDays(-day).Date.AddHours(hour);
                    
                    powerDataList.Add(new PowerData
                    {
                        SiteId = siteId.ToString(), // Convert int to string
                        Time = timestamp,
                        Solar = Math.Round(random.NextDouble() * 50, 1),
                        Battery = Math.Round(random.NextDouble() * 20, 1),
                        Grid = Math.Round(random.NextDouble() * 30, 1),
                        Demand = Math.Round(random.NextDouble() * 40 + 20, 1),
                        Wind = siteIndex == 3 ? Math.Round(random.NextDouble() * 35, 1) : null, // Wind for last site
                        CreatedAt = timestamp.AddMinutes(random.Next(0, 60))
                    });
                }
            }
        }

        await _context.PowerData.AddRangeAsync(powerDataList);
    }

    private async Task SeedAlertsAsync(List<int> existingSiteIds)
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
                Title = "System Operating Optimally",
                Message = "System operating at optimal efficiency",
                Severity = "Info",
                Status = "Active",
                SiteId = existingSiteIds[0].ToString(), // Convert int to string
                CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-5)
            },
            new()
            {
                Title = "Battery Level Warning",
                Message = "Battery storage level below 30%",
                Severity = "Warning",
                Status = "Active",
                SiteId = existingSiteIds[0].ToString(), // Convert int to string
                CreatedAt = DateTime.UtcNow.AddMinutes(-15),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-15)
            }
        };

        // Only add alerts for sites that exist
        if (existingSiteIds.Count > 1)
        {
            alerts.Add(new()
            {
                Title = "Maintenance Completed",
                Message = "Maintenance completed successfully",
                Severity = "Info",
                Status = "Resolved",
                SiteId = existingSiteIds[1].ToString(), // Convert int to string
                CreatedAt = DateTime.UtcNow.AddHours(-6),
                UpdatedAt = DateTime.UtcNow.AddHours(-6),
                ResolvedAt = DateTime.UtcNow.AddHours(-5)
            });
        }

        if (existingSiteIds.Count > 2)
        {
            alerts.Add(new()
            {
                Title = "Inverter Inspection Required",
                Message = "Inverter unit requires inspection",
                Severity = "Error",
                Status = "Active",
                SiteId = existingSiteIds[2].ToString(), // Convert int to string
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                UpdatedAt = DateTime.UtcNow.AddHours(-1)
            });
        }

        await _context.Alerts.AddRangeAsync(alerts);
    }
}
