
import { config } from '@/config/environment';
import React from 'react';

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

// React performance utilities with proper typing
export const withPerformanceTracking = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = React.memo((props: P) => {
    const monitor = PerformanceMonitor.getInstance();
    
    React.useEffect(() => {
      monitor.startTiming(`${componentName}-render`);
      return () => {
        monitor.endTiming(`${componentName}-render`);
      };
    });

    return React.createElement(Component, props);
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
};

// Bundle size analyzer without webpack dependency
export const analyzeBundleSize = () => {
  if (config.development.enableDebugLogs) {
    // Simple bundle analysis without external dependencies
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalScripts = scripts.length;
    
    console.log(`Bundle analysis: ${totalScripts} script tags found`);
    
    // Log script sources for debugging
    scripts.forEach((script, index) => {
      const src = script.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        console.log(`Script ${index + 1}: ${src}`);
      }
    });
  }
};

export const performanceMonitor = PerformanceMonitor.getInstance();
