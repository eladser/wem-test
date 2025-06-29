using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace WemLogViewer.Behaviors;

public static class TextBoxBehaviors
{
    public static readonly DependencyProperty WatermarkProperty =
        DependencyProperty.RegisterAttached(
            "Watermark",
            typeof(string),
            typeof(TextBoxBehaviors),
            new PropertyMetadata(string.Empty, OnWatermarkChanged));

    public static string GetWatermark(DependencyObject obj)
    {
        return (string)obj.GetValue(WatermarkProperty);
    }

    public static void SetWatermark(DependencyObject obj, string value)
    {
        obj.SetValue(WatermarkProperty, value);
    }

    private static void OnWatermarkChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is TextBox textBox)
        {
            textBox.GotFocus -= TextBox_GotFocus;
            textBox.LostFocus -= TextBox_LostFocus;
            textBox.TextChanged -= TextBox_TextChanged;

            if (!string.IsNullOrEmpty((string)e.NewValue))
            {
                textBox.GotFocus += TextBox_GotFocus;
                textBox.LostFocus += TextBox_LostFocus;
                textBox.TextChanged += TextBox_TextChanged;
                
                UpdateWatermark(textBox);
            }
        }
    }

    private static void TextBox_GotFocus(object sender, RoutedEventArgs e)
    {
        if (sender is TextBox textBox)
        {
            UpdateWatermark(textBox);
        }
    }

    private static void TextBox_LostFocus(object sender, RoutedEventArgs e)
    {
        if (sender is TextBox textBox)
        {
            UpdateWatermark(textBox);
        }
    }

    private static void TextBox_TextChanged(object sender, TextChangedEventArgs e)
    {
        if (sender is TextBox textBox)
        {
            UpdateWatermark(textBox);
        }
    }

    private static void UpdateWatermark(TextBox textBox)
    {
        var watermark = GetWatermark(textBox);
        
        if (string.IsNullOrEmpty(textBox.Text) && !textBox.IsFocused)
        {
            textBox.Foreground = Brushes.Gray;
            textBox.Text = watermark;
        }
        else if (textBox.Text == watermark && textBox.IsFocused)
        {
            textBox.Foreground = SystemColors.ControlTextBrush;
            textBox.Text = string.Empty;
        }
        else if (!string.IsNullOrEmpty(textBox.Text) && textBox.Text != watermark)
        {
            textBox.Foreground = SystemColors.ControlTextBrush;
        }
    }
}