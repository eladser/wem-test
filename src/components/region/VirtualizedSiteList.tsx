import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import { Search, ExternalLink, Zap, TrendingUp, AlertTriangle, Filter, SortAsc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Site } from '@/types/energy';

interface VirtualizedSiteListProps {
  sites: Site[];
  height?: number;
}

interface SiteItemProps {
  site: Site;
  index: number;
}

const SiteItem = ({ site, index }: SiteItemProps) => {
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
    <div 
      className="px-2 pb-2 animate-fade-in" 
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Output</span>
              </div>
              <p className="text-white font-semibold">{site.currentOutput} MW</p>
              <p className="text-xs text-slate-500">of {site.totalCapacity} MW</p>
            </div>
            
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Efficiency</span>
              </div>
              <p className="text-white font-semibold">{Math.round((site.currentOutput / site.totalCapacity) * 100)}%</p>
              <p className="text-xs text-emerald-400">+2.1% today</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Grid Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-amber-400">2 Alerts</span>
            </div>
          </div>

          <div className="flex gap-2">
            <NavLink to={`/site/${site.id}`} className="flex-1">
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors">
                <ExternalLink className="w-3 h-3 mr-2" />
                View Details
              </Button>
            </NavLink>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Monitor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VirtualizedSiteList = ({ sites, height = 600 }: VirtualizedSiteListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");

  const filteredAndSortedSites = useMemo(() => {
    let filtered = sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || site.status === statusFilter;
      
      let matchesCapacity = true;
      if (capacityFilter === "small") matchesCapacity = site.totalCapacity < 50;
      else if (capacityFilter === "medium") matchesCapacity = site.totalCapacity >= 50 && site.totalCapacity < 100;
      else if (capacityFilter === "large") matchesCapacity = site.totalCapacity >= 100;
      
      return matchesSearch && matchesStatus && matchesCapacity;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'capacity': return b.totalCapacity - a.totalCapacity;
        case 'output': return b.currentOutput - a.currentOutput;
        case 'efficiency': return (b.currentOutput / b.totalCapacity) - (a.currentOutput / a.totalCapacity);
        default: return 0;
      }
    });

    return filtered;
  }, [sites, searchTerm, statusFilter, sortBy, capacityFilter]);

  return (
    <div className="space-y-4">
      {/* Advanced Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>

          <Select value={capacityFilter} onValueChange={setCapacityFilter}>
            <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">&lt; 50 MW</SelectItem>
              <SelectItem value="medium">50-100 MW</SelectItem>
              <SelectItem value="large">&gt; 100 MW</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
              <SelectItem value="output">Output</SelectItem>
              <SelectItem value="efficiency">Efficiency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>Showing {filteredAndSortedSites.length} of {sites.length} sites</span>
          {(searchTerm || statusFilter !== 'all' || capacityFilter !== 'all') && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filters applied</span>
            </div>
          )}
        </div>
      </div>

      {/* Site List - No longer virtualized but still scrollable */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden">
        {filteredAndSortedSites.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Sites Found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div 
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/30 scrollbar-track-slate-800"
            style={{ maxHeight: `${height}px` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {filteredAndSortedSites.map((site, index) => (
                <SiteItem key={site.id} site={site} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};