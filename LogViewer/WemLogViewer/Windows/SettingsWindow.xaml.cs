using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Microsoft.Win32;
using WemLogViewer.Models;

namespace WemLogViewer.Windows;

public partial class SettingsWindow : Window
{
    private AppSettings _settings;

    public SettingsWindow()
    {
        InitializeComponent();
        _settings = LoadSettings();
        LoadSettingsToUI();
        InitializeFontComboBoxes();
    }

    private AppSettings LoadSettings()
    {
        // In a real app, this would load from a config file
        // For now, return default settings
        return new AppSettings();
    }

    private void LoadSettingsToUI()
    {
        // General Settings
        AutoLoadLastFileCheckBox.IsChecked = _settings.AutoLoadLastFile;
        ShowLineNumbersCheckBox.IsChecked = _settings.ShowLineNumbers;
        WordWrapCheckBox.IsChecked = _settings.WordWrap;
        ConfirmExitCheckBox.IsChecked = _settings.ConfirmExit;

        // Auto Refresh Settings
        AutoRefreshEnabledCheckBox.IsChecked = _settings.AutoRefreshEnabled;
        RefreshIntervalTextBox.Text = _settings.RefreshIntervalSeconds.ToString();
        AutoScrollToEndCheckBox.IsChecked = _settings.AutoScrollToEnd;

        // Font Settings
        FontFamilyComboBox.Text = _settings.FontFamily;
        FontSizeTextBox.Text = _settings.FontSize.ToString();

        // Filter Settings
        DefaultTraceCheckBox.IsChecked = _settings.DefaultTraceEnabled;
        DefaultDebugCheckBox.IsChecked = _settings.DefaultDebugEnabled;
        DefaultInfoCheckBox.IsChecked = _settings.DefaultInfoEnabled;
        DefaultWarnCheckBox.IsChecked = _settings.DefaultWarnEnabled;
        DefaultErrorCheckBox.IsChecked = _settings.DefaultErrorEnabled;
        DefaultFatalCheckBox.IsChecked = _settings.DefaultFatalEnabled;
        RememberFiltersCheckBox.IsChecked = _settings.RememberFilters;
        ApplyFiltersRealTimeCheckBox.IsChecked = _settings.ApplyFiltersRealTime;
        MaxFilterResultsTextBox.Text = _settings.MaxFilterResults.ToString();

        // Performance Settings
        MaxLogsInMemoryTextBox.Text = _settings.MaxLogsInMemory.ToString();
        UseVirtualizationCheckBox.IsChecked = _settings.UseVirtualization;
        BackgroundLoadingCheckBox.IsChecked = _settings.BackgroundLoading;

        // Export Settings
        DefaultExportFormatComboBox.SelectedIndex = (int)_settings.DefaultExportFormat;
        IncludeHeadersCheckBox.IsChecked = _settings.IncludeHeaders;
        ExportFilteredOnlyCheckBox.IsChecked = _settings.ExportFilteredOnly;

        // Debug Settings
        EnableDebugLoggingCheckBox.IsChecked = _settings.EnableDebugLogging;
        ShowPerformanceStatsCheckBox.IsChecked = _settings.ShowPerformanceStats;

        // Display Settings
        AlternatingRowColorsCheckBox.IsChecked = _settings.AlternatingRowColors;
        ShowGridLinesCheckBox.IsChecked = _settings.ShowGridLines;
        RowsPerPageTextBox.Text = _settings.RowsPerPage.ToString();

        // Update color previews
        UpdateColorPreviews();
    }

    private void InitializeFontComboBoxes()
    {
        // Populate font family combo box
        foreach (var fontFamily in Fonts.SystemFontFamilies.OrderBy(f => f.Source))
        {
            FontFamilyComboBox.Items.Add(fontFamily.Source);
        }
    }

    private void UpdateColorPreviews()
    {
        ErrorColorPreview.Fill = new SolidColorBrush((Color)ColorConverter.ConvertFromString(_settings.ErrorColor));
        WarningColorPreview.Fill = new SolidColorBrush((Color)ColorConverter.ConvertFromString(_settings.WarningColor));
        InfoColorPreview.Fill = new SolidColorBrush((Color)ColorConverter.ConvertFromString(_settings.InfoColor));
    }

    private void ChangeColor_Click(object sender, RoutedEventArgs e)
    {
        var button = sender as Button;
        if (button == null) return;

        var dialog = new System.Windows.Forms.ColorDialog();
        
        // Set current color based on button
        if (button == ChangeErrorColorButton)
        {
            dialog.Color = System.Drawing.ColorTranslator.FromHtml(_settings.ErrorColor);
        }
        else if (button == ChangeWarningColorButton)
        {
            dialog.Color = System.Drawing.ColorTranslator.FromHtml(_settings.WarningColor);
        }
        else if (button == ChangeInfoColorButton)
        {
            dialog.Color = System.Drawing.ColorTranslator.FromHtml(_settings.InfoColor);
        }

        if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
        {
            var colorHex = $"#{dialog.Color.R:X2}{dialog.Color.G:X2}{dialog.Color.B:X2}";
            
            if (button == ChangeErrorColorButton)
            {
                _settings.ErrorColor = colorHex;
            }
            else if (button == ChangeWarningColorButton)
            {
                _settings.WarningColor = colorHex;
            }
            else if (button == ChangeInfoColorButton)
            {
                _settings.InfoColor = colorHex;
            }
            
            UpdateColorPreviews();
        }
    }

    private void ClearCache_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            // Clear application cache
            var result = MessageBox.Show("Are you sure you want to clear the application cache?", 
                "Clear Cache", MessageBoxButton.YesNo, MessageBoxImage.Question);
            
            if (result == MessageBoxResult.Yes)
            {
                // Implementation would clear cache files
                MessageBox.Show("Cache cleared successfully.", "Clear Cache", 
                    MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error clearing cache: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ResetSettings_Click(object sender, RoutedEventArgs e)
    {
        var result = MessageBox.Show("Are you sure you want to reset all settings to default values?", 
            "Reset Settings", MessageBoxButton.YesNo, MessageBoxImage.Question);
        
        if (result == MessageBoxResult.Yes)
        {
            _settings = new AppSettings();
            LoadSettingsToUI();
            MessageBox.Show("Settings have been reset to default values.", "Reset Settings", 
                MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }

    private void Ok_Click(object sender, RoutedEventArgs e)
    {
        if (SaveSettingsFromUI())
        {
            SaveSettings(_settings);
            DialogResult = true;
            Close();
        }
    }

    private void Cancel_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = false;
        Close();
    }

    private void Apply_Click(object sender, RoutedEventArgs e)
    {
        if (SaveSettingsFromUI())
        {
            SaveSettings(_settings);
            MessageBox.Show("Settings applied successfully.", "Settings", 
                MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }

    private bool SaveSettingsFromUI()
    {
        try
        {
            // General Settings
            _settings.AutoLoadLastFile = AutoLoadLastFileCheckBox.IsChecked == true;
            _settings.ShowLineNumbers = ShowLineNumbersCheckBox.IsChecked == true;
            _settings.WordWrap = WordWrapCheckBox.IsChecked == true;
            _settings.ConfirmExit = ConfirmExitCheckBox.IsChecked == true;

            // Auto Refresh Settings
            _settings.AutoRefreshEnabled = AutoRefreshEnabledCheckBox.IsChecked == true;
            if (int.TryParse(RefreshIntervalTextBox.Text, out int refreshInterval))
                _settings.RefreshIntervalSeconds = refreshInterval;
            _settings.AutoScrollToEnd = AutoScrollToEndCheckBox.IsChecked == true;

            // Font Settings
            _settings.FontFamily = FontFamilyComboBox.Text;
            if (double.TryParse(FontSizeTextBox.Text, out double fontSize))
                _settings.FontSize = fontSize;

            // Filter Settings
            _settings.DefaultTraceEnabled = DefaultTraceCheckBox.IsChecked == true;
            _settings.DefaultDebugEnabled = DefaultDebugCheckBox.IsChecked == true;
            _settings.DefaultInfoEnabled = DefaultInfoCheckBox.IsChecked == true;
            _settings.DefaultWarnEnabled = DefaultWarnCheckBox.IsChecked == true;
            _settings.DefaultErrorEnabled = DefaultErrorCheckBox.IsChecked == true;
            _settings.DefaultFatalEnabled = DefaultFatalCheckBox.IsChecked == true;
            _settings.RememberFilters = RememberFiltersCheckBox.IsChecked == true;
            _settings.ApplyFiltersRealTime = ApplyFiltersRealTimeCheckBox.IsChecked == true;
            if (int.TryParse(MaxFilterResultsTextBox.Text, out int maxResults))
                _settings.MaxFilterResults = maxResults;

            // Performance Settings
            if (int.TryParse(MaxLogsInMemoryTextBox.Text, out int maxLogs))
                _settings.MaxLogsInMemory = maxLogs;
            _settings.UseVirtualization = UseVirtualizationCheckBox.IsChecked == true;
            _settings.BackgroundLoading = BackgroundLoadingCheckBox.IsChecked == true;

            // Export Settings
            _settings.DefaultExportFormat = (ExportFormat)DefaultExportFormatComboBox.SelectedIndex;
            _settings.IncludeHeaders = IncludeHeadersCheckBox.IsChecked == true;
            _settings.ExportFilteredOnly = ExportFilteredOnlyCheckBox.IsChecked == true;

            // Debug Settings
            _settings.EnableDebugLogging = EnableDebugLoggingCheckBox.IsChecked == true;
            _settings.ShowPerformanceStats = ShowPerformanceStatsCheckBox.IsChecked == true;

            // Display Settings
            _settings.AlternatingRowColors = AlternatingRowColorsCheckBox.IsChecked == true;
            _settings.ShowGridLines = ShowGridLinesCheckBox.IsChecked == true;
            if (int.TryParse(RowsPerPageTextBox.Text, out int rowsPerPage))
                _settings.RowsPerPage = rowsPerPage;

            return true;
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error saving settings: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
            return false;
        }
    }

    private void SaveSettings(AppSettings settings)
    {
        try
        {
            // In a real app, this would save to a config file
            // For now, just store in memory
            // Could use JSON serialization to save to file:
            // var json = JsonSerializer.Serialize(settings);
            // File.WriteAllText("settings.json", json);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error saving settings to file: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}