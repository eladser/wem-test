using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;
using WemDashboard.Shared.Constants;

namespace WemDashboard.API.Controllers;

[Route("api/sites")]
public class SitesController : BaseController
{
    private readonly ISiteService _siteService;
    private readonly ILogger<SitesController> _logger;

    public SitesController(ISiteService siteService, ILogger<SitesController> logger)
    {
        _siteService = siteService;
        _logger = logger;
    }

    /// <summary>
    /// Get all sites
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAllSites()
    {
        var result = await _siteService.GetAllSitesAsync();
        return HandleResult(result);
    }

    /// <summary>
    /// Get site by ID with optional data inclusion
    /// </summary>
    [HttpGet("{siteId}")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetSiteById(
        string siteId,
        [FromHeader(Name = AppConstants.Headers.IncludeAssets)] bool includeAssets = false,
        [FromHeader(Name = AppConstants.Headers.IncludePowerData)] bool includePowerData = false,
        [FromHeader(Name = AppConstants.Headers.IncludeMetrics)] bool includeMetrics = false,
        [FromHeader(Name = AppConstants.Headers.TimeRange)] string? timeRange = null)
    {
        var result = await _siteService.GetSiteByIdAsync(siteId, includeAssets, includePowerData, includeMetrics, timeRange);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new site
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AppConstants.Policies.ManagerOrAbove)]
    public async Task<IActionResult> CreateSite([FromBody] CreateSiteDto createSiteDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _siteService.CreateSiteAsync(createSiteDto);
        
        if (result.Success && result.Data != null)
        {
            return CreatedAtAction(nameof(GetSiteById), new { siteId = result.Data.Id }, result);
        }
        
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing site
    /// </summary>
    [HttpPut("{siteId}")]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> UpdateSite(string siteId, [FromBody] UpdateSiteDto updateSiteDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _siteService.UpdateSiteAsync(siteId, updateSiteDto);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete a site
    /// </summary>
    [HttpDelete("{siteId}")]
    [Authorize(Policy = AppConstants.Policies.AdminOnly)]
    public async Task<IActionResult> DeleteSite(string siteId)
    {
        var result = await _siteService.DeleteSiteAsync(siteId);
        return HandleResult(result);
    }

    /// <summary>
    /// Update site status
    /// </summary>
    [HttpPatch("{siteId}/status")]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> UpdateSiteStatus(string siteId, [FromBody] UpdateSiteStatusDto updateStatusDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _siteService.UpdateSiteStatusAsync(siteId, updateStatusDto);
        return HandleResult(result);
    }

    /// <summary>
    /// Get sites by region
    /// </summary>
    [HttpGet("region/{region}")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetSitesByRegion(string region)
    {
        var result = await _siteService.GetSitesByRegionAsync(region);
        return HandleResult(result);
    }

    /// <summary>
    /// Get site metrics
    /// </summary>
    [HttpGet("{siteId}/metrics")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetSiteMetrics(string siteId)
    {
        var result = await _siteService.GetSiteMetricsAsync(siteId);
        return HandleResult(result);
    }

    /// <summary>
    /// Get site analytics
    /// </summary>
    [HttpGet("{siteId}/analytics")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetSiteAnalytics(string siteId, [FromQuery] string? metrics = null)
    {
        var result = await _siteService.GetSiteAnalyticsAsync(siteId, metrics);
        return HandleResult(result);
    }

    /// <summary>
    /// Get energy mix for site
    /// </summary>
    [HttpGet("{siteId}/energy-mix")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetEnergyMix(string siteId)
    {
        var result = await _siteService.GetEnergyMixAsync(siteId);
        return HandleResult(result);
    }

    /// <summary>
    /// Export site data
    /// </summary>
    [HttpGet("{siteId}/export")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> ExportSiteData(string siteId, [FromQuery] string format = "json")
    {
        // This would be implemented to return different formats (CSV, PDF, etc.)
        var result = await _siteService.GetSiteByIdAsync(siteId, true, true, true);
        
        if (!result.Success)
        {
            return HandleResult(result);
        }

        return format.ToLower() switch
        {
            "csv" => Ok("CSV export not implemented yet"),
            "pdf" => Ok("PDF export not implemented yet"),
            _ => HandleResult(result)
        };
    }
}
