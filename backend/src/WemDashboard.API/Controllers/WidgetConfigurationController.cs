using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WidgetConfigurationController : ControllerBase
{
    private readonly IWidgetConfigurationService _widgetService;

    public WidgetConfigurationController(IWidgetConfigurationService widgetService)
    {
        _widgetService = widgetService;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WidgetConfigurationDto>>> GetUserWidgets()
    {
        var userId = GetCurrentUserId();
        var widgets = await _widgetService.GetUserWidgetsAsync(userId);
        return Ok(widgets);
    }

    [HttpGet("page/{pageName}")]
    public async Task<ActionResult<IEnumerable<WidgetConfigurationDto>>> GetPageWidgets(string pageName)
    {
        var userId = GetCurrentUserId();
        var widgets = await _widgetService.GetPageWidgetsAsync(userId, pageName);
        return Ok(widgets);
    }

    [HttpGet("layout/{layoutId}")]
    public async Task<ActionResult<IEnumerable<WidgetConfigurationDto>>> GetLayoutWidgets(int layoutId)
    {
        var widgets = await _widgetService.GetLayoutWidgetsAsync(layoutId);
        var userId = GetCurrentUserId();
        
        // Filter to only return widgets belonging to the current user
        var userWidgets = widgets.Where(w => w.UserId == userId);
        return Ok(userWidgets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WidgetConfigurationDto>> GetWidget(int id)
    {
        var widget = await _widgetService.GetWidgetByIdAsync(id);
        if (widget == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (widget.UserId != userId)
        {
            return Forbid();
        }
        
        return Ok(widget);
    }

    [HttpGet("widget/{widgetId}")]
    public async Task<ActionResult<WidgetConfigurationDto>> GetWidgetByWidgetId(string widgetId)
    {
        var userId = GetCurrentUserId();
        var widget = await _widgetService.GetWidgetByWidgetIdAsync(userId, widgetId);
        if (widget == null)
        {
            return NotFound();
        }
        
        return Ok(widget);
    }

    [HttpPost]
    public async Task<ActionResult<WidgetConfigurationDto>> CreateWidget([FromBody] WidgetConfigurationDto widget)
    {
        var userId = GetCurrentUserId();
        widget.UserId = userId;
        widget.Id = 0;
        
        var created = await _widgetService.CreateWidgetAsync(widget);
        return CreatedAtAction(nameof(GetWidget), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WidgetConfigurationDto>> UpdateWidget(int id, [FromBody] WidgetConfigurationDto widget)
    {
        var existing = await _widgetService.GetWidgetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        widget.Id = id;
        widget.UserId = userId;
        
        var updated = await _widgetService.UpdateWidgetAsync(widget);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWidget(int id)
    {
        var existing = await _widgetService.GetWidgetByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        await _widgetService.DeleteWidgetAsync(id);
        return NoContent();
    }

    [HttpDelete("widget/{widgetId}")]
    public async Task<ActionResult> DeleteWidgetByWidgetId(string widgetId)
    {
        var userId = GetCurrentUserId();
        await _widgetService.DeleteWidgetByWidgetIdAsync(userId, widgetId);
        return NoContent();
    }

    [HttpPut("bulk")]
    public async Task<ActionResult<IEnumerable<WidgetConfigurationDto>>> BulkUpdateWidgets([FromBody] IEnumerable<WidgetConfigurationDto> widgets)
    {
        var userId = GetCurrentUserId();
        
        // Ensure all widgets belong to the current user
        foreach (var widget in widgets)
        {
            widget.UserId = userId;
        }
        
        var updated = await _widgetService.BulkUpdateWidgetsAsync(widgets);
        return Ok(updated);
    }
}