using System.ComponentModel.DataAnnotations;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Assets;

public class UpdateAssetDto
{
    [MaxLength(200)]
    public string? Name { get; set; }

    public AssetType? Type { get; set; }
    public AssetStatus? Status { get; set; }
    public string? Power { get; set; }
    public string? Efficiency { get; set; }
}
