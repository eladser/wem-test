using System.ComponentModel.DataAnnotations;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Application.DTOs;

public class CreateLogEntryDto
{
    [Required]
    [MaxLength(500)]
    public string Message { get; set; } = string.Empty;

    [Required]
    public string Level { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public Dictionary<string, object>? Context { get; set; }

    public LogErrorDto? Error { get; set; }

    [MaxLength(2000)]
    public string? Url { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    public string? UserId { get; set; }
}

public class LogErrorDto
{
    [MaxLength(200)]
    public string? Name { get; set; }

    [MaxLength(1000)]
    public string? Message { get; set; }

    public string? Stack { get; set; }
}

public class LogEntryResponseDto
{
    public int Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public LogLevel Level { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Component { get; set; }
    public string? UserId { get; set; }
    public string? Url { get; set; }
    public Dictionary<string, object>? Context { get; set; }
    public LogErrorDto? Error { get; set; }
}

public class LogFilterDto
{
    public string? Level { get; set; }
    public string? Component { get; set; }
    public string? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class PagedLogResponseDto
{
    public List<LogEntryResponseDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class ErrorStatisticsDto
{
    public int TotalErrors { get; set; }
    public int TotalWarnings { get; set; }
    public int TotalCritical { get; set; }
    public Dictionary<string, int> ErrorsByLevel { get; set; } = new();
    public Dictionary<string, int> ErrorsByComponent { get; set; } = new();
    public Dictionary<DateTime, int> ErrorsByDay { get; set; } = new();
    public List<TopErrorDto> TopErrors { get; set; } = new();
}

public class TopErrorDto
{
    public string Message { get; set; } = string.Empty;
    public int Count { get; set; }
    public DateTime LastOccurrence { get; set; }
}