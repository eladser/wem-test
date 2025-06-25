
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Cpu, 
  HardDrive, 
  Network, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

export const EnhancedSystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 67,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      icon: Cpu
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      trend: 'up',
      icon: HardDrive
    },
    {
      id: 'temperature',
      name: 'Temperature',
      value: 42,
      unit: '°C',
      status: 'healthy',
      trend: 'stable',
      icon: Thermometer
    },
    {
      id: 'network',
      name: 'Network Load',
      value: 78,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: Network
    },
    {
      id: 'power',
      name: 'Power Consumption',
      value: 89,
      unit: 'kW',
      status: 'warning',
      trend: 'up',
      icon: Zap
    },
    {
      id: 'uptime',
      name: 'System Uptime',
      value: 99.8,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      icon: Clock
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10))
      })));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
      case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/40';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/40';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
      case 'stable': return <Activity className="w-3 h-3 text-slate-400" />;
      default: return null;
    }
  };

  const healthyCount = metrics.filter(m => m.status === 'healthy').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const criticalCount = metrics.filter(m => m.status === 'critical').length;

  return (
    <Card className="glass-card border-slate-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            System Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs">
              Live
            </Badge>
            <span className="text-xs text-slate-400">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-300">{healthyCount} Healthy</span>
          </div>
          {warningCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300">{warningCount} Warning</span>
            </div>
          )}
          {criticalCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-slate-300">{criticalCount} Critical</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 glass rounded-lg">
                  <metric.icon className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{metric.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{metric.value}{metric.unit}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(metric.status)} text-xs`}>
                {metric.status}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Progress 
                value={metric.value} 
                className="h-2 bg-slate-800"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0{metric.unit}</span>
                <span>100{metric.unit}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full glass border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            View Detailed Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
