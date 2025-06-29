using Serilog;
using Serilog.Events;
using System.IO;

namespace WemLogViewer.Services;

public static class LoggingService
{
    public static ILogger? Logger { get; private set; }
    
    public static void Initialize()
    {
        try
        {
            var logDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "WemLogViewer");
            Directory.CreateDirectory(logDirectory);
            
            var logFile = Path.Combine(logDirectory, "logviewer.log");
            
            Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .Enrich.WithProperty("Application", "WemLogViewer")
                .Enrich.WithProperty("Version", "1.0.0")
                .WriteTo.Console()
                .WriteTo.File(logFile,
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 7,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
                .CreateLogger();
            
            Logger.Information("WEM Log Viewer started");
        }
        catch (Exception ex)
        {
            // Fallback to console logging if file logging fails
            Logger = new LoggerConfiguration()
                .MinimumLevel.Warning()
                .WriteTo.Console()
                .CreateLogger();
            
            Logger.Warning(ex, "Failed to initialize file logging, using console only");
        }
    }
    
    public static void Shutdown()
    {
        Logger?.Information("WEM Log Viewer shutting down");
        Logger?.Dispose();
    }
}