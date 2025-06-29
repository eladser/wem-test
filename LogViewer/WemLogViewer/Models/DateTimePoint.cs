using System;

namespace WemLogViewer.Models;

public class DateTimePoint
{
    public DateTime DateTime { get; set; }
    public double Value { get; set; }
    
    public DateTimePoint(DateTime dateTime, double value)
    {
        DateTime = dateTime;
        Value = value;
    }
}