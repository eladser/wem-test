using System.Data;
using System.Data.SQLite;
using WemLogViewer.Models;

namespace WemLogViewer.Services;

public class DatabaseService
{
    public List<LogEntry> GetLogs(string connectionString, int maxRecords = 10000)
    {
        var logs = new List<LogEntry>();
        
        try
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            
            // Try different table names and structures
            var query = DetectLogTableStructure(connection);
            if (string.IsNullOrEmpty(query))
            {
                throw new InvalidOperationException("No recognized log table structure found in database");
            }
            
            using var command = new SQLiteCommand(query, connection);
            using var reader = command.ExecuteReader();
            
            var columnNames = GetColumnNames(reader);
            int recordCount = 0;
            
            while (reader.Read() && recordCount < maxRecords)
            {
                var logEntry = CreateLogEntryFromReader(reader, columnNames, recordCount + 1);
                logs.Add(logEntry);
                recordCount++;
            }
            
            LoggingService.Logger?.Information("Retrieved {LogCount} log entries from database", logs.Count);
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error retrieving logs from database");
            throw;
        }
        
        return logs.OrderByDescending(l => l.Timestamp).ToList();
    }
    
    private string DetectLogTableStructure(SQLiteConnection connection)
    {
        // Common table names to try
        var tableNames = new[] { "LogEntries", "Logs", "LogEntry", "ApplicationLogs", "EventLogs" };
        
        foreach (var tableName in tableNames)
        {
            try
            {
                var checkTableQuery = $"SELECT name FROM sqlite_master WHERE type='table' AND name='{tableName}';";
                using var checkCommand = new SQLiteCommand(checkTableQuery, connection);
                var result = checkCommand.ExecuteScalar();
                
                if (result != null)
                {
                    // Get table schema
                    var schemaQuery = $"PRAGMA table_info({tableName});";
                    using var schemaCommand = new SQLiteCommand(schemaQuery, connection);
                    using var schemaReader = schemaCommand.ExecuteReader();
                    
                    var columns = new List<string>();
                    while (schemaReader.Read())
                    {
                        columns.Add(schemaReader.GetString("name"));
                    }
                    
                    // Build appropriate query based on available columns
                    return BuildQueryForTable(tableName, columns);
                }
            }
            catch
            {
                // Continue to next table name
            }
        }
        
        return string.Empty;
    }
    
    private string BuildQueryForTable(string tableName, List<string> columns)
    {
        var selectColumns = new List<string>();
        
        // Map common column names
        var columnMap = new Dictionary<string, string[]>
        {
            ["Id"] = new[] { "Id", "ID", "LogId", "EntryId" },
            ["Timestamp"] = new[] { "Timestamp", "DateTime", "LogDate", "CreatedAt", "TimeStamp" },
            ["Level"] = new[] { "Level", "LogLevel", "Severity" },
            ["Message"] = new[] { "Message", "LogMessage", "Text", "Description" },
            ["Component"] = new[] { "Component", "Source", "Logger", "Category" },
            ["UserId"] = new[] { "UserId", "User", "UserID", "Username" },
            ["Url"] = new[] { "Url", "RequestUrl", "Path" },
            ["Context"] = new[] { "Context", "Properties", "Data", "Additional" },
            ["StackTrace"] = new[] { "StackTrace", "Exception", "Error", "Stack" }
        };
        
        foreach (var mapping in columnMap)
        {
            var foundColumn = mapping.Value.FirstOrDefault(col => 
                columns.Any(c => c.Equals(col, StringComparison.OrdinalIgnoreCase)));
            
            if (!string.IsNullOrEmpty(foundColumn))
            {
                selectColumns.Add($"{foundColumn} AS {mapping.Key}");
            }
            else
            {
                selectColumns.Add($"NULL AS {mapping.Key}");
            }
        }
        
        return $"SELECT {string.Join(", ", selectColumns)} FROM {tableName} ORDER BY {GetTimestampColumn(columns)} DESC";
    }
    
    private string GetTimestampColumn(List<string> columns)
    {
        var timestampColumns = new[] { "Timestamp", "DateTime", "LogDate", "CreatedAt", "TimeStamp" };
        return timestampColumns.FirstOrDefault(col => 
            columns.Any(c => c.Equals(col, StringComparison.OrdinalIgnoreCase))) ?? "ROWID";
    }
    
    private List<string> GetColumnNames(IDataReader reader)
    {
        var columns = new List<string>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
            columns.Add(reader.GetName(i));
        }
        return columns;
    }
    
    private LogEntry CreateLogEntryFromReader(IDataReader reader, List<string> columnNames, int id)
    {
        var logEntry = new LogEntry { Id = id };
        
        try
        {
            // Read standard columns
            logEntry.Timestamp = GetSafeDateTime(reader, "Timestamp") ?? DateTime.Now;
            logEntry.Level = GetSafeString(reader, "Level") ?? "Information";
            logEntry.Message = GetSafeString(reader, "Message") ?? "";
            logEntry.Component = GetSafeString(reader, "Component");
            logEntry.UserId = GetSafeString(reader, "UserId");
            logEntry.Url = GetSafeString(reader, "Url");
            logEntry.Context = GetSafeString(reader, "Context");
            logEntry.StackTrace = GetSafeString(reader, "StackTrace");
            
            // Store all additional properties
            logEntry.Properties = new Dictionary<string, object>();
            foreach (var columnName in columnNames)
            {
                if (!IsStandardColumn(columnName))
                {
                    var value = reader[columnName];
                    if (value != DBNull.Value)
                    {
                        logEntry.Properties[columnName] = value;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Warning(ex, "Error reading log entry from database row");
            logEntry.Message = "Error reading log entry";
            logEntry.Level = "Error";
        }
        
        return logEntry;
    }
    
    private DateTime? GetSafeDateTime(IDataReader reader, string columnName)
    {
        try
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal)) return null;
            
            var value = reader.GetValue(ordinal);
            return value switch
            {
                DateTime dt => dt,
                string str => DateTime.TryParse(str, out var parsed) ? parsed : null,
                _ => null
            };
        }
        catch
        {
            return null;
        }
    }
    
    private string? GetSafeString(IDataReader reader, string columnName)
    {
        try
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? null : reader.GetString(ordinal);
        }
        catch
        {
            return null;
        }
    }
    
    private static bool IsStandardColumn(string columnName)
    {
        var standardColumns = new[] 
        {
            "Id", "Timestamp", "Level", "Message", "Component", 
            "UserId", "Url", "Context", "StackTrace"
        };
        return standardColumns.Contains(columnName, StringComparer.OrdinalIgnoreCase);
    }
    
    public bool TestConnection(string connectionString)
    {
        try
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();
            return true;
        }
        catch
        {
            return false;
        }
    }
    
    // Overload method that takes DatabaseConfig as expected by DatabaseConnectionWindow
    public bool TestConnection(DatabaseConfig config)
    {
        return TestConnection(config.ConnectionString);
    }
}