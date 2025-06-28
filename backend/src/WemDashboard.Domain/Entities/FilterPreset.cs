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
    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string PageName { get; set; } = string.Empty;
    
    // Filter configuration as JSON
    [Column(TypeName = "nvarchar(max)")]
    public string FilterConfig { get; set; } = "{}";
    
    public bool IsDefault { get; set; } = false;
    public bool IsShared { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation reference
    public virtual User User { get; set; } = null!;
}