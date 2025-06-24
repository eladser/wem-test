
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Trash2, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { toast } from 'sonner';

interface RequestMetric {
  requestId: string;
  endpoint: string;
  method: string;
  duration?: number;
  statusCode?: number;
  error?: string;
  startTime: number;
}

export const ApiGatewayMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<RequestMetric[]>([]);
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const requestMetrics = apiService.getRequestMetrics();
      const cacheData = apiService.getCacheStats();
      
      setMetrics(requestMetrics.slice(-20)); // Show last 20 requests
      setCacheStats(cacheData);
    } catch (error) {
      toast.error('Failed to refresh API Gateway data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearCache = () => {
    try {
      apiService.clearCache();
      toast.success('API cache cleared');
      refreshData();
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (statusCode?: number, error?: string) => {
    if (error) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
    }
    if (!statusCode) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
    }
    if (statusCode >= 400) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    return `${Math.round(duration)}ms`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
            <p className="text-xs text-muted-foreground">Last 20 requests shown</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Entries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.size}</div>
            <p className="text-xs text-muted-foreground">Active cache entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length > 0 
                ? Math.round(metrics.reduce((acc, m) => acc + (m.duration || 0), 0) / metrics.length)
                : 0}ms
            </div>
            <p className="text-xs text-muted-foreground">Average duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          onClick={clearCache}
          variant="outline"
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cache
        </Button>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent requests</p>
            ) : (
              metrics.map((metric) => (
                <div key={metric.requestId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{metric.method}</Badge>
                      <span className="font-mono text-sm">{metric.endpoint}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(metric.startTime)} • ID: {metric.requestId.slice(-8)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatDuration(metric.duration)}</span>
                    {getStatusBadge(metric.statusCode, metric.error)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cache Information */}
      {cacheStats.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cache Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cacheStats.keys.slice(0, 10).map((key, index) => (
                <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                  {key}
                </div>
              ))}
              {cacheStats.keys.length > 10 && (
                <p className="text-sm text-muted-foreground">
                  ...and {cacheStats.keys.length - 10} more entries
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
