import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // Report error to monitoring service (e.g., Sentry, LogRocket, etc.)
    this.reportError(error, errorInfo);
    
    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to an error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(), // Implement this based on your auth system
    };

    // Example: Send to monitoring service
    // window.gtag?.('event', 'exception', {
    //   description: error.message,
    //   fatal: false
    // });

    console.log('Error reported:', errorReport);
  };

  private getUserId = () => {
    // Get user ID from your auth context/local storage
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => alert('Error details copied to clipboard'))
      .catch(() => console.log('Failed to copy error details'));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.state.error?.message.includes('fetch') || 
                           this.state.error?.message.includes('network');
      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">
                {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
              </CardTitle>
              <p className="text-slate-400">
                {isNetworkError 
                  ? 'Unable to connect to our servers. Please check your internet connection.'
                  : 'An unexpected error occurred. Our team has been notified.'
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error ID for support */}
              <Alert className="bg-slate-800 border-slate-600">
                <Bug className="h-4 w-4" />
                <AlertDescription className="text-slate-300">
                  <strong>Error ID:</strong> <code className="text-green-400">{this.state.errorId}</code>
                  <br />
                  <small>Please include this ID when contacting support.</small>
                </AlertDescription>
              </Alert>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again ({this.maxRetries - this.retryCount} left)
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Error details for development */}
              {(process.env.NODE_ENV === 'development' || this.props.showDetails) && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-300 mb-2">
                    Technical Details
                  </summary>
                  <div className="bg-slate-800 p-4 rounded-lg text-sm">
                    <div className="mb-4">
                      <Button 
                        onClick={this.copyErrorDetails}
                        size="sm"
                        variant="outline"
                        className="mb-2"
                      >
                        Copy Error Details
                      </Button>
                    </div>
                    
                    <div className="space-y-2 font-mono text-xs">
                      <div>
                        <strong className="text-red-400">Error:</strong>
                        <pre className="text-red-300 whitespace-pre-wrap mt-1">
                          {this.state.error?.message}
                        </pre>
                      </div>
                      
                      {this.state.error?.stack && (
                        <div>
                          <strong className="text-orange-400">Stack Trace:</strong>
                          <pre className="text-orange-300 whitespace-pre-wrap mt-1 max-h-32 overflow-y-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong className="text-blue-400">Component Stack:</strong>
                          <pre className="text-blue-300 whitespace-pre-wrap mt-1 max-h-32 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default EnhancedErrorBoundary;