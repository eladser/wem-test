using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Media;
using System.Windows.Shapes;
using System.Windows.Controls;
using WemLogViewer.Models;

namespace WemLogViewer.Windows;

public partial class StatisticsWindow : Window
{
    private readonly ObservableCollection<LogEntry> _logs;
    
    public StatisticsWindow(ObservableCollection<LogEntry> logs)
    {
        InitializeComponent();
        _logs = logs;
        LoadStatistics();
    }
    
    private void LoadStatistics()
    {
        if (_logs.Count == 0)
        {
            SummaryTextBlock.Text = "No logs available for analysis";
            return;
        }
        
        // Overall statistics
        var totalLogs = _logs.Count;
        var errorLogs = _logs.Count(l => l.Level == "Error" || l.Level == "Fatal");
        var errorRate = totalLogs > 0 ? (errorLogs * 100.0 / totalLogs) : 0;
        
        var minDate = _logs.Min(l => l.Timestamp);
        var maxDate = _logs.Max(l => l.Timestamp);
        
        TotalLogsTextBlock.Text = totalLogs.ToString("N0");
        ErrorRateTextBlock.Text = $"{errorRate:F1}%";
        DateRangeTextBlock.Text = $"{minDate:yyyy-MM-dd HH:mm}\nto\n{maxDate:yyyy-MM-dd HH:mm}";
        
        // Most active component
        var topComponent = _logs
            .Where(l => !string.IsNullOrEmpty(l.Component))
            .GroupBy(l => l.Component)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();
        
        ActiveComponentTextBlock.Text = topComponent != null ? 
            $"{topComponent.Key}\n({topComponent.Count()} logs)" : "N/A";
        
        // Peak hour
        var hourlyDistribution = _logs
            .GroupBy(l => l.Timestamp.Hour)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();
        
        PeakHourTextBlock.Text = hourlyDistribution != null ? 
            $"{hourlyDistribution.Key:00}:00\n({hourlyDistribution.Count()} logs)" : "N/A";
        
        // Unique users
        var uniqueUsers = _logs
            .Where(l => !string.IsNullOrEmpty(l.UserId))
            .Select(l => l.UserId)
            .Distinct()
            .Count();
        
        UniqueUsersTextBlock.Text = uniqueUsers.ToString();
        
        SummaryTextBlock.Text = $"Analysis of {totalLogs:N0} log entries from {minDate:yyyy-MM-dd} to {maxDate:yyyy-MM-dd}";
        
        // Load detailed statistics
        LoadLevelDistribution();
        LoadComponentStatistics();
        LoadErrorSummary();
        DrawHourlyChart();
    }
    
    private void LoadLevelDistribution()
    {
        var levelCounts = _logs
            .GroupBy(l => l.Level ?? "Unknown")
            .Select(g => new { Level = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();
        
        LevelStatsPanel.Children.Clear();
        
        var total = _logs.Count;
        foreach (var levelStat in levelCounts)
        {
            var percentage = total > 0 ? (levelStat.Count * 100.0 / total) : 0;
            
            var panel = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 2, 0, 2) };
            
            // Level name
            var levelText = new TextBlock 
            { 
                Text = levelStat.Level, 
                Width = 100, 
                FontWeight = FontWeights.Bold,
                Foreground = GetLevelBrush(levelStat.Level)
            };
            panel.Children.Add(levelText);
            
            // Progress bar
            var progressBar = new ProgressBar 
            { 
                Value = percentage, 
                Maximum = 100, 
                Width = 200, 
                Height = 20, 
                Margin = new Thickness(10, 0, 10, 0),
                Foreground = GetLevelBrush(levelStat.Level)
            };
            panel.Children.Add(progressBar);
            
            // Count and percentage
            var countText = new TextBlock 
            { 
                Text = $"{levelStat.Count:N0} ({percentage:F1}%)", 
                VerticalAlignment = VerticalAlignment.Center
            };
            panel.Children.Add(countText);
            
            LevelStatsPanel.Children.Add(panel);
        }
    }
    
    private void LoadComponentStatistics()
    {
        var componentStats = _logs
            .Where(l => !string.IsNullOrEmpty(l.Component))
            .GroupBy(l => l.Component)
            .Select(g => new 
            {
                Component = g.Key,
                Count = g.Count(),
                Percentage = $"{(g.Count() * 100.0 / _logs.Count):F1}%"
            })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToList();
        
        ComponentsDataGrid.ItemsSource = componentStats;
    }
    
    private void LoadErrorSummary()
    {
        var errorStats = _logs
            .Where(l => l.Level == "Error" || l.Level == "Fatal")
            .GroupBy(l => l.Message ?? "Unknown error")
            .Select(g => new 
            {
                Message = g.Key.Length > 100 ? g.Key[..100] + "..." : g.Key,
                Count = g.Count(),
                LastSeen = g.Max(x => x.Timestamp).ToString("yyyy-MM-dd HH:mm")
            })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToList();
        
        ErrorsDataGrid.ItemsSource = errorStats;
    }
    
    private void DrawHourlyChart()
    {
        HourlyChart.Children.Clear();
        
        var last24Hours = DateTime.Now.AddDays(-1);
        var recentLogs = _logs.Where(l => l.Timestamp >= last24Hours).ToList();
        
        if (recentLogs.Count == 0) return;
        
        var hourlyData = new int[24];
        foreach (var log in recentLogs)
        {
            hourlyData[log.Timestamp.Hour]++;
        }
        
        var maxCount = hourlyData.Max();
        if (maxCount == 0) return;
        
        var chartWidth = HourlyChart.ActualWidth > 0 ? HourlyChart.ActualWidth : 600;
        var chartHeight = HourlyChart.ActualHeight > 0 ? HourlyChart.ActualHeight : 80;
        
        var barWidth = chartWidth / 24;
        
        for (int hour = 0; hour < 24; hour++)
        {
            var count = hourlyData[hour];
            var barHeight = maxCount > 0 ? (count * (chartHeight - 20) / maxCount) : 0;
            
            var rect = new Rectangle
            {
                Width = barWidth - 2,
                Height = barHeight,
                Fill = Brushes.SteelBlue,
                Stroke = Brushes.DarkBlue,
                StrokeThickness = 1
            };
            
            Canvas.SetLeft(rect, hour * barWidth + 1);
            Canvas.SetBottom(rect, 20);
            HourlyChart.Children.Add(rect);
            
            // Hour label
            var label = new TextBlock
            {
                Text = hour.ToString("00"),
                FontSize = 9,
                Foreground = Brushes.Gray
            };
            
            Canvas.SetLeft(label, hour * barWidth + barWidth/2 - 8);
            Canvas.SetBottom(label, 2);
            HourlyChart.Children.Add(label);
        }
    }
    
    private static System.Windows.Media.Brush GetLevelBrush(string level)
    {
        return level?.ToLower() switch
        {
            "error" => Brushes.Red,
            "fatal" => Brushes.DarkRed,
            "warning" => Brushes.Orange,
            "information" => Brushes.Blue,
            "debug" => Brushes.Gray,
            "trace" => Brushes.LightGray,
            _ => Brushes.Black
        };
    }
    
    private void Refresh_Click(object sender, RoutedEventArgs e)
    {
        LoadStatistics();
    }
    
    private void Close_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }
}