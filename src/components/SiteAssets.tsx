import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  TrendingUp, 
  Wrench, 
  Battery, 
  Sun, 
  Wind, 
  Search, 
  Filter, 
  Download,
  Settings,
  Activity,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw
} from "lucide-react";
import { getMockAssets } from "@/services/mockDataService";

const SiteAssets = () => {
  const { siteId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  
  const assets = getMockAssets(siteId || '');

  // Enhanced filtering
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
      const matchesType = typeFilter === "all" || asset.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, searchTerm, statusFilter, typeFilter]);

  // Asset statistics
  const stats = useMemo(() => ({
    total: assets.length,
    online: assets.filter(a => a.status === 'online' || a.status === 'charging').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    warning: assets.filter(a => a.status === 'warning').length,
    offline: assets.filter(a => a.status === 'offline').length,
    inverters: assets.filter(a => a.type === 'inverter').length,
    batteries: assets.filter(a => a.type === 'battery').length,
    solarPanels: assets.filter(a => a.type === 'solar_panel').length,
    windTurbines: assets.filter(a => a.type === 'wind_turbine').length,
  }), [assets]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'inverter': return Zap;
      case 'battery': return Battery;
      case 'solar_panel': return Sun;
      case 'wind_turbine': return Wind;
      default: return Zap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'charging': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'maintenance': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Asset Management</h2>
          <p className="text-slate-400">Monitor and manage all site assets and equipment</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Assets", value: stats.total, icon: Activity, color: "blue" },
          { title: "Online", value: stats.online, icon: TrendingUp, color: "emerald" },
          { title: "Maintenance", value: stats.maintenance, icon: Wrench, color: "orange" },
          { title: "Warnings", value: stats.warning, icon: AlertTriangle, color: "yellow" },
          { title: "Inverters", value: stats.inverters, icon: Zap, color: "purple" },
          { title: "Batteries", value: stats.batteries, icon: Battery, color: "cyan" }
        ].map((stat, index) => (
          <Card key={stat.title} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                <span className="text-xs text-slate-500">Live</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs text-slate-400">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Filtering and Search */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-white">Asset Inventory</CardTitle>
              <CardDescription className="text-slate-400">
                {filteredAssets.length} of {assets.length} assets shown
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="charging">Charging</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="inverter">Inverter</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="solar_panel">Solar Panel</SelectItem>
                  <SelectItem value="wind_turbine">Wind Turbine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-slate-800/50">
              <TabsTrigger value="overview">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map((asset, index) => {
                  const IconComponent = getAssetIcon(asset.type);
                  return (
                    <Card key={asset.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-slate-700/50">
                              <IconComponent className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-sm">{asset.name}</h4>
                              <p className="text-xs text-slate-400">{asset.id}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Type</span>
                            <span className="text-slate-300 capitalize">{asset.type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Power</span>
                            <span className="text-white font-medium">{asset.power}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Efficiency</span>
                            <span className="text-white font-medium">{asset.efficiency}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Updated</span>
                            <div className="flex items-center gap-1 text-slate-300">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{asset.lastUpdate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-700/50 flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs border-slate-600 text-slate-300 hover:text-white">
                            <Settings className="w-3 h-3 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs border-slate-600 text-slate-300 hover:text-white">
                            <Activity className="w-3 h-3 mr-1" />
                            Monitor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredAssets.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No assets found</h3>
                  <p className="text-slate-400">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="space-y-4">
              <div className="bg-slate-800/30 rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 border-b border-slate-700/50 text-sm font-medium text-slate-300">
                  <div>Asset</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Power</div>
                  <div>Efficiency</div>
                  <div>Actions</div>
                </div>
                
                {filteredAssets.map((asset, index) => {
                  const IconComponent = getAssetIcon(asset.type);
                  return (
                    <div key={asset.id} className="grid grid-cols-6 gap-4 p-4 border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors animate-fade-in" style={{ animationDelay: `${index * 0.02}s` }}>
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-slate-700/50">
                          <IconComponent className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{asset.name}</p>
                          <p className="text-xs text-slate-400">{asset.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-300 capitalize text-sm">
                        {asset.type.replace('_', ' ')}
                      </div>
                      <div className="flex items-center">
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-white font-medium text-sm">
                        {asset.power}
                      </div>
                      <div className="flex items-center text-white font-medium text-sm">
                        {asset.efficiency}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <Activity className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Overview</CardTitle>
                    <CardDescription className="text-slate-400">Asset efficiency metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredAssets.slice(0, 5).map((asset, index) => {
                        const efficiency = parseFloat(asset.efficiency.replace('%', ''));
                        return (
                          <div key={asset.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">{asset.name}</span>
                              <span className="text-white font-medium">{asset.efficiency}</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${efficiency}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Asset Health</CardTitle>
                    <CardDescription className="text-slate-400">Status distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { status: 'Online', count: stats.online, color: 'emerald' },
                        { status: 'Maintenance', count: stats.maintenance, color: 'orange' },
                        { status: 'Warning', count: stats.warning, color: 'yellow' },
                        { status: 'Offline', count: stats.offline, color: 'red' }
                      ].map((item, index) => (
                        <div key={item.status} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                            <span className="text-slate-300">{item.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{item.count}</span>
                            <span className="text-slate-400 text-sm">
                              ({Math.round((item.count / stats.total) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteAssets;
