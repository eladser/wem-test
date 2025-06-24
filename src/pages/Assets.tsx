
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Battery, Search, Filter, MoreHorizontal } from "lucide-react";

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const assets = [
    {
      id: "INV-001",
      name: "Solar Inverter #1",
      type: "Inverter",
      site: "Site A - Main Campus",
      status: "online",
      power: "8.5 kW",
      efficiency: "94.2%",
      lastUpdate: "2 min ago",
      icon: Zap
    },
    {
      id: "BAT-001",
      name: "Battery Pack #1",
      type: "Battery",
      site: "Site A - Main Campus",
      status: "charging",
      power: "12.3 kW",
      efficiency: "96.8%",
      lastUpdate: "1 min ago",
      icon: Battery
    },
    {
      id: "INV-002",
      name: "Solar Inverter #2",
      type: "Inverter",
      site: "Site B - Warehouse",
      status: "maintenance",
      power: "0 kW",
      efficiency: "0%",
      lastUpdate: "2 hours ago",
      icon: Zap
    },
    {
      id: "BAT-002",
      name: "Battery Pack #2",
      type: "Battery",
      site: "Site B - Warehouse",
      status: "online",
      power: "7.8 kW",
      efficiency: "92.1%",
      lastUpdate: "3 min ago",
      icon: Battery
    },
    {
      id: "INV-003",
      name: "Solar Inverter #3",
      type: "Inverter",
      site: "Site C - Office Complex",
      status: "warning",
      power: "6.2 kW",
      efficiency: "87.5%",
      lastUpdate: "5 min ago",
      icon: Zap
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "charging": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "maintenance": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return "●";
      case "charging": return "⚡";
      case "warning": return "⚠";
      case "maintenance": return "🔧";
      default: return "●";
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Asset Management</h1>
          <p className="text-slate-400 mt-1">Monitor and control your renewable energy assets</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          Add Asset
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search assets, sites, or types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <asset.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{asset.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{asset.id}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <Badge className={getStatusColor(asset.status)}>
                  {getStatusIcon(asset.status)} {asset.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Site</span>
                  <span className="text-white text-sm font-medium">{asset.site}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Power Output</span>
                  <span className="text-white text-sm font-medium">{asset.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Efficiency</span>
                  <span className="text-white text-sm font-medium">{asset.efficiency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Last Update</span>
                  <span className="text-slate-400 text-sm">{asset.lastUpdate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No assets found</h3>
            <p className="text-slate-400">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assets;
