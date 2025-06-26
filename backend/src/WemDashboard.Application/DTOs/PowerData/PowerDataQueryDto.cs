using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Application.DTOs.PowerData;

public class PowerDataQueryDto
{
    public string? SiteId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Take { get; set; }
    public int? Skip { get; set; }
    public string? OrderBy { get; set; }
    public bool Descending { get; set; } = true;
}
