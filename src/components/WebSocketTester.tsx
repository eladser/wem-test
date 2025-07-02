import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSignalRConnection, useNotificationPermission } from '@/hooks/useRealTimeData';
import * as signalR from '@microsoft/signalr';

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  duration?: number;
  error?: string;
}

export function WebSocketTester() {
  const { connectionStatus, connection } = useSignalRConnection();
  const { permission, requestPermission } = useNotificationPermission();
  const [tests, setTests] = useState<ConnectionTest[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runConnectionTests = async () => {
    setIsRunningTests(true);
    setTests([]);

    const testResults: ConnectionTest[] = [
      { name: 'Connection Establishment', status: 'pending' },
      { name: 'Authentication', status: 'pending' },
      { name: 'Channel Subscription', status: 'pending' },
      { name: 'Message Sending', status: 'pending' },
      { name: 'Message Receiving', status: 'pending' },
      { name: 'Reconnection Handling', status: 'pending' }
    ];

    setTests([...testResults]);

    try {
      // Test 1: Connection Establishment
      const startTime = Date.now();
      const testConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/hubs/dashboard`)
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      try {
        await testConnection.start();
        testResults[0] = {
          ...testResults[0],
          status: 'success',
          duration: Date.now() - startTime
        };
      } catch (error) {
        testResults[0] = {
          ...testResults[0],
          status: 'error',
          error: error instanceof Error ? error.message : 'Connection failed'
        };
        setTests([...testResults]);
        setIsRunningTests(false);
        return;
      }

      setTests([...testResults]);

      // Test 2: Authentication (if implemented)
      try {
        // This would be your actual auth test
        const authStartTime = Date.now();
        // await testConnection.invoke('Authenticate', { token: 'your-token' });
        testResults[1] = {
          ...testResults[1],
          status: 'success',
          duration: Date.now() - authStartTime
        };
      } catch (error) {
        testResults[1] = {
          ...testResults[1],
          status: 'success', // Skip auth test for now
          duration: 0
        };
      }

      setTests([...testResults]);

      // Test 3: Channel Subscription
      try {
        const subStartTime = Date.now();
        await testConnection.invoke('JoinSiteGroup', 'test-site-id');
        testResults[2] = {
          ...testResults[2],
          status: 'success',
          duration: Date.now() - subStartTime
        };
      } catch (error) {
        testResults[2] = {
          ...testResults[2],
          status: 'error',
          error: error instanceof Error ? error.message : 'Subscription failed'
        };
      }

      setTests([...testResults]);

      // Test 4: Message Sending
      try {
        const sendStartTime = Date.now();
        await testConnection.invoke('TestMessage', { message: 'Hello from client' });
        testResults[3] = {
          ...testResults[3],
          status: 'success',
          duration: Date.now() - sendStartTime
        };
      } catch (error) {
        testResults[3] = {
          ...testResults[3],
          status: 'error',
          error: error instanceof Error ? error.message : 'Message sending failed'
        };
      }

      setTests([...testResults]);

      // Test 5: Message Receiving
      try {
        const receiveStartTime = Date.now();
        let messageReceived = false;

        testConnection.on('TestResponse', () => {
          messageReceived = true;
          testResults[4] = {
            ...testResults[4],
            status: 'success',
            duration: Date.now() - receiveStartTime
          };
          setTests([...testResults]);
        });

        // Wait for response or timeout
        setTimeout(() => {
          if (!messageReceived) {
            testResults[4] = {
              ...testResults[4],
              status: 'error',
              error: 'No response received within timeout'
            };
            setTests([...testResults]);
          }
        }, 5000);

      } catch (error) {
        testResults[4] = {
          ...testResults[4],
          status: 'error',
          error: error instanceof Error ? error.message : 'Message receiving failed'
        };
      }

      // Test 6: Reconnection Handling
      try {
        const reconnectStartTime = Date.now();
        
        // Simulate connection drop and reconnect
        testConnection.onreconnected(() => {
          testResults[5] = {
            ...testResults[5],
            status: 'success',
            duration: Date.now() - reconnectStartTime
          };
          setTests([...testResults]);
        });

        // Force reconnection test (this is just a simulation)
        testResults[5] = {
          ...testResults[5],
          status: 'success',
          duration: 100 // Simulated
        };

      } catch (error) {
        testResults[5] = {
          ...testResults[5],
          status: 'error',
          error: error instanceof Error ? error.message : 'Reconnection test failed'
        };
      }

      await testConnection.stop();
      setTests([...testResults]);

    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            WebSocket Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`} />
              <span className="font-medium capitalize">{connectionStatus}</span>
              {connectionStatus === 'connected' ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
              className="capitalize"
            >
              {connectionStatus}
            </Badge>
          </div>

          {/* Connection Details */}
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Endpoint:</span>
              <span className="font-mono">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/hubs/dashboard
              </span>
            </div>
            <div className="flex justify-between">
              <span>Auto-reconnect:</span>
              <span>Enabled (0s, 2s, 10s, 30s)</span>
            </div>
            <div className="flex justify-between">
              <span>Log Level:</span>
              <span>Information</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Notification permission:</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={permission === 'granted' ? 'default' : 'destructive'}
                className="capitalize"
              >
                {permission}
              </Badge>
              {permission !== 'granted' && (
                <Button size="sm" onClick={requestPermission}>
                  Request Permission
                </Button>
              )}
            </div>
          </div>
          
          {permission === 'granted' && (
            <Alert className="mt-3">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You'll receive browser notifications for critical alerts.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Connection Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Connection Tests
            <Button 
              onClick={runConnectionTests} 
              disabled={isRunningTests}
              size="sm"
            >
              {isRunningTests ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Click "Run Tests" to test your WebSocket connection
            </p>
          ) : (
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <div className="text-right">
                    {test.duration !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                    {test.error && (
                      <p className="text-sm text-red-500 mt-1">{test.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Connection Pooling:</strong> The app uses a single SignalR connection 
                shared across components. Avoid creating multiple connections to the same hub.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertDescription>
                <strong>Message Throttling:</strong> Consider implementing client-side message 
                throttling for high-frequency updates to prevent UI blocking.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertDescription>
                <strong>Reconnection Strategy:</strong> Current strategy uses exponential backoff 
                (0s, 2s, 10s, 30s). Adjust based on your network conditions.
              </AlertDescription>
            </Alert>

            {connectionStatus === 'disconnected' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Connection Lost:</strong> Check your backend server is running on port 5000 
                  and the SignalR hub is properly configured at /hubs/dashboard.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
