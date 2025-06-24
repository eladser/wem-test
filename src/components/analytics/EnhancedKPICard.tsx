
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { theme } from "@/lib/theme";
import { StatusBadge } from "@/components/common/StatusBadge";

interface KPIData {
  title: string;
  value: string;
  previousValue?: string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendPercentage?: number;
  status?: "success" | "warning" | "error" | "pending";
  icon?: React.ReactNode;
  description?: string;
}

interface EnhancedKPICardProps {
  kpi: KPIData;
  className?: string;
}

export const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({ kpi, className = "" }) => {
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case "up":
        return "text-emerald-400";
      case "down":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusBadge = () => {
    if (!kpi.status) return null;
    return <StatusBadge status={kpi.status} className="ml-auto" />;
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} ${className} hover:bg-slate-800/60 transition-all duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {kpi.icon && (
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                {kpi.icon}
              </div>
            )}
            <div>
              <h3 className={`text-sm font-medium ${theme.colors.text.secondary}`}>
                {kpi.title}
              </h3>
              {kpi.description && (
                <p className={`text-xs ${theme.colors.text.muted} mt-1`}>
                  {kpi.description}
                </p>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${theme.colors.text.primary}`}>
              {kpi.value}
            </span>
            {kpi.unit && (
              <span className={`text-sm ${theme.colors.text.muted}`}>
                {kpi.unit}
              </span>
            )}
          </div>

          {kpi.trend && kpi.trendPercentage && (
            <div className={`flex items-center gap-2 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(kpi.trendPercentage)}%</span>
              <span className={theme.colors.text.muted}>
                vs previous period
              </span>
            </div>
          )}

          {kpi.previousValue && (
            <div className={`text-xs ${theme.colors.text.muted}`}>
              Previous: {kpi.previousValue} {kpi.unit}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
