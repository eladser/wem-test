using System.Globalization;
using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using WemLogViewer.Models;

namespace WemLogViewer.Services;

public class LogFileService
{
    private static readonly Regex SerilogRegex = new(
        @"^(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) \[(?<level>\w+)\]\s*(?<message>.*?)(?:\s+at\s+(?<location>.*))?$",
        RegexOptions.Compiled | RegexOptions.Multiline);

    private static readonly Regex JsonLogRegex = new(
        @"^\{.*\}$",
        RegexOptions.Compiled);

    private static readonly Regex TimestampRegex = new(
        @"(?<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:?\d{2})?)",
        RegexOptions.Compiled);

    private static readonly Regex LevelRegex = new(
        @"\b(?<level>TRACE|DEBUG|INFO|INFORMATION|WARN|WARNING|ERROR|FATAL|CRITICAL)\b",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public List<LogEntry> ReadLogFile(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Log file not found: {filePath}");

        var logs = new List<LogEntry>();
        var lines = File.ReadAllLines(filePath);
        
        LoggingService.Logger?.Information("Reading log file: {FilePath} ({LineCount} lines)", filePath, lines.Length);

        for (int i = 0; i < lines.Length; i++)
        {
            try
            {
                var line = lines[i];
                if (string.IsNullOrWhiteSpace(line)) continue;

                var logEntry = ParseLogLine(line, i + 1);
                if (logEntry != null)
                {
                    logs.Add(logEntry);
                }
            }
            catch (Exception ex)
            {
                LoggingService.Logger?.Warning(ex, "Error parsing log line {LineNumber} in file {FilePath}", i + 1, filePath);
                // Create a basic log entry for unparseable lines
                logs.Add(new LogEntry
                {
                    Id = i + 1,
                    Timestamp = DateTime.Now,
                    Level = "Unknown",
                    Message = lines[i],
                    RawLogLine = lines[i]
                });
            }
        }

        LoggingService.Logger?.Information("Parsed {LogCount} log entries from {FilePath}", logs.Count, filePath);
        return logs;
    }

    public List<LogEntry> ReadLogDirectory(string directoryPath)
    {
        if (!Directory.Exists(directoryPath))
            throw new DirectoryNotFoundException($"Log directory not found: {directoryPath}");

        var allLogs = new List<LogEntry>();
        var logFiles = Directory.GetFiles(directoryPath, "*.log", SearchOption.AllDirectories)
            .Concat(Directory.GetFiles(directoryPath, "*.txt", SearchOption.AllDirectories))
            .OrderBy(f => f)
            .ToList();

        LoggingService.Logger?.Information("Reading {FileCount} log files from directory: {DirectoryPath}", logFiles.Count, directoryPath);

        foreach (var file in logFiles)
        {
            try
            {
                var fileLogs = ReadLogFile(file);
                // Add file source information
                foreach (var log in fileLogs)
                {
                    log.Properties ??= new Dictionary<string, object>();
                    log.Properties["SourceFile"] = Path.GetFileName(file);
                }
                allLogs.AddRange(fileLogs);
            }
            catch (Exception ex)
            {
                LoggingService.Logger?.Error(ex, "Error reading log file: {FilePath}", file);
            }
        }

        return allLogs.OrderBy(l => l.Timestamp).ToList();
    }

    private LogEntry? ParseLogLine(string line, int lineNumber)
    {
        // Try JSON format first
        if (JsonLogRegex.IsMatch(line.Trim()))
        {
            return ParseJsonLog(line, lineNumber);
        }

        // Try Serilog format
        var serilogMatch = SerilogRegex.Match(line);
        if (serilogMatch.Success)
        {
            return ParseSerilogEntry(serilogMatch, line, lineNumber);
        }

        // Try generic format
        return ParseGenericLog(line, lineNumber);
    }

    private LogEntry? ParseJsonLog(string line, int lineNumber)
    {
        try
        {
            using var document = JsonDocument.Parse(line);
            var root = document.RootElement;

            var logEntry = new LogEntry
            {
                Id = lineNumber,
                RawLogLine = line
            };

            // Extract common properties
            if (root.TryGetProperty("@t", out var timestamp) ||
                root.TryGetProperty("timestamp", out timestamp) ||
                root.TryGetProperty("Timestamp", out timestamp))
            {
                if (DateTime.TryParse(timestamp.GetString(), out var ts))
                {
                    logEntry.Timestamp = ts;
                }
            }

            if (root.TryGetProperty("@l", out var level) ||
                root.TryGetProperty("level", out level) ||
                root.TryGetProperty("Level", out level))
            {
                logEntry.Level = level.GetString();
            }

            if (root.TryGetProperty("@m", out var message) ||
                root.TryGetProperty("message", out message) ||
                root.TryGetProperty("Message", out message))
            {
                logEntry.Message = message.GetString();
            }

            if (root.TryGetProperty("@x", out var exception) ||
                root.TryGetProperty("exception", out exception) ||
                root.TryGetProperty("Exception", out exception))
            {
                logEntry.StackTrace = exception.GetString();
            }

            // Extract additional properties
            ExtractAdditionalProperties(root, logEntry);

            return logEntry;
        }
        catch (JsonException ex)
        {
            LoggingService.Logger?.Warning(ex, "Failed to parse JSON log line {LineNumber}", lineNumber);
            return null;
        }
    }

    private LogEntry ParseSerilogEntry(Match match, string line, int lineNumber)
    {
        var logEntry = new LogEntry
        {
            Id = lineNumber,
            RawLogLine = line
        };

        // Extract timestamp
        if (DateTime.TryParseExact(match.Groups["timestamp"].Value, 
            "yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture, 
            DateTimeStyles.None, out var timestamp))
        {
            logEntry.Timestamp = timestamp;
        }

        // Extract level
        logEntry.Level = match.Groups["level"].Value;

        // Extract message
        logEntry.Message = match.Groups["message"].Value.Trim();

        // Extract location (if available)
        if (match.Groups["location"].Success)
        {
            logEntry.Properties ??= new Dictionary<string, object>();
            logEntry.Properties["Location"] = match.Groups["location"].Value;
        }

        return logEntry;
    }

    private LogEntry ParseGenericLog(string line, int lineNumber)
    {
        var logEntry = new LogEntry
        {
            Id = lineNumber,
            RawLogLine = line,
            Message = line
        };

        // Try to extract timestamp
        var timestampMatch = TimestampRegex.Match(line);
        if (timestampMatch.Success)
        {
            if (DateTime.TryParse(timestampMatch.Groups["timestamp"].Value, out var timestamp))
            {
                logEntry.Timestamp = timestamp;
            }
        }
        else
        {
            logEntry.Timestamp = DateTime.Now;
        }

        // Try to extract level
        var levelMatch = LevelRegex.Match(line);
        if (levelMatch.Success)
        {
            logEntry.Level = NormalizeLevel(levelMatch.Groups["level"].Value);
        }
        else
        {
            logEntry.Level = "Information";
        }

        return logEntry;
    }

    private void ExtractAdditionalProperties(JsonElement root, LogEntry logEntry)
    {
        logEntry.Properties = new Dictionary<string, object>();

        foreach (var property in root.EnumerateObject())
        {
            switch (property.Name.ToLower())
            {
                case "component":
                    logEntry.Component = property.Value.GetString();
                    break;
                case "userid":
                case "user":
                    logEntry.UserId = property.Value.GetString();
                    break;
                case "url":
                    logEntry.Url = property.Value.GetString();
                    break;
                case "context":
                    logEntry.Context = property.Value.GetRawText();
                    break;
                case "error":
                    if (property.Value.TryGetProperty("stack", out var stack))
                    {
                        logEntry.StackTrace = stack.GetString();
                    }
                    logEntry.Properties["Error"] = property.Value.GetRawText();
                    break;
                default:
                    // Skip internal Serilog properties
                    if (!property.Name.StartsWith("@"))
                    {
                        try
                        {
                            logEntry.Properties[property.Name] = property.Value.ValueKind switch
                            {
                                JsonValueKind.String => property.Value.GetString() ?? "",
                                JsonValueKind.Number => property.Value.GetDouble(),
                                JsonValueKind.True => true,
                                JsonValueKind.False => false,
                                _ => property.Value.GetRawText()
                            };
                        }
                        catch
                        {
                            logEntry.Properties[property.Name] = property.Value.GetRawText();
                        }
                    }
                    break;
            }
        }
    }

    private static string NormalizeLevel(string level)
    {
        return level.ToUpper() switch
        {
            "TRACE" => "Trace",
            "DEBUG" => "Debug",
            "INFO" => "Information",
            "INFORMATION" => "Information",
            "WARN" => "Warning",
            "WARNING" => "Warning",
            "ERROR" => "Error",
            "FATAL" => "Fatal",
            "CRITICAL" => "Fatal",
            _ => "Information"
        };
    }
}