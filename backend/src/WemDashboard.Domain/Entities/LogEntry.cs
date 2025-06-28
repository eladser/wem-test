using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Domain.Entities;

public class LogEntry
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(500)]
    public string Message { get; set; } = string.Empty;

    [Required]
    public LogLevel Level { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string? Component { get; set; }

    [MaxLength(50)]
    public string? UserId { get; set; }

    [MaxLength(2000)]
    public string? Url { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [MaxLength(50)]
    public string? RequestId { get; set; }

    [MaxLength(50)]
    public string? SessionId { get; set; }

    [Column(TypeName = "jsonb")]
    public string? ContextJson { get; set; }

    // Error details
    [MaxLength(200)]
    public string? ErrorName { get; set; }

    [MaxLength(1000)]
    public string? ErrorMessage { get; set; }

    public string? StackTrace { get; set; }

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string? Environment { get; set; }

    [MaxLength(50)]
    public string? Application { get; set; } = "WemDashboard";

    [MaxLength(20)]
    public string? Version { get; set; }

    // Performance data
    public long? Duration { get; set; }

    public double? MemoryUsage { get; set; }

    public double? CpuUsage { get; set; }

    // Navigation properties for related data
    public string? RelatedEntityType { get; set; }
    public string? RelatedEntityId { get; set; }

    // Index helpers
    public string LevelString => Level.ToString();
    public DateTime Date => Timestamp.Date;
}