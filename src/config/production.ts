
import { config } from './environment';
import { healthMonitor } from '@/utils/monitoring';
import { logger } from '@/utils/logging';
import { performanceMonitor } from '@/utils/performance';

export class ProductionSetup {
  static async initialize() {
    // Initialize error reporting
    this.setupErrorReporting();
    
    // Initialize performance monitoring
    this.setupPerformanceMonitoring();
    
    // Initialize health monitoring
    this.setupHealthMonitoring();
    
    // Setup security headers (would be done server-side in real app)
    this.logSecurityRecommendations();
    
    logger.info('Production setup completed', {
      environment: config.app.environment,
      version: config.app.version,
    });
  }

  private static setupErrorReporting() {
    // Global error handler
    window.addEventListener('error', (event) => {
      logger.error('Global error caught', new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', new Error(event.reason), {
        reason: event.reason,
      });
    });
  }

  private static setupPerformanceMonitoring() {
    // Start performance monitoring
    performanceMonitor.measureWebVitals();
    performanceMonitor.measureResourceTiming();
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            logger.warn('Long task detected', {
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private static setupHealthMonitoring() {
    // Start periodic health checks
    healthMonitor.startPeriodicHealthChecks(300000); // 5 minutes
    
    // Initial health check
    healthMonitor.performHealthCheck();
  }

  private static logSecurityRecommendations() {
    logger.info('Security recommendations for production deployment', {
      recommendations: [
        'Set Content-Security-Policy headers',
        'Enable HSTS (HTTP Strict Transport Security)',
        'Set X-Frame-Options to DENY or SAMEORIGIN',
        'Set X-Content-Type-Options to nosniff',
        'Set Referrer-Policy to strict-origin-when-cross-origin',
        'Enable CORS with specific origins',
        'Use HTTPS in production',
        'Implement rate limiting on API endpoints',
        'Validate and sanitize all user inputs',
        'Keep dependencies updated'
      ]
    });
  }
}

// Production checklist
export const PRODUCTION_CHECKLIST = {
  security: [
    'CSP headers configured',
    'HTTPS enabled',
    'API rate limiting',
    'Input validation',
    'Dependency scanning'
  ],
  performance: [
    'Code splitting implemented',
    'Images optimized',
    'Caching strategy',
    'CDN configured',
    'Bundle size optimized'
  ],
  monitoring: [
    'Error tracking setup',
    'Performance monitoring',
    'Health checks',
    'Logging configured',
    'Analytics implemented'
  ],
  deployment: [
    'Environment variables set',
    'Build process automated',
    'Backup strategy',
    'Rollback plan',
    'Load testing completed'
  ]
};
