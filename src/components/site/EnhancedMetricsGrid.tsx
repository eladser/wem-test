
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Metric } from "@/types/energy";

interface EnhancedMetricsGridProps {
  metrics: Metric[];
}

export const EnhancedMetricsGrid: React.FC<EnhancedMetricsGridProps> = ({ metrics }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = (trend: string, change: string) => {
    if (trend === 'up') {
      return change.startsWith('+') ? 'text-emerald-400' : 'text-red-400';
    } else if (trend === 'down') {
      return change.startsWith('-') ? 'text-red-400' : 'text-emerald-400';
    }
    return 'text-slate-400';
  };

  const getCardGradient = (color: string) => {
    switch (color) {
      case 'green':
        return 'from-emerald-500/5 to-green-500/5 border-emerald-500/20 hover:border-emerald-400/40';
      case 'blue':
        return 'from-blue-500/5 to-cyan-500/5 border-blue-500/20 hover:border-blue-400/40';
      case 'emerald':
        return 'from-emerald-500/5 to-teal-500/5 border-emerald-500/20 hover:border-emerald-400/40';
      case 'cyan':
        return 'from-cyan-500/5 to-blue-500/5 border-cyan-500/20 hover:border-cyan-400/40';
      default:
        return 'from-slate-500/5 to-slate-600/5 border-slate-500/20 hover:border-slate-400/40';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={metric.title}
          className={`bg-gradient-to-br ${getCardGradient(metric.color)} backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group animate-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-6">
            {/* Header with icon and title */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-${metric.color}-500/10 rounded-2xl group-hover:bg-${metric.color}-500/20 transition-colors duration-300`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-1">
                    {metric.title}
                  </h3>
                </div>
              </div>
              
              <Badge 
                variant="outline"
                className={`${getTrendColor(metric.trend, metric.change)} border-current/20 text-xs`}
              >
                Live
              </Badge>
            </div>

            {/* Main value */}
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white tracking-tight">
                {metric.value}
              </div>
              
              {/* Trend indicator */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${getTrendColor(metric.trend, metric.change)}`}>
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm font-medium">
                    {metric.change}
                  </span>
                </div>
                
                <span className="text-xs text-slate-400">
                  vs yesterday
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400 rounded-full transition-all duration-1000 animate-pulse`}
                  style={{ 
                    width: `${Math.min(100, Math.max(0, 70 + (index * 10)))}%`,
                    animationDelay: `${index * 0.2}s`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
