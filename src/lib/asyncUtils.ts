
export interface AsyncOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const withAsyncHandler = async <T>(
  operation: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): Promise<AsyncOperationResult<T>> => {
  try {
    const data = await operation();
    
    if (options?.onSuccess) {
      options.onSuccess(data);
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    if (options?.onError) {
      options.onError(error instanceof Error ? error : new Error(errorMessage));
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const createMockApiCall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 10% failure rate for testing
      if (Math.random() < 0.1) {
        reject(new Error('Simulated API error'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};
