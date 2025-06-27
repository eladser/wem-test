using System.ComponentModel.DataAnnotations;

namespace WemDashboard.Shared.DTOs;

/// <summary>
/// DTO for general settings
/// </summary>
public class GeneralSettingsDto
{
    [Required(ErrorMessage = "Company name is required")]
    [StringLength(100, ErrorMessage = "Company name cannot exceed 100 characters")]
    public string Company { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "Timezone cannot exceed 50 characters")]
    public string? Timezone { get; set; }

    public bool DarkMode { get; set; }
    
    public bool AutoSync { get; set; }
}

/// <summary>
/// DTO for notification settings
/// </summary>
public class NotificationSettingsDto
{
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool AlertsEnabled { get; set; }
    public int AlertThreshold { get; set; }
    public List<string> NotificationTypes { get; set; } = new();
}

/// <summary>
/// DTO for security settings
/// </summary>
public class SecuritySettingsDto
{
    public bool TwoFactorEnabled { get; set; }
    public int SessionTimeout { get; set; }
    public bool RequirePasswordChange { get; set; }
    public int PasswordExpiryDays { get; set; }
}

/// <summary>
/// DTO for all settings combined
/// </summary>
public class AllSettingsDto
{
    public GeneralSettingsDto? General { get; set; }
    public NotificationSettingsDto? Notifications { get; set; }
    public SecuritySettingsDto? Security { get; set; }
}