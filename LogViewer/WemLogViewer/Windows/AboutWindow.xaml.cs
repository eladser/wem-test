using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Navigation;

namespace WemLogViewer.Windows;

public partial class AboutWindow : Window
{
    public AboutWindow()
    {
        InitializeComponent();
        LoadSystemInformation();
    }
    
    private void LoadSystemInformation()
    {
        try
        {
            // Build date
            var assembly = Assembly.GetExecutingAssembly();
            var buildDate = GetBuildDate(assembly);
            BuildDateTextBlock.Text = buildDate.ToString("yyyy-MM-dd HH:mm:ss");
            
            // System information
            var systemInfo = $"""
Operating System: {Environment.OSVersion}
Processor Architecture: {RuntimeInformation.ProcessArchitecture}
Framework: {RuntimeInformation.FrameworkDescription}
CLR Version: {Environment.Version}
Machine Name: {Environment.MachineName}
User Domain: {Environment.UserDomainName}
User Name: {Environment.UserName}
Working Set: {Environment.WorkingSet / 1024 / 1024:N0} MB
System Directory: {Environment.SystemDirectory}
Current Directory: {Environment.CurrentDirectory}
""";
            
            SystemInfoTextBlock.Text = systemInfo;
        }
        catch (Exception ex)
        {
            SystemInfoTextBlock.Text = $"Error loading system information: {ex.Message}";
        }
    }
    
    private static DateTime GetBuildDate(Assembly assembly)
    {
        try
        {
            // Try to get build date from assembly
            var attribute = assembly.GetCustomAttribute<AssemblyMetadataAttribute>();
            if (attribute != null && DateTime.TryParse(attribute.Value, out var buildDate))
            {
                return buildDate;
            }
            
            // Fallback to file creation time
            return File.GetCreationTime(assembly.Location);
        }
        catch
        {
            return DateTime.Now;
        }
    }
    
    private void Hyperlink_RequestNavigate(object sender, RequestNavigateEventArgs e)
    {
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = e.Uri.AbsoluteUri,
                UseShellExecute = true
            });
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Could not open link: {ex.Message}", "Error", 
                MessageBoxButton.OK, MessageBoxImage.Warning);
        }
    }
    
    private void Close_Click(object sender, RoutedEventArgs e)
    {
        Close();
    }
}