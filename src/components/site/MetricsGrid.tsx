
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Metric } from "@/types/energy";

interface MetricsGridProps {
  metrics: Metric[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = React.memo(({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={metric.title} 
          className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" 
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 text-${metric.color}-400 transition-transform hover:scale-110`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="flex items-center text-xs">
              <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === "up" ? "text-green-400" : "text-red-400"} transition-colors`} />
              <span className={metric.trend === "up" ? "text-green-400" : "text-red-400"}>
                {metric.change}
              </span>
              <span className="text-slate-400 ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

MetricsGrid.displayName = 'MetricsGrid';
