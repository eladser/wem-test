
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
  reportToService?: boolean;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

export interface HandledError {
  message: string;
  stack?: string;
  context: ErrorContext;
  originalError: Error | unknown;
}

const createErrorContext = (
  component?: string,
  action?: string
): ErrorContext => ({
  component,
  action,
  timestamp: Date.now(),
  userAgent: navigator.userAgent,
  url: window.location.href
});

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {},
    context?: Partial<ErrorContext>
  ): string => {
    const {
      showToast = true,
      logToConsole = true,
      customMessage,
      reportToService = false
    } = options;

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

    const handledError: HandledError = {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        ...createErrorContext(context?.component, context?.action),
        ...context
      },
      originalError: error
    };

    if (logToConsole) {
      console.error('Error handled:', handledError);
    }

    if (showToast) {
      toast.error(customMessage || errorMessage);
    }

    // In production, report to error tracking service
    if (reportToService && process.env.NODE_ENV === 'production') {
      // Example: reportError(handledError);
      console.info('Error would be reported to service:', handledError);
    }

    return errorMessage;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {},
    context?: Partial<ErrorContext>
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options, context);
      return null;
    }
  }, [handleError]);

  const createErrorBoundary = useCallback((
    componentName: string
  ) => {
    return (error: Error, errorInfo: React.ErrorInfo) => {
      handleError(error, {
        showToast: true,
        logToConsole: true,
        reportToService: true
      }, {
        component: componentName,
        action: 'render'
      });
    };
  }, [handleError]);

  return { 
    handleError, 
    handleAsyncError,
    createErrorBoundary
  };
};

export type UseErrorHandler = ReturnType<typeof useErrorHandler>;
