using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;
using WemDashboard.Shared.Constants;

namespace WemDashboard.API.Controllers;

[Route("api/sites/{siteId}/power-data")]
public class PowerDataController : BaseController
{
    private readonly IPowerDataService _powerDataService;
    private readonly ILogger<PowerDataController> _logger;

    public PowerDataController(IPowerDataService powerDataService, ILogger<PowerDataController> logger)
    {
        _powerDataService = powerDataService;
        _logger = logger;
    }

    /// <summary>
    /// Get power data for a site
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetPowerData(
        string siteId,
        [FromQuery] string? range = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var query = new PowerDataQueryDto
        {
            SiteId = siteId,
            Range = range,
            FromDate = fromDate,
            ToDate = toDate
        };

        var result = await _powerDataService.GetPowerDataAsync(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Add new power data for a site
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> AddPowerData(string siteId, [FromBody] CreatePowerDataDto createPowerDataDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Ensure the site ID in the URL matches the DTO
        createPowerDataDto.SiteId = siteId;

        var result = await _powerDataService.AddPowerDataAsync(createPowerDataDto);
        return HandleResult(result);
    }

    /// <summary>
    /// Get latest power data for a site
    /// </summary>
    [HttpGet("latest")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetLatestPowerData(string siteId, [FromQuery] int count = 24)
    {
        var result = await _powerDataService.GetLatestPowerDataAsync(siteId, count);
        return HandleResult(result);
    }

    /// <summary>
    /// Get total energy for a site within a date range
    /// </summary>
    [HttpGet("total-energy")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetTotalEnergy(
        string siteId,
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate)
    {
        var result = await _powerDataService.GetTotalEnergyAsync(siteId, fromDate, toDate);
        return HandleResult(result);
    }
}
