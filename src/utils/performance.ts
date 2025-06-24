
import { ComponentType, lazy } from 'react';

export const lazyWithPreload = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const LazyComponent = lazy(importFunc);
  
  // Add preload method to the lazy component
  (LazyComponent as any).preload = importFunc;
  
  return LazyComponent;
};

export const preloadComponent = (
  lazyComponent: ComponentType<any> & { preload?: () => Promise<any> }
) => {
  if (lazyComponent.preload) {
    lazyComponent.preload();
  }
};

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`[Performance] ${name} took ${(end - start).toFixed(2)}ms`);
};

export const measureAsyncPerformance = async <T>(
  name: string, 
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`[Performance] ${name} took ${(end - start).toFixed(2)}ms`);
  return result;
};

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};
