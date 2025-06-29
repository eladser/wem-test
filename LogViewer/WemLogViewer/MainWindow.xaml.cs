using Microsoft.Win32;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Threading;
using WemLogViewer.Models;
using WemLogViewer.Services;
using WemLogViewer.Windows;
using Ookii.Dialogs.Wpf;

namespace WemLogViewer;

public partial class MainWindow : Window
{
    private readonly ObservableCollection<LogEntry> _allLogs = new();
    private readonly CollectionViewSource _logsViewSource = new();
    private readonly LogFileService _logFileService = new();
    private readonly DatabaseService _databaseService = new();
    private readonly ExportService _exportService = new();
    private readonly DispatcherTimer _autoRefreshTimer = new();
    
    private string? _currentLogPath;
    private bool _isLoading;

    public MainWindow()
    {
        InitializeComponent();
        InitializeApp();
    }

    private void InitializeApp()
    {
        // Setup data binding
        _logsViewSource.Source = _allLogs;
        LogDataGrid.ItemsSource = _logsViewSource.View;
        
        // Setup auto-refresh timer
        _autoRefreshTimer.Interval = TimeSpan.FromSeconds(5);
        _autoRefreshTimer.Tick += AutoRefreshTimer_Tick;
        
        // Load recent files to component filter
        LoadComponentsAndUsers();
        
        // Set initial date filters
        FromDatePicker.SelectedDate = DateTime.Today.AddDays(-7);
        ToDatePicker.SelectedDate = DateTime.Today.AddDays(1);
        
        UpdateStatus("Ready - Open a log file or connect to database to begin");
    }

    #region Command Handlers

    private async void OpenCommand_Executed(object sender, ExecutedRoutedEventArgs e)
    {
        var openFileDialog = new OpenFileDialog
        {
            Filter = "Log Files (*.log;*.txt)|*.log;*.txt|All Files (*.*)|*.*",
            Title = "Open Log File",
            Multiselect = false
        };

        if (openFileDialog.ShowDialog() == true)
        {
            await LoadLogFile(openFileDialog.FileName);
        }
    }

    private async void SaveCommand_Executed(object sender, ExecutedRoutedEventArgs e)
    {
        var filteredLogs = _logsViewSource.View.Cast<LogEntry>().ToList();
        if (!filteredLogs.Any())
        {
            MessageBox.Show("No logs to export.", "Export", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }

        var saveFileDialog = new SaveFileDialog
        {
            Filter = "CSV Files (*.csv)|*.csv|JSON Files (*.json)|*.json|Text Files (*.txt)|*.txt",
            Title = "Export Filtered Logs",
            FileName = $"WEM_Logs_{DateTime.Now:yyyyMMdd_HHmmss}"
        };

        if (saveFileDialog.ShowDialog() == true)
        {
            await ExportLogs(filteredLogs, saveFileDialog.FileName);
        }
    }

    private void FindCommand_Executed(object sender, ExecutedRoutedEventArgs e)
    {
        SearchTextBox.Focus();
        SearchTextBox.SelectAll();
    }

    private void RefreshCommand_Executed(object sender, ExecutedRoutedEventArgs e)
    {
        _ = RefreshLogs();
    }

    private void ClearFilterCommand_Executed(object sender, ExecutedRoutedEventArgs e)
    {
        ClearAllFilters();
    }

    #endregion

    #region Menu Event Handlers

    private async void OpenDirectory_Click(object sender, RoutedEventArgs e)
    {
        var folderDialog = new VistaFolderBrowserDialog
        {
            Description = "Select log directory",
            UseDescriptionForTitle = true
        };

        if (folderDialog.ShowDialog() == true)
        {
            await LoadLogDirectory(folderDialog.SelectedPath);
        }
    }

    private void ConnectDatabase_Click(object sender, RoutedEventArgs e)
    {
        var dbConnectionWindow = new DatabaseConnectionWindow();
        if (dbConnectionWindow.ShowDialog() == true)
        {
            _ = LoadDatabaseLogs(dbConnectionWindow.ConnectionString);
        }
    }

    private void Exit_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }

    private void AutoRefresh_Click(object sender, RoutedEventArgs e)
    {
        if (AutoRefreshMenuItem.IsChecked)
        {
            _autoRefreshTimer.Start();
        }
        else
        {
            _autoRefreshTimer.Stop();
        }
    }

    private void ShowStatistics_Click(object sender, RoutedEventArgs e)
    {
        var statsWindow = new StatisticsWindow(_allLogs);
        statsWindow.Show();
    }

    private void ShowCharts_Click(object sender, RoutedEventArgs e)
    {
        var chartsWindow = new ChartsWindow(_allLogs);
        chartsWindow.Show();
    }

    private void Settings_Click(object sender, RoutedEventArgs e)
    {
        var settingsWindow = new SettingsWindow();
        settingsWindow.ShowDialog();
    }

    private void About_Click(object sender, RoutedEventArgs e)
    {
        var aboutWindow = new AboutWindow();
        aboutWindow.ShowDialog();
    }

    #endregion

    #region Filter Event Handlers

    private void Filter_Changed(object sender, RoutedEventArgs e)
    {
        ApplyFilters();
    }

    private void Filter_Changed(object sender, SelectionChangedEventArgs e)
    {
        ApplyFilters();
    }

    private void Filter_Changed(object sender, TextChangedEventArgs e)
    {
        ApplyFilters();
    }

    private void Filter_Changed(object sender, SelectionChangedEventArgs e)
    {
        ApplyFilters();
    }

    #endregion

    #region Quick Action Handlers

    private void LastHour_Click(object sender, RoutedEventArgs e)
    {
        FromDatePicker.SelectedDate = DateTime.Now.AddHours(-1);
        ToDatePicker.SelectedDate = DateTime.Now;
    }

    private void Today_Click(object sender, RoutedEventArgs e)
    {
        FromDatePicker.SelectedDate = DateTime.Today;
        ToDatePicker.SelectedDate = DateTime.Today.AddDays(1);
    }

    private void ErrorsOnly_Click(object sender, RoutedEventArgs e)
    {
        // Uncheck all levels except Error and Fatal
        TraceCheckBox.IsChecked = false;
        DebugCheckBox.IsChecked = false;
        InfoCheckBox.IsChecked = false;
        WarnCheckBox.IsChecked = false;
        ErrorCheckBox.IsChecked = true;
        FatalCheckBox.IsChecked = true;
    }

    private void ClearFilters_Click(object sender, RoutedEventArgs e)
    {
        ClearAllFilters();
    }

    #endregion

    #region Data Grid Event Handlers

    private void LogDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (LogDataGrid.SelectedItem is LogEntry selectedLog)
        {
            ShowLogDetails(selectedLog);
        }
    }

    private void LogDataGrid_MouseDoubleClick(object sender, MouseButtonEventArgs e)
    {
        if (LogDataGrid.SelectedItem is LogEntry selectedLog)
        {
            var detailWindow = new LogDetailWindow(selectedLog);
            detailWindow.Show();
        }
    }

    #endregion

    #region Core Methods

    private async Task LoadLogFile(string filePath)
    {
        if (_isLoading) return;
        
        try
        {
            _isLoading = true;
            UpdateStatus($"Loading log file: {Path.GetFileName(filePath)}");
            ShowLoading(true);
            
            _currentLogPath = filePath;
            var logs = await Task.Run(() => _logFileService.ReadLogFile(filePath));
            
            _allLogs.Clear();
            foreach (var log in logs)
            {
                _allLogs.Add(log);
            }
            
            LoadComponentsAndUsers();
            ApplyFilters();
            
            UpdateStatus($"Loaded {logs.Count} logs from {Path.GetFileName(filePath)}");
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading log file: {FilePath}", filePath);
            MessageBox.Show($"Error loading log file: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
            UpdateStatus("Error loading log file");
        }
        finally
        {
            _isLoading = false;
            ShowLoading(false);
        }
    }

    private async Task LoadLogDirectory(string directoryPath)
    {
        if (_isLoading) return;
        
        try
        {
            _isLoading = true;
            UpdateStatus($"Loading logs from directory: {directoryPath}");
            ShowLoading(true);
            
            var logs = await Task.Run(() => _logFileService.ReadLogDirectory(directoryPath));
            
            _allLogs.Clear();
            foreach (var log in logs.OrderBy(l => l.Timestamp))
            {
                _allLogs.Add(log);
            }
            
            LoadComponentsAndUsers();
            ApplyFilters();
            
            UpdateStatus($"Loaded {logs.Count} logs from {directoryPath}");
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading log directory: {DirectoryPath}", directoryPath);
            MessageBox.Show($"Error loading log directory: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
            UpdateStatus("Error loading log directory");
        }
        finally
        {
            _isLoading = false;
            ShowLoading(false);
        }
    }

    private async Task LoadDatabaseLogs(string connectionString)
    {
        if (_isLoading) return;
        
        try
        {
            _isLoading = true;
            UpdateStatus("Loading logs from database...");
            ShowLoading(true);
            
            var logs = await Task.Run(() => _databaseService.GetLogs(connectionString));
            
            _allLogs.Clear();
            foreach (var log in logs.OrderBy(l => l.Timestamp))
            {
                _allLogs.Add(log);
            }
            
            LoadComponentsAndUsers();
            ApplyFilters();
            
            UpdateStatus($"Loaded {logs.Count} logs from database");
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading database logs");
            MessageBox.Show($"Error connecting to database: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
            UpdateStatus("Error loading database logs");
        }
        finally
        {
            _isLoading = false;
            ShowLoading(false);
        }
    }

    private async Task RefreshLogs()
    {
        if (string.IsNullOrEmpty(_currentLogPath) || _isLoading) return;
        
        await LoadLogFile(_currentLogPath);
    }

    private async Task ExportLogs(List<LogEntry> logs, string filePath)
    {
        try
        {
            UpdateStatus("Exporting logs...");
            ShowLoading(true);
            
            await Task.Run(() => _exportService.ExportLogs(logs, filePath));
            
            UpdateStatus($"Exported {logs.Count} logs to {Path.GetFileName(filePath)}");
            MessageBox.Show($"Successfully exported {logs.Count} logs to {filePath}", 
                "Export Complete", MessageBoxButton.OK, MessageBoxImage.Information);
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error exporting logs");
            MessageBox.Show($"Error exporting logs: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
            UpdateStatus("Error exporting logs");
        }
        finally
        {
            ShowLoading(false);
        }
    }

    private void ApplyFilters()
    {
        if (_logsViewSource.View == null) return;
        
        _logsViewSource.View.Filter = FilterPredicate;
        
        var filteredCount = _logsViewSource.View.Cast<LogEntry>().Count();
        LogCountTextBlock.Text = $"{_allLogs.Count} total logs";
        FilteredCountTextBlock.Text = $"{filteredCount} shown";
    }

    private bool FilterPredicate(object obj)
    {
        if (obj is not LogEntry log) return false;
        
        // Level filter
        var levelFilter = GetSelectedLevels();
        if (!levelFilter.Contains(log.Level)) return false;
        
        // Date filter
        if (FromDatePicker.SelectedDate.HasValue && log.Timestamp < FromDatePicker.SelectedDate.Value)
            return false;
        if (ToDatePicker.SelectedDate.HasValue && log.Timestamp > ToDatePicker.SelectedDate.Value)
            return false;
        
        // Search filter
        if (!string.IsNullOrWhiteSpace(SearchTextBox.Text))
        {
            var searchText = SearchTextBox.Text;
            var stringComparison = CaseSensitiveCheckBox.IsChecked == true ? 
                StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
            
            if (RegexCheckBox.IsChecked == true)
            {
                try
                {
                    var regex = new Regex(searchText, CaseSensitiveCheckBox.IsChecked == true ? 
                        RegexOptions.None : RegexOptions.IgnoreCase);
                    if (!regex.IsMatch(log.Message ?? "") && 
                        !regex.IsMatch(log.Component ?? ""))
                        return false;
                }
                catch
                {
                    // Invalid regex, fall back to simple search
                    if (!log.Message?.Contains(searchText, stringComparison) == true &&
                        !log.Component?.Contains(searchText, stringComparison) == true)
                        return false;
                }
            }
            else
            {
                if (!log.Message?.Contains(searchText, stringComparison) == true &&
                    !log.Component?.Contains(searchText, stringComparison) == true)
                    return false;
            }
        }
        
        // Component filter
        if (ComponentComboBox.SelectedItem != null && !string.IsNullOrEmpty(ComponentComboBox.SelectedItem.ToString()))
        {
            if (log.Component != ComponentComboBox.SelectedItem.ToString())
                return false;
        }
        
        // User filter
        if (UserComboBox.SelectedItem != null && !string.IsNullOrEmpty(UserComboBox.SelectedItem.ToString()))
        {
            if (log.UserId != UserComboBox.SelectedItem.ToString())
                return false;
        }
        
        return true;
    }

    private List<string> GetSelectedLevels()
    {
        var levels = new List<string>();
        if (TraceCheckBox.IsChecked == true) levels.Add("Trace");
        if (DebugCheckBox.IsChecked == true) levels.Add("Debug");
        if (InfoCheckBox.IsChecked == true) levels.Add("Information");
        if (WarnCheckBox.IsChecked == true) levels.Add("Warning");
        if (ErrorCheckBox.IsChecked == true) levels.Add("Error");
        if (FatalCheckBox.IsChecked == true) levels.Add("Fatal");
        return levels;
    }

    private void LoadComponentsAndUsers()
    {
        var components = _allLogs.Where(l => !string.IsNullOrEmpty(l.Component))
            .Select(l => l.Component)
            .Distinct()
            .OrderBy(c => c)
            .ToList();
        
        var users = _allLogs.Where(l => !string.IsNullOrEmpty(l.UserId))
            .Select(l => l.UserId)
            .Distinct()
            .OrderBy(u => u)
            .ToList();
        
        ComponentComboBox.Items.Clear();
        ComponentComboBox.Items.Add(""); // Empty option
        foreach (var component in components)
        {
            ComponentComboBox.Items.Add(component);
        }
        
        UserComboBox.Items.Clear();
        UserComboBox.Items.Add(""); // Empty option
        foreach (var user in users)
        {
            UserComboBox.Items.Add(user);
        }
    }

    private void ShowLogDetails(LogEntry log)
    {
        MessageDetailsTextBox.Text = log.Message ?? "";
        ContextTextBox.Text = log.Context ?? "";
        StackTraceTextBox.Text = log.StackTrace ?? "";
        RawLogTextBox.Text = log.RawLogLine ?? "";
    }

    private void ClearAllFilters()
    {
        TraceCheckBox.IsChecked = true;
        DebugCheckBox.IsChecked = true;
        InfoCheckBox.IsChecked = true;
        WarnCheckBox.IsChecked = true;
        ErrorCheckBox.IsChecked = true;
        FatalCheckBox.IsChecked = true;
        
        FromDatePicker.SelectedDate = null;
        ToDatePicker.SelectedDate = null;
        
        SearchTextBox.Text = "";
        RegexCheckBox.IsChecked = false;
        CaseSensitiveCheckBox.IsChecked = false;
        
        ComponentComboBox.SelectedIndex = 0;
        UserComboBox.SelectedIndex = 0;
    }

    private void UpdateStatus(string message)
    {
        StatusTextBlock.Text = message;
        LoggingService.Logger?.Information("UI Status: {Message}", message);
    }

    private void ShowLoading(bool show)
    {
        LoadingProgressBar.Visibility = show ? Visibility.Visible : Visibility.Collapsed;
        LoadingProgressBar.IsIndeterminate = show;
    }

    private void AutoRefreshTimer_Tick(object? sender, EventArgs e)
    {
        _ = RefreshLogs();
    }

    #endregion
}

// Custom Commands
public static class CustomCommands
{
    public static readonly RoutedUICommand Refresh = new(
        "Refresh", "Refresh", typeof(CustomCommands),
        new InputGestureCollection { new KeyGesture(Key.F5) });
        
    public static readonly RoutedUICommand ClearFilter = new(
        "Clear Filter", "ClearFilter", typeof(CustomCommands));
}