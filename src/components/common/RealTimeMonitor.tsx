
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { theme } from '@/lib/theme';

interface MonitorData {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export const RealTimeMonitor: React.FC = () => {
  const [monitorData, setMonitorData] = useState<MonitorData[]>([
    {
      id: '1',
      name: 'Grid Power',
      currentValue: 2450,
      previousValue: 2380,
      unit: 'MW',
      status: 'normal',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Solar Generation',
      currentValue: 1850,
      previousValue: 1920,
      unit: 'MW',
      status: 'normal',
      trend: 'down'
    },
    {
      id: '3',
      name: 'Battery Storage',
      currentValue: 78,
      previousValue: 82,
      unit: '%',
      status: 'warning',
      trend: 'down'
    },
    {
      id: '4',
      name: 'System Efficiency',
      currentValue: 89.5,
      previousValue: 88.2,
      unit: '%',
      status: 'normal',
      trend: 'up'
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMonitorData(prev => prev.map(item => ({
        ...item,
        currentValue: item.currentValue + (Math.random() - 0.5) * 10,
        previousValue: item.currentValue,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
      })));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: MonitorData['status']) => {
    switch (status) {
      case 'normal': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'critical': return 'text-red-400';
    }
  };

  const getTrendIcon = (trend: MonitorData['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      case 'stable': return <Activity className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Activity className="w-5 h-5 text-emerald-400" />
          Real-Time Monitoring
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 ml-auto">
            Live
          </Badge>
        </CardTitle>
        <p className={`text-xs ${theme.colors.text.muted}`}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {monitorData.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-3 rounded-lg border ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-200`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                item.status === 'normal' ? 'bg-emerald-400' :
                item.status === 'warning' ? 'bg-amber-400' :
                'bg-red-400'
              }`} />
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${theme.colors.text.primary}`}>
                    {item.name}
                  </span>
                  {getTrendIcon(item.trend)}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-lg font-bold ${getStatusColor(item.status)}`}>
                    {item.currentValue.toFixed(1)}{item.unit}
                  </span>
                  <span className={`text-xs ${theme.colors.text.muted}`}>
                    ({item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}
                    {Math.abs(item.currentValue - item.previousValue).toFixed(1)})
                  </span>
                </div>
              </div>
            </div>
            {item.status !== 'normal' && (
              <AlertCircle className={`w-4 h-4 ${getStatusColor(item.status)}`} />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
