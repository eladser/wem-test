import { logger } from './logger';
import { NetworkError, AuthenticationError, ValidationError, NotFoundError, AppError } from './errorHandler';

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiClient {
  private config: ApiClientConfig;
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> = [];
  private responseInterceptors: Array<(response: ApiResponse) => ApiResponse> = [];

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = {
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      timeout: 10000,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  private getAuthToken(): string | null {
    try {
      const token = localStorage.getItem('authToken');
      return token;
    } catch {
      return null;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = 3,
      retryDelay = 1000
    } = config;

    // Apply request interceptors
    let requestConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      requestConfig = interceptor(requestConfig);
    }

    // Prepare headers
    const finalHeaders: Record<string, string> = {
      ...this.config.defaultHeaders,
      ...headers,
    };

    // Add auth token if available
    const authToken = this.getAuthToken();
    if (authToken) {
      finalHeaders.Authorization = `Bearer ${authToken}`;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeout),
    };

    const fullUrl = `${this.config.baseURL}${url}`;
    
    logger.debug('API Request', {
      url: fullUrl,
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined
    });

    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions);
        
        logger.debug('API Response', {
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        // Handle different status codes
        if (!response.ok) {
          const errorData = await this.parseResponse(response);
          
          switch (response.status) {
            case 400:
              throw new ValidationError(
                errorData?.message || 'Validation failed',
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
            case 401:
              throw new AuthenticationError(
                errorData?.message || 'Authentication failed',
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
            case 403:
              throw new AuthenticationError(
                errorData?.message || 'Access denied',
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
            case 404:
              throw new NotFoundError(
                errorData?.message || 'Resource not found',
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
            case 429:
              throw new NetworkError(
                'Too many requests. Please try again later.',
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
            case 500:
            case 502:
            case 503:
            case 504:
              throw new NetworkError(
                'Server error. Please try again later.',
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
            default:
              throw new AppError(
                errorData?.message || `Request failed with status ${response.status}`,
                response.status,
                true,
                { component: 'ApiClient', action: `${method} ${url}`, metadata: errorData }
              );
          }
        }

        const data = await this.parseResponse<T>(response);
        
        let apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };

        // Apply response interceptors
        for (const interceptor of this.responseInterceptors) {
          apiResponse = interceptor(apiResponse);
        }

        logger.info('API Request successful', {
          url: fullUrl,
          method,
          status: response.status,
          responseSize: JSON.stringify(data).length
        });

        return apiResponse;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry for client errors (4xx) or specific error types
        if (
          error instanceof ValidationError ||
          error instanceof AuthenticationError ||
          error instanceof NotFoundError ||
          (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500)
        ) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === retries) {
          logger.error('API Request failed after all retries', {
            url: fullUrl,
            method,
            attempt: attempt + 1,
            maxRetries: retries + 1
          }, lastError);
          
          throw lastError;
        }

        // Wait before retrying
        logger.warn('API Request failed, retrying', {
          url: fullUrl,
          method,
          attempt: attempt + 1,
          maxRetries: retries + 1,
          retryDelay
        }, lastError);
        
        await this.sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
      }
    }

    throw lastError!;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    const text = await response.text();
    return text as unknown as T;
  }

  // HTTP Methods
  async get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'POST', body: data });
  }

  async put<T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'PUT', body: data });
  }

  async patch<T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'PATCH', body: data });
  }

  async delete<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { ...config, method: 'DELETE' });
  }

  // Interceptors
  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: ApiResponse) => ApiResponse) {
    this.responseInterceptors.push(interceptor);
  }

  // Update config
  updateConfig(config: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Convenience functions
export const api = {
  get: <T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.delete<T>(url, config),
};

export default apiClient;