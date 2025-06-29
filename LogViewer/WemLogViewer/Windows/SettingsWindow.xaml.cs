using System.Windows;

namespace WemLogViewer.Windows;

public partial class SettingsWindow : Window
{
    public SettingsWindow()
    {
        InitializeComponent();
        LoadSettings();
    }
    
    private void LoadSettings()
    {
        // Load settings from configuration
        // This is a simplified version - in a real app, you'd load from app.config or registry
        
        try
        {
            // Display Options
            ShowLineNumbersCheckBox.IsChecked = Properties.Settings.Default.ShowLineNumbers;
            WordWrapCheckBox.IsChecked = Properties.Settings.Default.WordWrap;
            ShowTimestampCheckBox.IsChecked = Properties.Settings.Default.ShowTimestamp;
            HighlightErrorsCheckBox.IsChecked = Properties.Settings.Default.HighlightErrors;
            
            // Performance
            MaxLogsTextBox.Text = Properties.Settings.Default.MaxLogs.ToString();
            RefreshIntervalTextBox.Text = Properties.Settings.Default.RefreshInterval.ToString();
            EnableVirtualizationCheckBox.IsChecked = Properties.Settings.Default.EnableVirtualization;
            
            // Startup
            RememberWindowSizeCheckBox.IsChecked = Properties.Settings.Default.RememberWindowSize;
            AutoLoadLastFileCheckBox.IsChecked = Properties.Settings.Default.AutoLoadLastFile;
            CheckUpdatesCheckBox.IsChecked = Properties.Settings.Default.CheckUpdates;
            
            // Theme
            var theme = Properties.Settings.Default.Theme;
            LightThemeRadio.IsChecked = theme == "Light";
            DarkThemeRadio.IsChecked = theme == "Dark";
            SystemThemeRadio.IsChecked = theme == "System";
            
            // Fonts
            SetComboBoxValue(LogFontComboBox, Properties.Settings.Default.LogFont);
            SetComboBoxValue(LogFontSizeComboBox, Properties.Settings.Default.LogFontSize.ToString());
            SetComboBoxValue(UIFontComboBox, Properties.Settings.Default.UIFont);
            SetComboBoxValue(UIFontSizeComboBox, Properties.Settings.Default.UIFontSize.ToString());
            
            // Parsing
            EnableJsonParsingCheckBox.IsChecked = Properties.Settings.Default.EnableJsonParsing;
            EnableSerilogParsingCheckBox.IsChecked = Properties.Settings.Default.EnableSerilogParsing;
            EnableGenericParsingCheckBox.IsChecked = Properties.Settings.Default.EnableGenericParsing;
            StrictParsingCheckBox.IsChecked = Properties.Settings.Default.StrictParsing;
            
            // Export
            SetComboBoxValue(DefaultExportFormatComboBox, Properties.Settings.Default.DefaultExportFormat);
            IncludeRawLogCheckBox.IsChecked = Properties.Settings.Default.IncludeRawLog;
            CompressExportsCheckBox.IsChecked = Properties.Settings.Default.CompressExports;
            
            // Logging
            SetComboBoxValue(LogLevelComboBox, Properties.Settings.Default.LogLevel);
            EnableFileLoggingCheckBox.IsChecked = Properties.Settings.Default.EnableFileLogging;
            EnableConsoleLoggingCheckBox.IsChecked = Properties.Settings.Default.EnableConsoleLogging;
        }
        catch
        {
            // Use defaults if loading fails
        }
    }
    
    private void SaveSettings()
    {
        try
        {
            // Display Options
            Properties.Settings.Default.ShowLineNumbers = ShowLineNumbersCheckBox.IsChecked ?? false;
            Properties.Settings.Default.WordWrap = WordWrapCheckBox.IsChecked ?? false;
            Properties.Settings.Default.ShowTimestamp = ShowTimestampCheckBox.IsChecked ?? true;
            Properties.Settings.Default.HighlightErrors = HighlightErrorsCheckBox.IsChecked ?? true;
            
            // Performance
            if (int.TryParse(MaxLogsTextBox.Text, out var maxLogs))
                Properties.Settings.Default.MaxLogs = Math.Max(1000, Math.Min(1000000, maxLogs));
            
            if (int.TryParse(RefreshIntervalTextBox.Text, out var refreshInterval))
                Properties.Settings.Default.RefreshInterval = Math.Max(1, Math.Min(300, refreshInterval));
            
            Properties.Settings.Default.EnableVirtualization = EnableVirtualizationCheckBox.IsChecked ?? true;
            
            // Startup
            Properties.Settings.Default.RememberWindowSize = RememberWindowSizeCheckBox.IsChecked ?? true;
            Properties.Settings.Default.AutoLoadLastFile = AutoLoadLastFileCheckBox.IsChecked ?? false;
            Properties.Settings.Default.CheckUpdates = CheckUpdatesCheckBox.IsChecked ?? false;
            
            // Theme
            if (LightThemeRadio.IsChecked == true)
                Properties.Settings.Default.Theme = "Light";
            else if (DarkThemeRadio.IsChecked == true)
                Properties.Settings.Default.Theme = "Dark";
            else
                Properties.Settings.Default.Theme = "System";
            
            // Fonts
            Properties.Settings.Default.LogFont = GetComboBoxValue(LogFontComboBox) ?? "Consolas";
            if (int.TryParse(GetComboBoxValue(LogFontSizeComboBox), out var logFontSize))
                Properties.Settings.Default.LogFontSize = logFontSize;
            
            Properties.Settings.Default.UIFont = GetComboBoxValue(UIFontComboBox) ?? "Segoe UI";
            if (int.TryParse(GetComboBoxValue(UIFontSizeComboBox), out var uiFontSize))
                Properties.Settings.Default.UIFontSize = uiFontSize;
            
            // Parsing
            Properties.Settings.Default.EnableJsonParsing = EnableJsonParsingCheckBox.IsChecked ?? true;
            Properties.Settings.Default.EnableSerilogParsing = EnableSerilogParsingCheckBox.IsChecked ?? true;
            Properties.Settings.Default.EnableGenericParsing = EnableGenericParsingCheckBox.IsChecked ?? true;
            Properties.Settings.Default.StrictParsing = StrictParsingCheckBox.IsChecked ?? false;
            
            // Export
            Properties.Settings.Default.DefaultExportFormat = GetComboBoxValue(DefaultExportFormatComboBox) ?? "CSV";
            Properties.Settings.Default.IncludeRawLog = IncludeRawLogCheckBox.IsChecked ?? true;
            Properties.Settings.Default.CompressExports = CompressExportsCheckBox.IsChecked ?? false;
            
            // Logging
            Properties.Settings.Default.LogLevel = GetComboBoxValue(LogLevelComboBox) ?? "Info";
            Properties.Settings.Default.EnableFileLogging = EnableFileLoggingCheckBox.IsChecked ?? true;
            Properties.Settings.Default.EnableConsoleLogging = EnableConsoleLoggingCheckBox.IsChecked ?? false;
            
            Properties.Settings.Default.Save();
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error saving settings: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
    
    private void SetComboBoxValue(System.Windows.Controls.ComboBox comboBox, string value)
    {
        foreach (System.Windows.Controls.ComboBoxItem item in comboBox.Items)
        {
            if (item.Content?.ToString() == value)
            {
                comboBox.SelectedItem = item;
                break;
            }
        }
    }
    
    private string? GetComboBoxValue(System.Windows.Controls.ComboBox comboBox)
    {
        return (comboBox.SelectedItem as System.Windows.Controls.ComboBoxItem)?.Content?.ToString();
    }
    
    private void ResetDefaults_Click(object sender, RoutedEventArgs e)
    {
        var result = MessageBox.Show("Reset all settings to default values?", "Reset Settings", 
            MessageBoxButton.YesNo, MessageBoxImage.Question);
        
        if (result == MessageBoxResult.Yes)
        {
            Properties.Settings.Default.Reset();
            LoadSettings();
        }
    }
    
    private void OK_Click(object sender, RoutedEventArgs e)
    {
        SaveSettings();
        DialogResult = true;
        Close();
    }
    
    private void Cancel_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = false;
        Close();
    }
    
    private void Apply_Click(object sender, RoutedEventArgs e)
    {
        SaveSettings();
    }
}

// Settings class for storing application preferences
public static class Properties
{
    public static Settings Default { get; } = new Settings();
}

public class Settings
{
    // Display Options
    public bool ShowLineNumbers { get; set; } = false;
    public bool WordWrap { get; set; } = false;
    public bool ShowTimestamp { get; set; } = true;
    public bool HighlightErrors { get; set; } = true;
    
    // Performance
    public int MaxLogs { get; set; } = 50000;
    public int RefreshInterval { get; set; } = 5;
    public bool EnableVirtualization { get; set; } = true;
    
    // Startup
    public bool RememberWindowSize { get; set; } = true;
    public bool AutoLoadLastFile { get; set; } = false;
    public bool CheckUpdates { get; set; } = false;
    
    // Theme
    public string Theme { get; set; } = "Light";
    
    // Fonts
    public string LogFont { get; set; } = "Consolas";
    public int LogFontSize { get; set; } = 11;
    public string UIFont { get; set; } = "Segoe UI";
    public int UIFontSize { get; set; } = 12;
    
    // Parsing
    public bool EnableJsonParsing { get; set; } = true;
    public bool EnableSerilogParsing { get; set; } = true;
    public bool EnableGenericParsing { get; set; } = true;
    public bool StrictParsing { get; set; } = false;
    
    // Export
    public string DefaultExportFormat { get; set; } = "CSV";
    public bool IncludeRawLog { get; set; } = true;
    public bool CompressExports { get; set; } = false;
    
    // Logging
    public string LogLevel { get; set; } = "Info";
    public bool EnableFileLogging { get; set; } = true;
    public bool EnableConsoleLogging { get; set; } = false;
    
    public void Save()
    {
        // In a real application, save to registry, config file, or user settings
    }
    
    public void Reset()
    {
        // Reset to default values
        ShowLineNumbers = false;
        WordWrap = false;
        ShowTimestamp = true;
        HighlightErrors = true;
        MaxLogs = 50000;
        RefreshInterval = 5;
        EnableVirtualization = true;
        RememberWindowSize = true;
        AutoLoadLastFile = false;
        CheckUpdates = false;
        Theme = "Light";
        LogFont = "Consolas";
        LogFontSize = 11;
        UIFont = "Segoe UI";
        UIFontSize = 12;
        EnableJsonParsing = true;
        EnableSerilogParsing = true;
        EnableGenericParsing = true;
        StrictParsing = false;
        DefaultExportFormat = "CSV";
        IncludeRawLog = true;
        CompressExports = false;
        LogLevel = "Info";
        EnableFileLogging = true;
        EnableConsoleLogging = false;
    }
}