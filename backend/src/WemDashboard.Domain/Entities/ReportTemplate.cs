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
    public string TemplateName { get; set; } = string.Empty;
    
    // Add Name property for backward compatibility
    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string ReportType { get; set; } = string.Empty; // e.g., "energy", "performance", "maintenance"
    
    // Store template configuration as JSON
    public string TemplateConfig { get; set; } = "{}";
    
    // Store report parameters as JSON
    public string Parameters { get; set; } = "{}";
    
    // Add scheduling properties that repository expects
    public bool IsScheduled { get; set; } = false;
    public string ScheduleCron { get; set; } = string.Empty;
    
    // Add export format property that DbContext expects
    public string ExportFormat { get; set; } = "PDF";
    
    public bool IsShared { get; set; } = false;
    public bool IsDefault { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation reference
    public virtual User User { get; set; } = null!;
}