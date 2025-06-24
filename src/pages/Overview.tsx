
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { MapPin, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { mockRegions } from "@/services/mockDataService";

const Overview = () => {
  const totalSites = mockRegions.reduce((acc, region) => acc + region.sites.length, 0);
  const onlineSites = mockRegions.reduce((acc, region) => 
    acc + region.sites.filter(site => site.status === 'online').length, 0
  );
  const totalCapacity = mockRegions.reduce((acc, region) => 
    acc + region.sites.reduce((siteAcc, site) => siteAcc + site.totalCapacity, 0), 0
  );
  const totalOutput = mockRegions.reduce((acc, region) => 
    acc + region.sites.reduce((siteAcc, site) => siteAcc + site.currentOutput, 0), 0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "maintenance": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "offline": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-in-left">
        <h1 className="text-3xl font-bold text-white">Energy Management Overview</h1>
        <p className="text-slate-400 mt-1">Monitor and manage renewable energy across all regions</p>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Sites</CardTitle>
            <MapPin className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSites}</div>
            <p className="text-xs text-green-400">{onlineSites} online</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Capacity</CardTitle>
            <Zap className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCapacity.toFixed(1)} kW</div>
            <p className="text-xs text-slate-400">Installed capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Output</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalOutput.toFixed(1)} kW</div>
            <p className="text-xs text-emerald-400">Real-time generation</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {((totalOutput / totalCapacity) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-cyan-400">System average</p>
          </CardContent>
        </Card>
      </div>

      {/* Regions and Sites */}
      <div className="space-y-6">
        {mockRegions.map((region, regionIndex) => (
          <Card key={region.id} className="bg-slate-900/50 border-slate-700 animate-fade-in" style={{ animationDelay: `${regionIndex * 0.1}s` }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>{region.name}</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {region.sites.length} sites in this region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {region.sites.map((site, siteIndex) => (
                  <Card key={site.id} className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 transition-all duration-200 group animate-fade-in" style={{ animationDelay: `${siteIndex * 0.05}s` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{site.name}</h4>
                        <Badge className={getStatusColor(site.status)}>
                          {site.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location</span>
                          <span className="text-slate-300">{site.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Capacity</span>
                          <span className="text-white font-medium">{site.totalCapacity} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Output</span>
                          <span className="text-white font-medium">{site.currentOutput} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Efficiency</span>
                          <span className="text-white font-medium">{site.efficiency}%</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button asChild variant="outline" size="sm" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                          <NavLink to={`/site/${site.id}`}>
                            View Dashboard
                          </NavLink>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Alerts */}
      <Card className="bg-slate-900/50 border-slate-700 animate-slide-in-up">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span>System Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Battery optimization recommended</p>
                  <p className="text-slate-400 text-sm">Main Campus - Battery Pack #1</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Site offline</p>
                  <p className="text-slate-400 text-sm">Office Complex - Maintenance mode</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
