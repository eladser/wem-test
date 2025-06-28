using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Interfaces;
using WemDashboard.Application.Services;
using WemDashboard.Domain.Enums;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly ILogService _logService;
    private readonly ILogger<LogsController> _logger;

    public LogsController(ILogService logService, ILogger<LogsController> logger)
    {
        _logService = logService;
        _logger = logger;
    }

    /// <summary>
    /// Receive log entry from frontend
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateLogEntry([FromBody] CreateLogEntryDto logEntry)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _logService.CreateLogEntryAsync(logEntry);
            
            _logger.LogInformation("Frontend log entry received: {Level} - {Message}", 
                logEntry.Level, logEntry.Message);
            
            return Ok(new { message = "Log entry created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating log entry");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get log entries with filtering and pagination
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetLogEntries(
        [FromQuery] string? level = null,
        [FromQuery] string? component = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var filter = new LogFilterDto
            {
                Level = level,
                Component = component,
                StartDate = startDate,
                EndDate = endDate,
                Page = page,
                PageSize = Math.Min(pageSize, 100) // Max 100 items per page
            };

            var result = await _logService.GetLogEntriesAsync(filter);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving log entries");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Get error statistics
    /// </summary>
    [HttpGet("statistics")]
    [Authorize]
    public async Task<IActionResult> GetErrorStatistics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var stats = await _logService.GetErrorStatisticsAsync(startDate, endDate);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving error statistics");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Clear old log entries
    /// </summary>
    [HttpDelete("cleanup")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CleanupLogs([FromQuery] int daysOld = 30)
    {
        try
        {
            var deletedCount = await _logService.CleanupOldLogsAsync(daysOld);
            _logger.LogInformation("Cleaned up {DeletedCount} old log entries", deletedCount);
            
            return Ok(new { message = $"Deleted {deletedCount} old log entries" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning up logs");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}