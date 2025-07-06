using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Interfaces;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;
using WemDashboard.Infrastructure.Data;
using DomainLogLevel = WemDashboard.Domain.Enums.LogLevel;
using MsLogLevel = Microsoft.Extensions.Logging.LogLevel;

namespace WemDashboard.Infrastructure.Services;

public class LogService : ILogService
{
    private readonly WemDashboardDbContext _context;
    private readonly ILogger<LogService> _logger;

    public LogService(WemDashboardDbContext context, ILogger<LogService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task CreateLogEntryAsync(CreateLogEntryDto dto)
    {
        try
        {
            var logEntry = new LogEntry
            {
                Message = dto.Message,
                Level = ParseLogLevel(dto.Level),
                Timestamp = dto.Timestamp,
                UserId = dto.UserId,
                Url = dto.Url,
                UserAgent = dto.UserAgent,
                ContextJson = dto.Context != null ? JsonSerializer.Serialize(dto.Context) : null,
                ErrorName = dto.Error?.Name,
                ErrorMessage = dto.Error?.Message,
                StackTrace = dto.Error?.Stack,
                Environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                Component = ExtractComponentFromUrl(dto.Url) ?? "Frontend"
            };

            _context.LogEntries.Add(logEntry);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save log entry: {Message}", dto.Message);
            // Don't throw - logging should never break the application
        }
    }

    public async Task<PagedLogResponseDto> GetLogEntriesAsync(LogFilterDto filter)
    {
        var query = _context.LogEntries.AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(filter.Level) && Enum.TryParse<DomainLogLevel>(filter.Level, true, out var level))
        {
            query = query.Where(l => l.Level == level);
        }

        if (!string.IsNullOrEmpty(filter.Component))
        {
            query = query.Where(l => l.Component != null && l.Component.Contains(filter.Component));
        }

        if (!string.IsNullOrEmpty(filter.UserId))
        {
            query = query.Where(l => l.UserId == filter.UserId);
        }

        if (filter.StartDate.HasValue)
        {
            query = query.Where(l => l.Timestamp >= filter.StartDate.Value);
        }

        if (filter.EndDate.HasValue)
        {
            query = query.Where(l => l.Timestamp <= filter.EndDate.Value);
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Apply pagination and get data - Fixed: Move JsonSerializer.Deserialize outside expression tree
        var logEntries = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(l => new
            {
                l.Id,
                l.Message,
                l.Level,
                l.Timestamp,
                l.Component,
                l.UserId,
                l.Url,
                l.ContextJson,
                l.ErrorName,
                l.ErrorMessage,
                l.StackTrace
            })
            .ToListAsync();

        // Convert to DTOs with JSON deserialization outside the expression tree
        var items = logEntries.Select(l => new LogEntryResponseDto
        {
            Id = l.Id,
            Message = l.Message,
            Level = l.Level,
            Timestamp = l.Timestamp,
            Component = l.Component,
            UserId = l.UserId,
            Url = l.Url,
            Context = !string.IsNullOrEmpty(l.ContextJson) 
                ? DeserializeContext(l.ContextJson) 
                : null,
            Error = !string.IsNullOrEmpty(l.ErrorName) ? new LogErrorDto
            {
                Name = l.ErrorName,
                Message = l.ErrorMessage,
                Stack = l.StackTrace
            } : null
        }).ToList();

        return new PagedLogResponseDto
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<ErrorStatisticsDto> GetErrorStatisticsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var query = _context.LogEntries
            .Where(l => l.Timestamp >= start && l.Timestamp <= end);

        var stats = new ErrorStatisticsDto();

        // Count by level
        var levelCounts = await query
            .GroupBy(l => l.Level)
            .Select(g => new { Level = g.Key, Count = g.Count() })
            .ToListAsync();

        foreach (var item in levelCounts)
        {
            stats.ErrorsByLevel[item.Level.ToString()] = item.Count;
            
            switch (item.Level)
            {
                case DomainLogLevel.Error:
                    stats.TotalErrors += item.Count;
                    break;
                case DomainLogLevel.Warning:
                    stats.TotalWarnings += item.Count;
                    break;
                case DomainLogLevel.Critical:
                    stats.TotalCritical += item.Count;
                    break;
            }
        }

        // Count by component
        stats.ErrorsByComponent = await query
            .Where(l => l.Level >= DomainLogLevel.Warning && l.Component != null)
            .GroupBy(l => l.Component!)
            .Select(g => new { Component = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Component, x => x.Count);

        // Count by day - need to use DateTime.Date property
        stats.ErrorsByDay = await query
            .Where(l => l.Level >= DomainLogLevel.Warning)
            .Select(l => new { Date = l.Timestamp.Date, Level = l.Level })
            .GroupBy(l => l.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Date, x => x.Count);

        // Top errors
        stats.TopErrors = await query
            .Where(l => l.Level >= DomainLogLevel.Error)
            .GroupBy(l => l.Message)
            .Select(g => new TopErrorDto
            {
                Message = g.Key,
                Count = g.Count(),
                LastOccurrence = g.Max(x => x.Timestamp)
            })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToListAsync();

        return stats;
    }

    public async Task<int> CleanupOldLogsAsync(int daysOld = 30)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);
        
        var oldLogs = _context.LogEntries
            .Where(l => l.Timestamp < cutoffDate && l.Level < DomainLogLevel.Error); // Keep errors longer
        
        var count = await oldLogs.CountAsync();
        
        if (count > 0)
        {
            _context.LogEntries.RemoveRange(oldLogs);
            await _context.SaveChangesAsync();
        }
        
        return count;
    }

    public async Task LogApplicationEventAsync(string eventName, string message, object? data = null)
    {
        var logEntry = new LogEntry
        {
            Message = $"{eventName}: {message}",
            Level = DomainLogLevel.Information,
            Component = "System",
            ContextJson = data != null ? JsonSerializer.Serialize(data) : null,
            Environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        };

        _context.LogEntries.Add(logEntry);
        await _context.SaveChangesAsync();
    }

    public async Task LogPerformanceMetricAsync(string metricName, double value, string? unit = null)
    {
        var logEntry = new LogEntry
        {
            Message = $"Performance metric: {metricName}",
            Level = DomainLogLevel.Information,
            Component = "Performance",
            ContextJson = JsonSerializer.Serialize(new { Metric = metricName, Value = value, Unit = unit }),
            Environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        };

        _context.LogEntries.Add(logEntry);
        await _context.SaveChangesAsync();
    }

    public async Task LogUserActionAsync(string userId, string action, string? details = null)
    {
        var logEntry = new LogEntry
        {
            Message = $"User action: {action}",
            Level = DomainLogLevel.Information,
            Component = "UserAction",
            UserId = userId,
            ContextJson = details != null ? JsonSerializer.Serialize(new { Action = action, Details = details }) : null,
            Environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        };

        _context.LogEntries.Add(logEntry);
        await _context.SaveChangesAsync();
    }

    private static DomainLogLevel ParseLogLevel(string level)
    {
        return level.ToUpperInvariant() switch
        {
            "TRACE" or "DEBUG" => DomainLogLevel.Debug,
            "INFO" or "INFORMATION" => DomainLogLevel.Information,
            "WARN" or "WARNING" => DomainLogLevel.Warning,
            "ERROR" => DomainLogLevel.Error,
            "FATAL" or "CRITICAL" => DomainLogLevel.Critical,
            _ => DomainLogLevel.Information
        };
    }

    private static string? ExtractComponentFromUrl(string? url)
    {
        if (string.IsNullOrEmpty(url)) return null;
        
        try
        {
            var uri = new Uri(url);
            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            return segments.Length > 0 ? segments[0] : "Unknown";
        }
        catch
        {
            return "Unknown";
        }
    }

    private static Dictionary<string, object>? DeserializeContext(string contextJson)
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(contextJson);
        }
        catch
        {
            return null;
        }
    }
}
