// Frontend Logger System

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

class Logger {
  private logLevel: LogLevel;
  private maxLogEntries: number = 1000;
  private logEntries: LogEntry[] = [];
  private isProduction: boolean;
  private apiEndpoint?: string;

  constructor() {
    this.logLevel = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
    this.isProduction = import.meta.env.PROD;
    this.apiEndpoint = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Listen for unhandled errors
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  private handleGlobalError(event: ErrorEvent) {
    this.error('Global error caught', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.error('Unhandled promise rejection', {
      reason: event.reason,
      stack: event.reason?.stack
    });
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
      stack: error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getUserId()
    };
  }

  private getUserId(): string | undefined {
    // Try to get user ID from localStorage or context
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).id : undefined;
    } catch {
      return undefined;
    }
  }

  private addLogEntry(entry: LogEntry) {
    this.logEntries.push(entry);
    
    // Keep only the last N entries
    if (this.logEntries.length > this.maxLogEntries) {
      this.logEntries = this.logEntries.slice(-this.maxLogEntries);
    }

    // Console output for development
    if (!this.isProduction) {
      this.outputToConsole(entry);
    }

    // Send to backend for ERROR and FATAL levels
    if (entry.level >= LogLevel.ERROR) {
      this.sendToBackend(entry);
    }
  }

  private outputToConsole(entry: LogEntry) {
    const timestamp = entry.timestamp.toISOString();
    const levelStr = LogLevel[entry.level];
    const message = `[${timestamp}] ${levelStr}: ${entry.message}`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.context, entry.error);
        break;
      case LogLevel.INFO:
        console.info(message, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message, entry.context, entry.error);
        break;
    }
  }

  private async sendToBackend(entry: LogEntry) {
    try {
      await fetch(`${this.apiEndpoint}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: entry.timestamp.toISOString(),
          level: LogLevel[entry.level],
          message: entry.message,
          context: entry.context,
          error: entry.error ? {
            name: entry.error.name,
            message: entry.error.message,
            stack: entry.error.stack
          } : undefined,
          url: entry.url,
          userAgent: entry.userAgent,
          userId: entry.userId
        })
      });
    } catch (error) {
      // Silently fail to avoid infinite loops
      console.error('Failed to send log to backend:', error);
    }
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.addLogEntry(this.createLogEntry(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: Record<string, any>) {
    if (this.logLevel <= LogLevel.INFO) {
      this.addLogEntry(this.createLogEntry(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: Record<string, any>) {
    if (this.logLevel <= LogLevel.WARN) {
      this.addLogEntry(this.createLogEntry(LogLevel.WARN, message, context));
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    if (this.logLevel <= LogLevel.ERROR) {
      this.addLogEntry(this.createLogEntry(LogLevel.ERROR, message, context, error));
    }
  }

  fatal(message: string, context?: Record<string, any>, error?: Error) {
    this.addLogEntry(this.createLogEntry(LogLevel.FATAL, message, context, error));
  }

  // Get recent log entries
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logEntries.slice(-count);
  }

  // Clear all logs
  clearLogs() {
    this.logEntries = [];
  }

  // Performance logging
  startPerformanceTimer(name: string) {
    performance.mark(`${name}-start`);
  }

  endPerformanceTimer(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      this.info(`Performance: ${name}`, {
        duration: measure.duration,
        startTime: measure.startTime
      });
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions
export const logDebug = (message: string, context?: Record<string, any>) => logger.debug(message, context);
export const logInfo = (message: string, context?: Record<string, any>) => logger.info(message, context);
export const logWarn = (message: string, context?: Record<string, any>) => logger.warn(message, context);
export const logError = (message: string, context?: Record<string, any>, error?: Error) => logger.error(message, context, error);
export const logFatal = (message: string, context?: Record<string, any>, error?: Error) => logger.fatal(message, context, error);

// HOC for logging component lifecycle
export function withLogging<T extends Record<string, any>>(WrappedComponent: React.ComponentType<T>, componentName: string) {
  return function LoggedComponent(props: T) {
    React.useEffect(() => {
      logger.debug(`${componentName} mounted`, { props });
      return () => {
        logger.debug(`${componentName} unmounted`);
      };
    }, []);

    return React.createElement(WrappedComponent, props);
  };
}

// Hook for logging
export function useLogger() {
  return {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError,
    fatal: logFatal,
    startTimer: logger.startPerformanceTimer.bind(logger),
    endTimer: logger.endPerformanceTimer.bind(logger)
  };
}