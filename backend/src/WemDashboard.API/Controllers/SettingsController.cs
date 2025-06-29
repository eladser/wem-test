using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WemDashboard.Shared.DTOs;
using WemDashboard.Shared.Models;
using Microsoft.Extensions.Logging;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// REMOVED: [Authorize] - General settings don't require authentication
public class SettingsController : BaseController
{
    private readonly ILogger<SettingsController> _logger;
    private static readonly Dictionary<string, object> _settingsStore = new();

    public SettingsController(ILogger<SettingsController> logger)
    {
        _logger = logger;
        
        // Initialize with default settings if empty
        if (!_settingsStore.Any())
        {
            _settingsStore["company"] = "EnergyOS Corp";
            _settingsStore["timezone"] = "utc";
            _settingsStore["darkMode"] = true;
            _settingsStore["autoSync"] = true;
        }
    }

    /// <summary>
    /// Get all general settings - NO AUTHENTICATION REQUIRED
    /// </summary>
    [HttpGet("general")]
    [AllowAnonymous] // Explicitly allow anonymous access
    public IActionResult GetGeneralSettings()
    {
        try
        {
            _logger.LogInformation("Retrieving general settings (no auth required)");
            
            var settings = new
            {
                company = _settingsStore.GetValueOrDefault("company", "EnergyOS Corp"),
                timezone = _settingsStore.GetValueOrDefault("timezone", "utc"),
                darkMode = _settingsStore.GetValueOrDefault("darkMode", true),
                autoSync = _settingsStore.GetValueOrDefault("autoSync", true)
            };

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Data = settings,
                Message = "Settings retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving general settings");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to retrieve settings",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Update general settings - NO AUTHENTICATION REQUIRED
    /// </summary>
    [HttpPut("general")]
    [AllowAnonymous] // Explicitly allow anonymous access
    public IActionResult UpdateGeneralSettings([FromBody] GeneralSettingsDto settings)
    {
        try
        {
            _logger.LogInformation("Updating general settings (no auth required): {@Settings}", settings);
            
            if (settings == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Settings data is required"
                });
            }

            // Validate model state
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>())
                    .ToList();
                
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            // Update settings in store
            _settingsStore["company"] = settings.Company;
            _settingsStore["timezone"] = settings.Timezone ?? "utc";
            _settingsStore["darkMode"] = settings.DarkMode;
            _settingsStore["autoSync"] = settings.AutoSync;

            _logger.LogInformation("General settings updated successfully");

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Data = new
                {
                    company = _settingsStore["company"],
                    timezone = _settingsStore["timezone"],
                    darkMode = _settingsStore["darkMode"],
                    autoSync = _settingsStore["autoSync"]
                },
                Message = "Settings updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating general settings");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to update settings",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get all settings - REQUIRES AUTHENTICATION
    /// </summary>
    [HttpGet]
    [Authorize] // This still requires auth
    public IActionResult GetAllSettings()
    {
        try
        {
            _logger.LogInformation("Retrieving all settings (auth required)");
            
            return Ok(new ApiResponse<Dictionary<string, object>>
            {
                Success = true,
                Data = new Dictionary<string, object>(_settingsStore),
                Message = "All settings retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all settings");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to retrieve settings",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Reset settings to defaults - REQUIRES AUTHENTICATION
    /// </summary>
    [HttpPost("reset")]
    [Authorize] // This still requires auth
    public IActionResult ResetSettings()
    {
        try
        {
            _logger.LogInformation("Resetting settings to defaults (auth required)");
            
            _settingsStore.Clear();
            _settingsStore["company"] = "EnergyOS Corp";
            _settingsStore["timezone"] = "utc";
            _settingsStore["darkMode"] = true;
            _settingsStore["autoSync"] = true;

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Data = new Dictionary<string, object>(_settingsStore),
                Message = "Settings reset to defaults successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting settings");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "Failed to reset settings",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}
