using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Application.DTOs.Assets;
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
    /// Get all assets
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAllAssets([FromQuery] string? siteId = null)
    {
        if (!string.IsNullOrEmpty(siteId))
        {
            var siteResult = await _assetService.GetAssetsBySiteIdAsync(siteId);
            return HandleResult(siteResult);
        }

        var result = await _assetService.GetAllAssetsAsync();
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
        return HandleResult(result);
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
    /// Update asset information
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
    [Authorize(Policy = AppConstants.Policies.ManagerOrAbove)]
    public async Task<IActionResult> DeleteAsset(string assetId)
    {
        var result = await _assetService.DeleteAssetAsync(assetId);
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
    /// Get all assets for a specific site
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AppConstants.Policies.AllRoles)]
    public async Task<IActionResult> GetAssetsBySite(string siteId)
    {
        var result = await _assetService.GetAssetsBySiteIdAsync(siteId);
        return HandleResult(result);
    }
}
