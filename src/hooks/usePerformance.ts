
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime?: number;
}

export const usePerformance = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    // Component mounted
    mountTime.current = Date.now() - startTime.current;
    console.log(`[Performance] ${componentName} mounted in ${mountTime.current}ms`);

    return () => {
      // Component unmounted
      const unmountTime = Date.now() - startTime.current;
      console.log(`[Performance] ${componentName} unmounted after ${unmountTime}ms`);
    };
  }, [componentName]);

  const logRenderTime = () => {
    const renderTime = Date.now() - startTime.current;
    console.log(`[Performance] ${componentName} rendered in ${renderTime}ms`);
    return renderTime;
  };

  return { logRenderTime, mountTime: mountTime.current };
};
