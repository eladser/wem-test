using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using LiveCharts;
using LiveCharts.Configurations;
using LiveCharts.Wpf;
using WemLogViewer.Models;

namespace WemLogViewer.Windows;

public partial class ChartsWindow : Window
{
    private readonly ObservableCollection<LogEntry> _allLogs;
    private List<LogEntry> _filteredLogs;
    
    public Func<double, string> TimeFormatter { get; set; }
    public Func<double, string> HourFormatter { get; set; }
    public string[] ComponentLabels { get; set; } = Array.Empty<string>();
    
    public ChartsWindow(ObservableCollection<LogEntry> logs)
    {
        InitializeComponent();
        _allLogs = logs;
        _filteredLogs = logs.ToList();
        
        InitializeFormatters();
        DataContext = this;
        LoadCharts();
    }
    
    private void InitializeFormatters()
    {
        TimeFormatter = value => new DateTime((long)value).ToString("MM/dd HH:mm");
        HourFormatter = value => $"{value:00}:00";
    }
    
    private void LoadCharts()
    {
        if (_filteredLogs.Count == 0)
        {
            SummaryTextBlock.Text = "No logs available for charting";
            return;
        }
        
        var minDate = _filteredLogs.Min(l => l.Timestamp);
        var maxDate = _filteredLogs.Max(l => l.Timestamp);
        SummaryTextBlock.Text = $"Charting {_filteredLogs.Count:N0} log entries from {minDate:yyyy-MM-dd HH:mm} to {maxDate:yyyy-MM-dd HH:mm}";
        
        LoadTimelineChart();
        LoadLevelsChart();
        LoadComponentsChart();
        LoadHourlyChart();
        LoadErrorTrendsChart();
    }
    
    private void LoadTimelineChart()
    {
        var timelineData = _filteredLogs
            .GroupBy(l => new DateTime(l.Timestamp.Year, l.Timestamp.Month, l.Timestamp.Day, l.Timestamp.Hour, 0, 0))
            .Select(g => new { Time = g.Key, Count = g.Count() })
            .OrderBy(x => x.Time)
            .ToList();
        
        var series = new LineSeries
        {
            Title = "Log Events",
            Values = new ChartValues<DateTimePoint>(
                timelineData.Select(d => new DateTimePoint(d.Time, d.Count))
            ),
            PointGeometry = DefaultGeometries.Circle,
            PointGeometrySize = 8,
            Fill = System.Windows.Media.Brushes.Transparent,
            Stroke = System.Windows.Media.Brushes.SteelBlue,
            StrokeThickness = 2
        };
        
        TimelineChart.Series = new SeriesCollection { series };
    }
    
    private void LoadLevelsChart()
    {
        var levelCounts = _filteredLogs
            .GroupBy(l => l.Level ?? "Unknown")
            .Select(g => new { Level = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();
        
        var series = new SeriesCollection();
        
        var colors = new[]
        {
            System.Windows.Media.Brushes.Red,        // Error
            System.Windows.Media.Brushes.DarkRed,    // Fatal
            System.Windows.Media.Brushes.Orange,     // Warning
            System.Windows.Media.Brushes.SteelBlue,  // Information
            System.Windows.Media.Brushes.Gray,       // Debug
            System.Windows.Media.Brushes.LightGray,  // Trace
            System.Windows.Media.Brushes.Purple      // Unknown
        };
        
        for (int i = 0; i < levelCounts.Count; i++)
        {
            var levelData = levelCounts[i];
            series.Add(new PieSeries
            {
                Title = levelData.Level,
                Values = new ChartValues<int> { levelData.Count },
                Fill = i < colors.Length ? colors[i] : System.Windows.Media.Brushes.Black,
                DataLabels = true,
                LabelPoint = point => $"{point.Y} ({point.Participation:P0})"
            });
        }
        
        LevelsChart.Series = series;
    }
    
    private void LoadComponentsChart()
    {
        var componentCounts = _filteredLogs
            .Where(l => !string.IsNullOrEmpty(l.Component))
            .GroupBy(l => l.Component)
            .Select(g => new { Component = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(10)
            .ToList();
        
        ComponentLabels = componentCounts.Select(c => c.Component ?? "").ToArray();
        
        var series = new ColumnSeries
        {
            Title = "Log Count",
            Values = new ChartValues<int>(componentCounts.Select(c => c.Count)),
            Fill = System.Windows.Media.Brushes.SteelBlue,
            DataLabels = true
        };
        
        ComponentsChart.Series = new SeriesCollection { series };
    }
    
    private void LoadHourlyChart()
    {
        var hourlyData = new int[24];
        var dailyCounts = new Dictionary<int, int>();
        
        foreach (var log in _filteredLogs)
        {
            var hour = log.Timestamp.Hour;
            hourlyData[hour]++;
            
            var dayKey = log.Timestamp.DayOfYear + log.Timestamp.Year * 1000;
            if (!dailyCounts.ContainsKey(dayKey))
                dailyCounts[dayKey] = 0;
        }
        
        var daysCount = Math.Max(1, dailyCounts.Count);
        var averageData = hourlyData.Select((count, hour) => new { Hour = hour, Average = (double)count / daysCount }).ToList();
        
        var series = new ColumnSeries
        {
            Title = "Average Logs per Hour",
            Values = new ChartValues<double>(averageData.Select(d => d.Average)),
            Fill = System.Windows.Media.Brushes.Green,
            DataLabels = true,
            LabelPoint = point => $"{point.Y:F1}"
        };
        
        HourlyChart.Series = new SeriesCollection { series };
    }
    
    private void LoadErrorTrendsChart()
    {
        var errorData = _filteredLogs
            .Where(l => l.Level == "Error" || l.Level == "Fatal")
            .GroupBy(l => new DateTime(l.Timestamp.Year, l.Timestamp.Month, l.Timestamp.Day, l.Timestamp.Hour, 0, 0))
            .Select(g => new { Time = g.Key, Errors = g.Count(x => x.Level == "Error"), Fatals = g.Count(x => x.Level == "Fatal") })
            .OrderBy(x => x.Time)
            .ToList();
        
        var warningData = _filteredLogs
            .Where(l => l.Level == "Warning")
            .GroupBy(l => new DateTime(l.Timestamp.Year, l.Timestamp.Month, l.Timestamp.Day, l.Timestamp.Hour, 0, 0))
            .Select(g => new { Time = g.Key, Count = g.Count() })
            .OrderBy(x => x.Time)
            .ToList();
        
        var series = new SeriesCollection();
        
        if (errorData.Any())
        {
            series.Add(new LineSeries
            {
                Title = "Errors",
                Values = new ChartValues<DateTimePoint>(
                    errorData.Select(d => new DateTimePoint(d.Time, d.Errors))
                ),
                Stroke = System.Windows.Media.Brushes.Red,
                Fill = System.Windows.Media.Brushes.Transparent,
                PointGeometry = DefaultGeometries.Circle,
                PointGeometrySize = 6
            });
            
            series.Add(new LineSeries
            {
                Title = "Fatal",
                Values = new ChartValues<DateTimePoint>(
                    errorData.Select(d => new DateTimePoint(d.Time, d.Fatals))
                ),
                Stroke = System.Windows.Media.Brushes.DarkRed,
                Fill = System.Windows.Media.Brushes.Transparent,
                PointGeometry = DefaultGeometries.Square,
                PointGeometrySize = 6
            });
        }
        
        if (warningData.Any())
        {
            series.Add(new LineSeries
            {
                Title = "Warnings",
                Values = new ChartValues<DateTimePoint>(
                    warningData.Select(d => new DateTimePoint(d.Time, d.Count))
                ),
                Stroke = System.Windows.Media.Brushes.Orange,
                Fill = System.Windows.Media.Brushes.Transparent,
                PointGeometry = DefaultGeometries.Diamond,
                PointGeometrySize = 6
            });
        }
        
        ErrorTrendsChart.Series = series;
    }
    
    private void TimeRangeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (TimeRangeComboBox.SelectedItem is ComboBoxItem selectedItem)
        {
            var tag = selectedItem.Tag?.ToString();
            FilterLogsByTimeRange(tag);
            LoadCharts();
        }
    }
    
    private void FilterLogsByTimeRange(string? timeRange)
    {
        var now = DateTime.Now;
        
        _filteredLogs = timeRange switch
        {
            "1h" => _allLogs.Where(l => l.Timestamp >= now.AddHours(-1)).ToList(),
            "6h" => _allLogs.Where(l => l.Timestamp >= now.AddHours(-6)).ToList(),
            "24h" => _allLogs.Where(l => l.Timestamp >= now.AddDays(-1)).ToList(),
            "7d" => _allLogs.Where(l => l.Timestamp >= now.AddDays(-7)).ToList(),
            "all" => _allLogs.ToList(),
            _ => _allLogs.ToList()
        };
    }
    
    private void Refresh_Click(object sender, RoutedEventArgs e)
    {
        LoadCharts();
    }
    
    private void Close_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }
}