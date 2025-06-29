using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;
using WemLogViewer.Models;
using WemLogViewer.Services;

namespace WemLogViewer.Windows;

public partial class DatabaseConnectionWindow : Window
{
    public DatabaseConfig? DatabaseConfig { get; private set; }
    public bool IsConnected { get; private set; }

    public DatabaseConnectionWindow()
    {
        InitializeComponent();
        InitializeUI();
    }

    private void InitializeUI()
    {
        // Set default values
        FilePathTextBox.Text = "logs.db";
        ServerTextBox.Text = "localhost";
        PortTextBox.Text = "1433";
        DatabaseTextBox.Text = "LogDatabase";
        
        // Update UI based on default selection (SQLite)
        UpdateUIForConnectionType();
    }

    private void ConnectionType_Changed(object sender, RoutedEventArgs e)
    {
        UpdateUIForConnectionType();
    }

    private void UpdateUIForConnectionType()
    {
        if (SqliteRadio?.IsChecked == true)
        {
            // SQLite - show file path, hide server details
            FilePathLabel.Visibility = Visibility.Visible;
            FilePathTextBox.Visibility = Visibility.Visible;
            BrowseButton.Visibility = Visibility.Visible;
            
            ServerLabel.Visibility = Visibility.Collapsed;
            ServerTextBox.Visibility = Visibility.Collapsed;
            PortLabel.Visibility = Visibility.Collapsed;
            PortTextBox.Visibility = Visibility.Collapsed;
            DatabaseLabel.Visibility = Visibility.Collapsed;
            DatabaseTextBox.Visibility = Visibility.Collapsed;
            UsernameLabel.Visibility = Visibility.Collapsed;
            UsernameTextBox.Visibility = Visibility.Collapsed;
            PasswordLabel.Visibility = Visibility.Collapsed;
            PasswordBox.Visibility = Visibility.Collapsed;
        }
        else
        {
            // Server databases - hide file path, show server details
            FilePathLabel.Visibility = Visibility.Collapsed;
            FilePathTextBox.Visibility = Visibility.Collapsed;
            BrowseButton.Visibility = Visibility.Collapsed;
            
            ServerLabel.Visibility = Visibility.Visible;
            ServerTextBox.Visibility = Visibility.Visible;
            PortLabel.Visibility = Visibility.Visible;
            PortTextBox.Visibility = Visibility.Visible;
            DatabaseLabel.Visibility = Visibility.Visible;
            DatabaseTextBox.Visibility = Visibility.Visible;
            UsernameLabel.Visibility = Visibility.Visible;
            UsernameTextBox.Visibility = Visibility.Visible;
            PasswordLabel.Visibility = Visibility.Visible;
            PasswordBox.Visibility = Visibility.Visible;
            
            // Set default ports based on database type
            if (SqlServerRadio?.IsChecked == true)
                PortTextBox.Text = "1433";
            else if (PostgreSqlRadio?.IsChecked == true)
                PortTextBox.Text = "5432";
            else if (MySqlRadio?.IsChecked == true)
                PortTextBox.Text = "3306";
        }
    }

    private void Browse_Click(object sender, RoutedEventArgs e)
    {
        var dialog = new Microsoft.Win32.OpenFileDialog
        {
            Title = "Select SQLite Database File",
            Filter = "SQLite Database Files (*.db)|*.db|All Files (*.*)|*.*",
            CheckFileExists = false
        };

        if (dialog.ShowDialog() == true)
        {
            FilePathTextBox.Text = dialog.FileName;
        }
    }

    private async void TestConnection_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            TestConnectionButton.IsEnabled = false;
            TestConnectionButton.Content = "Testing...";

            var config = CreateDatabaseConfig();
            var databaseService = new DatabaseService();
            
            var success = await Task.Run(() => databaseService.TestConnection(config));
            
            if (success)
            {
                System.Windows.MessageBox.Show("Connection successful!", "Test Connection", 
                    MessageBoxButton.OK, MessageBoxImage.Information);
            }
            else
            {
                System.Windows.MessageBox.Show("Connection failed. Please check your settings.", "Test Connection", 
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        catch (Exception ex)
        {
            System.Windows.MessageBox.Show($"Connection test failed: {ex.Message}", "Test Connection", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally
        {
            TestConnectionButton.IsEnabled = true;
            TestConnectionButton.Content = "Test Connection";
        }
    }

    private void Connect_Click(object sender, RoutedEventArgs e)
    {
        try
        {
            DatabaseConfig = CreateDatabaseConfig();
            IsConnected = true;
            DialogResult = true;
            Close();
        }
        catch (Exception ex)
        {
            System.Windows.MessageBox.Show($"Error creating connection: {ex.Message}", "Connection Error", 
                MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void Cancel_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = false;
        Close();
    }

    private DatabaseConfig CreateDatabaseConfig()
    {
        var config = new DatabaseConfig
        {
            TableName = TableNameTextBox.Text,
            EnableAutoRefresh = AutoRefreshCheckBox.IsChecked == true
        };

        if (int.TryParse(RefreshIntervalTextBox.Text, out int interval))
        {
            config.RefreshIntervalSeconds = interval;
        }

        if (SqliteRadio.IsChecked == true)
        {
            config.Type = DatabaseType.SQLite;
            config.ConnectionString = $"Data Source={FilePathTextBox.Text};";
        }
        else if (SqlServerRadio.IsChecked == true)
        {
            config.Type = DatabaseType.SqlServer;
            config.ConnectionString = $"Server={ServerTextBox.Text},{PortTextBox.Text};Database={DatabaseTextBox.Text};User Id={UsernameTextBox.Text};Password={PasswordBox.Password};";
        }
        else if (PostgreSqlRadio.IsChecked == true)
        {
            config.Type = DatabaseType.PostgreSQL;
            config.ConnectionString = $"Host={ServerTextBox.Text};Port={PortTextBox.Text};Database={DatabaseTextBox.Text};Username={UsernameTextBox.Text};Password={PasswordBox.Password};";
        }
        else if (MySqlRadio.IsChecked == true)
        {
            config.Type = DatabaseType.MySQL;
            config.ConnectionString = $"Server={ServerTextBox.Text};Port={PortTextBox.Text};Database={DatabaseTextBox.Text};User={UsernameTextBox.Text};Password={PasswordBox.Password};";
        }

        return config;
    }
}