import { logger } from './logger';
import { toast } from '@/hooks/use-toast';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: ErrorContext;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: ErrorContext
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed', context?: ErrorContext) {
    super(message, 503, true, context);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', context?: ErrorContext) {
    super(message, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', context?: ErrorContext) {
    super(message, 401, true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization failed', context?: ErrorContext) {
    super(message, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: ErrorContext) {
    super(message, 404, true, context);
  }
}

class ErrorHandler {
  private showToast(title: string, description: string, variant: 'default' | 'destructive' | 'success' | 'warning' = 'destructive') {
    toast({
      title,
      description,
      variant,
    });
  }

  private getUserFriendlyMessage(error: Error): string {
    if (error instanceof AppError) {
      return error.message;
    }

    if (error instanceof TypeError) {
      return 'Something went wrong. Please try again.';
    }

    if (error.message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    return 'An unexpected error occurred. Please try again.';
  }

  private shouldShowToUser(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  public handleError(error: Error, context?: ErrorContext): void {
    // Log the error
    logger.error('Error handled by ErrorHandler', {
      ...context,
      errorName: error.name,
      errorMessage: error.message,
      statusCode: error instanceof AppError ? error.statusCode : undefined
    }, error);

    // Show user-friendly message if appropriate
    if (this.shouldShowToUser(error)) {
      const userMessage = this.getUserFriendlyMessage(error);
      let variant: 'default' | 'destructive' | 'success' | 'warning' = 'destructive';
      
      if (error instanceof ValidationError) {
        variant = 'warning';
      }
      
      this.showToast('Error', userMessage, variant);
    } else {
      // For programming errors, show a generic message
      this.showToast(
        'Unexpected Error',
        'Something went wrong. Our team has been notified.',
        'destructive'
      );
    }
  }

  public handleAsyncError(promise: Promise<any>, context?: ErrorContext): Promise<any> {
    return promise.catch((error) => {
      this.handleError(error, context);
      throw error; // Re-throw to allow caller to handle if needed
    });
  }

  public wrapAsyncFunction<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: ErrorContext
  ): T {
    return ((...args: any[]) => {
      return this.handleAsyncError(fn(...args), context);
    }) as T;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions
export const handleError = (error: Error, context?: ErrorContext) => {
  errorHandler.handleError(error, context);
};

export const handleAsyncError = (promise: Promise<any>, context?: ErrorContext) => {
  return errorHandler.handleAsyncError(promise, context);
};

export const wrapAsyncFunction = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
) => {
  return errorHandler.wrapAsyncFunction(fn, context);
};

// React hook for error handling
export function useErrorHandler() {
  return {
    handleError,
    handleAsyncError,
    wrapAsyncFunction,
    AppError,
    NetworkError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError
  };
}

// Utility function to create error context
export function createErrorContext(
  component: string,
  action?: string,
  metadata?: Record<string, any>
): ErrorContext {
  return {
    component,
    action,
    metadata,
    userId: getCurrentUserId()
  };
}

function getCurrentUserId(): string | undefined {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : undefined;
  } catch {
    return undefined;
  }
}