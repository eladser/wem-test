using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Application.DTOs.Sites;

public class CreateSiteDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Region { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public double TotalCapacity { get; set; }
}
