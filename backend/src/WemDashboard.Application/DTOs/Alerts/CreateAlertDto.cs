using System.ComponentModel.DataAnnotations;
using WemDashboard.Domain.Entities;

namespace WemDashboard.Application.DTOs.Alerts;

public class CreateAlertDto
{
    [Required]
    public AlertType Type { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    public string? SiteId { get; set; }
}
