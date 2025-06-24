
import { deploymentManager } from './deployment';
import { logger } from './logging';
import { healthMonitor } from './monitoring';
import { initializeSecurity } from './security';
import { config } from '@/config/environment';

export class ApplicationStartup {
  private static instance: ApplicationStartup;

  static getInstance(): ApplicationStartup {
    if (!ApplicationStartup.instance) {
      ApplicationStartup.instance = new ApplicationStartup();
    }
    return ApplicationStartup.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      logger.info('Starting application initialization');

      // Initialize security first
      initializeSecurity();

      // Initialize deployment
      const deploymentSuccess = await deploymentManager.initialize();
      if (!deploymentSuccess) {
        throw new Error('Deployment initialization failed');
      }

      // Log deployment and system information
      deploymentManager.logSystemInfo();

      // Start health monitoring
      if (config.app.environment === 'production') {
        healthMonitor.startPeriodicHealthChecks(300000); // 5 minutes
      }

      // Perform initial health check
      await healthMonitor.performHealthCheck();

      logger.info('Application initialization completed successfully');
      return true;
    } catch (error) {
      logger.error('Application initialization failed', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  async shutdown(): Promise<void> {
    logger.info('Starting application shutdown');
    
    try {
      // Cleanup operations would go here
      logger.info('Application shutdown completed');
    } catch (error) {
      logger.error('Error during application shutdown', error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export const applicationStartup = ApplicationStartup.getInstance();
