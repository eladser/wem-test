
import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRegions } from "@/services/mockDataService";
import { RegionAnalytics } from "@/components/region/RegionAnalytics";
import { AlertsManager } from "@/components/region/AlertsManager";
import { EnergyForecast } from "@/components/region/EnergyForecast";
import { TeamManager } from "@/components/region/TeamManager";
import { ExportManager } from "@/components/region/ExportManager";
import { SiteMonitoringGrid } from "@/components/region/SiteMonitoringGrid";
import { SitePerformanceAnalytics } from "@/components/region/SitePerformanceAnalytics";
import { AlertManagement } from "@/components/region/AlertManagement";
import { MapPin, Zap, TrendingUp, Users, Building } from "lucide-react";
import { theme } from "@/lib/theme";

const RegionOverview = () => {
  const { regionId } = useParams();
  const region = mockRegions.find(r => r.id === regionId);

  if (!region) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Region not found</p>
      </div>
    );
  }

  const totalCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
  const totalCurrent = region.sites.reduce((sum, site) => sum + site.currentOutput, 0);
  const avgEfficiency = region.sites.reduce((sum, site) => sum + site.efficiency, 0) / region.sites.length;

  return (
    <div className="space-y-6">
      {/* Region Header */}
      <div className="animate-slide-in-left">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-6 h-6 text-emerald-400" />
          <h1 className={`text-3xl font-bold ${theme.colors.text.primary}`}>{region.name}</h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {region.sites.length} sites
          </Badge>
        </div>
        <p className={`${theme.colors.text.muted} text-lg`}>
          Regional energy management and monitoring dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
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
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{totalCurrent.toFixed(1)} MW</p>
              </div>
              <TrendingUp className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Avg Efficiency</p>
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{avgEfficiency.toFixed(1)}%</p>
              </div>
              <Building className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Active Sites</p>
                <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>
                  {region.sites.filter(s => s.status === 'online').length}
                </p>
              </div>
              <Users className={`w-8 h-8 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
          <TabsTrigger value="sites" className="data-[state=active]:bg-slate-700">Live Sites</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">Performance</TabsTrigger>
          <TabsTrigger value="alert-mgmt" className="data-[state=active]:bg-slate-700">Alert Mgmt</TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-slate-700">Alerts</TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-slate-700">Forecast</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-slate-700">Team</TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-slate-700">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <RegionAnalytics />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsManager />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <EnergyForecast />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamManager />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <ExportManager />
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <SiteMonitoringGrid />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <SitePerformanceAnalytics />
        </TabsContent>

        <TabsContent value="alert-mgmt" className="space-y-6">
          <AlertManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegionOverview;
