using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WemDashboard.Application.DTOs;
using WemDashboard.Application.Services;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GridConfigurationController : ControllerBase
{
    private readonly IGridConfigurationService _gridService;

    public GridConfigurationController(IGridConfigurationService gridService)
    {
        _gridService = gridService;
    }

    private string GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    }

    // Complete grid configuration endpoints
    [HttpGet]
    public async Task<ActionResult<GridConfigurationDto>> GetGridConfiguration([FromQuery] int? siteId = null)
    {
        var userId = GetCurrentUserId();
        var gridConfig = await _gridService.GetCompleteGridConfigurationAsync(userId, siteId);
        return Ok(gridConfig);
    }

    [HttpPost("save")]
    public async Task<ActionResult<GridConfigurationDto>> SaveGridConfiguration([FromBody] GridConfigurationDto gridConfig)
    {
        var userId = GetCurrentUserId();
        gridConfig.UserId = userId;
        
        var saved = await _gridService.SaveCompleteGridConfigurationAsync(gridConfig);
        return Ok(saved);
    }

    // Component endpoints
    [HttpGet("components")]
    public async Task<ActionResult<IEnumerable<GridComponentConfigurationDto>>> GetComponents([FromQuery] int? siteId = null)
    {
        var userId = GetCurrentUserId();
        var components = siteId.HasValue 
            ? await _gridService.GetSiteComponentsAsync(userId, siteId.Value)
            : await _gridService.GetUserComponentsAsync(userId);
        return Ok(components);
    }

    [HttpGet("components/{id}")]
    public async Task<ActionResult<GridComponentConfigurationDto>> GetComponent(int id)
    {
        var component = await _gridService.GetComponentByIdAsync(id);
        if (component == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (component.UserId != userId)
        {
            return Forbid();
        }
        
        return Ok(component);
    }

    [HttpGet("components/component/{componentId}")]
    public async Task<ActionResult<GridComponentConfigurationDto>> GetComponentByComponentId(string componentId)
    {
        var userId = GetCurrentUserId();
        var component = await _gridService.GetComponentByComponentIdAsync(userId, componentId);
        if (component == null)
        {
            return NotFound();
        }
        
        return Ok(component);
    }

    [HttpPost("components")]
    public async Task<ActionResult<GridComponentConfigurationDto>> CreateComponent([FromBody] GridComponentConfigurationDto component)
    {
        var userId = GetCurrentUserId();
        component.UserId = userId;
        component.Id = 0;
        
        var created = await _gridService.CreateComponentAsync(component);
        return CreatedAtAction(nameof(GetComponent), new { id = created.Id }, created);
    }

    [HttpPut("components/{id}")]
    public async Task<ActionResult<GridComponentConfigurationDto>> UpdateComponent(int id, [FromBody] GridComponentConfigurationDto component)
    {
        var existing = await _gridService.GetComponentByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        component.Id = id;
        component.UserId = userId;
        
        var updated = await _gridService.UpdateComponentAsync(component);
        return Ok(updated);
    }

    [HttpDelete("components/{id}")]
    public async Task<ActionResult> DeleteComponent(int id)
    {
        var existing = await _gridService.GetComponentByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        await _gridService.DeleteComponentAsync(id);
        return NoContent();
    }

    [HttpDelete("components/component/{componentId}")]
    public async Task<ActionResult> DeleteComponentByComponentId(string componentId)
    {
        var userId = GetCurrentUserId();
        await _gridService.DeleteComponentByComponentIdAsync(userId, componentId);
        return NoContent();
    }

    [HttpPut("components/bulk")]
    public async Task<ActionResult<IEnumerable<GridComponentConfigurationDto>>> BulkUpdateComponents([FromBody] IEnumerable<GridComponentConfigurationDto> components)
    {
        var userId = GetCurrentUserId();
        
        // Ensure all components belong to the current user
        foreach (var component in components)
        {
            component.UserId = userId;
        }
        
        var updated = await _gridService.BulkUpdateComponentsAsync(components);
        return Ok(updated);
    }

    // Flow endpoints
    [HttpGet("flows")]
    public async Task<ActionResult<IEnumerable<EnergyFlowConfigurationDto>>> GetFlows([FromQuery] int? siteId = null)
    {
        var userId = GetCurrentUserId();
        var flows = siteId.HasValue 
            ? await _gridService.GetSiteFlowsAsync(userId, siteId.Value)
            : await _gridService.GetUserFlowsAsync(userId);
        return Ok(flows);
    }

    [HttpGet("flows/{id}")]
    public async Task<ActionResult<EnergyFlowConfigurationDto>> GetFlow(int id)
    {
        var flow = await _gridService.GetFlowByIdAsync(id);
        if (flow == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (flow.UserId != userId)
        {
            return Forbid();
        }
        
        return Ok(flow);
    }

    [HttpGet("flows/flow/{flowId}")]
    public async Task<ActionResult<EnergyFlowConfigurationDto>> GetFlowByFlowId(string flowId)
    {
        var userId = GetCurrentUserId();
        var flow = await _gridService.GetFlowByFlowIdAsync(userId, flowId);
        if (flow == null)
        {
            return NotFound();
        }
        
        return Ok(flow);
    }

    [HttpPost("flows")]
    public async Task<ActionResult<EnergyFlowConfigurationDto>> CreateFlow([FromBody] EnergyFlowConfigurationDto flow)
    {
        var userId = GetCurrentUserId();
        flow.UserId = userId;
        flow.Id = 0;
        
        var created = await _gridService.CreateFlowAsync(flow);
        return CreatedAtAction(nameof(GetFlow), new { id = created.Id }, created);
    }

    [HttpPut("flows/{id}")]
    public async Task<ActionResult<EnergyFlowConfigurationDto>> UpdateFlow(int id, [FromBody] EnergyFlowConfigurationDto flow)
    {
        var existing = await _gridService.GetFlowByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        flow.Id = id;
        flow.UserId = userId;
        
        var updated = await _gridService.UpdateFlowAsync(flow);
        return Ok(updated);
    }

    [HttpDelete("flows/{id}")]
    public async Task<ActionResult> DeleteFlow(int id)
    {
        var existing = await _gridService.GetFlowByIdAsync(id);
        if (existing == null)
        {
            return NotFound();
        }
        
        var userId = GetCurrentUserId();
        if (existing.UserId != userId)
        {
            return Forbid();
        }
        
        await _gridService.DeleteFlowAsync(id);
        return NoContent();
    }

    [HttpDelete("flows/flow/{flowId}")]
    public async Task<ActionResult> DeleteFlowByFlowId(string flowId)
    {
        var userId = GetCurrentUserId();
        await _gridService.DeleteFlowByFlowIdAsync(userId, flowId);
        return NoContent();
    }

    [HttpPut("flows/bulk")]
    public async Task<ActionResult<IEnumerable<EnergyFlowConfigurationDto>>> BulkUpdateFlows([FromBody] IEnumerable<EnergyFlowConfigurationDto> flows)
    {
        var userId = GetCurrentUserId();
        
        // Ensure all flows belong to the current user
        foreach (var flow in flows)
        {
            flow.UserId = userId;
        }
        
        var updated = await _gridService.BulkUpdateFlowsAsync(flows);
        return Ok(updated);
    }
}