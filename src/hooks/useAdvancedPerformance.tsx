import { useEffect, useRef, useCallback, useState } from 'react';

// Performance monitoring configuration
interface PerformanceConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  enableMemoryMonitoring?: boolean;
  slowThreshold?: number; // milliseconds
  memoryThreshold?: number; // MB
}

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  memoryUsage?: number;
  props?: any;
  isSlowRender: boolean;
}

interface MemoryInfo {
  usedJSMemory: number;
  totalJSMemory: number;
  jsMemoryLimit: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private config: PerformanceConfig;
  private observers: Set<(metrics: PerformanceMetrics[]) => void> = new Set();

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableLogging: process.env.NODE_ENV === 'development',
      enableMetrics: true,
      enableMemoryMonitoring: true,
      slowThreshold: 16, // 60fps threshold
      memoryThreshold: 50, // 50MB
      ...config
    };
  }

  static getInstance(config?: PerformanceConfig): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  logMetric(metric: PerformanceMetrics) {
    if (!this.config.enableMetrics) return;

    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    if (this.config.enableLogging) {
      this.logToConsole(metric);
    }

    // Notify observers
    this.observers.forEach(observer => observer(this.metrics));
  }

  private logToConsole(metric: PerformanceMetrics) {
    const { componentName, renderTime, isSlowRender, memoryUsage } = metric;
    
    if (isSlowRender) {
      console.warn(
        `🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`,
        metric
      );
    } else if (this.config.enableLogging) {
      console.log(
        `⚡ ${componentName}: ${renderTime.toFixed(2)}ms${memoryUsage ? ` | Memory: ${memoryUsage.toFixed(1)}MB` : ''}`
      );
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getSlowRenders(): PerformanceMetrics[] {
    return this.metrics.filter(m => m.isSlowRender);
  }

  getAverageRenderTime(componentName?: string): number {
    const relevantMetrics = componentName 
      ? this.metrics.filter(m => m.componentName === componentName)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    
    return relevantMetrics.reduce((sum, m) => sum + m.renderTime, 0) / relevantMetrics.length;
  }

  subscribe(observer: (metrics: PerformanceMetrics[]) => void) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  clear() {
    this.metrics = [];
  }

  // Get memory usage if available
  getMemoryUsage(): MemoryInfo | null {
    if (!this.config.enableMemoryMonitoring) return null;
    
    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      usedJSMemory: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
      totalJSMemory: memory.totalJSHeapSize / 1024 / 1024,
      jsMemoryLimit: memory.jsMemoryLimit / 1024 / 1024
    };
  }
}

// Main performance hook
export const usePerformance = (
  componentName: string, 
  dependencies?: any[], 
  config?: PerformanceConfig
) => {
  const monitor = PerformanceMonitor.getInstance(config);
  const startTimeRef = useRef<number>();
  const mountTimeRef = useRef<number>();
  const [renderCount, setRenderCount] = useState(0);

  // Start timing on every render
  const startTime = performance.now();
  startTimeRef.current = startTime;

  // Log render time after render is complete
  const logRenderTime = useCallback(() => {
    if (!startTimeRef.current) return;
    
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    const memoryUsage = monitor.getMemoryUsage()?.usedJSMemory;
    
    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: endTime,
      memoryUsage,
      props: dependencies,
      isSlowRender: renderTime > (config?.slowThreshold || 16)
    };

    monitor.logMetric(metric);
  }, [componentName, dependencies, config?.slowThreshold, monitor]);

  // Track component lifecycle
  useEffect(() => {
    mountTimeRef.current = performance.now();
    setRenderCount(prev => prev + 1);
    
    // Log mount time
    if (mountTimeRef.current && startTimeRef.current) {
      const mountTime = mountTimeRef.current - startTimeRef.current;
      console.log(`🎯 ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    }

    return () => {
      console.log(`💀 ${componentName} unmounted after ${renderCount} renders`);
    };
  }, []);

  // Auto-log render time after each render
  useEffect(() => {
    logRenderTime();
  });

  return {
    logRenderTime,
    renderCount,
    getMetrics: () => monitor.getMetrics(),
    getComponentMetrics: () => monitor.getMetrics().filter(m => m.componentName === componentName),
    getSlowRenders: () => monitor.getSlowRenders(),
    getAverageRenderTime: () => monitor.getAverageRenderTime(componentName),
    subscribe: monitor.subscribe.bind(monitor),
    clear: monitor.clear.bind(monitor)
  };
};

// Hook for monitoring specific operations
export const useOperationPerformance = () => {
  const measure = useCallback((name: string, operation: () => Promise<any> | any) => {
    const start = performance.now();
    
    const finish = (result?: any) => {
      const end = performance.now();
      const duration = end - start;
      
      console.log(`⚡ Operation "${name}" took ${duration.toFixed(2)}ms`);
      
      if (duration > 100) {
        console.warn(`🐌 Slow operation detected: "${name}" took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    };

    try {
      const result = operation();
      
      if (result && typeof result.then === 'function') {
        // Handle async operations
        return result
          .then((asyncResult: any) => finish(asyncResult))
          .catch((error: any) => {
            finish();
            throw error;
          });
      } else {
        // Handle sync operations
        return finish(result);
      }
    } catch (error) {
      finish();
      throw error;
    }
  }, []);

  return { measure };
};

// Hook for monitoring network requests
export const useNetworkPerformance = () => {
  const [networkMetrics, setNetworkMetrics] = useState<{
    [key: string]: { duration: number; timestamp: number; status?: number }
  }>({});

  const measureRequest = useCallback(async (
    url: string, 
    requestInit?: RequestInit
  ): Promise<Response> => {
    const start = performance.now();
    
    try {
      const response = await fetch(url, requestInit);
      const duration = performance.now() - start;
      
      setNetworkMetrics(prev => ({
        ...prev,
        [url]: {
          duration,
          timestamp: Date.now(),
          status: response.status
        }
      }));
      
      if (duration > 1000) {
        console.warn(`🐌 Slow network request: ${url} took ${duration.toFixed(2)}ms`);
      } else {
        console.log(`🌐 ${url}: ${duration.toFixed(2)}ms (${response.status})`);
      }
      
      return response;
    } catch (error) {
      const duration = performance.now() - start;
      setNetworkMetrics(prev => ({
        ...prev,
        [url]: {
          duration,
          timestamp: Date.now(),
          status: 0 // Error
        }
      }));
      
      console.error(`❌ Network request failed: ${url} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }, []);

  return {
    measureRequest,
    networkMetrics,
    clearNetworkMetrics: () => setNetworkMetrics({})
  };
};

// Performance monitoring component for debugging
export const PerformanceDevTools: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const monitor = PerformanceMonitor.getInstance();
    const unsubscribe = monitor.subscribe(setMetrics);
    
    // Add keyboard shortcut to toggle visibility
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null;

  const slowRenders = metrics.filter(m => m.isSlowRender);
  const averageRenderTime = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length 
    : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm z-50 font-mono text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Performance Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div>Total Renders: {metrics.length}</div>
        <div>Slow Renders: {slowRenders.length}</div>
        <div>Avg Render Time: {averageRenderTime.toFixed(2)}ms</div>
        
        {slowRenders.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-yellow-400">
              Slow Renders ({slowRenders.length})
            </summary>
            <div className="mt-1 max-h-32 overflow-y-auto">
              {slowRenders.slice(-5).map((metric, idx) => (
                <div key={idx} className="text-red-400 text-xs">
                  {metric.componentName}: {metric.renderTime.toFixed(2)}ms
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
      
      <div className="text-gray-400 mt-2 text-xs">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;