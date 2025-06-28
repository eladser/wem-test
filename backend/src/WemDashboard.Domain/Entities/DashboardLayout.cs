using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WemDashboard.Domain.Entities;

public class DashboardLayout
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string LayoutName { get; set; } = string.Empty;
    
    [Required]
    public string PageName { get; set; } = string.Empty;
    
    public bool IsDefault { get; set; } = false;
    
    // Store layout configuration as JSON - Remove SQL Server specific TypeName
    public string LayoutConfig { get; set; } = "{}";
    
    // Grid-specific settings
    public int GridColumns { get; set; } = 12;
    public int GridRows { get; set; } = 10;
    public string GridGap { get; set; } = "medium";
    
    // Widget positions and sizes - Remove SQL Server specific TypeName
    public string WidgetPositions { get; set; } = "[]";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation reference
    public virtual User User { get; set; } = null!;
}