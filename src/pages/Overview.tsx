
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, MapPin, Zap, TrendingUp, Users, Building, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SystemStatusMonitor } from "@/components/monitoring/SystemStatusMonitor";
import { QuickActions } from "@/components/widgets/QuickActions";
import { mockRegions } from "@/services/mockDataService";
import { theme } from "@/lib/theme";

const Overview = () => {
  const totalSites = mockRegions.reduce((sum, region) => sum + region.sites.length, 0);
  const totalCapacity = mockRegions.reduce((sum, region) => 
    sum + region.sites.reduce((siteSum, site) => siteSum + site.totalCapacity, 0), 0
  );
  const avgEfficiency = mockRegions.reduce((sum, region) => 
    sum + region.sites.reduce((siteSum, site) => siteSum + site.efficiency, 0), 0
  ) / totalSites;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className={`text-4xl font-bold ${theme.colors.text.primary} mb-2`}>
          Energy Management Overview
        </h1>
        <p className={`text-lg ${theme.colors.text.muted}`}>
          Monitor and control your energy infrastructure from a single dashboard
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} hover:scale-105 transition-transform duration-200`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Total Capacity</p>
                <p className={`text-3xl font-bold ${theme.colors.text.primary}`}>{totalCapacity.toFixed(1)} MW</p>
                <p className="text-xs text-emerald-400">+12% from last month</p>
              </div>
              <Zap className={`w-12 h-12 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} hover:scale-105 transition-transform duration-200`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Active Sites</p>
                <p className={`text-3xl font-bold ${theme.colors.text.primary}`}>{totalSites}</p>
                <p className="text-xs text-emerald-400">All operational</p>
              </div>
              <Building className={`w-12 h-12 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} hover:scale-105 transition-transform duration-200`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Avg Efficiency</p>
                <p className={`text-3xl font-bold ${theme.colors.text.primary}`}>{avgEfficiency.toFixed(1)}%</p>
                <p className="text-xs text-emerald-400">+5.2% optimized</p>
              </div>
              <TrendingUp className={`w-12 h-12 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} hover:scale-105 transition-transform duration-200`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme.colors.text.muted}`}>Regions</p>
                <p className={`text-3xl font-bold ${theme.colors.text.primary}`}>{mockRegions.length}</p>
                <p className="text-xs text-emerald-400">Multi-regional coverage</p>
              </div>
              <MapPin className={`w-12 h-12 ${theme.colors.text.accent}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemStatusMonitor />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Regions Grid */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <MapPin className="w-5 h-5 text-emerald-400" />
            Regional Overview
          </CardTitle>
          <CardDescription className={theme.colors.text.muted}>
            Monitor performance across all regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRegions.map((region, index) => (
              <Card 
                key={region.id} 
                className={`${theme.colors.background.card} border-slate-700 hover:border-emerald-500/50 transition-all duration-200 hover:scale-105 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${theme.colors.text.primary}`}>{region.name}</h4>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {region.sites.length} sites
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={theme.colors.text.muted}>Capacity</span>
                      <span className={theme.colors.text.primary}>
                        {region.sites.reduce((sum, site) => sum + site.totalCapacity, 0).toFixed(1)} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.colors.text.muted}>Current Output</span>
                      <span className={theme.colors.text.primary}>
                        {region.sites.reduce((sum, site) => sum + site.currentOutput, 0).toFixed(1)} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.colors.text.muted}>Efficiency</span>
                      <span className={theme.colors.text.primary}>
                        {(region.sites.reduce((sum, site) => sum + site.efficiency, 0) / region.sites.length).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <Link to={`/region/${region.id}`}>
                    <Button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 group">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
