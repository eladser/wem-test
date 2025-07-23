using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class Device
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string DeviceType { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? SerialNumber { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Site Site { get; set; } = null!;
    public virtual ICollection<EnergyReading> EnergyReadings { get; set; } = new List<EnergyReading>();
}