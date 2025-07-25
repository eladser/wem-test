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
using WemLogViewer.Behaviors;

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
    private readonly HashSet<string> _logEntryHashes = new();
    private DateTime _lastFileModified = DateTime.MinValue;

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
        
        // Initialize filters to show all logs by default
        InitializeFilters();
        
        UpdateStatus("Ready - Open a log file or connect to database to begin");
    }

    private void InitializeFilters()
    {
        // Set all log level checkboxes to checked by default
        TraceCheckBox.IsChecked = true;
        DebugCheckBox.IsChecked = true;
        InfoCheckBox.IsChecked = true;
        WarnCheckBox.IsChecked = true;
        ErrorCheckBox.IsChecked = true;
        FatalCheckBox.IsChecked = true;
        
        // Clear date filters to show all dates
        FromDatePicker.SelectedDate = null;
        ToDatePicker.SelectedDate = null;
        
        // Clear search box
        SearchTextBox.Text = "";
    }

    private string GetActualSearchText()
    {
        // Get the watermark text for comparison
        var watermark = TextBoxBehaviors.GetWatermark(SearchTextBox);
        var searchText = SearchTextBox.Text?.Trim() ?? "";
        
        // If the text equals the watermark or is empty, return empty string
        if (string.IsNullOrEmpty(searchText) || searchText == watermark)
        {
            return "";
        }
        
        return searchText;
    }

    #region Command Handlers

    private async void OpenCommand_Executed(object sender, ExecutedRoutedEventArgs e)
    {
        var openFileDialog = new Microsoft.Win32.OpenFileDialog
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
        var filteredLogs = _logsViewSource.View?.Cast<LogEntry>().ToList() ?? new List<LogEntry>();
        if (!filteredLogs.Any())
        {
            System.Windows.MessageBox.Show("No logs to export.", "Export", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }

        var saveFileDialog = new Microsoft.Win32.SaveFileDialog
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
            _ = LoadDatabaseLogs(dbConnectionWindow.DatabaseConfig?.ConnectionString ?? "");
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
        try
        {
            var statsWindow = new StatisticsWindow(_allLogs);
            statsWindow.Show();
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error opening statistics window");
            System.Windows.MessageBox.Show($"Error opening statistics: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ShowCharts_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            if (_allLogs == null || _allLogs.Count == 0)
            {
                System.Windows.MessageBox.Show("No logs available for charting. Please load some log data first.", "No Data", 
                    MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }
            
            var chartsWindow = new ChartsWindow(_allLogs);
            chartsWindow.Show();
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error opening charts window");
            System.Windows.MessageBox.Show($"Error opening charts: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
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
        Dispatcher.BeginInvoke(new Action(ApplyFilters), DispatcherPriority.Background);
    }

    private void Filter_Changed(object sender, SelectionChangedEventArgs e)
    {
        Dispatcher.BeginInvoke(new Action(ApplyFilters), DispatcherPriority.Background);
    }

    private void Filter_Changed(object sender, TextChangedEventArgs e)
    {
        Dispatcher.BeginInvoke(new Action(ApplyFilters), DispatcherPriority.Background);
    }

    #endregion

    #region Quick Action Handlers

    private void LastHour_Click(object sender, RoutedEventArgs e)
    {
        FromDatePicker.SelectedDate = DateTime.Now.AddHours(-1);
        ToDatePicker.SelectedDate = DateTime.Now;
        ApplyFilters();
    }

    private void Today_Click(object sender, RoutedEventArgs e)
    {
        FromDatePicker.SelectedDate = DateTime.Today;
        ToDatePicker.SelectedDate = DateTime.Today.AddDays(1);
        ApplyFilters();
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
        ApplyFilters();
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
            
            // Get file modification time
            if (File.Exists(filePath))
            {
                _lastFileModified = File.GetLastWriteTime(filePath);
            }
            
            var logs = await Task.Run(() => _logFileService.ReadLogFile(filePath));
            
            // Clear existing data
            _logEntryHashes.Clear();
            _allLogs.Clear();
            
            foreach (var log in logs)
            {
                var logHash = GenerateLogHash(log);
                if (_logEntryHashes.Add(logHash)) // Add returns true if item was added (not duplicate)
                {
                    _allLogs.Add(log);
                }
            }
            
            LoadComponentsAndUsers();
            ApplyFilters();
            
            UpdateStatus($"Loaded {_allLogs.Count} logs from {Path.GetFileName(filePath)}");
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading log file: {FilePath}", filePath);
            System.Windows.MessageBox.Show($"Error loading log file: {ex.Message}", "Error", 
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
            
            _logEntryHashes.Clear();
            _allLogs.Clear();
            
            foreach (var log in logs.OrderBy(l => l.Timestamp))
            {
                var logHash = GenerateLogHash(log);
                if (_logEntryHashes.Add(logHash))
                {
                    _allLogs.Add(log);
                }
            }
            
            LoadComponentsAndUsers();
            ApplyFilters();
            
            UpdateStatus($"Loaded {_allLogs.Count} logs from {directoryPath}");
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading log directory: {DirectoryPath}", directoryPath);
            System.Windows.MessageBox.Show($"Error loading log directory: {ex.Message}", "Error", 
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
            
            _logEntryHashes.Clear();
            _allLogs.Clear();
            
            foreach (var log in logs.OrderBy(l => l.Timestamp))
            {
                var logHash = GenerateLogHash(log);
                if (_logEntryHashes.Add(logHash))
                {
                    _allLogs.Add(log);
                }
            }
            
            LoadComponentsAndUsers();
            ApplyFilters();
            
            UpdateStatus($"Loaded {_allLogs.Count} logs from database");
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading database logs");
            System.Windows.MessageBox.Show($"Error connecting to database: {ex.Message}", "Error", 
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
        
        try
        {
            _isLoading = true;
            UpdateStatus("Checking for new logs...");
            ShowLoading(true);
            
            // Check if file was modified
            if (File.Exists(_currentLogPath))
            {
                var currentModified = File.GetLastWriteTime(_currentLogPath);
                if (currentModified <= _lastFileModified)
                {
                    UpdateStatus("No new logs - file unchanged");
                    return;
                }
                _lastFileModified = currentModified;
            }
            
            var newLogs = await Task.Run(() => _logFileService.ReadLogFile(_currentLogPath));
            
            // Only add truly new logs
            var newLogCount = 0;
            foreach (var log in newLogs)
            {
                var logHash = GenerateLogHash(log);
                if (_logEntryHashes.Add(logHash)) // Add returns true if item was added (not duplicate)
                {
                    _allLogs.Add(log);
                    newLogCount++;
                }
            }
            
            if (newLogCount > 0)
            {
                LoadComponentsAndUsers();
                ApplyFilters();
                UpdateStatus($"Added {newLogCount} new logs");
            }
            else
            {
                UpdateStatus("No new logs found");
            }
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error refreshing logs");
            UpdateStatus("Error refreshing logs");
        }
        finally
        {
            _isLoading = false;
            ShowLoading(false);
        }
    }

    private string GenerateLogHash(LogEntry log)
    {
        // Create a more robust hash using multiple properties
        var hashInput = $"{log.Timestamp:yyyy-MM-dd HH:mm:ss.fff}|{log.Level ?? ""}|{log.Component ?? ""}|{log.Message ?? ""}|{log.UserId ?? ""}";
        return hashInput.GetHashCode().ToString();
    }

    private async Task ExportLogs(List<LogEntry> logs, string filePath)
    {
        try
        {
            UpdateStatus("Exporting logs...");
            ShowLoading(true);
            
            await Task.Run(() => _exportService.ExportLogs(logs, filePath));
            
            UpdateStatus($"Exported {logs.Count} logs to {Path.GetFileName(filePath)}");
            System.Windows.MessageBox.Show($"Successfully exported {logs.Count} logs to {filePath}", 
                "Export Complete", MessageBoxButton.OK, MessageBoxImage.Information);
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error exporting logs");
            System.Windows.MessageBox.Show($"Error exporting logs: {ex.Message}", "Error", 
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
        
        try
        {
            _logsViewSource.View.Filter = FilterPredicate;
            
            var filteredCount = _logsViewSource.View.Cast<LogEntry>().Count();
            LogCountTextBlock.Text = $"{_allLogs.Count:N0} total logs";
            FilteredCountTextBlock.Text = $"{filteredCount:N0} shown";
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error applying filters");
            UpdateStatus($"Error applying filters: {ex.Message}");
        }
    }

    private bool FilterPredicate(object obj)
    {
        if (obj is not LogEntry log) return false;
        
        try
        {
            // Level filter
            var selectedLevels = GetSelectedLevels();
            if (selectedLevels.Count > 0)
            {
                var logLevel = log.Level ?? "Unknown";
                if (!selectedLevels.Contains(logLevel))
                {
                    return false;
                }
            }
            
            // Date filter
            if (FromDatePicker.SelectedDate.HasValue)
            {
                if (log.Timestamp.Date < FromDatePicker.SelectedDate.Value.Date)
                {
                    return false;
                }
            }
            
            if (ToDatePicker.SelectedDate.HasValue)
            {
                if (log.Timestamp.Date > ToDatePicker.SelectedDate.Value.Date)
                {
                    return false;
                }
            }
            
            // Search filter - Use the proper method to get actual search text
            var searchText = GetActualSearchText();
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                var stringComparison = CaseSensitiveCheckBox.IsChecked == true ? 
                    StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase;
                
                if (RegexCheckBox.IsChecked == true)
                {
                    try
                    {
                        var regexOptions = CaseSensitiveCheckBox.IsChecked == true ? 
                            RegexOptions.None : RegexOptions.IgnoreCase;
                        var regex = new Regex(searchText, regexOptions);
                        
                        if (!regex.IsMatch(log.Message ?? "") && 
                            !regex.IsMatch(log.Component ?? "") &&
                            !regex.IsMatch(log.UserId ?? ""))
                        {
                            return false;
                        }
                    }
                    catch
                    {
                        // Invalid regex, fall back to simple search
                        if (!(log.Message?.Contains(searchText, stringComparison) == true ||
                              log.Component?.Contains(searchText, stringComparison) == true ||
                              log.UserId?.Contains(searchText, stringComparison) == true))
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    if (!(log.Message?.Contains(searchText, stringComparison) == true ||
                          log.Component?.Contains(searchText, stringComparison) == true ||
                          log.UserId?.Contains(searchText, stringComparison) == true))
                    {
                        return false;
                    }
                }
            }
            
            // Component filter
            var selectedComponent = ComponentComboBox.SelectedItem?.ToString();
            if (!string.IsNullOrEmpty(selectedComponent) && selectedComponent != "")
            {
                if (log.Component != selectedComponent)
                {
                    return false;
                }
            }
            
            // User filter
            var selectedUser = UserComboBox.SelectedItem?.ToString();
            if (!string.IsNullOrEmpty(selectedUser) && selectedUser != "")
            {
                if (log.UserId != selectedUser)
                {
                    return false;
                }
            }
            
            return true;
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error in filter predicate");
            return true; // Show the log if there's an error in filtering
        }
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
        try
        {
            var components = _allLogs.Where(l => !string.IsNullOrEmpty(l.Component))
                .Select(l => l.Component!)
                .Distinct()
                .OrderBy(c => c)
                .ToList();
            
            var users = _allLogs.Where(l => !string.IsNullOrEmpty(l.UserId))
                .Select(l => l.UserId!)
                .Distinct()
                .OrderBy(u => u)
                .ToList();
            
            ComponentComboBox.Items.Clear();
            ComponentComboBox.Items.Add(""); // Empty option
            foreach (var component in components)
            {
                ComponentComboBox.Items.Add(component);
            }
            ComponentComboBox.SelectedIndex = 0; // Select empty option by default
            
            UserComboBox.Items.Clear();
            UserComboBox.Items.Add(""); // Empty option
            foreach (var user in users)
            {
                UserComboBox.Items.Add(user);
            }
            UserComboBox.SelectedIndex = 0; // Select empty option by default
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error loading components and users");
        }
    }

    private void ShowLogDetails(LogEntry log)
    {
        try
        {
            // Message Details Tab - Always show the main message
            MessageDetailsTextBox.Text = log.Message ?? "";
            
            // Context Tab - Show context if available, otherwise show structured/multi-line content
            if (!string.IsNullOrEmpty(log.Context))
            {
                ContextTextBox.Text = log.Context;
            }
            else
            {
                // Fallback: Show multi-line content excluding the first line
                var lines = (log.Message ?? "").Split(Environment.NewLine);
                if (lines.Length > 1)
                {
                    // Skip the first line and show the rest as context
                    var contextLines = lines.Skip(1).Where(line => !string.IsNullOrWhiteSpace(line)).ToArray();
                    if (contextLines.Any())
                    {
                        ContextTextBox.Text = string.Join(Environment.NewLine, contextLines);
                    }
                    else
                    {
                        ContextTextBox.Text = "No additional context available";
                    }
                }
                else
                {
                    ContextTextBox.Text = "No additional context available";
                }
            }
            
            // Stack Trace Tab - Show stack trace if available, otherwise show properties or additional info
            if (!string.IsNullOrEmpty(log.StackTrace))
            {
                StackTraceTextBox.Text = log.StackTrace;
            }
            else
            {
                // Fallback: Show properties or any additional technical information
                var additionalInfo = new List<string>();
                
                // Add properties if available
                if (log.Properties != null && log.Properties.Any())
                {
                    additionalInfo.Add("Properties:");
                    foreach (var prop in log.Properties)
                    {
                        additionalInfo.Add($"  {prop.Key}: {prop.Value}");
                    }
                }
                
                // Add component and user info if available
                if (!string.IsNullOrEmpty(log.Component))
                {
                    additionalInfo.Add($"Component: {log.Component}");
                }
                
                if (!string.IsNullOrEmpty(log.UserId))
                {
                    additionalInfo.Add($"User ID: {log.UserId}");
                }
                
                if (!string.IsNullOrEmpty(log.Url))
                {
                    additionalInfo.Add($"URL: {log.Url}");
                }
                
                // Check for exception-like content in the message
                var message = log.Message ?? "";
                if (message.Contains("Exception:") || message.Contains("Error:") || message.Contains("at "))
                {
                    // Extract lines that look like stack trace
                    var lines = message.Split(Environment.NewLine);
                    var stackLikeLines = lines.Where(line => 
                        line.Trim().StartsWith("at ") ||
                        line.Contains("Exception:") ||
                        line.Contains("Error:") ||
                        line.Trim().StartsWith("---> ")).ToArray();
                    
                    if (stackLikeLines.Any())
                    {
                        additionalInfo.Add("Exception/Error Information:");
                        additionalInfo.AddRange(stackLikeLines);
                    }
                }
                
                if (additionalInfo.Any())
                {
                    StackTraceTextBox.Text = string.Join(Environment.NewLine, additionalInfo);
                }
                else
                {
                    StackTraceTextBox.Text = "No stack trace or additional technical information available";
                }
            }
            
            // Raw Log Tab - Always show the complete raw log entry
            RawLogTextBox.Text = log.RawLogLine ?? "";
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error showing log details");
            
            // Fallback to show at least something
            MessageDetailsTextBox.Text = log.Message ?? "Error displaying message";
            ContextTextBox.Text = "Error loading context";
            StackTraceTextBox.Text = "Error loading stack trace";
            RawLogTextBox.Text = log.RawLogLine ?? "";
        }
    }

    private void ClearAllFilters()
    {
        try
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
            
            ApplyFilters();
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error clearing filters");
        }
    }

    private void UpdateStatus(string message)
    {
        try
        {
            StatusTextBlock.Text = message;
            LoggingService.Logger?.Information("UI Status: {Message}", message);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error updating status: {ex.Message}");
        }
    }

    private void ShowLoading(bool show)
    {
        try
        {
            LoadingProgressBar.Visibility = show ? Visibility.Visible : Visibility.Collapsed;
            LoadingProgressBar.IsIndeterminate = show;
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error showing loading indicator");
        }
    }

    private void AutoRefreshTimer_Tick(object? sender, EventArgs e)
    {
        _ = RefreshLogs();
    }

    #endregion
}