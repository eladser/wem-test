namespace WemDashboard.Application.DTOs;

public class GridComponentConfigurationDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string ComponentId { get; set; } = string.Empty;
    public string ComponentType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double X { get; set; } = 0;
    public double Y { get; set; } = 0;
    public double Power { get; set; } = 0;
    public string Status { get; set; } = "active";
    public double? Efficiency { get; set; }
    public double? Capacity { get; set; }
    public string AdditionalSettings { get; set; } = "{}";
    public int? SiteId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}