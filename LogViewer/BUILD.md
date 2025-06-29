# Building WEM Log Viewer

This document provides detailed instructions for building the WEM Log Viewer application from source.

## Prerequisites

### Required Software
- **Windows 10/11**: The application is designed for Windows
- **.NET 8.0 SDK**: Download from [Microsoft .NET](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Visual Studio 2022** (recommended) or **Visual Studio Code**
- **Git**: For cloning the repository

### Optional Tools
- **Windows Terminal**: For a better command-line experience
- **PowerShell 7+**: Enhanced scripting capabilities

## Building from Command Line

### 1. Clone the Repository
```bash
git clone https://github.com/eladser/wem-test.git
cd wem-test/LogViewer
```

### 2. Restore Dependencies
```bash
dotnet restore WemLogViewer.sln
```

### 3. Build the Solution

#### Debug Build
```bash
dotnet build WemLogViewer.sln --configuration Debug
```

#### Release Build
```bash
dotnet build WemLogViewer.sln --configuration Release
```

### 4. Run the Application
```bash
dotnet run --project WemLogViewer/WemLogViewer.csproj
```

## Building with Visual Studio

### 1. Open the Solution
- Launch Visual Studio 2022
- Open `WemLogViewer.sln`
- Wait for the solution to load and restore packages

### 2. Build the Solution
- Press `Ctrl+Shift+B` or use `Build → Build Solution`
- Ensure there are no build errors

### 3. Run the Application
- Press `F5` for debug mode
- Press `Ctrl+F5` for release mode without debugging

## Creating Distribution Packages

### Self-Contained Executable
Create a single executable file that includes the .NET runtime:

```bash
dotnet publish WemLogViewer/WemLogViewer.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

Output location: `WemLogViewer/bin/Release/net8.0-windows/win-x64/publish/`

### Framework-Dependent Deployment
Create a smaller package that requires .NET 8.0 to be installed:

```bash
dotnet publish WemLogViewer/WemLogViewer.csproj -c Release -r win-x64 --self-contained false
```

### Portable Build
Create a portable version that can run on any Windows machine with .NET 8.0:

```bash
dotnet publish WemLogViewer/WemLogViewer.csproj -c Release --no-self-contained
```

## Build Configurations

### Debug Configuration
- Includes debug symbols
- No optimizations
- Detailed error messages
- Console logging enabled

### Release Configuration
- Optimized code
- No debug symbols
- Minimal logging
- Smaller file size

## Troubleshooting Build Issues

### Common Issues

#### 1. NuGet Package Restore Failures
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore --force
```

#### 2. Missing .NET SDK
```bash
# Check installed SDKs
dotnet --list-sdks

# Install .NET 8.0 SDK if missing
# Download from: https://dotnet.microsoft.com/download/dotnet/8.0
```

#### 3. Build Errors Related to WPF
Ensure you're building on Windows with the Windows Desktop workload installed in Visual Studio.

#### 4. SQLite Native Library Issues
The SQLite package should automatically include native libraries. If issues persist:
```bash
dotnet add package System.Data.SQLite.Core --version 1.0.118
```

### Verbose Build Output
For detailed build information:
```bash
dotnet build --verbosity detailed
```

### Clean Build
To perform a clean build:
```bash
dotnet clean
dotnet build
```

## Development Environment Setup

### Visual Studio Extensions (Recommended)
- **XAML Styler**: Auto-format XAML files
- **CodeMaid**: Code cleanup and organization
- **GitExtensions**: Enhanced Git integration
- **Productivity Power Tools**: Various productivity enhancements

### Code Analysis
Enable code analysis in Visual Studio:
1. Right-click the project → Properties
2. Go to Code Analysis tab
3. Enable "Run code analysis on build"

## Performance Optimization

### Build Performance
- Use SSD storage for source code
- Exclude build directories from antivirus scanning
- Use parallel builds: `dotnet build -m`

### Runtime Performance
The Release build includes several optimizations:
- IL trimming to reduce size
- ReadyToRun compilation
- Assembly optimization

## Continuous Integration

### GitHub Actions Workflow
Create `.github/workflows/build.yml`:

```yaml
name: Build WEM Log Viewer

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: windows-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
        
    - name: Restore dependencies
      run: dotnet restore LogViewer/WemLogViewer.sln
      
    - name: Build
      run: dotnet build LogViewer/WemLogViewer.sln --no-restore --configuration Release
      
    - name: Publish
      run: dotnet publish LogViewer/WemLogViewer/WemLogViewer.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: WemLogViewer
        path: LogViewer/WemLogViewer/bin/Release/net8.0-windows/win-x64/publish/
```

## Deployment

### Manual Deployment
1. Build the Release configuration
2. Copy the output to target machine
3. Ensure .NET 8.0 runtime is installed (if not using self-contained)

### Installer Creation
For creating an installer, consider using:
- **WiX Toolset**: For MSI installers
- **Inno Setup**: For setup executables
- **ClickOnce**: For automatic updates

### Code Signing
For distribution, consider code signing the executable:
```bash
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com WemLogViewer.exe
```

## Testing

### Unit Tests
Run unit tests (if available):
```bash
dotnet test
```

### Integration Tests
Test with sample log files:
1. Copy sample logs to `TestData/` directory
2. Run application
3. Load test files and verify functionality

## Resources

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [WPF Documentation](https://docs.microsoft.com/en-us/dotnet/desktop/wpf/)
- [Visual Studio Documentation](https://docs.microsoft.com/en-us/visualstudio/)
- [NuGet Package Manager](https://docs.microsoft.com/en-us/nuget/)

---

For additional help with building, please check the main README.md or create an issue in the GitHub repository.