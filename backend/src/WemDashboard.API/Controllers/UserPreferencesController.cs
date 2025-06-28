using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserPreferencesController : ControllerBase
{
    private readonly IUserPreferencesService _userPreferencesService;

    public UserPreferencesController(IUserPreferencesService userPreferencesService)
    {
        _userPreferencesService = userPreferencesService;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    }

    [HttpGet]
    public async Task<ActionResult<UserPreferencesDto>> GetUserPreferences()
    {
        var userId = GetCurrentUserId();
        var preferences = await _userPreferencesService.GetOrCreateDefaultPreferencesAsync(userId);
        return Ok(preferences);
    }

    [HttpPut]
    public async Task<ActionResult<UserPreferencesDto>> UpdateUserPreferences([FromBody] UserPreferencesDto preferences)
    {
        var userId = GetCurrentUserId();
        preferences.UserId = userId;
        
        var existing = await _userPreferencesService.GetUserPreferencesAsync(userId);
        if (existing != null)
        {
            preferences.Id = existing.Id;
            var updated = await _userPreferencesService.UpdateUserPreferencesAsync(preferences);
            return Ok(updated);
        }
        else
        {
            var created = await _userPreferencesService.CreateUserPreferencesAsync(preferences);
            return Ok(created);
        }
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteUserPreferences()
    {
        var userId = GetCurrentUserId();
        await _userPreferencesService.DeleteUserPreferencesAsync(userId);
        return NoContent();
    }

    [HttpPost("reset")]
    public async Task<ActionResult<UserPreferencesDto>> ResetToDefaults()
    {
        var userId = GetCurrentUserId();
        await _userPreferencesService.DeleteUserPreferencesAsync(userId);
        var defaultPreferences = await _userPreferencesService.GetOrCreateDefaultPreferencesAsync(userId);
        return Ok(defaultPreferences);
    }
}