# WEM Log Viewer - Feature Documentation

This document provides detailed information about all features available in the WEM Log Viewer application.

## 🎯 Core Features

### 1. Multi-Format Log Parsing

#### Supported Formats
- **JSON Logs**: Serilog JSON format with automatic property detection
- **Serilog Text**: Standard Serilog text format with structured data
- **Generic Logs**: Automatic detection of timestamps and log levels
- **Custom Formats**: Extensible parsing for custom log formats

#### Parsing Capabilities
- Automatic format detection
- Robust error handling for malformed entries
- Context preservation for multi-line entries
- Property extraction from structured logs

### 2. Advanced Filtering System

#### Log Level Filtering
- **Trace**: Detailed diagnostic information
- **Debug**: Development and troubleshooting information
- **Information**: General application flow
- **Warning**: Potentially harmful situations
- **Error**: Error events that don't stop the application
- **Fatal**: Critical errors that may cause termination

#### Time Range Filtering
- **Absolute Ranges**: Specific start and end dates/times
- **Relative Ranges**: Last hour, today, last 24 hours, etc.
- **Custom Ranges**: User-defined time periods
- **Real-time Updates**: Filters update as new logs arrive

#### Content Filtering
- **Text Search**: Search within log messages
- **Regular Expressions**: Advanced pattern matching
- **Case Sensitivity**: Optional case-sensitive search
- **Component Filtering**: Filter by application component
- **User Filtering**: Filter by user ID or name

### 3. Database Integration

#### SQLite Support
- **Automatic Schema Detection**: Recognizes common log table structures
- **WEM Dashboard Integration**: Special support for WEM database schema
- **Efficient Queries**: Optimized for large datasets
- **Connection Management**: Secure and reliable database connections

#### Supported Table Structures
```sql
-- Example compatible table structure
CREATE TABLE LogEntries (
    Id INTEGER PRIMARY KEY,
    Timestamp DATETIME,
    Level TEXT,
    Message TEXT,
    Component TEXT,
    UserId TEXT,
    Context TEXT,
    StackTrace TEXT
);
```

### 4. Real-Time Monitoring

#### Auto-Refresh
- **Configurable Intervals**: 1-300 seconds
- **Smart Updates**: Only refresh changed data
- **Performance Optimized**: Minimal resource usage
- **Visual Indicators**: Shows when refreshing

#### Live Filtering
- **Instant Results**: Filters apply immediately
- **No Lag**: Optimized for large datasets
- **Preserved State**: Maintains scroll position and selection

## 📊 Analysis Features

### 1. Statistical Analysis

#### Overview Statistics
- **Total Log Count**: Complete count of loaded logs
- **Error Rate**: Percentage of error and fatal logs
- **Date Range**: Time span of loaded logs
- **Peak Activity**: Busiest time periods
- **Unique Users**: Count of distinct users in logs

#### Distribution Analysis
- **Log Level Distribution**: Breakdown by severity
- **Component Activity**: Most active application components
- **Hourly Patterns**: Activity by hour of day
- **Daily Trends**: Activity patterns over days

#### Error Analysis
- **Error Frequency**: Most common error messages
- **Error Trends**: Error patterns over time
- **Critical Issues**: Fatal errors and their frequency
- **Component Errors**: Error distribution by component

### 2. Data Visualization

#### Timeline Charts
- **Activity Over Time**: Log volume across time periods
- **Multiple Series**: Different log levels on same chart
- **Interactive**: Zoom, pan, and drill-down capabilities
- **Export Options**: Save charts as images

#### Distribution Charts
- **Pie Charts**: Log level and component distribution
- **Bar Charts**: Component activity and error frequency
- **Line Charts**: Trend analysis over time
- **Customizable**: Configurable colors and styles

#### Specialized Visualizations
- **Heatmaps**: Activity intensity over time periods
- **Error Correlation**: Relationship between different error types
- **Performance Metrics**: Response times and throughput

## 🎨 User Interface Features

### 1. Modern Design

#### Visual Elements
- **Clean Layout**: Intuitive and uncluttered interface
- **Modern Icons**: Clear, scalable icons throughout
- **Consistent Styling**: Unified design language
- **Responsive Design**: Adapts to different window sizes

#### Color Coding
- **Log Level Colors**: Visual distinction for different severities
- **Status Indicators**: Clear visual feedback for application state
- **Highlight System**: Important information stands out
- **Accessibility**: High contrast options available

### 2. Customization Options

#### Themes
- **Light Theme**: Bright, clean appearance
- **Dark Theme**: Reduced eye strain for extended use
- **System Theme**: Automatically matches Windows theme
- **Custom Themes**: User-defined color schemes

#### Layout Customization
- **Resizable Panels**: Adjustable layout to user preference
- **Collapsible Sections**: Hide/show different areas
- **Toolbar Customization**: Add/remove toolbar buttons
- **Window State Memory**: Remembers size and position

#### Font Options
- **Log Display Font**: Monospace fonts for log content
- **UI Font**: System font for interface elements
- **Size Adjustment**: Configurable for different screen resolutions
- **Font Weight**: Normal, bold, or custom weights

### 3. Navigation & Interaction

#### Keyboard Shortcuts
- `Ctrl+O`: Open log file
- `Ctrl+S`: Export filtered logs
- `Ctrl+F`: Focus search box
- `F5`: Refresh logs
- `Ctrl+1-6`: Quick log level filters
- `Escape`: Clear current selection

#### Mouse Interactions
- **Double-Click**: Open detailed log view
- **Right-Click**: Context menu with options
- **Drag & Drop**: Load files by dragging onto window
- **Scroll Wheel**: Zoom in charts and quick scroll

## 📤 Export & Reporting

### 1. Export Formats

#### CSV Export
```csv
Timestamp,Level,Component,Message,UserId,Url,Context,StackTrace
2025-06-29 10:30:15.123,Information,AuthService,User logged in,user123,/login,,
```

#### JSON Export
```json
[
  {
    "Timestamp": "2025-06-29T10:30:15.123Z",
    "Level": "Information",
    "Component": "AuthService",
    "Message": "User logged in",
    "UserId": "user123",
    "Context": null,
    "Properties": {}
  }
]
```

#### HTML Export
- **Styled Reports**: Professional-looking HTML with CSS
- **Interactive Elements**: Collapsible sections and filtering
- **Print-Friendly**: Optimized for printing
- **Embedded Styles**: Self-contained HTML files

#### Text Export
- **Human Readable**: Easy to read format
- **Structured Layout**: Organized with headers and sections
- **Complete Information**: All log details included
- **Platform Independent**: Works on any system

### 2. Report Generation

#### Statistical Reports
- **Executive Summary**: High-level overview
- **Detailed Analysis**: In-depth statistics
- **Trend Reports**: Historical analysis
- **Error Reports**: Focus on issues and problems

#### Custom Reports
- **Filtered Data**: Export only selected logs
- **Date Range Reports**: Specific time periods
- **Component Reports**: Focus on specific components
- **User Activity Reports**: Per-user analysis

## 🔧 Configuration & Settings

### 1. Application Settings

#### Performance Settings
- **Max Log Entries**: Limit for memory management (1,000 - 1,000,000)
- **Auto-Refresh Interval**: How often to check for updates (1-300 seconds)
- **UI Virtualization**: Enable for better performance with large datasets
- **Background Processing**: Non-blocking operations

#### Display Settings
- **Show Line Numbers**: Display line numbers in detailed view
- **Word Wrap**: Enable text wrapping in message display
- **Show Timestamps**: Full timestamp display in grid
- **Highlight Errors**: Visual emphasis on error entries

#### Startup Settings
- **Remember Window Size**: Restore previous window dimensions
- **Auto-Load Last File**: Automatically open the last used file
- **Check for Updates**: Automatic update checking
- **Startup File Path**: Default directory for file operations

### 2. Advanced Configuration

#### Parsing Options
- **Enable JSON Parsing**: Support for JSON log formats
- **Enable Serilog Parsing**: Support for Serilog text format
- **Enable Generic Parsing**: Support for generic log formats
- **Strict Parsing Mode**: Faster but less flexible parsing

#### Export Preferences
- **Default Export Format**: Preferred format for exports
- **Include Raw Log Data**: Include original log lines in exports
- **Compress Large Exports**: Automatic compression for large files
- **Export Timestamp Format**: Customizable timestamp formatting

#### Security Settings
- **Database Connection Encryption**: Secure database connections
- **Audit Trail**: Log application usage (optional)
- **Data Retention**: Automatic cleanup of old data
- **Access Logging**: Track file and database access

## 🚀 Performance Features

### 1. Optimization Techniques

#### Memory Management
- **Lazy Loading**: Load data on-demand
- **Virtual Scrolling**: Only render visible items
- **Memory Pooling**: Reuse objects to reduce garbage collection
- **Smart Caching**: Cache frequently accessed data

#### UI Responsiveness
- **Background Threading**: Keep UI responsive during operations
- **Progressive Loading**: Show results as they become available
- **Cancellable Operations**: Allow users to cancel long operations
- **Status Updates**: Real-time progress indication

#### Search Optimization
- **Indexed Search**: Fast text searching
- **Compiled Regex**: Pre-compile regular expressions
- **Incremental Search**: Update results as user types
- **Search History**: Remember previous searches

### 2. Scalability

#### Large File Handling
- **Streaming Reader**: Process files larger than available memory
- **Chunked Processing**: Process data in manageable chunks
- **Memory Monitoring**: Automatic memory usage optimization
- **File Mapping**: Use memory-mapped files for very large logs

#### Database Performance
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQL queries
- **Batch Operations**: Process multiple records efficiently
- **Index Utilization**: Take advantage of database indexes

## 🔍 Search & Filter Features

### 1. Text Search

#### Search Modes
- **Simple Text**: Basic text matching
- **Regular Expressions**: Pattern-based searching
- **Wildcard Search**: Use * and ? wildcards
- **Fuzzy Search**: Find approximate matches

#### Search Options
- **Case Sensitive**: Optional case matching
- **Whole Words**: Match complete words only
- **Search History**: Remember previous searches
- **Search Highlighting**: Highlight matches in results

### 2. Filter Combinations

#### Boolean Logic
- **AND Conditions**: All filters must match
- **OR Conditions**: Any filter can match
- **NOT Conditions**: Exclude matching entries
- **Complex Expressions**: Combine multiple conditions

#### Filter Presets
- **Quick Filters**: One-click common filters
- **Saved Filters**: Save frequently used filter combinations
- **Filter Templates**: Pre-defined filter sets
- **Filter History**: Recently used filters

## 🛡️ Security & Privacy

### 1. Data Protection

#### Local Storage
- **No Cloud Storage**: All data remains on local machine
- **Secure File Handling**: Safe file operations
- **Permission Management**: Respect file system permissions
- **Audit Trail**: Optional logging of application usage

#### Privacy Features
- **Data Anonymization**: Option to hide sensitive information
- **PII Detection**: Identify and mask personal information
- **Secure Export**: Safe export with privacy options
- **Access Control**: User-based access restrictions

### 2. Compliance

#### Standards Support
- **GDPR Compliance**: Privacy regulation support
- **Data Retention**: Automatic cleanup policies
- **Audit Logging**: Track access and modifications
- **Secure Deletion**: Permanent data removal

---

*This feature documentation is comprehensive but may not cover every minor feature. For the most up-to-date information, please refer to the application's built-in help system or the latest release notes.*