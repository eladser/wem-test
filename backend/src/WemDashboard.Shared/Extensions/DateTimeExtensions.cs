namespace WemDashboard.Shared.Extensions;

public static class DateTimeExtensions
{
    public static string ToRelativeTime(this DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;
        
        return timeSpan.TotalMinutes switch
        {
            < 1 => "Just now",
            < 60 => $"{(int)timeSpan.TotalMinutes} min ago",
            < 1440 => $"{(int)timeSpan.TotalHours} hours ago",
            _ => $"{(int)timeSpan.TotalDays} days ago"
        };
    }
    
    public static DateTime GetTimeRangeStart(this DateTime dateTime, string timeRange)
    {
        return timeRange.ToLower() switch
        {
            "hour" => dateTime.AddHours(-1),
            "day" => dateTime.AddDays(-1),
            "week" => dateTime.AddDays(-7),
            "month" => dateTime.AddMonths(-1),
            _ => dateTime.AddDays(-1)
        };
    }
}
