import React, { useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building, CheckCircle, Zap, TrendingUp, AlertTriangle, Activity, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePerformance } from "@/hooks/usePerformance";

interface MetricsCardsProps {
  totalSites: number;
  onlineSites: number;
  totalCapacity: number;
  totalOutput: number;
  efficiency?: number;
  alerts?: number;
  lastUpdated?: string;
  isRealTime?: boolean;
}

interface MetricConfig {
  title: string;
  value: number;
  icon: React.ElementType;
  format: (val: number) => string;
  color: string;
  bgGradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  details?: {
    subtitle: string;
    progress?: number;
    progressColor?: string;
  };
  alerts?: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = React.memo(({
  totalSites,
  onlineSites,
  totalCapacity,
  totalOutput,
  efficiency = 0,
  alerts = 0,
  lastUpdated,
  isRealTime = false
}) => {
  const { logRenderTime } = usePerformance('MetricsCards');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const calculatedEfficiency = useMemo(() => {
    return totalCapacity > 0 ? (totalOutput / totalCapacity) * 100 : 0;
  }, [totalOutput, totalCapacity]);

  const offlineSites = totalSites - onlineSites;
  const uptime = totalSites > 0 ? (onlineSites / totalSites) * 100 : 0;

  const metrics = useMemo((): MetricConfig[] => [
    {
      title: "Total Sites",
      value: totalSites,
      icon: Building,
      format: (val: number) => val.toString(),
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      trend: {
        value: 8.3,
        isPositive: true,
        period: "vs last month"
      },
      details: {
        subtitle: `${onlineSites} online, ${offlineSites} offline`,
        progress: uptime,
        progressColor: uptime > 90 ? "bg-emerald-500" : uptime > 75 ? "bg-yellow-500" : "bg-red-500"
      }
    },
    {
      title: "Online Sites", 
      value: onlineSites,
      icon: CheckCircle,
      format: (val: number) => val.toString(),
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-green-500/20",
      trend: {
        value: 2.1,
        isPositive: true,
        period: "vs last week"
      },
      details: {
        subtitle: `${uptime.toFixed(1)}% uptime`,
        progress: uptime,
        progressColor: "bg-emerald-500"
      },
      alerts: offlineSites > 0 ? offlineSites : undefined
    },
    {
      title: "Total Capacity",
      value: totalCapacity,
      icon: Zap,
      format: (val: number) => `${val.toFixed(1)} MW`,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-violet-500/20",
      trend: {
        value: 12.8,
        isPositive: true,
        period: "capacity added"
      },
      details: {
        subtitle: `${calculatedEfficiency.toFixed(1)}% efficiency`,
        progress: calculatedEfficiency,
        progressColor: calculatedEfficiency > 90 ? "bg-emerald-500" : calculatedEfficiency > 75 ? "bg-yellow-500" : "bg-orange-500"
      }
    },
    {
      title: "Current Output",
      value: totalOutput,
      icon: TrendingUp,
      format: (val: number) => `${val.toFixed(1)} MW`,
      color: "text-amber-400",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      trend: {
        value: 5.7,
        isPositive: true,
        period: "vs average"
      },
      details: {
        subtitle: `Peak: ${(totalOutput * 1.15).toFixed(1)} MW`,
        progress: (totalOutput / totalCapacity) * 100,
        progressColor: "bg-amber-500"
      },
      alerts: alerts > 0 ? alerts : undefined
    }
  ], [totalSites, onlineSites, totalCapacity, totalOutput, calculatedEfficiency, uptime, offlineSites, alerts]);

  const handleCardClick = useCallback((title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  }, [expandedCard]);

  const getCardHeight = useCallback((title: string) => {
    return expandedCard === title ? "h-auto min-h-[200px]" : "h-32";
  }, [expandedCard]);

  logRenderTime();

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title} 
            className={`bg-gradient-to-br ${metric.bgGradient} backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 cursor-pointer group ${getCardHeight(metric.title)}`}
            onClick={() => handleCardClick(metric.title)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4 h-full flex flex-col">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  {metric.alerts && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {metric.alerts}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{metric.alerts} active alert{metric.alerts > 1 ? 's' : ''}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                
                {isRealTime && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400">Live</span>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color} mb-2`}>
                  {metric.format(metric.value)}
                </p>

                {/* Trend Information */}
                {metric.trend && (
                  <div className="flex items-center gap-1 mb-3">
                    <TrendingUp className={`w-3 h-3 ${
                      metric.trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`} />
                    <span className={`text-xs ${
                      metric.trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {metric.trend.isPositive ? '+' : '-'}{metric.trend.value}%
                    </span>
                    <span className="text-xs text-slate-500">
                      {metric.trend.period}
                    </span>
                  </div>
                )}

                {/* Progress and Details */}
                {metric.details && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {metric.details.subtitle}
                      </span>
                      {metric.details.progress !== undefined && (
                        <span className="text-xs text-slate-300">
                          {metric.details.progress.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    
                    {metric.details.progress !== undefined && (
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${metric.details.progressColor || 'bg-slate-500'}`}
                          style={{ width: `${Math.min(metric.details.progress, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {expandedCard === metric.title && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Status</span>
                      </div>
                      <p className="text-white font-medium">
                        {metric.title === "Total Sites" ? "All Systems" :
                         metric.title === "Online Sites" ? "Operational" :
                         metric.title === "Total Capacity" ? "Available" : "Active"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Updated</span>
                      </div>
                      <p className="text-white font-medium">
                        {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-3 text-slate-400 hover:text-white hover:bg-slate-700/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view details action
                    }}
                  >
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
});

MetricsCards.displayName = 'MetricsCards';