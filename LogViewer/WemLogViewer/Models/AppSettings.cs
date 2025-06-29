namespace WemLogViewer.Models;

public class AppSettings
{
    // General Settings
    public bool AutoLoadLastFile { get; set; } = false;
    public bool ShowLineNumbers { get; set; } = true;
    public bool WordWrap { get; set; } = true;
    public bool ConfirmExit { get; set; } = false;
    public string LastOpenedFile { get; set; } = string.Empty;
    public List<string> RecentFiles { get; set; } = new();
    
    // Auto Refresh Settings
    public bool AutoRefreshEnabled { get; set; } = false;
    public int RefreshIntervalSeconds { get; set; } = 5;
    public bool AutoScrollToEnd { get; set; } = true;
    
    // Display Settings
    public string FontFamily { get; set; } = "Consolas";
    public double FontSize { get; set; } = 12;
    public string ErrorColor { get; set; } = "#FF0000";
    public string WarningColor { get; set; } = "#FFA500";
    public string InfoColor { get; set; } = "#0000FF";
    public bool AlternatingRowColors { get; set; } = true;
    public bool ShowGridLines { get; set; } = true;
    public int RowsPerPage { get; set; } = 1000;
    
    // Filter Settings
    public bool DefaultTraceEnabled { get; set; } = false;
    public bool DefaultDebugEnabled { get; set; } = false;
    public bool DefaultInfoEnabled { get; set; } = true;
    public bool DefaultWarnEnabled { get; set; } = true;
    public bool DefaultErrorEnabled { get; set; } = true;
    public bool DefaultFatalEnabled { get; set; } = true;
    public bool RememberFilters { get; set; } = true;
    public bool ApplyFiltersRealTime { get; set; } = true;
    public int MaxFilterResults { get; set; } = 10000;
    
    // Performance Settings
    public int MaxLogsInMemory { get; set; } = 100000;
    public bool UseVirtualization { get; set; } = true;
    public bool BackgroundLoading { get; set; } = true;
    
    // Export Settings
    public ExportFormat DefaultExportFormat { get; set; } = ExportFormat.CSV;
    public bool IncludeHeaders { get; set; } = true;
    public bool ExportFilteredOnly { get; set; } = true;
    
    // Debug Settings
    public bool EnableDebugLogging { get; set; } = false;
    public bool ShowPerformanceStats { get; set; } = false;
    
    // Window Settings
    public double WindowWidth { get; set; } = 1400;
    public double WindowHeight { get; set; } = 900;
    public bool WindowMaximized { get; set; } = false;
    public double LeftPanelWidth { get; set; } = 300;
    public double BottomPanelHeight { get; set; } = 200;
}