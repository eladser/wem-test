using System.Globalization;
using System.IO;
using System.Text;
using System.Text.Json;
using WemLogViewer.Models;

namespace WemLogViewer.Services;

public class ExportService
{
    public void ExportLogs(List<LogEntry> logs, string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLower();
        
        switch (extension)
        {
            case ".csv":
                ExportToCsv(logs, filePath);
                break;
            case ".json":
                ExportToJson(logs, filePath);
                break;
            case ".txt":
                ExportToText(logs, filePath);
                break;
            case ".html":
                ExportToHtml(logs, filePath);
                break;
            default:
                throw new ArgumentException($"Unsupported export format: {extension}");
        }
        
        LoggingService.Logger?.Information("Exported {LogCount} logs to {FilePath}", logs.Count, filePath);
    }
    
    private void ExportToCsv(List<LogEntry> logs, string filePath)
    {
        using var writer = new StreamWriter(filePath, false, Encoding.UTF8);
        
        // Write header
        writer.WriteLine("Timestamp,Level,Component,Message,UserId,Url,Context,StackTrace");
        
        // Write data
        foreach (var log in logs)
        {
            var fields = new[]
            {
                EscapeCsvField(log.FormattedTimestamp),
                EscapeCsvField(log.Level ?? ""),
                EscapeCsvField(log.Component ?? ""),
                EscapeCsvField(log.Message ?? ""),
                EscapeCsvField(log.UserId ?? ""),
                EscapeCsvField(log.Url ?? ""),
                EscapeCsvField(log.Context ?? ""),
                EscapeCsvField(log.StackTrace ?? "")
            };
            
            writer.WriteLine(string.Join(",", fields));
        }
    }
    
    private void ExportToJson(List<LogEntry> logs, string filePath)
    {
        var exportData = logs.Select(log => new
        {
            Id = log.Id,
            Timestamp = log.Timestamp.ToString("O"), // ISO 8601 format
            Level = log.Level,
            Component = log.Component,
            Message = log.Message,
            UserId = log.UserId,
            Url = log.Url,
            Context = log.Context,
            StackTrace = log.StackTrace,
            Properties = log.Properties
        }).ToList();
        
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
        
        var json = JsonSerializer.Serialize(exportData, options);
        File.WriteAllText(filePath, json, Encoding.UTF8);
    }
    
    private void ExportToText(List<LogEntry> logs, string filePath)
    {
        using var writer = new StreamWriter(filePath, false, Encoding.UTF8);
        
        writer.WriteLine($"WEM Log Export - Generated on {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
        writer.WriteLine($"Total Logs: {logs.Count}");
        writer.WriteLine(new string('=', 80));
        writer.WriteLine();
        
        foreach (var log in logs)
        {
            writer.WriteLine($"[{log.FormattedTimestamp}] {log.Level?.ToUpper()}: {log.Message}");
            
            if (!string.IsNullOrEmpty(log.Component))
                writer.WriteLine($"Component: {log.Component}");
            
            if (!string.IsNullOrEmpty(log.UserId))
                writer.WriteLine($"User: {log.UserId}");
            
            if (!string.IsNullOrEmpty(log.Url))
                writer.WriteLine($"URL: {log.Url}");
            
            if (!string.IsNullOrEmpty(log.Context))
            {
                writer.WriteLine("Context:");
                writer.WriteLine(log.Context);
            }
            
            if (!string.IsNullOrEmpty(log.StackTrace))
            {
                writer.WriteLine("Stack Trace:");
                writer.WriteLine(log.StackTrace);
            }
            
            if (log.Properties?.Count > 0)
            {
                writer.WriteLine("Additional Properties:");
                foreach (var prop in log.Properties)
                {
                    writer.WriteLine($"  {prop.Key}: {prop.Value}");
                }
            }
            
            writer.WriteLine(new string('-', 40));
        }
    }
    
    private void ExportToHtml(List<LogEntry> logs, string filePath)
    {
        var html = new StringBuilder();
        
        html.AppendLine("<!DOCTYPE html>");
        html.AppendLine("<html lang='en'>");
        html.AppendLine("<head>");
        html.AppendLine("<meta charset='UTF-8'>");
        html.AppendLine("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        html.AppendLine("<title>WEM Log Export</title>");
        html.AppendLine("<style>");
        html.AppendLine(GetHtmlStyles());
        html.AppendLine("</style>");
        html.AppendLine("</head>");
        html.AppendLine("<body>");
        
        html.AppendLine("<div class='header'>");
        html.AppendLine("<h1>WEM Log Export</h1>");
        html.AppendLine($"<p>Generated on {DateTime.Now:yyyy-MM-dd HH:mm:ss} | Total Logs: {logs.Count}</p>");
        html.AppendLine("</div>");
        
        html.AppendLine("<div class='logs'>");
        
        foreach (var log in logs)
        {
            var levelClass = GetLevelClass(log.Level);
            html.AppendLine($"<div class='log-entry {levelClass}'>");
            html.AppendLine($"<div class='log-header'>");
            html.AppendLine($"<span class='timestamp'>{log.FormattedTimestamp}</span>");
            html.AppendLine($"<span class='level level-{log.Level?.ToLower()}'>{log.Level}</span>");
            if (!string.IsNullOrEmpty(log.Component))
                html.AppendLine($"<span class='component'>{EscapeHtml(log.Component)}</span>");
            html.AppendLine($"</div>");
            html.AppendLine($"<div class='message'>{EscapeHtml(log.Message ?? "")}</div>");
            
            if (!string.IsNullOrEmpty(log.Context) || !string.IsNullOrEmpty(log.StackTrace))
            {
                html.AppendLine("<div class='details'>");
                
                if (!string.IsNullOrEmpty(log.Context))
                {
                    html.AppendLine("<div class='context'>");
                    html.AppendLine("<strong>Context:</strong>");
                    html.AppendLine($"<pre>{EscapeHtml(log.Context)}</pre>");
                    html.AppendLine("</div>");
                }
                
                if (!string.IsNullOrEmpty(log.StackTrace))
                {
                    html.AppendLine("<div class='stack-trace'>");
                    html.AppendLine("<strong>Stack Trace:</strong>");
                    html.AppendLine($"<pre>{EscapeHtml(log.StackTrace)}</pre>");
                    html.AppendLine("</div>");
                }
                
                html.AppendLine("</div>");
            }
            
            html.AppendLine("</div>");
        }
        
        html.AppendLine("</div>");
        html.AppendLine("</body>");
        html.AppendLine("</html>");
        
        File.WriteAllText(filePath, html.ToString(), Encoding.UTF8);
    }
    
    private static string EscapeCsvField(string field)
    {
        if (string.IsNullOrEmpty(field)) return "";
        
        // Escape quotes and wrap in quotes if necessary
        if (field.Contains(',') || field.Contains('"') || field.Contains('\n') || field.Contains('\r'))
        {
            return $"\"{field.Replace("\"", "\"\"")}\""; 
        }
        
        return field;
    }
    
    private static string EscapeHtml(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        
        return text
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;")
            .Replace("\"", "&quot;")
            .Replace("'", "&#39;");
    }
    
    private static string GetLevelClass(string? level)
    {
        return level?.ToLower() switch
        {
            "error" => "log-error",
            "fatal" => "log-fatal",
            "warning" => "log-warning",
            "information" => "log-info",
            "debug" => "log-debug",
            "trace" => "log-trace",
            _ => "log-unknown"
        };
    }
    
    private static string GetHtmlStyles()
    {
        return @"
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
.header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header h1 { margin: 0; color: #333; }
.header p { margin: 5px 0 0 0; color: #666; }
.logs { display: flex; flex-direction: column; gap: 10px; }
.log-entry { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.log-header { padding: 12px 16px; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; align-items: center; gap: 12px; }
.timestamp { font-family: 'Courier New', monospace; font-size: 12px; color: #666; }
.level { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
.level-error { background: #dc3545; color: white; }
.level-fatal { background: #6f1616; color: white; }
.level-warning { background: #ffc107; color: #212529; }
.level-information { background: #17a2b8; color: white; }
.level-debug { background: #6c757d; color: white; }
.level-trace { background: #e9ecef; color: #495057; }
.component { background: #e7f3ff; color: #0366d6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.message { padding: 16px; color: #333; }
.details { padding: 0 16px 16px 16px; }
.context, .stack-trace { margin-top: 12px; }
.context strong, .stack-trace strong { color: #495057; }
pre { background: #f8f9fa; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 8px 0 0 0; }
.log-error { border-left: 4px solid #dc3545; }
.log-fatal { border-left: 4px solid #6f1616; }
.log-warning { border-left: 4px solid #ffc107; }
.log-info { border-left: 4px solid #17a2b8; }
.log-debug { border-left: 4px solid #6c757d; }
.log-trace { border-left: 4px solid #e9ecef; }
";
    }
}