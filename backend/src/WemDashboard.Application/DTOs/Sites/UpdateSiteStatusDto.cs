using System.ComponentModel.DataAnnotations;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Sites;

public class UpdateSiteStatusDto
{
    [Required]
    public SiteStatus Status { get; set; }

    public string? Notes { get; set; }
}
