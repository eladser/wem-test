using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WemDashboard.Domain.Entities;

public class ViewState
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string ViewName { get; set; } = string.Empty;
    
    [Required]
    public string PageName { get; set; } = string.Empty;
    
    [Required]
    public string StateKey { get; set; } = string.Empty;
    
    // Store view state as JSON
    public string StateValue { get; set; } = "{}";
    
    public DateTime? ExpiresAt { get; set; }
    public bool IsPersistent { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation reference
    public virtual User User { get; set; } = null!;
}