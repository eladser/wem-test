
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Zap, Battery, Thermometer, Gauge, Clock, Target } from 'lucide-react';

interface MetricData {
  id: string;
  title: string;
  value: string;
  target?: string;
  progress?: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface PerformanceMetricsGridProps {
  className?: string;
}

export const PerformanceMetricsGrid = ({ className = "" }: PerformanceMetricsGridProps) => {
  const metrics: MetricData[] = [
    {
      id: 'energy-efficiency',
      title: 'Energy Efficiency',
      value: '94.2%',
      target: '95%',
      progress: 94.2,
      trend: 'up',
      change: '+2.1%',
      icon: Zap,
      color: 'emerald',
      status: 'excellent'
    },
    {
      id: 'capacity-factor',
      title: 'Capacity Factor',
      value: '87.5%',
      target: '90%',
      progress: 87.5,
      trend: 'up',
      change: '+4.3%',
      icon: Gauge,
      color: 'blue',
      status: 'good'
    },
    {
      id: 'availability',
      title: 'System Availability',
      value: '99.8%',
      target: '99.9%',
      progress: 99.8,
      trend: 'stable',
      change: '0.0%',
      icon: Clock,
      color: 'green',
      status: 'excellent'
    },
    {
      id: 'temperature',
      title: 'Avg Temperature',
      value: '42°C',
      target: '45°C',
      progress: 93.3,
      trend: 'down',
      change: '-1.2°C',
      icon: Thermometer,
      color: 'orange',
      status: 'good'
    },
    {
      id: 'battery-health',
      title: 'Battery Health',
      value: '96.7%',
      target: '95%',
      progress: 96.7,
      trend: 'up',
      change: '+0.5%',
      icon: Battery,
      color: 'purple',
      status: 'excellent'
    },
    {
      id: 'performance-index',
      title: 'Performance Index',
      value: '8.9/10',
      target: '9.0/10',
      progress: 89,
      trend: 'up',
      change: '+0.2',
      icon: Target,
      color: 'cyan',
      status: 'good'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {metrics.map((metric) => (
        <Card key={metric.id} className="glass border-slate-700/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-${metric.color}-500/10 border border-${metric.color}-500/20`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <Badge className={`${getStatusColor(metric.status)} text-xs`}>
                {metric.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">
                {metric.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{metric.value}</span>
                {metric.target && (
                  <span className="text-sm text-slate-500">/ {metric.target}</span>
                )}
              </div>
            </div>
            
            {metric.progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{metric.progress.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={metric.progress} 
                  className="h-2"
                />
              </div>
            )}
            
            <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
              {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {metric.trend === 'down' && <TrendingDown className="w-4 h-4" />}
              {metric.trend === 'stable' && <div className="w-4 h-4 flex items-center justify-center"><div className="w-3 h-0.5 bg-current"></div></div>}
              <span>{metric.change}</span>
              <span className="text-slate-500 ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
