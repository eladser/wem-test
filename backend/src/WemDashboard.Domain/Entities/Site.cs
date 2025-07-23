using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class Site
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [MaxLength(500)]
    public string? Location { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUpdate { get; set; }

    // Navigation properties
    public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    public virtual ICollection<Alert> Alerts { get; set; } = new List<Alert>();
    public virtual ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public virtual ICollection<PowerData> PowerData { get; set; } = new List<PowerData>();
}