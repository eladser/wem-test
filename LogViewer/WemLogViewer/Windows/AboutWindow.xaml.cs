using System.Diagnostics;
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
            var systemInfo = $"""\nOperating System: {Environment.OSVersion}\nProcessor Architecture: {RuntimeInformation.ProcessArchitecture}\nFramework: {RuntimeInformation.FrameworkDescription}\nCLR Version: {Environment.Version}\nMachine Name: {Environment.MachineName}\nUser Domain: {Environment.UserDomainName}\nUser Name: {Environment.UserName}\nWorking Set: {Environment.WorkingSet / 1024 / 1024:N0} MB\nSystem Directory: {Environment.SystemDirectory}\nCurrent Directory: {Environment.CurrentDirectory}\n""";
            
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