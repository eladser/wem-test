
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Users, Building, Activity, Globe } from 'lucide-react';

interface RegionMetricsGridProps {
  totalCapacity: number;
  totalCurrent: number;
  avgEfficiency: number;
  activeSites: number;
  totalSites: number;
}

export const RegionMetricsGrid = ({
  totalCapacity,
  totalCurrent,
  avgEfficiency,
  activeSites,
  totalSites
}: RegionMetricsGridProps) => {
  const utilizationRate = (totalCurrent / totalCapacity) * 100;
  const availabilityRate = (activeSites / totalSites) * 100;

  const metrics = [
    {
      title: "Total Capacity",
      value: `${totalCapacity.toFixed(1)} MW`,
      change: "+2.5%",
      trend: "up",
      icon: Zap,
      color: "emerald"
    },
    {
      title: "Current Output",
      value: `${totalCurrent.toFixed(1)} MW`,
      change: "+8.2%",
      trend: "up",
      icon: Activity,
      color: "blue"
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate.toFixed(1)}%`,
      change: "+1.2%",
      trend: "up",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Avg Efficiency",
      value: `${avgEfficiency.toFixed(1)}%`,
      change: "+0.8%",
      trend: "up",
      icon: Globe,
      color: "cyan"
    },
    {
      title: "Active Sites",
      value: `${activeSites}/${totalSites}`,
      change: "100%",
      trend: "stable",
      icon: Building,
      color: "green"
    },
    {
      title: "Availability",
      value: `${availabilityRate.toFixed(1)}%`,
      change: "+0.5%",
      trend: "up",
      icon: Users,
      color: "amber"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={metric.title} className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-500/10 border border-${metric.color}-500/20`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 bg-slate-800/50">
                Live
              </Badge>
            </div>
            
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              {metric.title}
            </h3>
            
            <div className="text-2xl font-bold text-white mb-2">
              {metric.value}
            </div>
            
            <div className={`flex items-center text-sm ${
              metric.trend === 'up' ? 'text-emerald-400' : 
              metric.trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                metric.trend === 'down' ? 'rotate-180' : 
                metric.trend === 'stable' ? 'rotate-90' : ''
              }`} />
              <span>{metric.change}</span>
              <span className="text-slate-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
