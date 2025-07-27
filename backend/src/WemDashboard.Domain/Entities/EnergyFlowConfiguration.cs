using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class EnergyFlowConfiguration
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string FlowId { get; set; } = string.Empty;
    
    [Required]
    public string FromComponentId { get; set; } = string.Empty;
    
    [Required]
    public string ToComponentId { get; set; } = string.Empty;
    
    public double Power { get; set; } = 0;
    public bool Enabled { get; set; } = true;
    
    // Flow visualization settings
    public string Color { get; set; } = "#3b82f6";
    public string LineStyle { get; set; } = "solid";
    public int LineWidth { get; set; } = 2;
    
    // Associated Site - FIXED: Changed to int to match Site.Id
    public int? SiteId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation references
    public virtual User User { get; set; } = null!;
    public virtual Site? Site { get; set; }
}
