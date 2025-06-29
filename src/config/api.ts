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
    // Primary endpoint - your .NET backend on port 5000
    this.endpoints.push({
      url: config.api.baseUrl,
      timeout: config.api.timeout,
      retryAttempts: config.api.retryAttempts,
      isHealthy: true
    });

    // Only add fallback endpoints in production (remove mock endpoints)
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

    logger.info('API endpoints initialized', { 
      endpointCount: this.endpoints.length,
      primary: this.endpoints[0]?.url,
      useMockData: config.features.useMockData
    });
  }

  getCurrentEndpoint(): ApiEndpoint {
    return this.endpoints[this.currentEndpointIndex] || this.endpoints[0];
  }

  async checkEndpointHealth(endpoint: ApiEndpoint): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Health check endpoints your .NET backend supports
      const healthEndpoints = ['/health', '/api/hello', '/api/health', '/'];
      
      for (const healthPath of healthEndpoints) {
        try {
          const response = await fetch(`${endpoint.url.replace('/api', '')}${healthPath}`, {
            method: 'GET',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          
          if (response.ok) {
            endpoint.isHealthy = true;
            endpoint.lastChecked = new Date();
            logger.info('Backend health check successful', { 
              endpoint: endpoint.url,
              healthPath
            });
            return true;
          }
        } catch (err) {
          // Continue to next health endpoint
          continue;
        }
      }

      // If all health checks failed, mark as unhealthy
      clearTimeout(timeoutId);
      endpoint.isHealthy = false;
      endpoint.lastChecked = new Date();
      return false;

    } catch (error) {
      endpoint.isHealthy = false;
      endpoint.lastChecked = new Date();
      
      logger.warn('Backend endpoint health check failed', { 
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

    // If no endpoints are healthy, return current (frontend will fall back to mock data)
    logger.warn('No healthy endpoints available, using primary endpoint');
    return current;
  }

  async rotateEndpoint(): Promise<void> {
    const nextIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
    this.currentEndpointIndex = nextIndex;
    logger.info('Rotated to next endpoint', { url: this.getCurrentEndpoint().url });
  }

  // Method to check if we should use mock data
  shouldUseMockData(): boolean {
    return config.features.useMockData;
  }
}

export const apiConfiguration = ApiConfiguration.getInstance();
