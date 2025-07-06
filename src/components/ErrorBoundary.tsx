import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logger.fatal('React Error Boundary caught an error', {
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }, error);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI - WITHOUT router hooks
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        onReload={this.handleReload}
        onReset={this.handleReset}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  onReload: () => void;
  onReset: () => void;
}

function ErrorFallback({ error, errorInfo, errorId, onReload, onReset }: ErrorFallbackProps) {
  const isProduction = import.meta.env.PROD;

  const handleGoHome = () => {
    // Use window.location instead of navigate to avoid router dependency
    window.location.href = '/';
  };

  const handleReportError = () => {
    // Create a bug report
    const bugReport = {
      errorId,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2))
      .then(() => {
        console.log('Error report copied to clipboard');
      })
      .catch(() => {
        console.log('Failed to copy error report');
      });
    
    // Create GitHub issue URL
    const errorMessage = error?.message || 'Unknown error';
    const stackTrace = error?.stack || 'No stack trace available';
    
    const issueBody = `**Error Report ID:** ${errorId}

**Error Message:** ${errorMessage}

**Stack Trace:**
\`\`\`
${stackTrace}
\`\`\`

**URL:** ${window.location.href}

**Timestamp:** ${new Date().toISOString()}`;
    
    const issueUrl = `https://github.com/eladser/wem-test/issues/new?title=${encodeURIComponent(`Error Report ${errorId}`)}&body=${encodeURIComponent(issueBody)}`;
    
    window.open(issueUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/20 p-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-lg">
            We're sorry, but an unexpected error occurred. Don't worry, we've been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error ID for support */}
          {errorId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Error ID for support:</p>
              <code className="text-sm text-muted-foreground">{errorId}</code>
            </div>
          )}

          {/* Error details (only in development) */}
          {!isProduction && error && (
            <div className="bg-destructive/10 p-4 rounded-lg">
              <p className="font-medium text-destructive mb-2">Error Details (Development):</p>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Message:</strong> {error.message}
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="mt-1 text-xs overflow-auto max-h-40 bg-background p-2 rounded border">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleGoHome} 
              className="flex-1"
              variant="default"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline" 
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={onReload} 
              variant="outline" 
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </div>

          {/* Report bug button */}
          <div className="text-center">
            <Button 
              onClick={handleReportError} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground"
            >
              <Bug className="h-4 w-4 mr-2" />
              Report this issue
            </Button>
          </div>

          {/* Help text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>If this problem persists, please contact support with the error ID above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorBoundary;

// Convenience wrapper for specific error types
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
