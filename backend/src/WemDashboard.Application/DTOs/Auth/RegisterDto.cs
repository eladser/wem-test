using System.ComponentModel.DataAnnotations;
using WemDashboard.Domain.Entities;
using WemDashboard.Domain.Enums;

namespace WemDashboard.Application.DTOs.Auth;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Viewer;
}
