namespace WemDashboard.Application.DTOs.PowerData;

public class PowerDataDto
{
    public string SiteId { get; set; } = string.Empty;
    public string? SiteName { get; set; }
    public DateTime Time { get; set; }
    public double Solar { get; set; }
    public double Battery { get; set; }
    public double Grid { get; set; }
    public double Demand { get; set; }
    public double? Wind { get; set; }
    public DateTime CreatedAt { get; set; }
}
