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
        await SeedSampleAssetsAsync();
        await SeedSamplePowerDataAsync();
        await SeedSampleAlertsAsync();
        await _context.SaveChangesAsync();
    }

    private async Task SeedSampleAssetsAsync()
    {
        if (await _context.Assets.AnyAsync())
            return;

        var assets = new List<Asset>
        {
            new()
            {
                Id = "INV-001",
                Name = "Solar Inverter #1",
                Type = AssetType.Inverter,
                SiteId = "site-a",
                Status = AssetStatus.Online,
                Power = "8.5 kW",
                Efficiency = "94.2%",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            },
            new()
            {
                Id = "BAT-001",
                Name = "Battery Pack #1",
                Type = AssetType.Battery,
                SiteId = "site-a",
                Status = AssetStatus.Charging,
                Power = "12.3 kW",
                Efficiency = "96.8%",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            },
            new()
            {
                Id = "INV-002",
                Name = "Solar Inverter #2",
                Type = AssetType.Inverter,
                SiteId = "site-b",
                Status = AssetStatus.Online,
                Power = "6.2 kW",
                Efficiency = "91.5%",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            },
            new()
            {
                Id = "INV-003",
                Name = "Solar Inverter #3",
                Type = AssetType.Inverter,
                SiteId = "site-c",
                Status = AssetStatus.Maintenance,
                Power = "0 kW",
                Efficiency = "0%",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow.AddHours(-2)
            },
            new()
            {
                Id = "INV-004",
                Name = "Solar Inverter #4",
                Type = AssetType.Inverter,
                SiteId = "site-d",
                Status = AssetStatus.Online,
                Power = "15.2 kW",
                Efficiency = "96.8%",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            },
            new()
            {
                Id = "BAT-002",
                Name = "Battery Pack #2",
                Type = AssetType.Battery,
                SiteId = "site-d",
                Status = AssetStatus.Online,
                Power = "13.5 kW",
                Efficiency = "95.1%",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            }
        };

        await _context.Assets.AddRangeAsync(assets);
    }

    private async Task SeedSamplePowerDataAsync()
    {
        if (await _context.PowerData.AnyAsync())
            return;

        var sites = new[] { "site-a", "site-b", "site-c", "site-d" };
        var powerDataList = new List<PowerData>();
        var random = new Random();

        foreach (var siteId in sites)
        {
            var multiplier = siteId == "site-d" ? 1.2 : siteId == "site-c" ? 0.3 : 1;
            
            for (int hour = 0; hour < 24; hour++)
            {
                var baseTime = DateTime.UtcNow.Date.AddHours(hour);
                var solarPower = hour >= 6 && hour <= 18 ? random.Next(50, 100) * multiplier : 0;
                var batteryPower = random.Next(60, 90) * multiplier;
                var gridPower = random.Next(5, 25) * multiplier;
                var demand = random.Next(80, 180) * multiplier;

                powerDataList.Add(new PowerData
                {
                    SiteId = siteId,
                    Time = baseTime,
                    Solar = Math.Round(solarPower, 1),
                    Battery = Math.Round(batteryPower, 1),
                    Grid = Math.Round(gridPower, 1),
                    Demand = Math.Round(demand, 1),
                    Wind = siteId == "site-d" ? Math.Round(random.Next(10, 50) * multiplier, 1) : null,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.PowerData.AddRangeAsync(powerDataList);
    }

    private async Task SeedSampleAlertsAsync()
    {
        if (await _context.Alerts.AnyAsync())
            return;

        var alerts = new List<Alert>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Warning,
                Message = "Battery level below 20% at Main Campus",
                SiteId = "site-a",
                Timestamp = DateTime.UtcNow.AddMinutes(-15),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-15)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Info,
                Message = "Scheduled maintenance completed successfully",
                SiteId = "site-b",
                Timestamp = DateTime.UtcNow.AddHours(-2),
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Error,
                Message = "Solar inverter offline - requires immediate attention",
                SiteId = "site-c",
                Timestamp = DateTime.UtcNow.AddHours(-1),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-1)
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                Type = AlertType.Success,
                Message = "Peak efficiency achieved - 98.5%",
                SiteId = "site-d",
                Timestamp = DateTime.UtcNow.AddMinutes(-30),
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-30)
            }
        };

        await _context.Alerts.AddRangeAsync(alerts);
    }
}
