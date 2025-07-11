namespace WemDashboard.Shared.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? RequestId { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, string message = "")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data,
            RequestId = Guid.NewGuid().ToString()
        };
    }

    public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>(),
            RequestId = Guid.NewGuid().ToString()
        };
    }

    public static ApiResponse<T> ErrorResponse(string message, string error)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = new List<string> { error },
            RequestId = Guid.NewGuid().ToString()
        };
    }
}

public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public List<string> Errors { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? RequestId { get; set; }

    public static ApiResponse SuccessResponse(string message = "")
    {
        return new ApiResponse
        {
            Success = true,
            Message = message,
            RequestId = Guid.NewGuid().ToString()
        };
    }

    public static ApiResponse SuccessResponse(object data, string message = "")
    {
        return new ApiResponse
        {
            Success = true,
            Message = message,
            Data = data,
            RequestId = Guid.NewGuid().ToString()
        };
    }

    public static ApiResponse ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>(),
            RequestId = Guid.NewGuid().ToString()
        };
    }

    public static ApiResponse ErrorResponse(string message, string error)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            Errors = new List<string> { error },
            RequestId = Guid.NewGuid().ToString()
        };
    }
}
