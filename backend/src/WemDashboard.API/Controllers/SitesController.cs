using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs.Sites;
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
    public async Task<IActionResult> GetAllSites([FromQuery] string? region = null)
    {
        if (!string.IsNullOrEmpty(region))
        {
            var regionResult = await _siteService.GetSitesByRegionAsync(region);
            return HandleResult(regionResult);
        }

        var result = await _siteService.GetAllSitesAsync();
        return HandleResult(result);
    }

    /// <summary>
    /// Get site by ID
    /// </summary>
    [HttpGet("{siteId}")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetSiteById(string siteId)
    {
        var result = await _siteService.GetSiteByIdAsync(siteId);
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
        return HandleResult(result);
    }

    /// <summary>
    /// Update site information
    /// </summary>
    [HttpPut("{siteId}")]
    [Authorize(Policy = AppConstants.Policies.ManagerOrAbove)]
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
    /// Update site status
    /// </summary>
    [HttpPatch("{siteId}/status")]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> UpdateSiteStatus(string siteId, [FromBody] UpdateSiteStatusDto statusDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _siteService.UpdateSiteStatusAsync(siteId, statusDto);
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
}
