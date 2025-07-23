using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Domain.Entities;

public class Alert
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string? Message { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Severity { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public virtual Site Site { get; set; } = null!;
}