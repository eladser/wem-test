using WemDashboard.Domain.Enums;

namespace WemDashboard.Domain.Entities;

public class Site
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public SiteStatus Status { get; set; }
    public double TotalCapacity { get; set; }
    public double CurrentOutput { get; set; }
    public double Efficiency { get; set; }
    public DateTime LastUpdate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public List<Asset> Assets { get; set; } = new();
    public List<PowerData> PowerData { get; set; } = new();
    public List<Alert> Alerts { get; set; } = new();
}
