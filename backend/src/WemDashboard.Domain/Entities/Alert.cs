namespace WemDashboard.Domain.Entities;

public class Alert
{
    public string Id { get; set; } = string.Empty;
    public AlertType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string SiteId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Site Site { get; set; } = null!;
}

public enum AlertType
{
    Warning,
    Info,
    Success,
    Error
}
