using System.Windows;
using WemLogViewer.Services;

namespace WemLogViewer;

public partial class App : System.Windows.Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);
        
        // Initialize logging for the log viewer itself
        LoggingService.Initialize();
        
        // Handle unhandled exceptions
        DispatcherUnhandledException += (s, ex) =>
        {
            LoggingService.Logger?.Error(ex.Exception, "Unhandled exception in LogViewer");
            MessageBox.Show($"An unexpected error occurred: {ex.Exception.Message}", 
                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            ex.Handled = true;
        };
    }
}