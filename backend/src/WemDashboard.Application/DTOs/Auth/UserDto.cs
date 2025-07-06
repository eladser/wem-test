using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Application.DTOs.Auth;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
}
