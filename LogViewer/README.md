# WEM Log Viewer

A powerful, user-friendly Windows application designed specifically for analyzing and viewing log files from WEM Dashboard applications. This advanced log viewer provides comprehensive filtering, search capabilities, statistical analysis, and data visualization to help developers and system administrators efficiently troubleshoot and monitor their applications.

## 🚀 Features

### Core Functionality
- **Multi-format Log Parsing**: Supports JSON, Serilog, and generic log formats
- **Real-time Filtering**: Advanced filtering by log level, time range, component, and user
- **Search & Regex**: Powerful search with regular expression support
- **Database Connectivity**: Connect to SQLite databases for centralized log storage
- **Auto-refresh**: Real-time log monitoring with configurable refresh intervals

### Data Analysis
- **Statistical Analysis**: Comprehensive statistics including error rates, peak hours, and distribution analysis
- **Interactive Charts**: Visual representation of log data with timeline, pie charts, and trend analysis
- **Error Tracking**: Dedicated error summarization and tracking
- **Performance Metrics**: Hourly patterns and activity analysis

### Export & Sharing
- **Multiple Export Formats**: Export to CSV, JSON, HTML, and TXT formats
- **Filtered Exports**: Export only the logs that match your current filters
- **Formatted Reports**: Generate beautiful HTML reports with styling

### User Experience
- **Modern UI**: Clean, intuitive interface with Windows 11 styling
- **Customizable Themes**: Light, dark, and system theme support
- **Detailed Log View**: Comprehensive log entry details with context, stack traces, and properties
- **Performance Optimized**: Handles large log files efficiently with virtualization

## 🛠️ Installation

### Prerequisites
- Windows 10/11
- .NET 8.0 Runtime
- Visual Studio 2022 (for building from source)

### Building from Source

1. **Clone the Repository**
   ```bash
   git clone https://github.com/eladser/wem-test.git
   cd wem-test/LogViewer
   ```

2. **Build the Solution**
   ```bash
   dotnet build WemLogViewer.sln --configuration Release
   ```

3. **Run the Application**
   ```bash
   dotnet run --project WemLogViewer/WemLogViewer.csproj
   ```

### Creating a Standalone Executable

```bash
dotnet publish WemLogViewer/WemLogViewer.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
```

## 📖 Usage Guide

### Opening Log Files

1. **Single File**: `File → Open Log File...` or `Ctrl+O`
2. **Directory**: `File → Open Directory...` to load all log files from a folder
3. **Database**: `File → Connect to Database...` to connect to SQLite database

### Filtering Logs

The left panel provides comprehensive filtering options:

- **Log Levels**: Filter by Trace, Debug, Information, Warning, Error, Fatal
- **Time Range**: Set specific date/time ranges
- **Search**: Text search with regex support
- **Component**: Filter by application component
- **User**: Filter by user ID
- **Quick Actions**: Predefined filters (Last Hour, Today, Errors Only)

### Advanced Features

#### Statistics Window
Access via `View → Statistics` to see:
- Overall log statistics
- Error rate analysis
- Component distribution
- Hourly activity patterns

#### Charts Window
Access via `View → Charts` for visual analysis:
- Timeline charts showing log activity over time
- Pie charts for log level distribution
- Component activity bar charts
- Error trend analysis

#### Export Options
1. Apply desired filters
2. `File → Export Filtered Logs...`
3. Choose format (CSV, JSON, HTML, TXT)
4. Save to desired location

## 🔧 Configuration

### Settings Window
Access via `Tools → Settings` to configure:

#### General
- Display options (line numbers, word wrap, timestamps)
- Performance settings (max logs, refresh interval)
- Startup preferences

#### Appearance
- Theme selection (Light/Dark/System)
- Font customization
- Color scheme configuration

#### Advanced
- Parsing options (JSON, Serilog, Generic)
- Export preferences
- Logging configuration

## 📊 Supported Log Formats

### JSON Logs
```json
{
  "@t": "2025-06-29T10:30:15.123Z",
  "@l": "Information",
  "@m": "User logged in successfully",
  "UserId": "user123",
  "Component": "AuthService"
}
```

### Serilog Format
```
2025-06-29 10:30:15.123 [Information] User logged in successfully
```

### Generic Format
The application can parse most common log formats by detecting timestamps and log levels automatically.

## 🗄️ Database Integration

### SQLite Connection
The log viewer can connect to SQLite databases containing log entries. It automatically detects common table structures and column names:

- **Table Names**: LogEntries, Logs, ApplicationLogs, EventLogs
- **Column Mapping**: Automatic detection of timestamp, level, message, component, user, and other fields
- **Query Optimization**: Efficient queries with proper indexing

### WEM Dashboard Integration
Special support for WEM Dashboard database schema:
- Automatic detection of WEM database files
- Optimized queries for WEM log structure
- Full context and error information extraction

## 🎨 Customization

### Themes
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for extended use
- **System Theme**: Automatically follows Windows system theme

### Colors
Customizable colors for different log levels:
- Error: Red
- Fatal: Dark Red
- Warning: Orange
- Information: Blue
- Debug: Gray
- Trace: Light Gray

## 🔍 Search & Filtering

### Text Search
- Case-sensitive/insensitive options
- Regular expression support
- Search in messages and components

### Time-based Filtering
- Absolute date/time ranges
- Relative time filters (Last Hour, Today, etc.)
- Custom time range selection

### Advanced Filters
- Multiple log level selection
- Component-based filtering
- User-based filtering
- Combined filter conditions

## 📈 Performance

### Optimization Features
- **UI Virtualization**: Handles large datasets efficiently
- **Lazy Loading**: Load data on-demand
- **Background Processing**: Non-blocking UI operations
- **Memory Management**: Efficient memory usage for large files

### Benchmarks
- Supports files with 1M+ log entries
- Real-time filtering on large datasets
- Sub-second search response times
- Minimal memory footprint

## 🛠️ Development

### Architecture
```
WemLogViewer/
├── Models/           # Data models (LogEntry, etc.)
├── Services/         # Business logic (LogFileService, DatabaseService, etc.)
├── Windows/          # UI windows and dialogs
├── Styles/           # XAML styles and themes
└── Resources/        # Icons, images, and resources
```

### Key Components
- **LogFileService**: Handles log file parsing and reading
- **DatabaseService**: Manages database connections and queries
- **ExportService**: Handles data export in various formats
- **LoggingService**: Internal application logging

### Dependencies
- **WPF**: User interface framework
- **Serilog**: Logging framework
- **System.Data.SQLite**: SQLite database connectivity
- **LiveCharts.Wpf**: Data visualization
- **Newtonsoft.Json**: JSON processing
- **Ookii.Dialogs.Wpf**: Enhanced dialogs

## 🚀 Getting Started

### Quick Start
1. Build and run the application
2. Click "Open Log File" or press `Ctrl+O`
3. Select a WEM Dashboard log file
4. Use the filter panel to narrow down results
5. Double-click any log entry for detailed view

### Sample Log Files
For testing, you can use the WEM Dashboard's log files typically located at:
- `backend/logs/wemdashboard-*.txt`
- `backend/logs/errors/wemdashboard-errors-*.txt`

### Database Connection
1. Click "Connect to Database" in the File menu
2. Browse to your WEM Dashboard SQLite database file
3. Click "Test Connection" to verify
4. Click "OK" to load logs from database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Clone the repository
2. Open `WemLogViewer.sln` in Visual Studio 2022
3. Restore NuGet packages
4. Build and run

### Code Style
- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML documentation for public methods
- Write unit tests for new features

## 📝 License

This project is part of the WEM Dashboard suite. Please refer to the main repository for licensing information.

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/eladser/wem-test/issues) page to report bugs or request new features.

## 📞 Support

For support and questions:
- Check the documentation in this README
- Browse existing [GitHub Issues](https://github.com/eladser/wem-test/issues)
- Create a new issue with detailed information

---

**Built with ❤️ for efficient log analysis and debugging.**