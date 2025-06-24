
import { config } from '@/config/environment';
import { apiConfiguration } from '@/config/api';
import { logger } from '@/utils/logging';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class ApiError extends Error {
  constructor(public message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const apiEndpoint = await apiConfiguration.findHealthyEndpoint();
    
    // Handle mock endpoint
    if (apiEndpoint.url === 'mock://api') {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiEndpoint.timeout);

    try {
      const response = await fetch(`${apiEndpoint.url}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      clearTimeout(timeoutId);

      if (attempt < apiEndpoint.retryAttempts && error instanceof Error && error.name !== 'AbortError') {
        logger.warn(`API call failed, retrying... (${attempt}/${apiEndpoint.retryAttempts})`, {
          endpoint,
          attempt,
          error: error.message
        });
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.fetchWithRetry<T>(endpoint, options, attempt + 1);
      }

      // If all retries failed, try rotating to next endpoint
      if (attempt >= apiEndpoint.retryAttempts) {
        await apiConfiguration.rotateEndpoint();
      }

      throw error;
    }
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, config.development.mockApiDelay));

    logger.info('Mock API request', { endpoint, method: options.method || 'GET' });

    // Return mock data based on endpoint
    const mockData = this.generateMockData(endpoint);
    return { data: mockData as T, success: true };
  }

  private generateMockData(endpoint: string): any {
    // Basic mock data generation
    if (endpoint.includes('/health')) {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    }
    
    if (endpoint.includes('/regions')) {
      return [];
    }

    if (endpoint.includes('/assets')) {
      return [];
    }

    if (endpoint.includes('/power-data')) {
      return [];
    }

    if (endpoint.includes('/metrics')) {
      return [];
    }

    if (endpoint.includes('/energy-mix')) {
      return [];
    }

    return { message: 'Mock response', timestamp: new Date().toISOString() };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
