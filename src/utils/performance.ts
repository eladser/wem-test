
import { ComponentType, lazy } from 'react';
import { LazyComponentWithPreload, AsyncPerformanceResult } from '@/types/performance';

export const lazyWithPreload = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): LazyComponentWithPreload<React.ComponentProps<T>> => {
  const LazyComponent = lazy(importFunc) as LazyComponentWithPreload<React.ComponentProps<T>>;
  
  // Add preload method to the lazy component
  LazyComponent.preload = importFunc;
  
  return LazyComponent;
};

export const preloadComponent = (
  lazyComponent: LazyComponentWithPreload
): void => {
  if (lazyComponent.preload) {
    lazyComponent.preload();
  }
};

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void): number => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  console.log(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
  return duration;
};

export const measureAsyncPerformance = async <T>(
  name: string, 
  fn: () => Promise<T>
): Promise<AsyncPerformanceResult<T>> => {
  const start = performance.now();
  const timestamp = Date.now();
  
  try {
    const result = await fn();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
    
    return {
      result,
      duration,
      timestamp
    };
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

// Debounce utility with better typing
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility with better typing
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Create a performance observer for more detailed metrics
export const createPerformanceObserver = (
  callback: (entries: PerformanceEntry[]) => void
): PerformanceObserver | null => {
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });
    
    return observer;
  }
  
  return null;
};
