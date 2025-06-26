using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs.PowerData;
using WemDashboard.Application.Services;
using WemDashboard.Shared.Constants;

namespace WemDashboard.API.Controllers;

[Route("api/power-data")]
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
    /// Get power data with optional filtering
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetPowerData([FromQuery] PowerDataQueryDto query)
    {
        var result = await _powerDataService.GetPowerDataAsync(query);
        return HandleResult(result);
    }

    /// <summary>
    /// Get latest power data for a site
    /// </summary>
    [HttpGet("sites/{siteId}/latest")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetLatestPowerData(string siteId, [FromQuery] int count = 24)
    {
        var result = await _powerDataService.GetLatestPowerDataAsync(siteId, count);
        return HandleResult(result);
    }

    /// <summary>
    /// Add new power data entry
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> AddPowerData([FromBody] CreatePowerDataDto createPowerDataDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _powerDataService.AddPowerDataAsync(createPowerDataDto);
        return HandleResult(result);
    }

    /// <summary>
    /// Get total energy for a site within date range
    /// </summary>
    [HttpGet("sites/{siteId}/energy")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetTotalEnergy(string siteId, [FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
    {
        var result = await _powerDataService.GetTotalEnergyAsync(siteId, fromDate, toDate);
        return HandleResult(result);
    }
}
