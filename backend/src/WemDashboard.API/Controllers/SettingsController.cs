using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WemDashboard.Shared.DTOs;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
    /// Get all general settings
    /// </summary>
    [HttpGet("general")]
    public async Task<IActionResult> GetGeneralSettings()
    {
        try
        {
            _logger.LogInformation("Retrieving general settings");
            
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
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Update general settings
    /// </summary>
    [HttpPut("general")]
    public async Task<IActionResult> UpdateGeneralSettings([FromBody] GeneralSettingsDto settings)
    {
        try
        {
            _logger.LogInformation("Updating general settings: {@Settings}", settings);
            
            if (settings == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Settings data is required"
                });
            }

            // Validate settings
            if (string.IsNullOrWhiteSpace(settings.Company))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Company name is required"
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
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Get all settings
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllSettings()
    {
        try
        {
            _logger.LogInformation("Retrieving all settings");
            
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
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Reset settings to defaults
    /// </summary>
    [HttpPost("reset")]
    public async Task<IActionResult> ResetSettings()
    {
        try
        {
            _logger.LogInformation("Resetting settings to defaults");
            
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
                Error = ex.Message
            });
        }
    }
}

/// <summary>
/// DTO for general settings
/// </summary>
public class GeneralSettingsDto
{
    public string Company { get; set; } = string.Empty;
    public string? Timezone { get; set; }
    public bool DarkMode { get; set; }
    public bool AutoSync { get; set; }
}