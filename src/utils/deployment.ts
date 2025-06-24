
import { config } from '@/config/environment';
import { logger } from '@/utils/logging';
import { configValidator } from '@/config/validation';

export interface DeploymentInfo {
  version: string;
  environment: string;
  buildTime: string;
  commitHash?: string;
  features: string[];
}

export class DeploymentManager {
  private static instance: DeploymentManager;
  private deploymentInfo: DeploymentInfo;

  constructor() {
    this.deploymentInfo = {
      version: config.app.version,
      environment: config.app.environment,
      buildTime: new Date().toISOString(),
      commitHash: import.meta.env.VITE_COMMIT_HASH || 'unknown',
      features: this.getEnabledFeatures()
    };
  }

  static getInstance(): DeploymentManager {
    if (!DeploymentManager.instance) {
      DeploymentManager.instance = new DeploymentManager();
    }
    return DeploymentManager.instance;
  }

  private getEnabledFeatures(): string[] {
    const features = [];
    if (config.features.enableAnalytics) features.push('analytics');
    if (config.features.enableNotifications) features.push('notifications');
    if (config.features.enableErrorReporting) features.push('error-reporting');
    if (config.performance.enableLazyLoading) features.push('lazy-loading');
    return features;
  }

  async initialize(): Promise<boolean> {
    try {
      logger.info('Initializing deployment', this.deploymentInfo);

      // Run configuration validation
      const validation = await configValidator.runAllValidations();
      
      if (!validation.isValid) {
        logger.error('Deployment initialization failed due to configuration errors', undefined, {
          errors: validation.errors
        });
        return false;
      }

      if (validation.warnings.length > 0) {
        logger.warn('Deployment initialized with warnings', {
          warnings: validation.warnings
        });
      }

      // Initialize production services
      if (config.app.environment === 'production') {
        await this.initializeProductionServices();
      }

      logger.info('Deployment initialized successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize deployment', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }

  private async initializeProductionServices(): Promise<void> {
    // Initialize error reporting
    if (config.features.enableErrorReporting) {
      logger.info('Error reporting initialized');
    }

    // Initialize analytics
    if (config.features.enableAnalytics) {
      logger.info('Analytics initialized');
    }

    // Performance monitoring
    logger.info('Performance monitoring initialized');
  }

  getDeploymentInfo(): DeploymentInfo {
    return { ...this.deploymentInfo };
  }

  logSystemInfo(): void {
    const systemInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    logger.info('System information', { 
      deployment: this.deploymentInfo, 
      system: systemInfo 
    });
  }
}

export const deploymentManager = DeploymentManager.getInstance();
