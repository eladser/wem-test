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

  // FIXED: Normalize URL construction to prevent double slashes and /api/api/
  private normalizeUrl(baseUrl: string, endpoint: string): string {
    // Remove trailing slash from base URL
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // If endpoint already starts with /api and baseUrl already includes /api, remove /api from endpoint
    if (cleanBaseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      return `${cleanBaseUrl}${cleanEndpoint.substring(4)}`;
    }
    
    // If baseUrl doesn't include /api but endpoint starts with /api, keep it
    if (!cleanBaseUrl.includes('/api') && cleanEndpoint.startsWith('/api/')) {
      return `${cleanBaseUrl}${cleanEndpoint}`;
    }
    
    // If baseUrl includes /api but endpoint doesn't start with /api, add to baseUrl
    if (cleanBaseUrl.endsWith('/api') && !cleanEndpoint.startsWith('/api/')) {
      return `${cleanBaseUrl}${cleanEndpoint}`;
    }
    
    // Default case: if no /api in baseUrl and endpoint doesn't start with /api, add /api
    if (!cleanBaseUrl.includes('/api') && !cleanEndpoint.startsWith('/api/')) {
      return `${cleanBaseUrl}/api${cleanEndpoint}`;
    }
    
    return `${cleanBaseUrl}${cleanEndpoint}`;
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
      
      // FIXED: Use normalized URL construction
      const fullUrl = this.normalizeUrl(apiEndpoint.url, gatewayRequest.endpoint);
      
      logger.info('API Gateway: Making request', { 
        requestId, 
        fullUrl, 
        method: gatewayRequest.method,
        baseUrl: apiEndpoint.url,
        endpoint: gatewayRequest.endpoint
      });

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

  private generateMockData(endpoint: string | undefined, method: string): any {
    // Handle undefined endpoint gracefully
    const safeEndpoint = endpoint || '';
    
    if (safeEndpoint.includes('/health')) {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    }
    
    if (safeEndpoint.includes('/auth/login')) {
      return { token: 'mock_jwt_token', user: { id: '1', email: 'user@example.com' } };
    }

    if (safeEndpoint.includes('/regions')) {
      return method === 'GET' ? [] : { id: 'new-region', name: 'New Region' };
    }

    if (safeEndpoint.includes('/assets')) {
      return method === 'GET' ? [] : { id: 'new-asset', name: 'New Asset' };
    }

    // FIXED: Add mock data for settings endpoints
    if (safeEndpoint.includes('/settings/general')) {
      if (method === 'GET') {
        return {
          company: 'EnergyOS Corp',
          timezone: 'utc',
          darkMode: true,
          autoSync: true
        };
      }
      if (method === 'PUT') {
        return { 
          success: true, 
          message: 'Settings updated successfully',
          data: {
            company: 'EnergyOS Corp',
            timezone: 'utc',
            darkMode: true,
            autoSync: true
          }
        };
      }
    }

    if (safeEndpoint.includes('/sites') && safeEndpoint.includes('/settings')) {
      return method === 'PUT' ? 
        { success: true, message: 'Site settings updated successfully' } :
        { id: 'site-settings', name: 'Site Settings' };
    }

    if (safeEndpoint.includes('/automation/rules')) {
      if (method === 'GET') {
        return [
          {
            id: '1',
            name: 'Peak Hours Optimization',
            type: 'schedule',
            enabled: true,
            schedule: '0 8-18 * * *',
            action: 'optimize_output'
          },
          {
            id: '2',
            name: 'Maintenance Window',
            type: 'schedule',
            enabled: true,
            schedule: '0 2 * * 0',
            action: 'maintenance_mode'
          }
        ];
      }
      return { id: 'new-rule', name: 'New Automation Rule' };
    }

    return { 
      message: `Mock ${method} response`, 
      timestamp: new Date().toISOString(),
      endpoint: safeEndpoint,
      success: true
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