using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Assets;

public class AssetDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public AssetType Type { get; set; }
    public string SiteId { get; set; } = string.Empty;
    public string? SiteName { get; set; }
    public AssetStatus Status { get; set; }
    public string Power { get; set; } = string.Empty;
    public string Efficiency { get; set; } = string.Empty;
    public DateTime LastUpdate { get; set; }
    public DateTime CreatedAt { get; set; }
}
