
import { apiGateway, type GatewayRequest } from './apiGateway';
import { logger } from '@/utils/logging';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  fromCache?: boolean;
}

export class ApiError extends Error {
  constructor(public message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private async makeRequest<T>(request: GatewayRequest): Promise<ApiResponse<T>> {
    try {
      const response = await apiGateway.request<T>(request);
      
      if (!response.success) {
        throw new ApiError(
          response.message || 'Request failed',
          response.statusCode
        );
      }

      return {
        data: response.data,
        success: response.success,
        fromCache: response.fromCache
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      logger.error('API Service: Request failed', error as Error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  async get<T>(
    endpoint: string, 
    options: { 
      requiresAuth?: boolean; 
      skipCache?: boolean; 
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'GET',
      ...options
    });
  }

  async post<T>(
    endpoint: string, 
    data: unknown,
    options: { 
      requiresAuth?: boolean;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'POST',
      data,
      skipCache: true, // Always skip cache for mutations
      ...options
    });
  }

  async put<T>(
    endpoint: string, 
    data: unknown,
    options: { 
      requiresAuth?: boolean;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'PUT',
      data,
      skipCache: true,
      ...options
    });
  }

  async patch<T>(
    endpoint: string, 
    data: unknown,
    options: { 
      requiresAuth?: boolean;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'PATCH',
      data,
      skipCache: true,
      ...options
    });
  }

  async delete<T>(
    endpoint: string,
    options: { 
      requiresAuth?: boolean;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      endpoint,
      method: 'DELETE',
      skipCache: true,
      ...options
    });
  }

  // Authentication helpers
  setAuthToken(token: string): void {
    apiGateway.setAuthToken(token);
  }

  clearAuthToken(): void {
    apiGateway.clearAuthToken();
  }

  // Cache management
  clearCache(): void {
    apiGateway.clearCache();
  }

  // Metrics and monitoring
  getRequestMetrics() {
    return apiGateway.getMetrics();
  }

  getCacheStats() {
    return apiGateway.getCacheStats();
  }
}

export const apiService = new ApiService();
