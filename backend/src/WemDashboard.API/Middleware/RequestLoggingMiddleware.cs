using System.Diagnostics;
using System.Text;

namespace WemDashboard.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;
    private readonly RequestLoggingOptions _options;

    public RequestLoggingMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger,
        RequestLoggingOptions options)
    {
        _next = next;
        _logger = logger;
        _options = options;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (ShouldSkipLogging(context))
        {
            await _next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString("N")[..8];
        
        // Add request ID to response headers
        context.Response.Headers.Add("X-Request-Id", requestId);
        
        // Log request
        await LogRequestAsync(context, requestId);

        // Capture response
        var originalBodyStream = context.Response.Body;
        using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            
            // Log response
            await LogResponseAsync(context, requestId, stopwatch.ElapsedMilliseconds);
            
            // Copy response back to original stream
            responseBodyStream.Seek(0, SeekOrigin.Begin);
            await responseBodyStream.CopyToAsync(originalBodyStream);
            context.Response.Body = originalBodyStream;
        }
    }

    private bool ShouldSkipLogging(HttpContext context)
    {
        var path = context.Request.Path.Value?.ToLowerInvariant();
        
        return _options.SkipPaths.Any(skipPath => 
            path?.StartsWith(skipPath, StringComparison.OrdinalIgnoreCase) == true);
    }

    private async Task LogRequestAsync(HttpContext context, string requestId)
    {
        var request = context.Request;
        var logData = new
        {
            RequestId = requestId,
            Method = request.Method,
            Path = request.Path,
            QueryString = request.QueryString.ToString(),
            Headers = GetSafeHeaders(request.Headers),
            UserAgent = request.Headers.UserAgent.ToString(),
            RemoteIpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserId = context.User?.Identity?.Name
        };

        string? requestBody = null;
        if (_options.LogRequestBody && request.ContentLength > 0 && request.ContentLength < _options.MaxRequestBodySize)
        {
            request.EnableBuffering();
            var buffer = new byte[request.ContentLength.Value];
            await request.Body.ReadAsync(buffer, 0, buffer.Length);
            requestBody = Encoding.UTF8.GetString(buffer);
            request.Body.Position = 0;
        }

        _logger.LogInformation("HTTP Request {RequestId}: {Method} {Path} {QueryString} - Body: {RequestBody}",
            requestId, request.Method, request.Path, request.QueryString, requestBody ?? "[Not logged]");

        _logger.LogDebug("HTTP Request Details {RequestId}: {@LogData}", requestId, logData);
    }

    private async Task LogResponseAsync(HttpContext context, string requestId, long elapsedMilliseconds)
    {
        var response = context.Response;
        
        string? responseBody = null;
        if (_options.LogResponseBody && response.Body.CanRead)
        {
            response.Body.Seek(0, SeekOrigin.Begin);
            var bodyText = await new StreamReader(response.Body).ReadToEndAsync();
            
            if (bodyText.Length < _options.MaxResponseBodySize)
            {
                responseBody = bodyText;
            }
            
            response.Body.Seek(0, SeekOrigin.Begin);
        }

        var logLevel = response.StatusCode >= 400 ? LogLevel.Warning : LogLevel.Information;
        
        _logger.Log(logLevel, "HTTP Response {RequestId}: {StatusCode} - {ElapsedMs}ms - Body: {ResponseBody}",
            requestId, response.StatusCode, elapsedMilliseconds, responseBody ?? "[Not logged]");

        // Log slow requests
        if (elapsedMilliseconds > _options.SlowRequestThresholdMs)
        {
            _logger.LogWarning("Slow HTTP Request {RequestId}: {Method} {Path} took {ElapsedMs}ms",
                requestId, context.Request.Method, context.Request.Path, elapsedMilliseconds);
        }
    }

    private static Dictionary<string, string> GetSafeHeaders(IHeaderDictionary headers)
    {
        var safeHeaders = new Dictionary<string, string>();
        var sensitiveHeaders = new[] { "authorization", "cookie", "x-api-key" };

        foreach (var header in headers)
        {
            if (sensitiveHeaders.Contains(header.Key.ToLowerInvariant()))
            {
                safeHeaders[header.Key] = "[REDACTED]";
            }
            else
            {
                safeHeaders[header.Key] = header.Value.ToString();
            }
        }

        return safeHeaders;
    }
}

public class RequestLoggingOptions
{
    public List<string> SkipPaths { get; set; } = new()
    {
        "/health",
        "/metrics",
        "/swagger",
        "/_next",
        "/favicon.ico"
    };
    
    public bool LogRequestBody { get; set; } = true;
    public bool LogResponseBody { get; set; } = false;
    public int MaxRequestBodySize { get; set; } = 4096; // 4KB
    public int MaxResponseBodySize { get; set; } = 4096; // 4KB
    public int SlowRequestThresholdMs { get; set; } = 5000; // 5 seconds
}