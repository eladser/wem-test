import { useEffect, useRef } from 'react';
import { PerformanceMetrics, PerformanceConfig } from '@/types/performance';

const defaultConfig: PerformanceConfig = {
  // Disable performance logging by default in development to reduce console noise
  enableLogging: import.meta.env.PROD || import.meta.env.VITE_ENABLE_PERFORMANCE_LOGS === 'true',
  threshold: 100,
  logLevel: 'info'
};

export const usePerformance = (
  componentName: string, 
  config: PerformanceConfig = defaultConfig
) => {
  const startTime = useRef<number>(Date.now());
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    // Component mounted
    mountTime.current = Date.now() - startTime.current;
    
    if (config.enableLogging) {
      const logLevel = mountTime.current > (config.threshold || 100) ? 'warn' : 'info';
      console[logLevel](`[Performance] ${componentName} mounted in ${mountTime.current}ms`);
    }

    return () => {
      // Component unmounted
      const unmountTime = Date.now() - startTime.current;
      if (config.enableLogging) {
        console.log(`[Performance] ${componentName} unmounted after ${unmountTime}ms`);
      }
    };
  }, [componentName, config]);

  const logRenderTime = (): number => {
    const renderTime = Date.now() - startTime.current;
    
    if (config.enableLogging) {
      const logLevel = renderTime > (config.threshold || 100) ? 'warn' : 'info';
      console[logLevel](`[Performance] ${componentName} rendered in ${renderTime}ms`);
    }
    
    return renderTime;
  };

  const getMetrics = (): PerformanceMetrics => ({
    componentName,
    renderTime: Date.now() - startTime.current,
    mountTime: mountTime.current || undefined
  });

  return { 
    logRenderTime, 
    mountTime: mountTime.current,
    getMetrics
  };
};

// Export a function to enable performance logging manually when needed
export const enablePerformanceLogging = () => {
  defaultConfig.enableLogging = true;
  console.log('[Performance] Performance logging enabled');
};

export const disablePerformanceLogging = () => {
  defaultConfig.enableLogging = false;
  console.log('[Performance] Performance logging disabled');
};
