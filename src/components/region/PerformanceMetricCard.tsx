
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { theme } from '@/lib/theme';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
}

interface PerformanceMetricCardProps {
  metric: PerformanceMetric;
}

export const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({ metric }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <Card className="bg-slate-800/30 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs ${theme.colors.text.muted}`}>{metric.name}</span>
          {getTrendIcon(metric.trend)}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold ${theme.colors.text.primary}`}>
            {metric.value.toFixed(1)}
          </span>
          <span className={`text-sm ${theme.colors.text.muted}`}>{metric.unit}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${getChangeColor(metric.change)}`}>
            {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
          </span>
          {metric.target && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-blue-400" />
              <span className={`text-xs ${theme.colors.text.muted}`}>{metric.target}{metric.unit}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
