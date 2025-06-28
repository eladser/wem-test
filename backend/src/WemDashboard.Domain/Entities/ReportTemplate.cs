using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WemDashboard.Domain.Entities;

public class ReportTemplate
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string ReportType { get; set; } = string.Empty;
    
    // Template configuration as JSON
    [Column(TypeName = "nvarchar(max)")]
    public string TemplateConfig { get; set; } = "{}";
    
    // Scheduling settings
    public bool IsScheduled { get; set; } = false;
    public string ScheduleCron { get; set; } = string.Empty;
    public string Recipients { get; set; } = string.Empty;
    
    // Export settings
    public string ExportFormat { get; set; } = "pdf";
    public bool IncludeCharts { get; set; } = true;
    public bool IncludeData { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation reference
    public virtual User User { get; set; } = null!;
}