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
        @"^\\{.*\\}$",
        RegexOptions.Compiled);

    // Pattern to detect start of a new log entry (timestamp at beginning of line)
    private static readonly Regex LogStartRegex = new(
        @"^(?<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:?\d{2})?)",
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

        // Group lines into complete log entries
        var logEntries = GroupLogLines(lines);
        
        int entryNumber = 1;
        foreach (var logLines in logEntries)
        {
            try
            {
                var logEntry = ParseLogEntry(logLines, entryNumber);
                if (logEntry != null)
                {
                    logs.Add(logEntry);
                    entryNumber++;
                }
            }
            catch (Exception ex)
            {
                LoggingService.Logger?.Warning(ex, "Error parsing log entry starting at line {LineNumber}", logLines.FirstLineNumber);
                // Create a basic log entry for unparseable entries
                logs.Add(new LogEntry
                {
                    Id = entryNumber++,
                    Timestamp = DateTime.Now,
                    Level = "Unknown",
                    Message = logLines.Content,
                    RawLogLine = logLines.Content
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

    private List<LogEntryLines> GroupLogLines(string[] lines)
    {
        var logEntries = new List<LogEntryLines>();
        var currentEntry = new LogEntryLines();
        
        for (int i = 0; i < lines.Length; i++)
        {
            var line = lines[i];
            
            // Skip empty lines
            if (string.IsNullOrWhiteSpace(line))
                continue;
            
            // Check if this line starts a new log entry
            if (LogStartRegex.IsMatch(line))
            {
                // If we have a current entry, save it
                if (!string.IsNullOrEmpty(currentEntry.Content))
                {
                    logEntries.Add(currentEntry);
                }
                
                // Start a new entry
                currentEntry = new LogEntryLines
                {
                    Content = line,
                    FirstLineNumber = i + 1
                };
            }
            else
            {
                // This is a continuation line - append to current entry
                if (!string.IsNullOrEmpty(currentEntry.Content))
                {
                    currentEntry.Content += Environment.NewLine + line;
                }
                else
                {
                    // This shouldn't happen, but handle orphaned lines
                    currentEntry = new LogEntryLines
                    {
                        Content = line,
                        FirstLineNumber = i + 1
                    };
                }
            }
        }
        
        // Add the last entry if it exists
        if (!string.IsNullOrEmpty(currentEntry.Content))
        {
            logEntries.Add(currentEntry);
        }
        
        return logEntries;
    }

    private LogEntry? ParseLogEntry(LogEntryLines logLines, int entryNumber)
    {
        var content = logLines.Content;
        var firstLine = content.Split(Environment.NewLine)[0];
        
        // Try JSON format first
        if (JsonLogRegex.IsMatch(firstLine.Trim()))
        {
            return ParseJsonLog(firstLine, entryNumber, content);
        }

        // Try Serilog format
        var serilogMatch = SerilogRegex.Match(firstLine);
        if (serilogMatch.Success)
        {
            return ParseSerilogEntry(serilogMatch, entryNumber, content);
        }

        // Try generic format
        return ParseGenericLog(content, entryNumber, logLines.FirstLineNumber);
    }

    private LogEntry? ParseJsonLog(string firstLine, int entryNumber, string fullContent)
    {
        try
        {
            using var document = JsonDocument.Parse(firstLine);
            var root = document.RootElement;

            var logEntry = new LogEntry
            {
                Id = entryNumber,
                RawLogLine = fullContent,
                Message = fullContent // Full multi-line content as message
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
                logEntry.Level = level.GetString() ?? "Unknown";
            }

            if (root.TryGetProperty("@m", out var message) ||
                root.TryGetProperty("message", out message) ||
                root.TryGetProperty("Message", out message))
            {
                // For multi-line entries, combine JSON message with continuation lines
                var jsonMessage = message.GetString() ?? "";
                var lines = fullContent.Split(Environment.NewLine);
                if (lines.Length > 1)
                {
                    var continuationLines = string.Join(Environment.NewLine, lines.Skip(1));
                    logEntry.Message = jsonMessage + Environment.NewLine + continuationLines;
                }
                else
                {
                    logEntry.Message = jsonMessage;
                }
            }

            if (root.TryGetProperty("@x", out var exception) ||
                root.TryGetProperty("exception", out exception) ||
                root.TryGetProperty("Exception", out exception))
            {
                logEntry.StackTrace = exception.GetString() ?? "";
            }

            // Extract additional properties
            ExtractAdditionalProperties(root, logEntry);

            return logEntry;
        }
        catch (JsonException ex)
        {
            LoggingService.Logger?.Warning(ex, "Failed to parse JSON log entry {EntryNumber}", entryNumber);
            return null;
        }
    }

    private LogEntry ParseSerilogEntry(Match match, int entryNumber, string fullContent)
    {
        var logEntry = new LogEntry
        {
            Id = entryNumber,
            RawLogLine = fullContent
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

        // For multi-line entries, use the full content as message
        var firstLineMessage = match.Groups["message"].Value.Trim();
        var lines = fullContent.Split(Environment.NewLine);
        
        if (lines.Length > 1)
        {
            // Combine first line message with continuation lines
            var continuationLines = string.Join(Environment.NewLine, lines.Skip(1));
            logEntry.Message = firstLineMessage + Environment.NewLine + continuationLines;
        }
        else
        {
            logEntry.Message = firstLineMessage;
        }

        // Extract location (if available)
        if (match.Groups["location"].Success)
        {
            logEntry.Properties ??= new Dictionary<string, object>();
            logEntry.Properties["Location"] = match.Groups["location"].Value;
        }

        return logEntry;
    }

    private LogEntry ParseGenericLog(string fullContent, int entryNumber, int lineNumber)
    {
        var firstLine = fullContent.Split(Environment.NewLine)[0];
        
        var logEntry = new LogEntry
        {
            Id = entryNumber,
            RawLogLine = fullContent,
            Message = fullContent // Use full multi-line content
        };

        // Try to extract timestamp from first line
        var timestampMatch = TimestampRegex.Match(firstLine);
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

        // Try to extract level from first line
        var levelMatch = LevelRegex.Match(firstLine);
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

    private class LogEntryLines
    {
        public string Content { get; set; } = "";
        public int FirstLineNumber { get; set; }
    }
}