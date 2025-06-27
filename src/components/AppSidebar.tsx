import { Home, MapPin, Users, Settings, BarChart3, Zap, Package, Search, ChevronDown, ChevronRight, Bell, Activity, Gauge, Filter, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockRegions } from "@/services/mockDataService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(mockRegions.map(r => r.id)));
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const mainNavItems = [
    { title: "Overview", url: "/", icon: Home },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Assets", url: "/assets", icon: Package },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  // Optimized filtering logic for scalability
  const filteredData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    return mockRegions.map(region => {
      const matchingRegion = region.name.toLowerCase().includes(searchLower);
      
      const filteredSites = region.sites.filter(site => {
        const matchesSearch = site.name.toLowerCase().includes(searchLower) ||
                            site.id.toLowerCase().includes(searchLower) ||
                            site.location.toLowerCase().includes(searchLower);
        const matchesStatus = !showOnlineOnly || site.status === 'online';
        return matchesSearch && matchesStatus;
      });

      return {
        ...region,
        sites: filteredSites,
        visible: matchingRegion || filteredSites.length > 0
      };
    }).filter(region => region.visible);
  }, [searchTerm, showOnlineOnly]);

  const totalSites = useMemo(() => 
    filteredData.reduce((acc, region) => acc + region.sites.length, 0), 
    [filteredData]
  );

  const onlineSites = useMemo(() => 
    filteredData.reduce((acc, region) => 
      acc + region.sites.filter(site => site.status === 'online').length, 0
    ), [filteredData]
  );

  const toggleRegion = useCallback((regionId: string) => {
    setExpandedRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(regionId)) {
        newSet.delete(regionId);
      } else {
        newSet.add(regionId);
      }
      return newSet;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setShowOnlineOnly(false);
  }, []);

  return (
    <Sidebar className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      {/* Fixed Header */}
      <SidebarHeader className="p-4 border-b border-slate-700 bg-slate-900 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">WEM</h2>
            <p className="text-xs text-slate-400">Wise Energy Management</p>
          </div>
        </div>
        
        {/* Enhanced Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search regions & sites..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {searchTerm && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant={showOnlineOnly ? "default" : "outline"}
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`text-xs h-7 ${
                showOnlineOnly 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
              }`}
            >
              <Filter className="w-3 h-3 mr-1" />
              Online Only
            </Button>
            
            {(searchTerm || showOnlineOnly) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="text-xs h-7 text-slate-400 hover:text-white"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">
              {totalSites} sites total
            </span>
            <span className="text-emerald-400">
              {onlineSites} online
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent className="bg-slate-900 flex-1 overflow-hidden">
        <div className="p-3 h-full flex flex-col space-y-4">
          {/* Navigation Section */}
          <SidebarGroup className="flex-shrink-0">
            <SidebarGroupLabel className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider px-3 flex items-center">
              <BarChart3 className="w-3 h-3 mr-2" />
              NAVIGATION
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainNavItems.map((item) => {
                  const isActive = currentPath === item.url || (item.url !== "/" && currentPath.startsWith(item.url));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                          }`}
                        >
                          <div className={`p-1.5 rounded-md transition-colors duration-200 ${
                            isActive ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                          }`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-sm">{item.title}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Regions & Sites Section */}
          <SidebarGroup className="flex-1 overflow-hidden">
            <SidebarGroupLabel className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider flex items-center px-3">
              <MapPin className="w-3 h-3 mr-2" />
              REGIONS & SITES
              {(searchTerm || showOnlineOnly) && (
                <Badge variant="secondary" className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1">
                  {totalSites}
                </Badge>
              )}
            </SidebarGroupLabel>
            
            <SidebarGroupContent className="flex-1 overflow-hidden">
              {filteredData.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No sites found</p>
                  <p className="text-slate-500 text-xs mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <SidebarMenu className="space-y-2 pr-2">
                    {filteredData.map((region) => {
                      const isRegionActive = currentPath.includes(`/region/${region.id}`);
                      const isExpanded = expandedRegions.has(region.id);
                      
                      return (
                        <SidebarMenuItem key={region.id}>
                          <Collapsible open={isExpanded} onOpenChange={() => toggleRegion(region.id)}>
                            <div className="space-y-1">
                              {/* Region Header */}
                              <div className="flex items-center w-full gap-1">
                                <NavLink
                                  to={`/region/${region.id}`}
                                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 flex-1 min-w-0 ${
                                    isRegionActive
                                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                  }`}
                                >
                                  <div className="p-1.5 rounded-md bg-slate-700/50 flex-shrink-0">
                                    <MapPin className="w-3 h-3" />
                                  </div>
                                  <div className="flex items-center justify-between w-full min-w-0">
                                    <span className="font-medium text-sm truncate pr-2" title={region.name}>
                                      {region.name}
                                    </span>
                                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 px-1.5 py-0.5 flex-shrink-0">
                                      {region.sites.length}
                                    </Badge>
                                  </div>
                                </NavLink>
                                
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800/50 flex-shrink-0 h-8 w-8"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-3 h-3" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3" />
                                    )}
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                              
                              {/* Sites List */}
                              <CollapsibleContent className="ml-3 space-y-1">
                                {region.sites.map((site) => {
                                  const isSiteActive = currentPath.includes(`/site/${site.id}`);
                                  return (
                                    <SidebarMenuItem key={site.id}>
                                      <SidebarMenuButton asChild>
                                        <NavLink
                                          to={`/site/${site.id}`}
                                          className={`flex items-start px-3 py-3 rounded-lg transition-all duration-200 w-full ${
                                            isSiteActive
                                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                              : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                          }`}
                                        >
                                          <div className="flex items-start space-x-3 w-full min-w-0">
                                            {/* Status Indicator */}
                                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                                              site.status === 'online' ? 'bg-emerald-400' :
                                              site.status === 'maintenance' ? 'bg-yellow-400' : 
                                              'bg-red-400'
                                            }`} />
                                            
                                            {/* Site Information */}
                                            <div className="flex-1 min-w-0 space-y-1">
                                              {/* Site Name */}
                                              <div>
                                                <h4 className="text-sm font-medium text-white leading-tight truncate" title={site.name}>
                                                  {site.name}
                                                </h4>
                                                <p className="text-xs text-slate-400 truncate">
                                                  {site.location}
                                                </p>
                                              </div>
                                              
                                              {/* Capacity and Output - Simplified */}
                                              <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-300">
                                                  {site.currentOutput}/{site.totalCapacity}MW
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                  site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                                                  site.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' : 
                                                  'bg-red-500/20 text-red-400'
                                                }`}>
                                                  {Math.round((site.currentOutput / site.totalCapacity) * 100)}%
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </NavLink>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  );
                                })}
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </ScrollArea>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      {/* Fixed Footer */}
      <SidebarFooter className="p-4 border-t border-slate-700 bg-slate-900 flex-shrink-0">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/60 rounded-lg border border-slate-600/50 hover:bg-slate-700/60 transition-all duration-200 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="text-xs text-slate-400">System Administrator</p>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}