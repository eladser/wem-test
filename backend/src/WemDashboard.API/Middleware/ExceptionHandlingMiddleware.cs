using System.Net;
using System.Text.Json;
using WemDashboard.Shared.Models;

namespace WemDashboard.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new ApiResponse<object>();
        
        switch (exception)
        {
            case ArgumentNullException:
            case ArgumentException:
                response = ApiResponse<object>.ErrorResponse("Invalid request parameters", exception.Message);
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;
            
            case UnauthorizedAccessException:
                response = ApiResponse<object>.ErrorResponse("Unauthorized access", exception.Message);
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;
            
            case KeyNotFoundException:
                response = ApiResponse<object>.ErrorResponse("Resource not found", exception.Message);
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                break;
            
            case InvalidOperationException:
                response = ApiResponse<object>.ErrorResponse("Invalid operation", exception.Message);
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;
            
            default:
                response = ApiResponse<object>.ErrorResponse("An error occurred while processing your request", "Internal server error");
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
