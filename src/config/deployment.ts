
import { config } from './environment';
import { logger } from '@/utils/logging';

export interface DeploymentConfig {
  environment: string;
  version: string;
  buildId: string;
  deploymentTime: string;
  healthCheckUrl: string;
  rollbackVersion?: string;
}

export class DeploymentManager {
  private static instance: DeploymentManager;
  private deploymentConfig: DeploymentConfig;

  static getInstance(): DeploymentManager {
    if (!DeploymentManager.instance) {
      DeploymentManager.instance = new DeploymentManager();
    }
    return DeploymentManager.instance;
  }

  constructor() {
    this.deploymentConfig = {
      environment: config.app.environment,
      version: config.app.version,
      buildId: this.generateBuildId(),
      deploymentTime: new Date().toISOString(),
      healthCheckUrl: `${config.api.baseUrl}/health`,
    };
  }

  private generateBuildId(): string {
    return `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async initialize(): Promise<boolean> {
    try {
      logger.info('Initializing deployment', this.deploymentConfig);
      
      // Perform deployment checks
      await this.performDeploymentChecks();
      
      // Initialize monitoring
      this.setupDeploymentMonitoring();
      
      return true;
    } catch (error) {
      logger.error('Deployment initialization failed', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  private async performDeploymentChecks(): Promise<void> {
    // Check API connectivity
    if (config.app.environment === 'production') {
      try {
        const response = await fetch(this.deploymentConfig.healthCheckUrl, {
          method: 'GET',
          timeout: 5000,
        } as RequestInit);
        
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }
        
        logger.info('API health check passed');
      } catch (error) {
        logger.warn('API health check failed', error instanceof Error ? error : new Error(String(error)));
      }
    }
    
    // Check required environment variables
    this.validateEnvironmentConfig();
    
    // Check browser compatibility
    this.checkBrowserCompatibility();
  }

  private validateEnvironmentConfig(): void {
    const requiredConfigs = {
      'API Base URL': config.api.baseUrl,
      'App Version': config.app.version,
      'Environment': config.app.environment,
    };

    const missingConfigs = Object.entries(requiredConfigs)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingConfigs.length > 0) {
      throw new Error(`Missing required configurations: ${missingConfigs.join(', ')}`);
    }
  }

  private checkBrowserCompatibility(): void {
    const requiredFeatures = [
      'fetch',
      'Promise',
      'localStorage',
      'sessionStorage',
    ];

    const unsupportedFeatures = requiredFeatures.filter(
      feature => !(feature in window)
    );

    if (unsupportedFeatures.length > 0) {
      logger.warn('Unsupported browser features detected', { unsupportedFeatures });
    }
  }

  private setupDeploymentMonitoring(): void {
    // Monitor for critical errors
    window.addEventListener('error', (event) => {
      logger.error('Critical runtime error detected', new Error(event.message), {
        buildId: this.deploymentConfig.buildId,
        filename: event.filename,
        lineno: event.lineno,
      });
    });

    // Performance monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            logger.info('Page load performance', {
              buildId: this.deploymentConfig.buildId,
              loadTime: entry.duration,
              domContentLoaded: (entry as PerformanceNavigationTiming).domContentLoadedEventEnd,
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  getDeploymentInfo(): DeploymentConfig {
    return { ...this.deploymentConfig };
  }

  logSystemInfo(): void {
    logger.info('System Information', {
      deployment: this.deploymentConfig,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
      } : 'Unknown',
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      } : 'Unknown',
    });
  }

  async performHealthCheck(): Promise<boolean> {
    try {
      // Basic application health checks
      const checks = {
        localStorage: this.checkLocalStorage(),
        api: await this.checkApiConnectivity(),
        performance: this.checkPerformance(),
      };

      const healthStatus = Object.values(checks).every(Boolean);
      
      logger.info('Health check completed', {
        status: healthStatus ? 'healthy' : 'unhealthy',
        checks,
        buildId: this.deploymentConfig.buildId,
      });

      return healthStatus;
    } catch (error) {
      logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  private checkLocalStorage(): boolean {
    try {
      const testKey = '__deployment_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private async checkApiConnectivity(): Promise<boolean> {
    if (config.app.environment === 'development') return true;
    
    try {
      const response = await fetch(this.deploymentConfig.healthCheckUrl, {
        method: 'HEAD',
        timeout: 3000,
      } as RequestInit);
      return response.ok;
    } catch {
      return false;
    }
  }

  private checkPerformance(): boolean {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return true;
    
    // Check if page load time is reasonable (< 5 seconds)
    return navigation.loadEventEnd < 5000;
  }
}

export const deploymentManager = DeploymentManager.getInstance();
