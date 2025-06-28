namespace WemDashboard.Application.DTOs;

public class DashboardLayoutDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string LayoutName { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;
    public string LayoutConfig { get; set; } = "{}";
    public int GridColumns { get; set; } = 12;
    public int GridRows { get; set; } = 10;
    public string GridGap { get; set; } = "medium";
    public string WidgetPositions { get; set; } = "[]";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}