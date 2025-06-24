import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Wrench } from "lucide-react";
import SiteTopBar from "./SiteTopBar";
import { getMockAssets } from "@/services/mockDataService";

const SiteAssets = () => {
  const { siteId } = useParams();
  const assets = getMockAssets(siteId || '');

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Asset Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Assets", value: assets.length, icon: Zap, color: "emerald" },
            { title: "Online", value: assets.filter(a => a.status === 'online').length, icon: TrendingUp, color: "green" },
            { title: "Maintenance", value: assets.filter(a => a.status === 'maintenance').length, icon: Wrench, color: "amber" }
          ].map((stat, index) => (
            <Card key={stat.title} className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className={`text-xs text-${stat.color}-400`}>
                  {stat.title === "Total Assets" ? "Managed assets" : "Current status"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assets List */}
        <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Assets List</CardTitle>
            <CardDescription className="text-slate-400">Detailed information on each asset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset, index) => (
                <Card key={asset.id} className="bg-slate-800/50 border-emerald-900/20 hover:bg-slate-700/50 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{asset.name}</h4>
                      <Badge className={asset.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}>
                        {asset.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type</span>
                        <span className="text-slate-300">{asset.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Power</span>
                        <span className="text-white font-medium">{asset.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efficiency</span>
                        <span className="text-white font-medium">{asset.efficiency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Update</span>
                        <span className="text-slate-300">{asset.lastUpdate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteAssets;
