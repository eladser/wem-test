namespace WemDashboard.Application.Exceptions;

public abstract class ApplicationException : Exception
{
    protected ApplicationException(string message) : base(message) { }
    protected ApplicationException(string message, Exception innerException) : base(message, innerException) { }
}

public class ValidationException : ApplicationException
{
    public ValidationException(string message) : base(message) { }
    public ValidationException(string message, Exception innerException) : base(message, innerException) { }
}

public class NotFoundException : ApplicationException
{
    public NotFoundException(string message) : base(message) { }
    public NotFoundException(string message, Exception innerException) : base(message, innerException) { }
}

public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message) : base(message) { }
    public UnauthorizedException(string message, Exception innerException) : base(message, innerException) { }
}

public class ForbiddenException : ApplicationException
{
    public ForbiddenException(string message) : base(message) { }
    public ForbiddenException(string message, Exception innerException) : base(message, innerException) { }
}

public class ConflictException : ApplicationException
{
    public ConflictException(string message) : base(message) { }
    public ConflictException(string message, Exception innerException) : base(message, innerException) { }
}

public class BadRequestException : ApplicationException
{
    public BadRequestException(string message) : base(message) { }
    public BadRequestException(string message, Exception innerException) : base(message, innerException) { }
}

public class ServiceUnavailableException : ApplicationException
{
    public ServiceUnavailableException(string message) : base(message) { }
    public ServiceUnavailableException(string message, Exception innerException) : base(message, innerException) { }
}