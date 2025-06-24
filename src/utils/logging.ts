
import { config } from '@/config/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output based on environment
    if (config.development.enableDebugLogs || level >= LogLevel.WARN) {
      const logMethod = this.getConsoleMethod(level);
      const formattedMessage = this.formatMessage(entry);
      
      if (error) {
        logMethod(formattedMessage, error);
      } else {
        logMethod(formattedMessage, context);
      }
    }

    // Send to external logging service in production
    if (config.app.environment === 'production' && level >= LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    return `[${timestamp}] ${level}: ${entry.message}`;
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // In production, replace with your logging service (e.g., LogRocket, Datadog)
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = Logger.getInstance();

// Convenience functions
export const logDebug = (message: string, context?: Record<string, any>) => 
  logger.debug(message, context);

export const logInfo = (message: string, context?: Record<string, any>) => 
  logger.info(message, context);

export const logWarn = (message: string, context?: Record<string, any>) => 
  logger.warn(message, context);

export const logError = (message: string, error?: Error, context?: Record<string, any>) => 
  logger.error(message, error, context);
