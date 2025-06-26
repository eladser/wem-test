using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Application.DTOs.Sites;

public class UpdateSiteDto
{
    [MaxLength(200)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? Region { get; set; }

    [Range(0, double.MaxValue)]
    public double? TotalCapacity { get; set; }

    [Range(0, double.MaxValue)]
    public double? CurrentOutput { get; set; }

    [Range(0, 100)]
    public double? Efficiency { get; set; }
}
