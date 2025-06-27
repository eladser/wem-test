import React, { useMemo, useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Zap, 
  TrendingUp, 
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Settings,
  Eye
} from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Site {
  id: string;
  name: string;
  status: string;
  totalCapacity: number;
  currentOutput: number;
  location?: string;
  lastUpdated?: string;
}

interface Region {
  id: string;
  name: string;
  sites: Site[];
  location?: string;
  timezone?: string;
}

interface RegionCardProps {
  region: Region;
  index: number;
  showDetails?: boolean;
  onQuickAction?: (regionId: string, action: string) => void;
}

export const RegionCard: React.FC<RegionCardProps> = React.memo(({ 
  region, 
  index, 
  showDetails = false,
  onQuickAction 
}) => {
  const { logRenderTime } = usePerformance('RegionCard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const regionStats = useMemo(() => {
    const regionCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
    const regionOutput = region.sites.reduce((sum, site) => sum + site.currentOutput, 0);
    const efficiency = regionCapacity > 0 ? (regionOutput / regionCapacity) * 100 : 0;
    
    const statusCounts = region.sites.reduce((acc, site) => {
      acc[site.status] = (acc[site.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const onlineSites = statusCounts.online || 0;
    const maintenanceSites = statusCounts.maintenance || 0;
    const offlineSites = statusCounts.offline || 0;
    const uptime = region.sites.length > 0 ? (onlineSites / region.sites.length) * 100 : 0;
    
    // Calculate trends (mock data - in real app this would come from API)
    const trends = {
      efficiency: { value: 2.3, isPositive: true },
      capacity: { value: 8.1, isPositive: true },
      output: { value: -1.2, isPositive: false }
    };
    
    return { 
      regionCapacity, 
      regionOutput, 
      efficiency, 
      onlineSites, 
      maintenanceSites, 
      offlineSites,
      uptime,
      trends
    };
  }, [region.sites]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'maintenance':
        return <Clock className="w-3 h-3 text-amber-400" />;
      case 'offline':
        return <AlertTriangle className="w-3 h-3 text-red-400" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-slate-400" />;
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

  const getEfficiencyColor = useCallback((efficiency: number) => {
    if (efficiency >= 90) return 'text-emerald-400';
    if (efficiency >= 75) return 'text-amber-400';
    return 'text-red-400';
  }, []);

  const getUptimeColor = useCallback((uptime: number) => {
    if (uptime >= 95) return 'bg-emerald-500';
    if (uptime >= 85) return 'bg-amber-500';
    return 'bg-red-500';
  }, []);

  const handleQuickAction = useCallback((action: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAction?.(region.id, action);
  }, [region.id, onQuickAction]);

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  logRenderTime();

  return (
    <TooltipProvider>
      <div 
        className={`block animate-fade-in hover:scale-105 transition-all duration-300 ${
          isHovered ? 'z-10' : ''
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border-slate-700/50 
          hover:border-slate-600/50 transition-all duration-300 group ${
          isExpanded ? 'min-h-[400px]' : 'h-auto'
        }`}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-500/30">
                  <MapPin className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{region.name}</h3>
                  {region.location && (
                    <p className="text-xs text-slate-400">{region.location}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  {region.sites.length} sites
                </Badge>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleExpanded}
                  className="p-1 h-6 w-6 text-slate-400 hover:text-white"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-4">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400">Capacity</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {regionStats.regionCapacity.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">MW</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Output</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {regionStats.regionOutput.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">MW</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Efficiency</span>
                </div>
                <p className={`text-lg font-bold ${getEfficiencyColor(regionStats.efficiency)}`}>
                  {regionStats.efficiency.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Uptime Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">System Uptime</span>
                <span className="text-sm font-medium text-white">
                  {regionStats.uptime.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getUptimeColor(regionStats.uptime)}`}
                  style={{ width: `${regionStats.uptime}%` }}
                />
              </div>
            </div>

            {/* Status Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium">{regionStats.onlineSites}</span>
                  <span className="text-slate-400">online</span>
                </div>
                {regionStats.maintenanceSites > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-medium">{regionStats.maintenanceSites}</span>
                    <span className="text-slate-400">maintenance</span>
                  </div>
                )}
                {regionStats.offlineSites > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-white font-medium">{regionStats.offlineSites}</span>
                    <span className="text-slate-400">offline</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <NavLink 
                to={`/region/${region.id}`}
                className="flex-1"
              >
                <Button 
                  size="sm" 
                  className="w-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </NavLink>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleQuickAction('settings', e)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Region Settings</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleQuickAction('external', e)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>External Monitoring</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="space-y-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                {/* Trends Section */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Performance Trends
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Efficiency</p>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className={`w-3 h-3 ${
                          regionStats.trends.efficiency.isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          regionStats.trends.efficiency.isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {regionStats.trends.efficiency.isPositive ? '+' : ''}{regionStats.trends.efficiency.value}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Capacity</p>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className={`w-3 h-3 ${
                          regionStats.trends.capacity.isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          regionStats.trends.capacity.isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {regionStats.trends.capacity.isPositive ? '+' : ''}{regionStats.trends.capacity.value}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Output</p>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className={`w-3 h-3 ${
                          regionStats.trends.output.isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          regionStats.trends.output.isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {regionStats.trends.output.isPositive ? '+' : ''}{regionStats.trends.output.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sites Overview */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Sites Overview
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {region.sites.slice(0, 5).map((site) => (
                      <div
                        key={site.id}
                        className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getStatusIcon(site.status)}
                          <span className="text-sm text-white truncate" title={site.name}>
                            {site.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {site.currentOutput.toFixed(1)}/{site.totalCapacity.toFixed(1)} MW
                          </p>
                          <p className="text-xs text-slate-400">
                            {((site.currentOutput / site.totalCapacity) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    ))}
                    {region.sites.length > 5 && (
                      <p className="text-xs text-slate-400 text-center py-2">
                        +{region.sites.length - 5} more sites
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
});

RegionCard.displayName = 'RegionCard';