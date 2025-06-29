namespace WemLogViewer.Models;

public class DatabaseConfig
{
    public string ConnectionString { get; set; } = string.Empty;
    public DatabaseType Type { get; set; } = DatabaseType.SQLite;
    public bool EnableAutoRefresh { get; set; } = false;
    public int RefreshIntervalSeconds { get; set; } = 30;
    public string TableName { get; set; } = "LogEntries";
}

public enum DatabaseType
{
    SQLite,
    SqlServer,
    PostgreSQL,
    MySQL
}