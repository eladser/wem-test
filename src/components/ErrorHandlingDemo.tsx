import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useLogger } from '../utils/logger';
import { useErrorHandler } from '../utils/errorHandler';
import { toast } from '../hooks/use-toast';
import { AlertTriangle, Bug, Info, CheckCircle, Clock, Zap } from 'lucide-react';

/**
 * Demo component to test the logging and error handling system
 * This component shows how to use the logging and error handling utilities
 */
export function ErrorHandlingDemo() {
  const log = useLogger();
  const { handleError, NetworkError, ValidationError, AppError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const handleInfoLog = () => {
    log.info('Info log test', {
      component: 'ErrorHandlingDemo',
      action: 'infoLogTest',
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: 'Info Log Created',
      description: 'Check the console for the log entry',
      variant: 'default'
    });
  };

  const handleWarningLog = () => {
    log.warn('Warning log test', {
      component: 'ErrorHandlingDemo',
      action: 'warningLogTest',
      reason: 'User triggered warning for testing'
    });
    
    toast({
      title: 'Warning Log Created',
      description: 'Check the console and backend logs',
      variant: 'warning'
    });
  };

  const handleErrorLog = () => {
    const testError = new Error('Test error for logging system');
    testError.stack = 'Error: Test error\n    at handleErrorLog (ErrorHandlingDemo.tsx:45:25)';
    
    log.error('Error log test', {
      component: 'ErrorHandlingDemo',
      action: 'errorLogTest',
      severity: 'high'
    }, testError);
    
    toast({
      title: 'Error Log Created',
      description: 'Error sent to backend for analysis',
      variant: 'destructive'
    });
  };

  const handleNetworkError = () => {
    const networkError = new NetworkError('Simulated network timeout', {
      component: 'ErrorHandlingDemo',
      action: 'networkTest',
      endpoint: '/api/test'
    });
    
    handleError(networkError);
  };

  const handleValidationError = () => {
    const validationError = new ValidationError('Required field is missing', {
      component: 'ErrorHandlingDemo',
      action: 'validationTest',
      field: 'email'
    });
    
    handleError(validationError);
  };

  const handleUnexpectedError = () => {
    const unexpectedError = new AppError('Something unexpected happened', 500, false, {
      component: 'ErrorHandlingDemo',
      action: 'unexpectedTest'
    });
    
    handleError(unexpectedError);
  };

  const handleReactError = () => {
    // This will trigger the React Error Boundary
    throw new Error('Simulated React component error - this will be caught by ErrorBoundary');
  };

  const handlePerformanceTest = async () => {
    setIsLoading(true);
    
    log.startTimer('performance-test');
    log.info('Starting performance test');
    
    try {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      log.endTimer('performance-test');
      log.info('Performance test completed successfully');
      
      toast({
        title: 'Performance Test Complete',
        description: 'Check console for timing information',
        variant: 'success'
      });
    } catch (error) {
      log.error('Performance test failed', { component: 'ErrorHandlingDemo' }, error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsyncError = async () => {
    setIsLoading(true);
    
    try {
      // Simulate async operation that fails
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Async operation failed'));
        }, 1000);
      });
    } catch (error) {
      handleError(error as Error, {
        component: 'ErrorHandlingDemo',
        action: 'asyncTest'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Error Handling & Logging Demo
        </CardTitle>
        <CardDescription>
          Test the comprehensive logging and error handling system. 
          Check browser console, network tab, and backend logs to see the system in action.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logging Tests */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Logging Tests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={handleInfoLog}
              variant="outline"
              className="h-auto py-3 px-4 text-left"
            >
              <div>
                <div className="font-medium">Info Log</div>
                <div className="text-sm text-muted-foreground">Creates info-level log</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleWarningLog}
              variant="outline"
              className="h-auto py-3 px-4 text-left border-yellow-200 hover:bg-yellow-50"
            >
              <div>
                <div className="font-medium text-yellow-700">Warning Log</div>
                <div className="text-sm text-muted-foreground">Creates warning-level log</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleErrorLog}
              variant="outline"
              className="h-auto py-3 px-4 text-left border-red-200 hover:bg-red-50"
            >
              <div>
                <div className="font-medium text-red-700">Error Log</div>
                <div className="text-sm text-muted-foreground">Creates error-level log</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Error Handling Tests */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Error Handling Tests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={handleNetworkError}
              variant="outline"
              className="h-auto py-3 px-4 text-left"
            >
              <div>
                <div className="font-medium">Network Error</div>
                <div className="text-sm text-muted-foreground">Simulates API timeout</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleValidationError}
              variant="outline"
              className="h-auto py-3 px-4 text-left"
            >
              <div>
                <div className="font-medium">Validation Error</div>
                <div className="text-sm text-muted-foreground">Simulates form validation error</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleUnexpectedError}
              variant="outline"
              className="h-auto py-3 px-4 text-left"
            >
              <div>
                <div className="font-medium">Unexpected Error</div>
                <div className="text-sm text-muted-foreground">Simulates system error</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleReactError}
              variant="outline"
              className="h-auto py-3 px-4 text-left border-red-200 hover:bg-red-50"
            >
              <div>
                <div className="font-medium text-red-700">React Error</div>
                <div className="text-sm text-muted-foreground">Triggers Error Boundary</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Performance & Async Tests */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance & Async Tests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={handlePerformanceTest}
              variant="outline"
              className="h-auto py-3 px-4 text-left"
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                {isLoading && <Clock className="h-4 w-4 animate-spin" />}
                <div>
                  <div className="font-medium">Performance Test</div>
                  <div className="text-sm text-muted-foreground">Measures operation timing</div>
                </div>
              </div>
            </Button>
            
            <Button 
              onClick={handleAsyncError}
              variant="outline"
              className="h-auto py-3 px-4 text-left"
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                {isLoading && <Clock className="h-4 w-4 animate-spin" />}
                <div>
                  <div className="font-medium">Async Error</div>
                  <div className="text-sm text-muted-foreground">Simulates async failure</div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            What to Check:
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>Browser Console:</strong> See client-side logs and errors</li>
            <li>• <strong>Network Tab:</strong> Check API calls to /api/logs endpoint</li>
            <li>• <strong>Toast Notifications:</strong> User-friendly error messages</li>
            <li>• <strong>Backend Logs:</strong> Check server console and log files</li>
            <li>• <strong>Database:</strong> Visit /api/logs to see stored log entries</li>
            <li>• <strong>Error Statistics:</strong> Visit /api/logs/statistics for analytics</li>
          </ul>
        </div>

        {/* API Information */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-800">API Endpoints:</h4>
          <div className="text-sm space-y-1 text-blue-700">
            <div><code className="bg-blue-100 px-2 py-1 rounded">GET /api/logs</code> - View log entries</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">GET /api/logs/statistics</code> - Error analytics</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">POST /api/logs</code> - Create log entry</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">DELETE /api/logs/cleanup</code> - Cleanup old logs</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ErrorHandlingDemo;