
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Battery, Search, Filter, MoreHorizontal, Loader2 } from "lucide-react";
import { dataService } from "@/services/dataService";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { sanitizeInput } from "@/utils/security";
import { Asset } from "@/types/energy";

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAsyncError } = useErrorHandler();

  useEffect(() => {
    const loadAssets = async () => {
      setIsLoading(true);
      
      const result = await handleAsyncError(
        async () => {
          const regions = await dataService.getRegions();
          const allAssets: Asset[] = [];
          
          for (const region of regions) {
            for (const site of region.sites) {
              const siteAssets = await dataService.getSiteAssets(site.id);
              allAssets.push(...siteAssets);
            }
          }
          
          return allAssets;
        },
        { customMessage: "Failed to load assets" },
        { component: "Assets", action: "loadAssets" }
      );

      if (result) {
        setAssets(result);
      }
      setIsLoading(false);
    };

    loadAssets();
  }, [handleAsyncError]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setSearchTerm(sanitizedValue);
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.siteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="ml-2 text-white">Loading assets...</span>
        </div>
      </div>
    );
  }

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
                onChange={handleSearchChange}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                maxLength={100}
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
                    {asset.type === 'battery' ? (
                      <Battery className="w-5 h-5 text-white" />
                    ) : (
                      <Zap className="w-5 h-5 text-white" />
                    )}
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
                  <span className="text-white text-sm font-medium">{asset.siteId}</span>
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

      {filteredAssets.length === 0 && !isLoading && (
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
