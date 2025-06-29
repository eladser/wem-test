using System.Collections.Generic;
using System.Windows;
using WemLogViewer.Models;

namespace WemLogViewer.Windows;

public partial class LogDetailWindow : Window
{
    private readonly LogEntry _logEntry;

    public LogDetailWindow(LogEntry logEntry)
    {
        InitializeComponent();
        _logEntry = logEntry;
        LoadLogDetails();
    }

    private void LoadLogDetails()
    {
        // Set window title and header
        Title = $"Log Entry Details - {_logEntry.Level}";
        TitleTextBlock.Text = $"Log Entry #{_logEntry.Id}";
        SubtitleTextBlock.Text = $"{_logEntry.Level} - {_logEntry.Timestamp:yyyy-MM-dd HH:mm:ss.fff}";

        // Overview tab
        TimestampTextBlock.Text = _logEntry.Timestamp.ToString("yyyy-MM-dd HH:mm:ss.fff");
        LevelTextBlock.Text = _logEntry.Level;
        ComponentTextBlock.Text = _logEntry.Component ?? "N/A";
        UserIdTextBlock.Text = _logEntry.UserId ?? "N/A";
        UrlTextBlock.Text = _logEntry.Url ?? "N/A";
        MessageTextBox.Text = _logEntry.Message;

        // Stack trace tab
        StackTraceTextBox.Text = _logEntry.StackTrace ?? "No stack trace available";

        // Context tab
        ContextTextBox.Text = _logEntry.Context ?? "No context available";

        // Properties tab
        if (_logEntry.Properties != null && _logEntry.Properties.Count > 0)
        {
            var propertyList = new List<PropertyItem>();
            foreach (var prop in _logEntry.Properties)
            {
                propertyList.Add(new PropertyItem 
                { 
                    Key = prop.Key, 
                    Value = prop.Value?.ToString() ?? "null" 
                });
            }
            PropertiesDataGrid.ItemsSource = propertyList;
        }
        else
        {
            PropertiesDataGrid.ItemsSource = new List<PropertyItem>
            {
                new PropertyItem { Key = "No properties", Value = "No additional properties available" }
            };
        }

        // Raw log tab
        RawLogTextBox.Text = _logEntry.RawLogLine;

        // Set text block colors based on log level
        SetLogLevelColor();
    }

    private void SetLogLevelColor()
    {
        var color = _logEntry.Level.ToLower() switch
        {
            "error" => "#DC3545",
            "fatal" => "#8B0000",
            "warning" => "#FD7E14",
            "information" => "#0D6EFD",
            "debug" => "#6C757D",
            "trace" => "#ADB5BD",
            _ => "#000000"
        };

        LevelTextBlock.Foreground = new System.Windows.Media.SolidColorBrush(
            (System.Windows.Media.Color)System.Windows.Media.ColorConverter.ConvertFromString(color));
    }

    private void CopyToClipboard_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            var details = $"""
                Log Entry Details
                =================
                ID: {_logEntry.Id}
                Timestamp: {_logEntry.Timestamp:yyyy-MM-dd HH:mm:ss.fff}
                Level: {_logEntry.Level}
                Component: {_logEntry.Component ?? "N/A"}
                User ID: {_logEntry.UserId ?? "N/A"}
                URL: {_logEntry.Url ?? "N/A"}
                Message: {_logEntry.Message}
                
                Stack Trace:
                {_logEntry.StackTrace ?? "No stack trace available"}
                
                Context:
                {_logEntry.Context ?? "No context available"}
                
                Raw Log:
                {_logEntry.RawLogLine}
                """;

            Clipboard.SetText(details);
            MessageBox.Show("Log details copied to clipboard.", "Copy to Clipboard", 
                MessageBoxButton.OK, MessageBoxImage.Information);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Failed to copy to clipboard: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void Close_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }

    private class PropertyItem
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}