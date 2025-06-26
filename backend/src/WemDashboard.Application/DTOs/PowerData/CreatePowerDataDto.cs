using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Application.DTOs.PowerData;

public class CreatePowerDataDto
{
    [Required]
    public string SiteId { get; set; } = string.Empty;

    [Required]
    public DateTime Time { get; set; }

    [Range(0, double.MaxValue)]
    public double Solar { get; set; }

    [Range(0, double.MaxValue)]
    public double Battery { get; set; }

    [Range(0, double.MaxValue)]
    public double Grid { get; set; }

    [Range(0, double.MaxValue)]
    public double Demand { get; set; }

    [Range(0, double.MaxValue)]
    public double? Wind { get; set; }
}
