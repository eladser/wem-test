
import { config } from './environment';
import { logger } from '@/utils/logging';

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

  validateEnvironmentConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required configurations
    if (!config.app.name) {
      errors.push('App name is required');
    }

    if (!config.app.version) {
      errors.push('App version is required');
    }

    if (!config.api.baseUrl) {
      errors.push('API base URL is required');
    }

    // Production-specific validations
    if (config.app.environment === 'production') {
      if (config.api.baseUrl.includes('localhost')) {
        errors.push('Production API base URL cannot be localhost');
      }

      if (config.features.enableErrorReporting && !config.services.errorReportingKey) {
        warnings.push('Error reporting enabled but no key configured');
      }

      if (config.features.enableAnalytics && !config.services.analyticsId) {
        warnings.push('Analytics enabled but no ID configured');
      }

      if (config.development.enableDebugLogs) {
        warnings.push('Debug logs enabled in production');
      }

      if (!config.security.enableCSP) {
        warnings.push('CSP headers disabled in production');
      }
    }

    // Security validations
    if (config.security.trustedDomains.length === 0 && config.app.environment === 'production') {
      warnings.push('No trusted domains configured for production');
    }

    // Performance validations
    if (config.api.timeout > 30000) {
      warnings.push('API timeout is very high (>30s)');
    }

    if (config.performance.cacheTimeout < 60000) {
      warnings.push('Cache timeout is very low (<1min)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateApiConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // API URL validation
    try {
      new URL(config.api.baseUrl);
    } catch {
      errors.push('Invalid API base URL format');
    }

    // Fallback URLs validation
    config.api.fallbackUrls.forEach((url, index) => {
      try {
        new URL(url);
      } catch {
        errors.push(`Invalid fallback URL ${index + 1}: ${url}`);
      }
    });

    // API configuration warnings
    if (config.api.retryAttempts > 5) {
      warnings.push('High retry attempts may cause performance issues');
    }

    if (config.api.timeout < 5000) {
      warnings.push('Low API timeout may cause frequent failures');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateSecurityConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Security warnings
    if (!config.security.enableRateLimiting && config.app.environment === 'production') {
      warnings.push('Rate limiting disabled in production');
    }

    if (config.security.trustedDomains.some(domain => domain === '*')) {
      errors.push('Wildcard (*) in trusted domains is not secure');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async runAllValidations(): Promise<ValidationResult> {
    const envValidation = this.validateEnvironmentConfig();
    const apiValidation = this.validateApiConfig();
    const securityValidation = this.validateSecurityConfig();

    const combinedResult: ValidationResult = {
      isValid: envValidation.isValid && apiValidation.isValid && securityValidation.isValid,
      errors: [...envValidation.errors, ...apiValidation.errors, ...securityValidation.errors],
      warnings: [...envValidation.warnings, ...apiValidation.warnings, ...securityValidation.warnings]
    };

    // Log validation results
    if (!combinedResult.isValid) {
      logger.error('Configuration validation failed', undefined, {
        errors: combinedResult.errors,
        warnings: combinedResult.warnings
      });
    } else if (combinedResult.warnings.length > 0) {
      logger.warn('Configuration validation completed with warnings', {
        warnings: combinedResult.warnings
      });
    } else {
      logger.info('Configuration validation passed');
    }

    return combinedResult;
  }
}

export const configValidator = ConfigValidator.getInstance();
