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
        await SeedUsersAsync();
        await SeedSitesAsync();
        await SeedAssetsAsync();
        await SeedPowerDataAsync();
        await SeedAlertsAsync();
        await _context.SaveChangesAsync();
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
            },
            new()
            {
                Id = "viewer-001",
                Email = "viewer@wemdashboard.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Viewer123!"),
                FirstName = "Lisa",
                LastName = "Rodriguez",
                Role = UserRole.Viewer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow.AddMinutes(-5)
            },
            new()
            {
                Id = "demo-user",
                Email = "demo@wemdashboard.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                FirstName = "Demo",
                LastName = "User",
                Role = UserRole.Viewer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow.AddMinutes(-1)
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
                Id = "site-de-001",
                Name = "Berlin Green Energy Hub",
                Location = "Brandenburg, Germany",
                Region = "europe",
                Status = SiteStatus.Maintenance,
                TotalCapacity = 28.4,
                CurrentOutput = 8.1,
                Efficiency = 28.5,
                CreatedAt = DateTime.UtcNow.AddDays(-120),
                UpdatedAt = DateTime.UtcNow.AddHours(-3),
                LastUpdate = DateTime.UtcNow.AddHours(-3)
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
            },
            new()
            {
                Id = "site-au-001",
                Name = "Australian Outback Solar",
                Location = "Northern Territory, Australia",
                Region = "asia-pacific",
                Status = SiteStatus.Online,
                TotalCapacity = 35.2,
                CurrentOutput = 29.8,
                Efficiency = 92.1,
                CreatedAt = DateTime.UtcNow.AddDays(-60),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-5),
                LastUpdate = DateTime.UtcNow.AddMinutes(-5)
            },
            new()
            {
                Id = "site-uk-001",
                Name = "Scottish Highlands Wind Farm",
                Location = "Highlands, Scotland, UK",
                Region = "europe",
                Status = SiteStatus.Online,
                TotalCapacity = 42.6,
                CurrentOutput = 38.9,
                Efficiency = 91.3,
                CreatedAt = DateTime.UtcNow.AddDays(-45),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-10),
                LastUpdate = DateTime.UtcNow.AddMinutes(-10)
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
            // California Solar Farm Alpha
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
                Id = "BAT-CA-001",
                Name = "Battery Storage System A",
                Type = AssetType.Battery,
                SiteId = "site-ca-001",
                Status = AssetStatus.Charging,
                Power = "15.4 kW",
                Efficiency = "94.2%",
                CreatedAt = DateTime.UtcNow.AddDays(-180),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-2),
                LastUpdate = DateTime.UtcNow.AddMinutes(-2)
            },
            // Texas Wind & Solar Complex
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
                Id = "SOLAR-TX-001",
                Name = "Solar Panel Array TX-1",
                Type = AssetType.SolarPanel,
                SiteId = "site-tx-001",
                Status = AssetStatus.Online,
                Power = "10.7 kW",
                Efficiency = "95.1%",
                CreatedAt = DateTime.UtcNow.AddDays(-150),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-1),
                LastUpdate = DateTime.UtcNow.AddMinutes(-1)
            },
            // Berlin Green Energy Hub
            new()
            {
                Id = "INV-DE-001",
                Name = "Inverter Unit Berlin-1",
                Type = AssetType.Inverter,
                SiteId = "site-de-001",
                Status = AssetStatus.Maintenance,
                Power = "0 kW",
                Efficiency = "0%",
                CreatedAt = DateTime.UtcNow.AddDays(-120),
                UpdatedAt = DateTime.UtcNow.AddHours(-3),
                LastUpdate = DateTime.UtcNow.AddHours(-3)
            },
            // Tokyo Bay Offshore Wind
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
            },
            new()
            {
                Id = "WIND-JP-002",
                Name = "Offshore Wind Turbine JP-2",
                Type = AssetType.WindTurbine,
                SiteId = "site-jp-001",
                Status = AssetStatus.Online,
                Power = "36.9 kW",
                Efficiency = "98.5%",
                CreatedAt = DateTime.UtcNow.AddDays(-90),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-30),
                LastUpdate = DateTime.UtcNow.AddMinutes(-30)
            },
            // Australian Outback Solar
            new()
            {
                Id = "SOLAR-AU-001",
                Name = "Outback Solar Array AU-1",
                Type = AssetType.SolarPanel,
                SiteId = "site-au-001",
                Status = AssetStatus.Online,
                Power = "29.8 kW",
                Efficiency = "92.1%",
                CreatedAt = DateTime.UtcNow.AddDays(-60),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-5),
                LastUpdate = DateTime.UtcNow.AddMinutes(-5)
            },
            // Scottish Highlands Wind Farm
            new()
            {
                Id = "WIND-UK-001",
                Name = "Highland Wind Turbine UK-1",
                Type = AssetType.WindTurbine,
                SiteId = "site-uk-001",
                Status = AssetStatus.Online,
                Power = "38.9 kW",
                Efficiency = "91.3%",
                CreatedAt = DateTime.UtcNow.AddDays(-45),
                UpdatedAt = DateTime.UtcNow.AddMinutes(-10),
                LastUpdate = DateTime.UtcNow.AddMinutes(-10)
            }
        };

        await _context.Assets.AddRangeAsync(assets);
    }

    private async Task SeedPowerDataAsync()
    {
        if (await _context.PowerData.AnyAsync())
            return;

        var sites = new[] { "site-ca-001", "site-tx-001", "site-de-001", "site-jp-001", "site-au-001", "site-uk-001" };
        var powerDataList = new List<PowerData>();
        var random = new Random(42); // Fixed seed for consistent data

        foreach (var siteId in sites)
        {
            // Generate 7 days of hourly data (168 hours)
            for (int day = 0; day < 7; day++)
            {
                for (int hour = 0; hour < 24; hour++)
                {
                    var timestamp = DateTime.UtcNow.AddDays(-day).Date.AddHours(hour);
                    
                    // Different patterns for different sites
                    var (solar, battery, grid, demand, wind) = GeneratePowerDataForSite(siteId, hour, day, random);
                    
                    powerDataList.Add(new PowerData
                    {
                        SiteId = siteId,
                        Time = timestamp,
                        Solar = solar,
                        Battery = battery,
                        Grid = grid,
                        Demand = demand,
                        Wind = wind,
                        CreatedAt = timestamp.AddMinutes(random.Next(0, 60))
                    });
                }
            }
        }

        await _context.PowerData.AddRangeAsync(powerDataList);
    }

    private static (double solar, double battery, double grid, double demand, double? wind) GeneratePowerDataForSite(
        string siteId, int hour, int day, Random random)
    {
        double solar = 0, battery = 0, grid = 0, demand = 0, wind = 0;
        
        // Base demand pattern (higher during day, lower at night)
        var baseDemand = 20 + (Math.Sin((hour - 6) * Math.PI / 12) * 15);
        if (baseDemand < 5) baseDemand = 5;
        
        // Add some randomness
        var variance = random.NextDouble() * 0.3 + 0.85; // 0.85 to 1.15 multiplier
        
        switch (siteId)
        {
            case "site-ca-001": // California Solar Farm
                solar = hour >= 6 && hour <= 18 ? (30 + Math.Sin((hour - 6) * Math.PI / 12) * 25) * variance : 0;
                battery = 15 + random.NextDouble() * 10;
                demand = baseDemand * 1.2 * variance;
                grid = Math.Max(0, demand - solar - battery);
                break;
                
            case "site-tx-001": // Texas Wind & Solar
                solar = hour >= 6 && hour <= 18 ? (25 + Math.Sin((hour - 6) * Math.PI / 12) * 20) * variance : 0;
                wind = 15 + random.NextDouble() * 30; // Wind is more variable
                battery = 12 + random.NextDouble() * 8;
                demand = baseDemand * 1.5 * variance;
                grid = Math.Max(0, demand - solar - wind - battery);
                break;
                
            case "site-de-001": // Berlin (Maintenance)
                solar = hour >= 7 && hour <= 17 ? (5 + Math.Sin((hour - 7) * Math.PI / 10) * 8) * variance : 0;
                battery = 3 + random.NextDouble() * 5;
                demand = baseDemand * 0.8 * variance;
                grid = Math.Max(0, demand - solar - battery);
                break;
                
            case "site-jp-001": // Tokyo Bay Wind
                wind = 25 + Math.Sin(hour * Math.PI / 12) * 20 + random.NextDouble() * 15;
                battery = 18 + random.NextDouble() * 12;
                demand = baseDemand * 1.8 * variance;
                grid = Math.Max(0, demand - wind - battery);
                break;
                
            case "site-au-001": // Australian Solar
                solar = hour >= 5 && hour <= 19 ? (35 + Math.Sin((hour - 5) * Math.PI / 14) * 30) * variance : 0;
                battery = 20 + random.NextDouble() * 15;
                demand = baseDemand * 1.1 * variance;
                grid = Math.Max(0, demand - solar - battery);
                break;
                
            case "site-uk-001": // Scottish Wind
                wind = 20 + Math.Sin((hour + 3) * Math.PI / 12) * 15 + random.NextDouble() * 12;
                battery = 16 + random.NextDouble() * 10;
                demand = baseDemand * 1.3 * variance;
                grid = Math.Max(0, demand - wind - battery);
                break;
        }
        
        return (Math.Round(solar, 1), Math.Round(battery, 1), Math.Round(grid, 1), 
                Math.Round(demand, 1), wind > 0 ? Math.Round(wind, 1) : null);
    }

    private async Task SeedAlertsAsync()
    {
        if (await _context.Alerts.AnyAsync())
            return;

        var alerts = new List<Alert>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Success,
                Message = "Tokyo Bay Wind Farm achieved 98.7% efficiency - new record!",
                SiteId = "site-jp-001",
                Timestamp = DateTime.UtcNow.AddMinutes(-5),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Warning,
                Message = "Battery storage level at California Solar Farm below 30%",
                SiteId = "site-ca-001",
                Timestamp = DateTime.UtcNow.AddMinutes(-15),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Error,
                Message = "Berlin Green Energy Hub - Inverter Unit requires immediate maintenance",
                SiteId = "site-de-001",
                Timestamp = DateTime.UtcNow.AddHours(-3),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-3)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Info,
                Message = "Scheduled maintenance completed successfully at Scottish Highlands Wind Farm",
                SiteId = "site-uk-001",
                Timestamp = DateTime.UtcNow.AddHours(-6),
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddHours(-6)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Warning,
                Message = "Australian Outback Solar - Dust accumulation detected on solar panels",
                SiteId = "site-au-001",
                Timestamp = DateTime.UtcNow.AddHours(-12),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-12)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Success,
                Message = "Texas Wind & Solar Complex exceeded daily energy target by 15%",
                SiteId = "site-tx-001",
                Timestamp = DateTime.UtcNow.AddDays(-1),
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Info,
                Message = "System update completed - all sites now running latest firmware",
                SiteId = "site-ca-001",
                Timestamp = DateTime.UtcNow.AddDays(-2),
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            }
        };

        await _context.Alerts.AddRangeAsync(alerts);
    }
}
