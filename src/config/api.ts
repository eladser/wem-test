
import { config } from './environment';
import { logger } from '@/utils/logging';

export interface ApiEndpoint {
  url: string;
  timeout: number;
  retryAttempts: number;
  isHealthy: boolean;
  lastChecked?: Date;
}

export class ApiConfiguration {
  private static instance: ApiConfiguration;
  private endpoints: ApiEndpoint[] = [];
  private currentEndpointIndex = 0;

  static getInstance(): ApiConfiguration {
    if (!ApiConfiguration.instance) {
      ApiConfiguration.instance = new ApiConfiguration();
    }
    return ApiConfiguration.instance;
  }

  constructor() {
    this.initializeEndpoints();
  }

  private initializeEndpoints(): void {
    // Primary endpoint from config
    this.endpoints.push({
      url: config.api.baseUrl,
      timeout: config.api.timeout,
      retryAttempts: config.api.retryAttempts,
      isHealthy: true
    });

    // Fallback endpoints for production
    if (config.app.environment === 'production') {
      config.api.fallbackUrls.forEach(url => {
        this.endpoints.push({
          url,
          timeout: config.api.timeout,
          retryAttempts: config.api.retryAttempts,
          isHealthy: true
        });
      });
    }

    // Mock endpoint for development/testing
    if (config.app.environment === 'development' || this.endpoints.length === 1) {
      this.endpoints.push({
        url: 'mock://api',
        timeout: 1000,
        retryAttempts: 1,
        isHealthy: true
      });
    }

    logger.info('API endpoints initialized', { 
      endpointCount: this.endpoints.length,
      primary: this.endpoints[0]?.url 
    });
  }

  getCurrentEndpoint(): ApiEndpoint {
    return this.endpoints[this.currentEndpointIndex] || this.endpoints[0];
  }

  async checkEndpointHealth(endpoint: ApiEndpoint): Promise<boolean> {
    if (endpoint.url === 'mock://api') {
      return true; // Mock endpoint is always healthy
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${endpoint.url}/health`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      endpoint.isHealthy = response.ok;
      endpoint.lastChecked = new Date();

      return response.ok;
    } catch (error) {
      endpoint.isHealthy = false;
      endpoint.lastChecked = new Date();
      logger.warn('Endpoint health check failed', { 
        endpoint: endpoint.url, 
        error: error instanceof Error ? error.message : String(error) 
      });
      return false;
    }
  }

  async findHealthyEndpoint(): Promise<ApiEndpoint> {
    // Check current endpoint first
    const current = this.getCurrentEndpoint();
    if (await this.checkEndpointHealth(current)) {
      return current;
    }

    // Try other endpoints
    for (let i = 0; i < this.endpoints.length; i++) {
      if (i === this.currentEndpointIndex) continue;
      
      const endpoint = this.endpoints[i];
      if (await this.checkEndpointHealth(endpoint)) {
        this.currentEndpointIndex = i;
        logger.info('Switched to healthy endpoint', { url: endpoint.url });
        return endpoint;
      }
    }

    // If no endpoints are healthy, return mock endpoint or current
    const mockEndpoint = this.endpoints.find(e => e.url === 'mock://api');
    if (mockEndpoint) {
      this.currentEndpointIndex = this.endpoints.indexOf(mockEndpoint);
      logger.warn('All real endpoints unhealthy, using mock endpoint');
      return mockEndpoint;
    }

    logger.error('No healthy endpoints available');
    return current;
  }

  async rotateEndpoint(): Promise<void> {
    const nextIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
    this.currentEndpointIndex = nextIndex;
    logger.info('Rotated to next endpoint', { url: this.getCurrentEndpoint().url });
  }
}

export const apiConfiguration = ApiConfiguration.getInstance();
