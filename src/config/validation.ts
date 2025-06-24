
import { config } from './environment';
import { logger } from '@/utils/logging';
import { apiConfiguration } from './api';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConfigValidator {
  private static instance: ConfigValidator;

  static getInstance(): ConfigValidator {
    if (!ConfigValidator.instance) {
      ConfigValidator.instance = new ConfigValidator();
    }
    return ConfigValidator.instance;
  }

  validateEnvironment(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required for production
    if (config.app.environment === 'production') {
      if (!config.api.baseUrl || config.api.baseUrl.includes('localhost')) {
        errors.push('Production API base URL is required and cannot be localhost');
      }

      if (config.development.enableDebugLogs) {
        warnings.push('Debug logs are enabled in production');
      }

      if (!config.features.enableErrorReporting) {
        warnings.push('Error reporting is disabled in production');
      }

      if (config.features.enableErrorReporting && !config.services.errorReportingKey) {
        warnings.push('Error reporting is enabled but no error reporting key is configured');
      }
    }

    // API configuration validation
    if (config.api.timeout < 5000) {
      warnings.push('API timeout is very low, consider increasing for production');
    }

    if (config.api.retryAttempts > 5) {
      warnings.push('API retry attempts are very high, consider reducing');
    }

    // Performance validation
    if (config.performance.cacheTimeout < 60000) {
      warnings.push('Cache timeout is very low, consider increasing for better performance');
    }

    // Security validation
    if (config.app.environment === 'production') {
      if (!config.security.enableCSP) {
        warnings.push('Content Security Policy is disabled in production');
      }

      if (!config.security.enableRateLimiting) {
        warnings.push('Rate limiting is disabled in production');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async validateApiConnection(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Find a healthy endpoint
      const healthyEndpoint = await apiConfiguration.findHealthyEndpoint();
      
      if (healthyEndpoint.url === 'mock://api') {
        warnings.push('Using mock API endpoint - no real API connectivity available');
        return {
          isValid: true,
          errors,
          warnings
        };
      }

      // Test the healthy endpoint
      const isHealthy = await apiConfiguration.checkEndpointHealth(healthyEndpoint);
      
      if (!isHealthy) {
        errors.push('No healthy API endpoints available');
      } else {
        logger.info('API connectivity validated successfully', { 
          endpoint: healthyEndpoint.url 
        });
      }

    } catch (error) {
      errors.push(`API connectivity validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async runAllValidations(): Promise<ValidationResult> {
    const envValidation = this.validateEnvironment();
    const apiValidation = await this.validateApiConnection();

    const allErrors = [...envValidation.errors, ...apiValidation.errors];
    const allWarnings = [...envValidation.warnings, ...apiValidation.warnings];

    const result = {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };

    // Log validation results
    if (result.errors.length > 0) {
      logger.error('Configuration validation failed', undefined, { errors: result.errors });
    }

    if (result.warnings.length > 0) {
      logger.warn('Configuration validation warnings', { warnings: result.warnings });
    }

    if (result.isValid) {
      logger.info('Configuration validation passed', { 
        warningCount: result.warnings.length 
      });
    }

    return result;
  }
}

export const configValidator = ConfigValidator.getInstance();
