using System.ComponentModel.DataAnnotations;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Assets;

public class CreateAssetDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public AssetType Type { get; set; }

    [Required]
    public string SiteId { get; set; } = string.Empty;

    public string Power { get; set; } = string.Empty;
    public string Efficiency { get; set; } = string.Empty;
}
