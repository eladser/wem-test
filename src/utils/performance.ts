
import { config } from '@/config/environment';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    if (config.development.enableDebugLogs) {
      console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    }

    // Report to analytics if enabled
    if (config.features.enableAnalytics) {
      this.reportMetric(label, duration);
    }

    return duration;
  }

  private reportMetric(label: string, duration: number): void {
    // In production, this would send to your analytics service
    if (config.app.environment === 'production') {
      // Example: send to Google Analytics, Mixpanel, etc.
      console.log(`Analytics: ${label} - ${duration}ms`);
    }
  }

  measureWebVitals(): void {
    // Measure Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with web-vitals library in a real app
      console.log('Web Vitals measurement would be implemented here');
    }
  }

  measureResourceTiming(): void {
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(
      (resource) => resource.duration > 1000
    );

    if (slowResources.length > 0 && config.development.enableDebugLogs) {
      console.warn('Slow resources detected:', slowResources);
    }
  }
}

// React performance utilities
export const withPerformanceTracking = <T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) => {
  return React.memo((props: T) => {
    const monitor = PerformanceMonitor.getInstance();
    
    React.useEffect(() => {
      monitor.startTiming(`${componentName}-render`);
      return () => {
        monitor.endTiming(`${componentName}-render`);
      };
    });

    return <Component {...props} />;
  });
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (config.development.enableDebugLogs) {
    import('webpack-bundle-analyzer').then((analyzer) => {
      console.log('Bundle analyzer available:', analyzer);
    }).catch(() => {
      console.log('Bundle analyzer not available in this environment');
    });
  }
};

export const performanceMonitor = PerformanceMonitor.getInstance();
