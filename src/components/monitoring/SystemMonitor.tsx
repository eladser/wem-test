
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { theme } from '@/lib/theme';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  change: number;
  maxValue?: number;
}

export const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: '1',
      name: 'Grid Frequency',
      value: 50.02,
      unit: 'Hz',
      status: 'healthy',
      change: 0.01,
      maxValue: 60
    },
    {
      id: '2',
      name: 'Load Factor',
      value: 87.5,
      unit: '%',
      status: 'warning',
      change: -2.3,
      maxValue: 100
    },
    {
      id: '3',
      name: 'Energy Storage',
      value: 2450,
      unit: 'MWh',
      status: 'healthy',
      change: 12.5,
      maxValue: 3000
    },
    {
      id: '4',
      name: 'System Efficiency',
      value: 94.8,
      unit: '%',
      status: 'healthy',
      change: 1.2,
      maxValue: 100
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 5,
      status: Math.random() > 0.8 ? 'warning' : 'healthy'
    })));
    
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 2),
        change: (Math.random() - 0.5) * 3
      })));
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-400';
      case 'warning':
        return 'text-amber-400';
      case 'critical':
        return 'text-red-400';
    }
  };

  const getProgressColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Gauge className="w-5 h-5 text-emerald-400" />
            System Monitor
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Live
            </Badge>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className={`text-xs ${theme.colors.text.muted}`}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id} 
            className={`p-4 rounded-lg border ${theme.colors.border.primary} bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(metric.status)}
                <span className={`font-medium ${theme.colors.text.primary}`}>
                  {metric.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value.toFixed(1)}{metric.unit}
                </span>
                <div className="flex items-center">
                  {metric.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-xs ml-1 ${metric.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {metric.maxValue && (
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metric.status)}`}
                  style={{ width: `${Math.min((metric.value / metric.maxValue) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-emerald-400 font-bold text-lg">
                {metrics.filter(m => m.status === 'healthy').length}
              </div>
              <div className="text-xs text-slate-400">Healthy</div>
            </div>
            <div>
              <div className="text-amber-400 font-bold text-lg">
                {metrics.filter(m => m.status === 'warning').length}
              </div>
              <div className="text-xs text-slate-400">Warning</div>
            </div>
            <div>
              <div className="text-red-400 font-bold text-lg">
                {metrics.filter(m => m.status === 'critical').length}
              </div>
              <div className="text-xs text-slate-400">Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
