using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class EnergyReading
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    
    [Required]
    public decimal Value { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Unit { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? ReadingType { get; set; }
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Device Device { get; set; } = null!;
}