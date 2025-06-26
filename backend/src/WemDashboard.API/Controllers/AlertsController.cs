using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;
using WemDashboard.Shared.Constants;

namespace WemDashboard.API.Controllers;

[Route("api/alerts")]
public class AlertsController : BaseController
{
    private readonly IAlertService _alertService;
    private readonly ILogger<AlertsController> _logger;

    public AlertsController(IAlertService alertService, ILogger<AlertsController> logger)
    {
        _alertService = alertService;
        _logger = logger;
    }

    /// <summary>
    /// Get recent alerts
    /// </summary>
    [HttpGet("recent")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetRecentAlerts([FromQuery] int count = 10)
    {
        var result = await _alertService.GetRecentAlertsAsync(count);
        return HandleResult(result);
    }

    /// <summary>
    /// Get unread alerts
    /// </summary>
    [HttpGet("unread")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetUnreadAlerts()
    {
        var result = await _alertService.GetUnreadAlertsAsync();
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new alert
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> CreateAlert([FromBody] CreateAlertDto createAlertDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _alertService.CreateAlertAsync(createAlertDto);
        return HandleResult(result);
    }

    /// <summary>
    /// Mark alert as read
    /// </summary>
    [HttpPatch("{alertId}/read")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> MarkAsRead(string alertId)
    {
        var result = await _alertService.MarkAsReadAsync(alertId);
        return HandleResult(result);
    }

    /// <summary>
    /// Mark multiple alerts as read
    /// </summary>
    [HttpPatch("read")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> MarkMultipleAsRead([FromBody] IEnumerable<string> alertIds)
    {
        var result = await _alertService.MarkMultipleAsReadAsync(alertIds);
        return HandleResult(result);
    }
}

[Route("api/sites/{siteId}/alerts")]
public class SiteAlertsController : BaseController
{
    private readonly IAlertService _alertService;
    private readonly ILogger<SiteAlertsController> _logger;

    public SiteAlertsController(IAlertService alertService, ILogger<SiteAlertsController> logger)
    {
        _alertService = alertService;
        _logger = logger;
    }

    /// <summary>
    /// Get alerts for a specific site
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAlertsBySite(string siteId)
    {
        var result = await _alertService.GetAlertsBySiteIdAsync(siteId);
        return HandleResult(result);
    }
}
