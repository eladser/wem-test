using Serilog.Context;
using WemDashboard.Shared.Constants;

namespace WemDashboard.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var requestId = Guid.NewGuid().ToString();
        
        // Add request ID to response headers
        context.Response.Headers.TryAdd(AppConstants.Headers.RequestId, requestId);
        
        // Add request ID to log context
        using (LogContext.PushProperty("RequestId", requestId))
        {
            var startTime = DateTime.UtcNow;
            
            _logger.LogInformation("Starting request {Method} {Path} from {RemoteIpAddress}",
                context.Request.Method,
                context.Request.Path,
                context.Connection.RemoteIpAddress);

            try
            {
                await _next(context);
            }
            finally
            {
                var duration = DateTime.UtcNow - startTime;
                
                _logger.LogInformation("Completed request {Method} {Path} with status {StatusCode} in {Duration}ms",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode,
                    duration.TotalMilliseconds);
            }
        }
    }
}
