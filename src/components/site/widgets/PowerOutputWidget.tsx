
import React from 'react';
import { WidgetContainer } from './WidgetContainer';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PowerOutputWidgetProps {
  currentOutput: number;
  capacity: number;
  trend: number;
  onRemove?: () => void;
  className?: string;
}

export const PowerOutputWidget = ({ 
  currentOutput, 
  capacity, 
  trend, 
  onRemove,
  className 
}: PowerOutputWidgetProps) => {
  const efficiency = (currentOutput / capacity) * 100;
  const isPositiveTrend = trend >= 0;

  // Mock hourly data for the past 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    output: currentOutput + (Math.random() - 0.5) * 5
  }));

  return (
    <WidgetContainer 
      title="Power Output" 
      onRemove={onRemove}
      className={className}
    >
      <div className="space-y-4">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Current Output</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-400">{currentOutput}MW</span>
              <Badge 
                variant="outline" 
                className={`${isPositiveTrend ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}`}
              >
                {isPositiveTrend ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(trend)}%
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Efficiency</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{efficiency.toFixed(1)}%</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <XAxis dataKey="hour" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line 
                type="monotone" 
                dataKey="output" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <span className="text-sm text-slate-400">Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400">Optimal</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};
