namespace WemLogViewer.Models;

public class ExportConfig
{
    public ExportFormat Format { get; set; } = ExportFormat.CSV;
    public bool IncludeHeaders { get; set; } = true;
    public bool ExportFilteredOnly { get; set; } = true;
    public string OutputPath { get; set; } = string.Empty;
    public List<string> SelectedFields { get; set; } = new();
    public string DateFormat { get; set; } = "yyyy-MM-dd HH:mm:ss.fff";
    public bool IncludeRawLog { get; set; } = false;
    public bool IncludeProperties { get; set; } = true;
}

public enum ExportFormat
{
    CSV,
    JSON,
    XML,
    HTML,
    Text
}