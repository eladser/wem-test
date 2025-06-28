using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardLayoutController : ControllerBase
{
    private readonly IDashboardLayoutService _layoutService;

    public DashboardLayoutController(IDashboardLayoutService layoutService)
    {
        _layoutService = layoutService;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DashboardLayoutDto>>> GetUserLayouts()
    {
        var userId = GetCurrentUserId();
        var layouts = await _layoutService.GetUserLayoutsAsync(userId);
        return Ok(layouts);
    }

    [HttpGet("page/{pageName}")]
    public async Task<ActionResult<IEnumerable<DashboardLayoutDto>>> GetPageLayouts(string pageName)
    {
        var userId = GetCurrentUserId();
        var layouts = await _layoutService.GetPageLayoutsAsync(userId, pageName);
        return Ok(layouts);
    }

    [HttpGet("page/{pageName}/default")]
    public async Task<ActionResult<DashboardLayoutDto>> GetDefaultLayout(string pageName)
    {
        var userId = GetCurrentUserId();
        var layout = await _layoutService.GetDefaultLayoutAsync(userId, pageName);
        if (layout == null)
        {
            return NotFound();
        }
        return Ok(layout);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DashboardLayoutDto>> GetLayout(int id)
    {
        var layout = await _layoutService.GetLayoutByIdAsync(id);
        if (layout == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (layout.UserId != userId)
        {
            return Forbid();
        }
        
        return Ok(layout);
    }

    [HttpPost]
    public async Task<ActionResult<DashboardLayoutDto>> CreateLayout([FromBody] DashboardLayoutDto layout)
    {
        var userId = GetCurrentUserId();
        layout.UserId = userId;
        layout.Id = 0;
        
        var created = await _layoutService.CreateLayoutAsync(layout);
        return CreatedAtAction(nameof(GetLayout), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DashboardLayoutDto>> UpdateLayout(int id, [FromBody] DashboardLayoutDto layout)
    {
        var existing = await _layoutService.GetLayoutByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        layout.Id = id;
        layout.UserId = userId;
        
        var updated = await _layoutService.UpdateLayoutAsync(layout);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteLayout(int id)
    {
        var existing = await _layoutService.GetLayoutByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        await _layoutService.DeleteLayoutAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/set-default")]
    public async Task<ActionResult> SetAsDefault(int id)
    {
        var existing = await _layoutService.GetLayoutByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        await _layoutService.SetAsDefaultAsync(id, userId, existing.PageName);
        return Ok();
    }
}