using System.Net;
using System.Text.Json;
using WemDashboard.Application.Exceptions;
using WemDashboard.Application.DTOs;

namespace WemDashboard.API.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ErrorHandlingMiddleware(
        RequestDelegate next,
        ILogger<ErrorHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var errorId = Guid.NewGuid().ToString();
        
        _logger.LogError(exception, "Unhandled exception occurred. ErrorId: {ErrorId}, Path: {Path}, Method: {Method}",
            errorId, context.Request.Path, context.Request.Method);

        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = new ApiErrorResponse
        {
            ErrorId = errorId,
            Message = GetErrorMessage(exception),
            StatusCode = GetStatusCode(exception)
        };

        // Add stack trace in development
        if (_environment.IsDevelopment())
        {
            errorResponse.Details = exception.ToString();
        }

        response.StatusCode = errorResponse.StatusCode;

        var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await response.WriteAsync(jsonResponse);
    }

    private static string GetErrorMessage(Exception exception)
    {
        return exception switch
        {
            ValidationException => exception.Message,
            NotFoundException => exception.Message,
            UnauthorizedException => "Access denied",
            ForbiddenException => "Forbidden",
            ConflictException => exception.Message,
            BadRequestException => exception.Message,
            _ => "An error occurred while processing your request"
        };
    }

    private static int GetStatusCode(Exception exception)
    {
        return exception switch
        {
            ValidationException => (int)HttpStatusCode.BadRequest,
            NotFoundException => (int)HttpStatusCode.NotFound,
            UnauthorizedException => (int)HttpStatusCode.Unauthorized,
            ForbiddenException => (int)HttpStatusCode.Forbidden,
            ConflictException => (int)HttpStatusCode.Conflict,
            BadRequestException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };
    }
}

public class ApiErrorResponse
{
    public string ErrorId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}