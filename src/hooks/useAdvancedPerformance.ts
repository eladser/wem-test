import { useState, useEffect, useCallback, useRef } from 'react';
import { realTimeDataService, RealTimeMetrics, RealTimeAlert } from '@/services/realTimeDataService';
import { schedulerService } from '@/services/schedulerService';

export interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorRate: number;
  userInteractions: number;
  apiResponseTimes: Record<string, number>;
}

export interface SystemHealth {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  scores: {
    performance: number;
    reliability: number;
    security: number;
    usability: number;
  };
  alerts: RealTimeAlert[];
  recommendations: string[];
}

export interface UseAdvancedPerformanceReturn {
  // Performance metrics
  performance: PerformanceMetrics;
  systemHealth: SystemHealth;
  
  // Real-time data
  realTimeMetrics: RealTimeMetrics | null;
  isConnected: boolean;
  
  // Controls
  startMonitoring: (siteId?: string) => void;
  stopMonitoring: () => void;
  resetMetrics: () => void;
  
  // Analytics
  getPerformanceReport: () => Promise<any>;
  optimizePerformance: () => Promise<void>;
  
  // Error handling
  errors: Error[];
  clearErrors: () => void;
}

export function useAdvancedPerformance(): UseAdvancedPerformanceReturn {
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    renderTime: 0,
    loadTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    errorRate: 0,
    userInteractions: 0,
    apiResponseTimes: {}
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'good',
    scores: {
      performance: 85,
      reliability: 90,
      security: 88,
      usability: 92
    },
    alerts: [],
    recommendations: []
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const metricsRef = useRef<PerformanceMetrics>(performance);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when performance state changes
  useEffect(() => {
    metricsRef.current = performance;
  }, [performance]);

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      initializePerformanceMonitoring();
    }

    return () => {
      cleanup();
    };
  }, []);

  const initializePerformanceMonitoring = useCallback(() => {
    try {
      // Performance Observer for paint timing
      if ('PerformanceObserver' in window) {
        observerRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (entry.entryType === 'paint') {
              if (entry.name === 'first-contentful-paint') {
                updateMetrics({ renderTime: entry.startTime });
              }
            } else if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              updateMetrics({
                loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
                networkLatency: navEntry.responseStart - navEntry.requestStart
              });
            } else if (entry.entryType === 'measure') {
              if (entry.name.startsWith('api-')) {
                const apiName = entry.name.replace('api-', '');
                updateMetrics({
                  apiResponseTimes: {
                    ...metricsRef.current.apiResponseTimes,
                    [apiName]: entry.duration
                  }
                });
              }
            }
          });
        });

        observerRef.current.observe({ 
          entryTypes: ['paint', 'navigation', 'measure', 'resource'] 
        });
      }

      // Memory usage monitoring
      if ('memory' in performance) {
        intervalRef.current = setInterval(() => {
          const memInfo = (performance as any).memory;
          if (memInfo) {
            updateMetrics({
              memoryUsage: memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit
            });
          }
        }, 5000);
      }

      // Error rate monitoring
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      // User interaction monitoring
      const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
      interactionEvents.forEach(event => {
        document.addEventListener(event, trackUserInteraction, { passive: true });
      });

    } catch (error) {
      console.error('Error initializing performance monitoring:', error);
      addError(new Error('Failed to initialize performance monitoring'));
    }
  }, []);

  const updateMetrics = useCallback((updates: Partial<PerformanceMetrics>) => {
    setPerformance(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((event: ErrorEvent) => {
    addError(new Error(event.message));
    updateMetrics({
      errorRate: metricsRef.current.errorRate + 1
    });
  }, []);

  const handleUnhandledRejection = useCallback((event: PromiseRejectionEvent) => {
    addError(new Error(`Unhandled promise rejection: ${event.reason}`));
    updateMetrics({
      errorRate: metricsRef.current.errorRate + 1
    });
  }, []);

  const trackUserInteraction = useCallback(() => {
    updateMetrics({
      userInteractions: metricsRef.current.userInteractions + 1
    });
  }, []);

  const addError = useCallback((error: Error) => {
    setErrors(prev => [...prev.slice(-9), error]); // Keep last 10 errors
  }, []);

  const startMonitoring = useCallback(async (siteId?: string) => {
    if (isMonitoring) return;

    try {
      setIsMonitoring(true);

      // Connect to real-time data service
      if (siteId) {
        const unsubscribe = realTimeDataService.subscribeToMetrics(siteId, (metrics) => {
          setRealTimeMetrics(metrics);
        });
        unsubscribeRef.current = unsubscribe;
      }

      // Subscribe to alerts
      const alertUnsubscribe = realTimeDataService.subscribeToAlerts((alert) => {
        setSystemHealth(prev => ({
          ...prev,
          alerts: [...prev.alerts.slice(-9), alert] // Keep last 10 alerts
        }));
      });

      // Combine unsubscribe functions
      const originalUnsubscribe = unsubscribeRef.current;
      unsubscribeRef.current = () => {
        originalUnsubscribe?.();
        alertUnsubscribe();
      };

      setIsConnected(true);

      // Start health monitoring
      startHealthMonitoring();

    } catch (error) {
      console.error('Error starting monitoring:', error);
      addError(new Error('Failed to start monitoring'));
      setIsMonitoring(false);
    }
  }, [isMonitoring]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;

    setIsMonitoring(false);
    setIsConnected(false);
    
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setRealTimeMetrics(null);
  }, [isMonitoring]);

  const startHealthMonitoring = useCallback(() => {
    const checkHealth = () => {
      const scores = calculateHealthScores();
      const overall = calculateOverallHealth(scores);
      const recommendations = generateRecommendations(scores);

      setSystemHealth(prev => ({
        ...prev,
        overall,
        scores,
        recommendations
      }));
    };

    // Check health every 30 seconds
    const healthInterval = setInterval(checkHealth, 30000);
    checkHealth(); // Initial check

    return () => clearInterval(healthInterval);
  }, [performance]);

  const calculateHealthScores = useCallback(() => {
    const { renderTime, loadTime, memoryUsage, networkLatency, errorRate } = performance;

    // Performance score (0-100)
    let performanceScore = 100;
    if (renderTime > 2000) performanceScore -= 20;
    if (loadTime > 3000) performanceScore -= 20;
    if (networkLatency > 1000) performanceScore -= 15;
    performanceScore = Math.max(0, performanceScore);

    // Reliability score (0-100)
    let reliabilityScore = 100;
    if (errorRate > 0) reliabilityScore -= Math.min(50, errorRate * 10);
    if (memoryUsage > 0.8) reliabilityScore -= 20;
    reliabilityScore = Math.max(0, reliabilityScore);

    // Security score (default good, would need actual security checks)
    const securityScore = 88;

    // Usability score based on interactions and errors
    let usabilityScore = 100;
    if (errorRate > 0) usabilityScore -= Math.min(30, errorRate * 5);
    usabilityScore = Math.max(0, usabilityScore);

    return {
      performance: Math.round(performanceScore),
      reliability: Math.round(reliabilityScore),
      security: securityScore,
      usability: Math.round(usabilityScore)
    };
  }, [performance]);

  const calculateOverallHealth = useCallback((scores: SystemHealth['scores']): SystemHealth['overall'] => {
    const average = (scores.performance + scores.reliability + scores.security + scores.usability) / 4;
    
    if (average >= 90) return 'excellent';
    if (average >= 75) return 'good';
    if (average >= 60) return 'fair';
    return 'poor';
  }, []);

  const generateRecommendations = useCallback((scores: SystemHealth['scores']): string[] => {
    const recommendations: string[] = [];

    if (scores.performance < 80) {
      recommendations.push('Consider optimizing render performance and reducing load times');
    }
    if (scores.reliability < 80) {
      recommendations.push('Address error handling and memory usage optimization');
    }
    if (scores.security < 80) {
      recommendations.push('Review security protocols and implement additional safeguards');
    }
    if (scores.usability < 80) {
      recommendations.push('Improve user experience and reduce interaction friction');
    }

    if (performance.memoryUsage > 0.8) {
      recommendations.push('High memory usage detected - consider memory optimization');
    }
    if (performance.networkLatency > 1000) {
      recommendations.push('High network latency - consider CDN or server optimization');
    }
    if (performance.errorRate > 5) {
      recommendations.push('High error rate - implement better error handling');
    }

    return recommendations;
  }, [performance]);

  const resetMetrics = useCallback(() => {
    setPerformance({
      renderTime: 0,
      loadTime: 0,
      memoryUsage: 0,
      networkLatency: 0,
      errorRate: 0,
      userInteractions: 0,
      apiResponseTimes: {}
    });
    setErrors([]);
  }, []);

  const getPerformanceReport = useCallback(async () => {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        metrics: performance,
        systemHealth,
        realTimeData: realTimeMetrics,
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        },
        session: {
          duration: Date.now() - (window.performance?.timing?.navigationStart || 0),
          errors: errors.length,
          interactions: performance.userInteractions
        }
      };

      // Store report for later analysis
      localStorage.setItem('wem-performance-report', JSON.stringify(report));
      
      return report;
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw error;
    }
  }, [performance, systemHealth, realTimeMetrics, errors]);

  const optimizePerformance = useCallback(async () => {
    try {
      // Client-side optimizations
      if (performance.memoryUsage > 0.8) {
        // Trigger garbage collection if available
        if ('gc' in window && typeof (window as any).gc === 'function') {
          (window as any).gc();
        }
      }

      // Clear old cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.includes('old') || name.includes('temp')
        );
        await Promise.all(oldCaches.map(name => caches.delete(name)));
      }

      // Optimize image loading
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (img instanceof HTMLImageElement && img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
      });

      // Create optimization task
      await schedulerService.createTask({
        name: 'Performance Optimization',
        description: 'Automated performance optimization task',
        type: 'optimization',
        schedule: {
          pattern: 'daily',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        config: {
          parameters: {
            optimizationType: 'client-side',
            metrics: performance
          },
          notifications: {
            onSuccess: true,
            onFailure: true,
            recipients: ['admin@example.com']
          }
        },
        status: 'active',
        priority: 'medium',
        createdBy: 'system'
      });

    } catch (error) {
      console.error('Error optimizing performance:', error);
      addError(new Error('Performance optimization failed'));
    }
  }, [performance]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    updateMetrics({ errorRate: 0 });
  }, []);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Remove event listeners
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    
    const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
    interactionEvents.forEach(event => {
      document.removeEventListener(event, trackUserInteraction);
    });
  }, [handleError, handleUnhandledRejection, trackUserInteraction]);

  return {
    performance,
    systemHealth,
    realTimeMetrics,
    isConnected,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getPerformanceReport,
    optimizePerformance,
    errors,
    clearErrors
  };
}

// Performance DevTools Component for Development
export function PerformanceDevTools() {
  const {
    performance,
    systemHealth,
    isConnected,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    errors,
    clearErrors
  } = useAdvancedPerformance();

  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance DevTools"
      >
        📊
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Health:</span>
              <span className={`font-medium ${
                systemHealth.overall === 'excellent' ? 'text-green-600' :
                systemHealth.overall === 'good' ? 'text-blue-600' :
                systemHealth.overall === 'fair' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {systemHealth.overall}
              </span>
            </div>
            
            <div className="border-t pt-2">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Metrics:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>Render: {Math.round(performance.renderTime)}ms</div>
                <div>Load: {Math.round(performance.loadTime)}ms</div>
                <div>Memory: {Math.round(performance.memoryUsage * 100)}%</div>
                <div>Errors: {performance.errorRate}</div>
              </div>
            </div>
            
            {errors.length > 0 && (
              <div className="border-t pt-2">
                <div className="text-xs text-red-600 mb-1">Recent Errors:</div>
                <div className="text-xs text-red-500 max-h-20 overflow-y-auto">
                  {errors.slice(-3).map((error, index) => (
                    <div key={index} className="truncate">{error.message}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => startMonitoring()}
                disabled={isConnected}
                className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-50"
              >
                Start
              </button>
              <button
                onClick={stopMonitoring}
                disabled={!isConnected}
                className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs disabled:opacity-50"
              >
                Stop
              </button>
              <button
                onClick={resetMetrics}
                className="flex-1 px-2 py-1 bg-gray-600 text-white rounded text-xs"
              >
                Reset
              </button>
            </div>
            
            {errors.length > 0 && (
              <button
                onClick={clearErrors}
                className="w-full px-2 py-1 bg-yellow-600 text-white rounded text-xs"
              >
                Clear Errors
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}