namespace WemLogViewer.Models;

public class LogStatistics
{
    public int TotalLogs { get; set; }
    public int TraceCount { get; set; }
    public int DebugCount { get; set; }
    public int InformationCount { get; set; }
    public int WarningCount { get; set; }
    public int ErrorCount { get; set; }
    public int FatalCount { get; set; }
    public DateTime? FirstLogTime { get; set; }
    public DateTime? LastLogTime { get; set; }
    public TimeSpan TimeSpan => (LastLogTime ?? DateTime.Now) - (FirstLogTime ?? DateTime.Now);
    public Dictionary<string, int> ComponentCounts { get; set; } = new();
    public Dictionary<string, int> UserCounts { get; set; } = new();
    public Dictionary<DateTime, int> HourlyDistribution { get; set; } = new();
    public List<string> MostCommonErrors { get; set; } = new();
    public double LogsPerMinute => TimeSpan.TotalMinutes > 0 ? TotalLogs / TimeSpan.TotalMinutes : 0;
    
    public int GetCountByLevel(string level)
    {
        return level?.ToLower() switch
        {
            "trace" => TraceCount,
            "debug" => DebugCount,
            "information" or "info" => InformationCount,
            "warning" or "warn" => WarningCount,
            "error" => ErrorCount,
            "fatal" or "critical" => FatalCount,
            _ => 0
        };
    }
}