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
    
    public string ComponentName { get; set; } = string.Empty;
    
    // Position and Size
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
    public int Width { get; set; } = 1;
    public int Height { get; set; } = 1;
    
    // Visual properties
    public string Color { get; set; } = "#3B82F6";
    public string BackgroundColor { get; set; } = "transparent";
    public string BorderStyle { get; set; } = "solid";
    public int BorderWidth { get; set; } = 1;
    
    // Component-specific configuration as JSON - Remove SQL Server specific TypeName
    public string ComponentConfig { get; set; } = "{}";
    
    // Data source configuration
    public string DataSource { get; set; } = string.Empty;
    public string DataFilters { get; set; } = "{}";
    
    // Display settings
    public bool IsVisible { get; set; } = true;
    public bool IsInteractive { get; set; } = true;
    
    // Site association - Using string to match Site.Id
    public string? SiteId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation references
    public virtual User User { get; set; } = null!;
    public virtual Site? Site { get; set; }
}