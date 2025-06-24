
import React, { useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

interface Site {
  id: string;
  name: string;
  status: string;
  totalCapacity: number;
  currentOutput: number;
}

interface Region {
  id: string;
  name: string;
  sites: Site[];
}

interface RegionCardProps {
  region: Region;
  index: number;
}

export const RegionCard: React.FC<RegionCardProps> = React.memo(({ region, index }) => {
  const { logRenderTime } = usePerformance('RegionCard');

  const regionStats = useMemo(() => {
    const regionCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
    const regionOutput = region.sites.reduce((sum, site) => sum + site.currentOutput, 0);
    const efficiency = regionCapacity > 0 ? (regionOutput / regionCapacity) * 100 : 0;
    
    return { regionCapacity, regionOutput, efficiency };
  }, [region.sites]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'maintenance':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'offline':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  }, []);

  logRenderTime();

  return (
    <NavLink 
      to={`/region/${region.id}`}
      className="block animate-fade-in hover:scale-105 transition-transform duration-200"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/60 border-slate-700/50 transition-all duration-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{region.name}</h3>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {region.sites.length} sites
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Capacity</span>
              <span className="text-slate-300">{regionStats.regionCapacity.toFixed(1)} MW</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Output</span>
              <span className="text-slate-300">{regionStats.regionOutput.toFixed(1)} MW</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Efficiency</span>
              <span className="text-slate-300">{regionStats.efficiency.toFixed(1)}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-3 h-3" />
              <span className="text-slate-400">Site Status</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {region.sites.map((site) => (
                <div
                  key={site.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(site.status)}`}
                >
                  {getStatusIcon(site.status)}
                  <span className="truncate max-w-[80px]">{site.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </NavLink>
  );
});

RegionCard.displayName = 'RegionCard';
