namespace WemDashboard.Application.DTOs;

public class EnergyFlowConfigurationDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FlowId { get; set; } = string.Empty;
    public string FromComponentId { get; set; } = string.Empty;
    public string ToComponentId { get; set; } = string.Empty;
    public double Power { get; set; } = 0;
    public bool Enabled { get; set; } = true;
    public string Color { get; set; } = "#3b82f6";
    public string LineStyle { get; set; } = "solid";
    public int LineWidth { get; set; } = 2;
    public int? SiteId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}