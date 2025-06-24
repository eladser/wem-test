
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building, CheckCircle, Zap, TrendingUp } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

interface MetricsCardsProps {
  totalSites: number;
  onlineSites: number;
  totalCapacity: number;
  totalOutput: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = React.memo(({
  totalSites,
  onlineSites,
  totalCapacity,
  totalOutput
}) => {
  const { logRenderTime } = usePerformance('MetricsCards');

  const metrics = useMemo(() => [
    {
      title: "Total Sites",
      value: totalSites,
      icon: Building,
      format: (val: number) => val.toString()
    },
    {
      title: "Online Sites", 
      value: onlineSites,
      icon: CheckCircle,
      format: (val: number) => val.toString()
    },
    {
      title: "Total Capacity",
      value: totalCapacity,
      icon: Zap,
      format: (val: number) => `${val.toFixed(1)} MW`
    },
    {
      title: "Current Output",
      value: totalOutput,
      icon: TrendingUp,
      format: (val: number) => `${val.toFixed(1)} MW`
    }
  ], [totalSites, onlineSites, totalCapacity, totalOutput]);

  logRenderTime();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.format(metric.value)}</p>
              </div>
              <metric.icon className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

MetricsCards.displayName = 'MetricsCards';
