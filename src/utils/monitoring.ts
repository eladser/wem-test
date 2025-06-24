
import { config } from '@/config/environment';
import { logger } from './logging';

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: Date;
  responseTime?: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheck[];
  timestamp: Date;
}

class HealthMonitor {
  private static instance: HealthMonitor;

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  async checkApiHealth(): Promise<HealthCheck> {
    const start = performance.now();
    
    try {
      const response = await fetch(`${config.api.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const responseTime = performance.now() - start;

      if (response.ok) {
        return {
          name: 'api',
          status: responseTime > 2000 ? 'degraded' : 'healthy',
          message: `API responding in ${responseTime.toFixed(0)}ms`,
          timestamp: new Date(),
          responseTime,
        };
      } else {
        return {
          name: 'api',
          status: 'unhealthy',
          message: `API returned ${response.status}`,
          timestamp: new Date(),
          responseTime,
        };
      }
    } catch (error) {
      const responseTime = performance.now() - start;
      return {
        name: 'api',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'API unreachable',
        timestamp: new Date(),
        responseTime,
      };
    }
  }

  checkLocalStorageHealth(): HealthCheck {
    try {
      const testKey = '__health_check__';
      const testValue = 'test';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved === testValue) {
        return {
          name: 'localStorage',
          status: 'healthy',
          message: 'Local storage working correctly',
          timestamp: new Date(),
        };
      } else {
        return {
          name: 'localStorage',
          status: 'unhealthy',
          message: 'Local storage read/write failed',
          timestamp: new Date(),
        };
      }
    } catch (error) {
      return {
        name: 'localStorage',
        status: 'unhealthy',
        message: 'Local storage unavailable',
        timestamp: new Date(),
      };
    }
  }

  checkMemoryUsage(): HealthCheck {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
      const usage = (usedMB / limitMB) * 100;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (usage > 90) status = 'unhealthy';
      else if (usage > 70) status = 'degraded';

      return {
        name: 'memory',
        status,
        message: `Memory usage: ${usedMB.toFixed(1)}MB (${usage.toFixed(1)}%)`,
        timestamp: new Date(),
      };
    }

    return {
      name: 'memory',
      status: 'healthy',
      message: 'Memory monitoring not available',
      timestamp: new Date(),
    };
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const checks: HealthCheck[] = [];

    // Run all health checks
    checks.push(await this.checkApiHealth());
    checks.push(this.checkLocalStorageHealth());
    checks.push(this.checkMemoryUsage());

    // Determine overall health
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (hasUnhealthy) overall = 'unhealthy';
    else if (hasDegraded) overall = 'degraded';

    const result: SystemHealth = {
      overall,
      checks,
      timestamp: new Date(),
    };

    // Log health status
    if (overall === 'unhealthy') {
      logger.error('System health check failed', undefined, { health: result });
    } else if (overall === 'degraded') {
      logger.warn('System health degraded', { health: result });
    } else {
      logger.info('System health check passed', { health: result });
    }

    return result;
  }

  startPeriodicHealthChecks(intervalMs: number = 300000): () => void { // 5 minutes default
    const interval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

export const healthMonitor = HealthMonitor.getInstance();

// Error boundary integration
export const reportErrorToMonitoring = (error: Error, errorInfo: any) => {
  logger.error('React Error Boundary caught error', error, {
    errorInfo,
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  // In production, send to error monitoring service
  if (config.app.environment === 'production') {
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }
};
