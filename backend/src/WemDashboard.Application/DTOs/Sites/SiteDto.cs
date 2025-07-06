using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Sites;

public class SiteDto
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
    public int AssetsCount { get; set; }
    public int AlertsCount { get; set; }
}
