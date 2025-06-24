
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  customMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      customMessage
    } = options;

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

    if (logToConsole) {
      console.error('Error handled:', error);
    }

    if (showToast) {
      toast.error(customMessage || errorMessage);
    }

    // In production, you might want to report to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error);
    }

    return errorMessage;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
