using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WemDashboard.Application.Services;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ViewStateController : ControllerBase
{
    private readonly IViewStateService _viewStateService;

    public ViewStateController(IViewStateService viewStateService)
    {
        _viewStateService = viewStateService;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    }

    [HttpGet("{pageName}/{stateKey}")]
    public async Task<ActionResult<T>> GetViewState<T>(string pageName, string stateKey) where T : class
    {
        var userId = GetCurrentUserId();
        var state = await _viewStateService.GetViewStateAsync<T>(userId, pageName, stateKey);
        if (state == null)
        {
            return NotFound();
        }
        return Ok(state);
    }

    [HttpPost("{pageName}/{stateKey}")]
    public async Task<ActionResult> SetViewState<T>(string pageName, string stateKey, [FromBody] ViewStateRequest<T> request) where T : class
    {
        var userId = GetCurrentUserId();
        await _viewStateService.SetViewStateAsync(userId, pageName, stateKey, request.Value, request.ExpiresAt, request.IsPersistent);
        return Ok();
    }

    [HttpDelete("{pageName}/{stateKey}")]
    public async Task<ActionResult> DeleteViewState(string pageName, string stateKey)
    {
        var userId = GetCurrentUserId();
        await _viewStateService.DeleteViewStateAsync(userId, pageName, stateKey);
        return NoContent();
    }

    [HttpGet("{pageName}")]
    public async Task<ActionResult<Dictionary<string, object>>> GetAllPageStates(string pageName)
    {
        var userId = GetCurrentUserId();
        var states = await _viewStateService.GetAllPageStatesAsync(userId, pageName);
        return Ok(states);
    }

    [HttpPost("cleanup-expired")]
    public async Task<ActionResult> CleanupExpiredStates()
    {
        await _viewStateService.DeleteExpiredStatesAsync();
        return Ok();
    }

    // Generic endpoint for any JSON data
    [HttpGet("{pageName}/{stateKey}/json")]
    public async Task<ActionResult<object>> GetViewStateJson(string pageName, string stateKey)
    {
        var userId = GetCurrentUserId();
        var state = await _viewStateService.GetViewStateAsync<object>(userId, pageName, stateKey);
        if (state == null)
        {
            return NotFound();
        }
        return Ok(state);
    }

    [HttpPost("{pageName}/{stateKey}/json")]
    public async Task<ActionResult> SetViewStateJson(string pageName, string stateKey, [FromBody] object value, 
        [FromQuery] DateTime? expiresAt = null, [FromQuery] bool isPersistent = true)
    {
        var userId = GetCurrentUserId();
        await _viewStateService.SetViewStateAsync(userId, pageName, stateKey, value, expiresAt, isPersistent);
        return Ok();
    }
}

public class ViewStateRequest<T> where T : class
{
    public T Value { get; set; } = default!;
    public DateTime? ExpiresAt { get; set; }
    public bool IsPersistent { get; set; } = true;
}