namespace WemDashboard.Application.DTOs;

public class WidgetConfigurationDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string WidgetId { get; set; } = string.Empty;
    public string WidgetType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
    public int Width { get; set; } = 4;
    public int Height { get; set; } = 4;
    public string Settings { get; set; } = "{}";
    public string DataSource { get; set; } = string.Empty;
    public string DataFilters { get; set; } = "{}";
    public bool IsVisible { get; set; } = true;
    public bool IsResizable { get; set; } = true;
    public bool IsDraggable { get; set; } = true;
    public string PageName { get; set; } = string.Empty;
    public int DashboardLayoutId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}