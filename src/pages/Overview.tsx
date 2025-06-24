import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRegions } from "@/services/mockDataService";
import { QuickActions } from "@/components/widgets/QuickActions";
import { SystemStatusMonitor } from "@/components/monitoring/SystemStatusMonitor";
import { SystemMonitor } from "@/components/monitoring/SystemMonitor";
import { EnergyAnalytics } from "@/components/widgets/EnergyAnalytics";
import { RealTimeMonitor } from "@/components/common/RealTimeMonitor";
import { 
  MapPin, 
  Zap, 
  TrendingUp, 
  Users, 
  Building, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { theme } from "@/lib/theme";

const Overview = () => {
  const totalSites = mockRegions.reduce((acc, region) => acc + region.sites.length, 0);
  const onlineSites = mockRegions.reduce((acc, region) => 
    acc + region.sites.filter(site => site.status === 'online').length, 0);
  const totalCapacity = mockRegions.reduce((acc, region) => 
    acc + region.sites.reduce((siteAcc, site) => siteAcc + site.totalCapacity, 0), 0);
  const totalOutput = mockRegions.reduce((acc, region) => 
    acc + region.sites.reduce((siteAcc, site) => siteAcc + site.currentOutput, 0), 0);

  const getStatusIcon = (status: string) => {
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
  };

  const getStatusColor = (status: string) => {
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-in-left">
        <h1 className={`text-3xl font-bold ${theme.colors.text.primary}`}>
          WEM Dashboard
        </h1>
        <p className={`${theme.colors.text.muted} text-lg`}>
          Monitor and manage your energy infrastructure across all regions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Total Sites</p>
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{totalSites}</p>
              </div>
              <Building className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Online Sites</p>
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{onlineSites}</p>
              </div>
              <CheckCircle className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Total Capacity</p>
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{totalCapacity.toFixed(1)} MW</p>
              </div>
              <Zap className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Current Output</p>
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{totalOutput.toFixed(1)} MW</p>
              </div>
              <TrendingUp className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="animate-fade-in">
        <EnergyAnalytics />
      </div>

      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-slide-in-left">
          <QuickActions />
        </div>
        <div className="animate-slide-in-up">
          <SystemStatusMonitor />
        </div>
        <div className="animate-slide-in-right">
          <SystemMonitor />
        </div>
      </div>

      {/* Real-Time Monitoring */}
      <div className="animate-slide-in-up">
        <RealTimeMonitor />
      </div>

      {/* Regions Grid */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary} animate-slide-in-up`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <MapPin className="w-5 h-5 text-emerald-400" />
            Regional Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRegions.map((region, index) => {
              const regionCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
              const regionOutput = region.sites.reduce((sum, site) => sum + site.currentOutput, 0);
              const efficiency = regionCapacity > 0 ? (regionOutput / regionCapacity) * 100 : 0;
              
              return (
                <NavLink 
                  key={region.id}
                  to={`/region/${region.id}`}
                  className="block animate-fade-in hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className={`${theme.colors.background.card} ${theme.colors.background.cardHover} ${theme.colors.border.primary} transition-all duration-200`}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${theme.colors.text.primary}`}>{region.name}</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {region.sites.length} sites
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={theme.colors.text.muted}>Capacity</span>
                          <span className={theme.colors.text.secondary}>{regionCapacity.toFixed(1)} MW</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme.colors.text.muted}>Output</span>
                          <span className={theme.colors.text.secondary}>{regionOutput.toFixed(1)} MW</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme.colors.text.muted}>Efficiency</span>
                          <span className={theme.colors.text.secondary}>{efficiency.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="w-3 h-3" />
                          <span className={theme.colors.text.muted}>Site Status</span>
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
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
