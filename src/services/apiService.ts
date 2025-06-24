
import { config } from '@/config/environment';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
    this.retryAttempts = config.api.retryAttempts;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
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

      if (attempt < this.retryAttempts && error instanceof Error && error.name !== 'AbortError') {
        console.log(`API call failed, retrying... (${attempt}/${this.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      throw error;
    }
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

export class ApiError extends Error {
  constructor(public message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}
