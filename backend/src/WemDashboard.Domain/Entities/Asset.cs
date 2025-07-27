namespace WemDashboard.Domain.Entities;

public class Asset
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public AssetType Type { get; set; }
    public int SiteId { get; set; }
    public AssetStatus Status { get; set; }
    public string Power { get; set; } = string.Empty;
    public string Efficiency { get; set; } = string.Empty;
    public DateTime LastUpdate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Site Site { get; set; } = null!;
}

public enum AssetType
{
    Inverter,
    Battery,
    SolarPanel,
    WindTurbine
}

public enum AssetStatus
{
    Online,
    Charging,
    Warning,
    Maintenance,
    Offline
}
