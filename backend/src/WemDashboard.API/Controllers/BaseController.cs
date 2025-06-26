using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WemDashboard.Shared.Models;

namespace WemDashboard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public abstract class BaseController : ControllerBase
{
    protected IActionResult HandleResult<T>(ApiResponse<T> result)
    {
        if (result.Success)
        {
            return Ok(result);
        }

        return result.Message switch
        {
            var msg when msg.Contains("not found", StringComparison.OrdinalIgnoreCase) => NotFound(result),
            var msg when msg.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) => Unauthorized(result),
            var msg when msg.Contains("forbidden", StringComparison.OrdinalIgnoreCase) => Forbid(),
            _ => BadRequest(result)
        };
    }

    protected string? GetUserId()
    {
        return User.FindFirst("id")?.Value;
    }

    protected string? GetUserEmail()
    {
        return User.FindFirst("email")?.Value;
    }

    protected string? GetUserRole()
    {
        return User.FindFirst("role")?.Value;
    }

    protected string GetClientIpAddress()
    {
        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    }
}
