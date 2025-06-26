using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Alerts;

public class AlertDto
{
    public string Id { get; set; } = string.Empty;
    public AlertType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? SiteId { get; set; }
    public string? SiteName { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
