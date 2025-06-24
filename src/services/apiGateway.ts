import { config } from '@/config/environment';
import { apiConfiguration } from '@/config/api';
import { logger } from '@/utils/logging';
import { rateLimiter } from '@/utils/security';

export interface GatewayRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  skipCache?: boolean;
  timeout?: number;
}

export interface GatewayResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  statusCode: number;
  fromCache?: boolean;
}

export interface RequestMetrics {
  requestId: string;
  endpoint: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  statusCode?: number;
  error?: string;
}

class ApiGateway {
  private static instance: ApiGateway;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestMetrics: RequestMetrics[] = [];
  private authToken: string | null = null;

  static getInstance(): ApiGateway {
    if (!ApiGateway.instance) {
      ApiGateway.instance = new ApiGateway();
    }
    return ApiGateway.instance;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
    logger.info('API Gateway: Auth token updated');
  }

  clearAuthToken(): void {
    this.authToken = null;
    logger.info('API Gateway: Auth token cleared');
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCacheKey(request: GatewayRequest): string {
    return `${request.method}:${request.endpoint}:${JSON.stringify(request.data || {})}`;
  }

  private isValidCacheEntry(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private async transformRequest(request: GatewayRequest): Promise<RequestInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': this.generateRequestId(),
      'X-Client-Version': config.app.version,
      ...request.headers
    };

    // Add authentication header if required and available
    if (request.requiresAuth && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Add CSRF token for write operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfToken = sessionStorage.getItem('csrf_token');
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return {
      method: request.method,
      headers,
      body: request.data ? JSON.stringify(request.data) : undefined,
      signal: AbortSignal.timeout(request.timeout || config.api.timeout)
    };
  }

  private async transformResponse<T>(response: Response, requestId: string): Promise<GatewayResponse<T>> {
    try {
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as T;
      }

      return {
        data,
        success: response.ok,
        statusCode: response.status,
        message: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
    } catch (error) {
      logger.error('API Gateway: Response transformation failed', error as Error, { requestId });
      throw new Error('Failed to parse response');
    }
  }

  private logRequestMetrics(metrics: RequestMetrics): void {
    this.requestMetrics.push(metrics);
    
    // Keep only last 100 requests
    if (this.requestMetrics.length > 100) {
      this.requestMetrics.shift();
    }

    logger.info('API Gateway: Request completed', {
      requestId: metrics.requestId,
      endpoint: metrics.endpoint,
      method: metrics.method,
      duration: metrics.duration,
      statusCode: metrics.statusCode
    });
  }

  async request<T>(gatewayRequest: GatewayRequest): Promise<GatewayResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = performance.now();

    const metrics: RequestMetrics = {
      requestId,
      endpoint: gatewayRequest.endpoint,
      method: gatewayRequest.method,
      startTime
    };

    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed(`api_${gatewayRequest.endpoint}`)) {
        throw new Error('Rate limit exceeded for this endpoint');
      }

      // Check cache for GET requests
      if (gatewayRequest.method === 'GET' && !gatewayRequest.skipCache) {
        const cacheKey = this.getCacheKey(gatewayRequest);
        const cachedEntry = this.cache.get(cacheKey);
        
        if (cachedEntry && this.isValidCacheEntry(cachedEntry)) {
          logger.info('API Gateway: Serving from cache', { requestId, endpoint: gatewayRequest.endpoint });
          return {
            data: cachedEntry.data,
            success: true,
            statusCode: 200,
            fromCache: true
          };
        }
      }

      // Get healthy API endpoint
      const apiEndpoint = await apiConfiguration.findHealthyEndpoint();
      
      // Handle mock requests
      if (apiEndpoint.url === 'mock://api') {
        return this.handleMockRequest<T>(gatewayRequest, requestId);
      }

      // Transform request
      const requestInit = await this.transformRequest(gatewayRequest);
      const fullUrl = `${apiEndpoint.url}${gatewayRequest.endpoint}`;

      // Make the actual request
      const response = await fetch(fullUrl, requestInit);
      
      metrics.endTime = performance.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.statusCode = response.status;

      // Transform response
      const gatewayResponse = await this.transformResponse<T>(response, requestId);

      // Cache successful GET responses
      if (gatewayRequest.method === 'GET' && gatewayResponse.success && !gatewayRequest.skipCache) {
        const cacheKey = this.getCacheKey(gatewayRequest);
        this.cache.set(cacheKey, {
          data: gatewayResponse.data,
          timestamp: Date.now(),
          ttl: config.performance.cacheTimeout
        });
      }

      this.logRequestMetrics(metrics);
      return gatewayResponse;

    } catch (error) {
      metrics.endTime = performance.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.error = error instanceof Error ? error.message : String(error);

      this.logRequestMetrics(metrics);

      logger.error('API Gateway: Request failed', error as Error, {
        requestId,
        endpoint: gatewayRequest.endpoint,
        method: gatewayRequest.method
      });

      throw error;
    }
  }

  private async handleMockRequest<T>(request: GatewayRequest, requestId: string): Promise<GatewayResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, config.development.mockApiDelay));

    logger.info('API Gateway: Mock request', { 
      requestId, 
      endpoint: request.endpoint, 
      method: request.method 
    });

    // Generate mock data based on endpoint
    const mockData = this.generateMockData(request.endpoint, request.method);
    
    return {
      data: mockData as T,
      success: true,
      statusCode: 200
    };
  }

  private generateMockData(endpoint: string, method: string): any {
    if (endpoint.includes('/health')) {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    }
    
    if (endpoint.includes('/auth/login')) {
      return { token: 'mock_jwt_token', user: { id: '1', email: 'user@example.com' } };
    }

    if (endpoint.includes('/regions')) {
      return method === 'GET' ? [] : { id: 'new-region', name: 'New Region' };
    }

    if (endpoint.includes('/assets')) {
      return method === 'GET' ? [] : { id: 'new-asset', name: 'New Asset' };
    }

    return { 
      message: `Mock ${method} response`, 
      timestamp: new Date().toISOString(),
      endpoint 
    };
  }

  clearCache(): void {
    this.cache.clear();
    logger.info('API Gateway: Cache cleared');
  }

  getMetrics(): RequestMetrics[] {
    return [...this.requestMetrics];
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const apiGateway = ApiGateway.getInstance();
