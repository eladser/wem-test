using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WemDashboard.Domain.Entities;

public class FilterPreset
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string PresetName { get; set; } = string.Empty;
    
    // Add Name property for backward compatibility
    public string Name { get; set; } = string.Empty;
    
    // Add PageName property that repositories expect
    public string PageName { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string ViewType { get; set; } = string.Empty; // e.g., "assets", "alerts", "power-data"
    
    // Store filter criteria as JSON
    public string FilterConfig { get; set; } = "{}";
    
    public bool IsShared { get; set; } = false;
    public bool IsDefault { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation reference
    public virtual User User { get; set; } = null!;
}