
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime?: number;
  unmountTime?: number;
}

export interface PerformanceConfig {
  enableLogging?: boolean;
  threshold?: number;
  logLevel?: 'info' | 'warn' | 'error';
}

export interface AsyncPerformanceResult<T> {
  result: T;
  duration: number;
  timestamp: number;
}

export type PerformanceLogger = (metrics: PerformanceMetrics) => void;

export interface LazyComponentWithPreload<T = any> {
  (props: T): React.ReactElement | null;
  preload?: () => Promise<any>;
}

