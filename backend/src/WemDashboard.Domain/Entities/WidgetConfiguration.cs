using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WemDashboard.Domain.Entities;

public class WidgetConfiguration
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string WidgetId { get; set; } = string.Empty;
    
    [Required]
    public string WidgetType { get; set; } = string.Empty;
    
    public string Title { get; set; } = string.Empty;
    
    // Position and Size
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
    public int Width { get; set; } = 4;
    public int Height { get; set; } = 4;
    
    // Widget-specific settings as JSON
    [Column(TypeName = "nvarchar(max)")]
    public string Settings { get; set; } = "{}";
    
    // Data source configuration
    public string DataSource { get; set; } = string.Empty;
    public string DataFilters { get; set; } = "{}";
    
    // Display settings
    public bool IsVisible { get; set; } = true;
    public bool IsResizable { get; set; } = true;
    public bool IsDraggable { get; set; } = true;
    
    // Page association
    public string PageName { get; set; } = string.Empty;
    public int DashboardLayoutId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation references
    public virtual User User { get; set; } = null!;
    public virtual DashboardLayout DashboardLayout { get; set; } = null!;
}