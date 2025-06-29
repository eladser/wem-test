using System.Windows.Input;

namespace WemLogViewer.Commands;

public static class CustomCommands
{
    public static readonly RoutedUICommand Refresh = new(
        "Refresh", "Refresh", typeof(CustomCommands),
        new InputGestureCollection { new KeyGesture(Key.F5) });
        
    public static readonly RoutedUICommand ClearFilter = new(
        "Clear Filter", "ClearFilter", typeof(CustomCommands));
}