
import { useEffect, useRef } from 'react';
import { PerformanceMetrics, PerformanceConfig } from '@/types/performance';

const defaultConfig: PerformanceConfig = {
  enableLogging: true,
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
