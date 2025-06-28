using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WemDashboard.Domain.Entities;

public class GridComponentConfiguration
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string ComponentId { get; set; } = string.Empty;
    
    [Required]
    public string ComponentType { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    
    // Position
    public double X { get; set; } = 0;
    public double Y { get; set; } = 0;
    
    // Power and Status
    public double Power { get; set; } = 0;
    public string Status { get; set; } = "active";
    
    // Component-specific properties
    public double? Efficiency { get; set; }
    public double? Capacity { get; set; }
    
    // Additional settings as JSON
    [Column(TypeName = "nvarchar(max)")]
    public string AdditionalSettings { get; set; } = "{}";
    
    // Associated Site - FIXED: Changed from int? to string? to match Site.Id
    public string? SiteId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation references
    public virtual User User { get; set; } = null!;
    public virtual Site? Site { get; set; }
}
