
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { MapPin, Zap, TrendingUp, AlertCircle, Activity, BarChart3 } from "lucide-react";
import { mockRegions } from "@/services/mockDataService";

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

  const totalSites = region.sites.length;
  const onlineSites = region.sites.filter(site => site.status === 'online').length;
  const totalCapacity = region.sites.reduce((acc, site) => acc + site.totalCapacity, 0);
  const totalOutput = region.sites.reduce((acc, site) => acc + site.currentOutput, 0);
  const avgEfficiency = region.sites.reduce((acc, site) => acc + site.efficiency, 0) / totalSites;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "maintenance": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "offline": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Region Header */}
      <div className="animate-slide-in-left">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{region.name} Region</h1>
            <p className="text-slate-400 mt-1">Regional overview and site management</p>
          </div>
        </div>
      </div>

      {/* Regional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Sites</CardTitle>
            <MapPin className="h-4 w-4 text-violet-400" />
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
            <div className="text-2xl font-bold text-white">{totalCapacity.toFixed(1)} MW</div>
            <p className="text-xs text-slate-400">Regional capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Output</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalOutput.toFixed(1)} MW</div>
            <p className="text-xs text-emerald-400">Active generation</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-cyan-400">Regional average</p>
          </CardContent>
        </Card>
      </div>

      {/* Sites in Region */}
      <Card className="bg-slate-900/50 border-slate-700 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span>Sites in {region.name}</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Monitor and manage all energy sites in this region
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
                      <span className="text-white font-medium">{site.totalCapacity} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Output</span>
                      <span className="text-white font-medium">{site.currentOutput} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Efficiency</span>
                      <span className="text-white font-medium">{site.efficiency}%</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                      <NavLink to={`/site/${site.id}`}>
                        View Site
                      </NavLink>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                      <NavLink to={`/site/${site.id}/analytics`}>
                        <BarChart3 className="w-4 h-4" />
                      </NavLink>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Alerts */}
      <Card className="bg-slate-900/50 border-slate-700 animate-slide-in-up">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span>Regional Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Performance optimization available</p>
                  <p className="text-slate-400 text-sm">{region.name} - Multiple sites</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Weekly report available</p>
                  <p className="text-slate-400 text-sm">{region.name} - Regional summary</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionOverview;
