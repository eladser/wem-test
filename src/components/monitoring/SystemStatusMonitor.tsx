
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, Database, Globe, Server, Wifi } from 'lucide-react';
import { theme } from '@/lib/theme';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ReactNode;
  description: string;
}

const generateRandomMetric = (base: number, variance: number) => {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance));
};

export const SystemStatusMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      icon: <Cpu className="w-4 h-4" />,
      description: 'System processor utilization'
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      icon: <Server className="w-4 h-4" />,
      description: 'RAM utilization across all nodes'
    },
    {
      id: 'database',
      name: 'Database Load',
      value: 32,
      unit: '%',
      status: 'healthy',
      icon: <Database className="w-4 h-4" />,
      description: 'Database query performance'
    },
    {
      id: 'network',
      name: 'Network I/O',
      value: 76,
      unit: 'Mbps',
      status: 'warning',
      icon: <Wifi className="w-4 h-4" />,
      description: 'Network throughput'
    },
    {
      id: 'api',
      name: 'API Response',
      value: 98.5,
      unit: '%',
      status: 'healthy',
      icon: <Globe className="w-4 h-4" />,
      description: 'API availability and response time'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        let newValue;
        if (metric.id === 'api') {
          newValue = generateRandomMetric(98, 3);
        } else {
          newValue = generateRandomMetric(metric.value, 20);
        }
        
        let status: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (metric.id === 'api') {
          if (newValue < 95) status = 'critical';
          else if (newValue < 98) status = 'warning';
        } else {
          if (newValue > 85) status = 'critical';
          else if (newValue > 70) status = 'warning';
        }

        return { ...metric, value: newValue, status };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
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

  const overallStatus = metrics.some(m => m.status === 'critical') ? 'critical' :
                      metrics.some(m => m.status === 'warning') ? 'warning' : 'healthy';

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <CardTitle className={theme.colors.text.primary}>System Status</CardTitle>
          </div>
          <Badge className={getStatusColor(overallStatus)}>
            {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="text-sm font-medium text-white">{metric.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">
                  {metric.value.toFixed(metric.id === 'api' ? 1 : 0)}{metric.unit}
                </span>
                <Badge className={getStatusColor(metric.status)} variant="outline">
                  {metric.status}
                </Badge>
              </div>
            </div>
            <Progress
              value={metric.id === 'api' ? metric.value : Math.min(metric.value, 100)}
              className="h-2"
            />
            <p className="text-xs text-slate-400 mt-1">{metric.description}</p>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Last updated</span>
            <span className="text-white">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
