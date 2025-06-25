
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import { Search, ExternalLink, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { Site } from '@/types/energy';

interface LiveSiteMonitoringProps {
  sites: Site[];
}

export const LiveSiteMonitoring = ({ sites }: LiveSiteMonitoringProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-400';
      case 'maintenance': return 'bg-amber-400';
      case 'offline': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "bg-violet-600 hover:bg-violet-700" : "bg-slate-800 border-slate-600"}
          >
            All ({sites.length})
          </Button>
          <Button
            variant={statusFilter === "online" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("online")}
            className={statusFilter === "online" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-800 border-slate-600"}
          >
            Online ({sites.filter(s => s.status === 'online').length})
          </Button>
          <Button
            variant={statusFilter === "maintenance" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("maintenance")}
            className={statusFilter === "maintenance" ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-800 border-slate-600"}
          >
            Maintenance ({sites.filter(s => s.status === 'maintenance').length})
          </Button>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <Card key={site.id} className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusIndicator(site.status)} animate-pulse`} />
                  <CardTitle className="text-white text-lg">{site.name}</CardTitle>
                </div>
                <Badge className={`${getStatusColor(site.status)} text-xs`}>
                  {site.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{site.location}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Output</span>
                  </div>
                  <p className="text-white font-semibold">{site.currentOutput} MW</p>
                  <p className="text-xs text-slate-500">of {site.totalCapacity} MW</p>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">Efficiency</span>
                  </div>
                  <p className="text-white font-semibold">{site.efficiency}%</p>
                  <p className="text-xs text-emerald-400">+2.1% today</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-slate-400">Grid Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-amber-400">2 Alerts</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <NavLink to={`/site/${site.id}`} className="flex-1">
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View Details
                  </Button>
                </NavLink>
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700">
                  Monitor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Sites Found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};
