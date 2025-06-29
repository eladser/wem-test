using System;
using System.Collections.Generic;

namespace WemLogViewer.Models;

public class LogEntry
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string Level { get; set; } = "Information";
    public string Message { get; set; } = string.Empty;
    public string? Component { get; set; }
    public string? UserId { get; set; }
    public string? Url { get; set; }
    public string? Context { get; set; }
    public string? StackTrace { get; set; }
    public string RawLogLine { get; set; } = string.Empty;
    public Dictionary<string, object>? Properties { get; set; }
    
    public LogEntry()
    {
        Timestamp = DateTime.Now;
        Properties = new Dictionary<string, object>();
    }
}