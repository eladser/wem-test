using WemDashboard.Application.DTOs;

namespace WemDashboard.Application.Interfaces;

public interface ILogService
{
    Task CreateLogEntryAsync(CreateLogEntryDto logEntry);
    Task<PagedLogResponseDto> GetLogEntriesAsync(LogFilterDto filter);
    Task<ErrorStatisticsDto> GetErrorStatisticsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<int> CleanupOldLogsAsync(int daysOld = 30);
    Task LogApplicationEventAsync(string eventName, string message, object? data = null);
    Task LogPerformanceMetricAsync(string metricName, double value, string? unit = null);
    Task LogUserActionAsync(string userId, string action, string? details = null);
}