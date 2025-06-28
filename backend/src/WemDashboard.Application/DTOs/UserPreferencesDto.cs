namespace WemDashboard.Application.DTOs;

public class UserPreferencesDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    
    // Theme and Display Settings
    public string Theme { get; set; } = "dark";
    public string Language { get; set; } = "en";
    public string TimeZone { get; set; } = "UTC";
    public string DateFormat { get; set; } = "MM/dd/yyyy";
    public string TimeFormat { get; set; } = "HH:mm";
    public bool AutoRefresh { get; set; } = true;
    public int RefreshInterval { get; set; } = 30;
    
    // Notification Settings
    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public bool SmsNotifications { get; set; } = false;
    public bool CriticalAlertsOnly { get; set; } = false;
    public string NotificationSound { get; set; } = "default";
    
    // Dashboard Layout
    public string DefaultDashboard { get; set; } = "overview";
    public bool ShowSidebar { get; set; } = true;
    public bool CompactMode { get; set; } = false;
    
    // Data Display Preferences
    public string PowerUnit { get; set; } = "kW";
    public string EnergyUnit { get; set; } = "kWh";
    public string CurrencySymbol { get; set; } = "$";
    public int DecimalPlaces { get; set; } = 2;
    
    // Chart and Analytics Settings
    public string DefaultChartType { get; set; } = "line";
    public int ChartAnimationDuration { get; set; } = 300;
    public bool ShowDataLabels { get; set; } = true;
    public string ChartColorScheme { get; set; } = "blue";
    
    // Security Settings
    public bool TwoFactorEnabled { get; set; } = false;
    public int SessionTimeout { get; set; } = 60;
    public bool RequirePasswordChange { get; set; } = false;
    public int PasswordChangeInterval { get; set; } = 90;
    
    // Export Settings
    public string DefaultExportFormat { get; set; } = "xlsx";
    public bool IncludeHeaders { get; set; } = true;
    public string DateRangeDefault { get; set; } = "last30days";
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}