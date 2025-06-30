    private void ShowLogDetails(LogEntry log)
    {
        try
        {
            // Message Details Tab - Always show the main message
            MessageDetailsTextBox.Text = log.Message ?? "";
            
            // Context Tab - Show context if available, otherwise show structured/multi-line content
            if (!string.IsNullOrEmpty(log.Context))
            {
                ContextTextBox.Text = log.Context;
            }
            else
            {
                // Fallback: Show multi-line content excluding the first line
                var lines = (log.Message ?? "").Split(Environment.NewLine);
                if (lines.Length > 1)
                {
                    // Skip the first line and show the rest as context
                    var contextLines = lines.Skip(1).Where(line => !string.IsNullOrWhiteSpace(line)).ToArray();
                    if (contextLines.Any())
                    {
                        ContextTextBox.Text = string.Join(Environment.NewLine, contextLines);
                    }
                    else
                    {
                        ContextTextBox.Text = "No additional context available";
                    }
                }
                else
                {
                    ContextTextBox.Text = "No additional context available";
                }
            }
            
            // Stack Trace Tab - Show stack trace if available, otherwise show properties or additional info
            if (!string.IsNullOrEmpty(log.StackTrace))
            {
                StackTraceTextBox.Text = log.StackTrace;
            }
            else
            {
                // Fallback: Show properties or any additional technical information
                var additionalInfo = new List<string>();
                
                // Add properties if available
                if (log.Properties != null && log.Properties.Any())
                {
                    additionalInfo.Add("Properties:");
                    foreach (var prop in log.Properties)
                    {
                        additionalInfo.Add($"  {prop.Key}: {prop.Value}");
                    }
                }
                
                // Add component and user info if available
                if (!string.IsNullOrEmpty(log.Component))
                {
                    additionalInfo.Add($"Component: {log.Component}");
                }
                
                if (!string.IsNullOrEmpty(log.UserId))
                {
                    additionalInfo.Add($"User ID: {log.UserId}");
                }
                
                if (!string.IsNullOrEmpty(log.Url))
                {
                    additionalInfo.Add($"URL: {log.Url}");
                }
                
                // Check for exception-like content in the message
                var message = log.Message ?? "";
                if (message.Contains("Exception:") || message.Contains("Error:") || message.Contains("at "))
                {
                    // Extract lines that look like stack trace
                    var lines = message.Split(Environment.NewLine);
                    var stackLikeLines = lines.Where(line => 
                        line.Trim().StartsWith("at ") ||
                        line.Contains("Exception:") ||
                        line.Contains("Error:") ||
                        line.Trim().StartsWith("---> ")).ToArray();
                    
                    if (stackLikeLines.Any())
                    {
                        additionalInfo.Add("Exception/Error Information:");
                        additionalInfo.AddRange(stackLikeLines);
                    }
                }
                
                if (additionalInfo.Any())
                {
                    StackTraceTextBox.Text = string.Join(Environment.NewLine, additionalInfo);
                }
                else
                {
                    StackTraceTextBox.Text = "No stack trace or additional technical information available";
                }
            }
            
            // Raw Log Tab - Always show the complete raw log entry
            RawLogTextBox.Text = log.RawLogLine ?? "";
        }
        catch (Exception ex)
        {
            LoggingService.Logger?.Error(ex, "Error showing log details");
            
            // Fallback to show at least something
            MessageDetailsTextBox.Text = log.Message ?? "Error displaying message";
            ContextTextBox.Text = "Error loading context";
            StackTraceTextBox.Text = "Error loading stack trace";
            RawLogTextBox.Text = log.RawLogLine ?? "";
        }
    }