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
            // Step 1: Seed Users and Sites first (no dependencies)
            await SeedUsersAsync();
            await SeedSitesAsync();
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ Users and Sites seeded successfully");

            // Step 2: Seed entities that depend on Sites
            await SeedAssetsAsync();
            await SeedPowerDataAsync();
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ Assets and PowerData seeded successfully");

            // Step 3: Seed Alerts last (depends on Sites being saved)
            await SeedAlertsAsync();
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

    private async Task SeedUsersAsync()
    {
        if (await _context.Users.AnyAsync())
            return;

        var users = new List<User>
        {
            new()
            {
                Id = "admin-001",
                Email = "admin@wemdashboard.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FirstName = "System",
                LastName = "Administrator",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow
            },
            new()
            {
                Id = "manager-001",
                Email = "manager@wemdashboard.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager123!"),
                FirstName = "Sarah",
                LastName = "Johnson",
                Role = UserRole.Manager,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow.AddHours(-2)
            },
            new()
            {
                Id = "operator-001",
                Email = "operator@wemdashboard.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Operator123!"),
                FirstName = "Mike",
                LastName = "Chen",
                Role = UserRole.Operator,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow.AddMinutes(-15)
            }
        };

        await _context.Users.AddRangeAsync(users);
    }

    private async Task SeedSitesAsync()
    {
        if (await _context.Sites.AnyAsync())
            return;

        var sites = new List<Site>
        {
            new()
            {
                Id = "site-ca-001",
                Name = "California Solar Farm Alpha",
                Location = "Riverside County, California, USA",
                Region = "north-america",
                Status = SiteStatus.Online,
                TotalCapacity = 45.8,
                CurrentOutput = 38.2,
                Efficiency = 96.5,
                CreatedAt = DateTime.UtcNow.AddDays(-180),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-2),
                LastUpdate = DateTime.UtcNow.AddMinutes(-2)
            },
            new()
            {
                Id = "site-tx-001",
                Name = "Texas Wind & Solar Complex",
                Location = "West Texas, USA",
                Region = "north-america",
                Status = SiteStatus.Online,
                TotalCapacity = 62.3,
                CurrentOutput = 51.7,
                Efficiency = 94.2,
                CreatedAt = DateTime.UtcNow.AddDays(-150),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-1),
                LastUpdate = DateTime.UtcNow.AddMinutes(-1)
            },
            new()
            {
                Id = "site-jp-001",
                Name = "Tokyo Bay Offshore Wind",
                Location = "Tokyo Bay, Japan",
                Region = "asia-pacific",
                Status = SiteStatus.Online,
                TotalCapacity = 78.9,
                CurrentOutput = 72.1,
                Efficiency = 98.7,
                CreatedAt = DateTime.UtcNow.AddDays(-90),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-30),
                LastUpdate = DateTime.UtcNow.AddMinutes(-30)
            }
        };

        await _context.Sites.AddRangeAsync(sites);
    }

    private async Task SeedAssetsAsync()
    {
        if (await _context.Assets.AnyAsync())
            return;

        var assets = new List<Asset>
        {
            new()
            {
                Id = "INV-CA-001",
                Name = "Solar Inverter Unit 1",
                Type = AssetType.Inverter,
                SiteId = "site-ca-001",
                Status = AssetStatus.Online,
                Power = "15.2 kW",
                Efficiency = "96.5%",
                CreatedAt = DateTime.UtcNow.AddDays(-180),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-2),
                LastUpdate = DateTime.UtcNow.AddMinutes(-2)
            },
            new()
            {
                Id = "WIND-TX-001",
                Name = "Wind Turbine Generator 1",
                Type = AssetType.WindTurbine,
                SiteId = "site-tx-001",
                Status = AssetStatus.Online,
                Power = "25.8 kW",
                Efficiency = "94.2%",
                CreatedAt = DateTime.UtcNow.AddDays(-150),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-1),
                LastUpdate = DateTime.UtcNow.AddMinutes(-1)
            },
            new()
            {
                Id = "WIND-JP-001",
                Name = "Offshore Wind Turbine JP-1",
                Type = AssetType.WindTurbine,
                SiteId = "site-jp-001",
                Status = AssetStatus.Online,
                Power = "35.2 kW",
                Efficiency = "98.7%",
                CreatedAt = DateTime.UtcNow.AddDays(-90),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-30),
                LastUpdate = DateTime.UtcNow.AddMinutes(-30)
            }
        };

        await _context.Assets.AddRangeAsync(assets);
    }

    private async Task SeedPowerDataAsync()
    {
        if (await _context.PowerData.AnyAsync())
            return;

        var sites = new[] { "site-ca-001", "site-tx-001", "site-jp-001" };
        var powerDataList = new List<PowerData>();
        var random = new Random(42);

        foreach (var siteId in sites)
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
                        Wind = siteId == "site-jp-001" ? Math.Round(random.NextDouble() * 35, 1) : null,
                        CreatedAt = timestamp.AddMinutes(random.Next(0, 60))
                    });
                }
            }
        }

        await _context.PowerData.AddRangeAsync(powerDataList);
    }

    private async Task SeedAlertsAsync()
    {
        if (await _context.Alerts.AnyAsync())
            return;

        // Verify sites exist first
        var existingSiteIds = await _context.Sites.Select(s => s.Id).ToListAsync();
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

        await _context.Alerts.AddRangeAsync(alerts);
    }
}
