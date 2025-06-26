namespace WemDashboard.Domain.Entities;

public class PowerData
{
    public int Id { get; set; }
    public string SiteId { get; set; } = string.Empty;
    public DateTime Time { get; set; }
    public double Solar { get; set; }
    public double Battery { get; set; }
    public double Grid { get; set; }
    public double Demand { get; set; }
    public double? Wind { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Site Site { get; set; } = null!;
}
