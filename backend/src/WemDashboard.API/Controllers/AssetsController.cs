using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;
using WemDashboard.Shared.Constants;

namespace WemDashboard.API.Controllers;

[Route("api/assets")]
public class AssetsController : BaseController
{
    private readonly IAssetService _assetService;
    private readonly ILogger<AssetsController> _logger;

    public AssetsController(IAssetService assetService, ILogger<AssetsController> logger)
    {
        _assetService = assetService;
        _logger = logger;
    }

    /// <summary>
    /// Get asset by ID
    /// </summary>
    [HttpGet("{assetId}")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAssetById(string assetId)
    {
        var result = await _assetService.GetAssetByIdAsync(assetId);
        return HandleResult(result);
    }

    /// <summary>
    /// Create a new asset
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AppConstants.Policies.ManagerOrAbove)]
    public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDto createAssetDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _assetService.CreateAssetAsync(createAssetDto);
        
        if (result.Success && result.Data != null)
        {
            return CreatedAtAction(nameof(GetAssetById), new { assetId = result.Data.Id }, result);
        }
        
        return HandleResult(result);
    }

    /// <summary>
    /// Update an existing asset
    /// </summary>
    [HttpPut("{assetId}")]
    [Authorize(Policy = AppConstants.Policies.OperatorOrAbove)]
    public async Task<IActionResult> UpdateAsset(string assetId, [FromBody] UpdateAssetDto updateAssetDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _assetService.UpdateAssetAsync(assetId, updateAssetDto);
        return HandleResult(result);
    }

    /// <summary>
    /// Delete an asset
    /// </summary>
    [HttpDelete("{assetId}")]
    [Authorize(Policy = AppConstants.Policies.AdminOnly)]
    public async Task<IActionResult> DeleteAsset(string assetId)
    {
        var result = await _assetService.DeleteAssetAsync(assetId);
        return HandleResult(result);
    }

    /// <summary>
    /// Get assets by type
    /// </summary>
    [HttpGet("type/{type}")]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAssetsByType(string type)
    {
        var result = await _assetService.GetAssetsByTypeAsync(type);
        return HandleResult(result);
    }
}

[Route("api/sites/{siteId}/assets")]
public class SiteAssetsController : BaseController
{
    private readonly IAssetService _assetService;
    private readonly ILogger<SiteAssetsController> _logger;

    public SiteAssetsController(IAssetService assetService, ILogger<SiteAssetsController> logger)
    {
        _assetService = assetService;
        _logger = logger;
    }

    /// <summary>
    /// Get assets for a specific site
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAssetsBySite(string siteId, [FromQuery] string? type = null)
    {
        var result = await _assetService.GetAssetsBySiteIdAsync(siteId, type);
        return HandleResult(result);
    }
}
