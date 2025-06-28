import { Home, MapPin, Users, Settings, BarChart3, Zap, Package, Search, ChevronDown, ChevronRight, Bell, Activity, Gauge, Filter, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockRegions } from "@/services/mockDataService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(mockRegions.map(r => r.id)));
  const [expandedSubRegions, setExpandedSubRegions] = useState<Set<string>>(new Set());
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const mainNavItems = [
    { title: "Overview", url: "/", icon: Home },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Assets", url: "/assets", icon: Package },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  // Enhanced filtering logic for sub-regions
  const filteredData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    return mockRegions.map(region => {
      const matchingRegion = region.name.toLowerCase().includes(searchLower);
      
      // Process sub-regions if they exist
      const filteredSubRegions = region.subRegions?.map(subRegion => {
        const matchingSubRegion = subRegion.name.toLowerCase().includes(searchLower);
        
        const filteredSites = subRegion.sites.filter(site => {
          const matchesSearch = site.name.toLowerCase().includes(searchLower) ||
                              site.id.toLowerCase().includes(searchLower) ||
                              site.location.toLowerCase().includes(searchLower);
          const matchesStatus = !showOnlineOnly || site.status === 'online';
          return matchesSearch && matchesStatus;
        });

        return {
          ...subRegion,
          sites: filteredSites,
          visible: matchingSubRegion || filteredSites.length > 0
        };
      }).filter(subRegion => subRegion.visible) || [];

      // Also filter direct sites for backward compatibility
      const filteredDirectSites = region.sites.filter(site => {
        const matchesSearch = site.name.toLowerCase().includes(searchLower) ||
                            site.id.toLowerCase().includes(searchLower) ||
                            site.location.toLowerCase().includes(searchLower);
        const matchesStatus = !showOnlineOnly || site.status === 'online';
        return matchesSearch && matchesStatus;
      });

      const hasVisibleContent = matchingRegion || 
                                filteredSubRegions.length > 0 || 
                                filteredDirectSites.length > 0;

      return {
        ...region,
        sites: filteredDirectSites,
        subRegions: filteredSubRegions,
        visible: hasVisibleContent
      };
    }).filter(region => region.visible);
  }, [searchTerm, showOnlineOnly]);

  const totalSites = useMemo(() => 
    filteredData.reduce((acc, region) => {
      const directSites = region.sites.length;
      const subRegionSites = region.subRegions?.reduce((subAcc, subRegion) => 
        subAcc + subRegion.sites.length, 0) || 0;
      return acc + directSites + subRegionSites;
    }, 0), 
    [filteredData]
  );

  const onlineSites = useMemo(() => 
    filteredData.reduce((acc, region) => {
      const directOnline = region.sites.filter(site => site.status === 'online').length;
      const subRegionOnline = region.subRegions?.reduce((subAcc, subRegion) => 
        subAcc + subRegion.sites.filter(site => site.status === 'online').length, 0) || 0;
      return acc + directOnline + subRegionOnline;
    }, 0), 
    [filteredData]
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

  const toggleSubRegion = useCallback((subRegionId: string) => {
    setExpandedSubRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subRegionId)) {
        newSet.delete(subRegionId);
      } else {
        newSet.add(subRegionId);
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
    <div className="w-full h-full bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Fixed Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-900 shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-white text-lg truncate">WEM</h2>
            <p className="text-xs text-slate-400 truncate">Wise Energy Management</p>
          </div>
        </div>
        
        {/* Enhanced Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 text-slate-400 hover:text-white z-10"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center justify-between gap-2">
            <Button
              size="sm"
              variant={showOnlineOnly ? "default" : "outline"}
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`text-xs h-7 flex-1 ${
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
                className="text-xs h-7 px-2 text-slate-400 hover:text-white shrink-0"
              >
                Clear
              </Button>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex justify-between text-xs pt-1">
            <span className="text-slate-400">
              {totalSites} sites total
            </span>
            <span className="text-emerald-400">
              {onlineSites} online
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content with smooth animations */}
      <div className="bg-slate-900 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Navigation Section - Fixed */}
          <div className="shrink-0 p-3 pb-0">
            <div className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider px-3 flex items-center">
              <BarChart3 className="w-3 h-3 mr-2" />
              NAVIGATION
            </div>
            <div className="space-y-1 px-3">
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.url || (item.url !== "/" && currentPath.startsWith(item.url));
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className={`p-1.5 rounded-md transition-colors duration-200 shrink-0 ${
                      isActive ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm truncate">{item.title}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Regions & Sites Section - Scrollable */}
          <div className="flex-1 overflow-hidden flex flex-col p-3">
            <div className="text-slate-400 font-semibold mb-3 text-xs uppercase tracking-wider flex items-center px-3">
              <MapPin className="w-3 h-3 mr-2" />
              REGIONS & SITES
              {(searchTerm || showOnlineOnly) && (
                <Badge variant="secondary" className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1">
                  {totalSites}
                </Badge>
              )}
            </div>
            
            {/* Scrollable container with enhanced styling */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-smooth">
              {filteredData.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No sites found</p>
                  <p className="text-slate-500 text-xs mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  {filteredData.map((region) => {
                    const isRegionActive = currentPath.includes(`/region/${region.id}`);
                    const isExpanded = expandedRegions.has(region.id);
                    
                    return (
                      <div key={region.id} className="animate-fade-in">
                        <Collapsible open={isExpanded} onOpenChange={() => toggleRegion(region.id)}>
                          <div className="space-y-1">
                            {/* Region Header - Clean styling */}
                            <div className="flex items-stretch gap-1">
                              <NavLink
                                to={`/region/${region.id}`}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 flex-1 min-w-0 ${
                                  isRegionActive
                                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                }`}
                              >
                                <div className="p-1.5 rounded-md bg-slate-700/50 shrink-0">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex items-center justify-between w-full min-w-0">
                                  <span className="font-semibold text-sm truncate text-white" title={region.name}>
                                    {region.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 px-2 py-0.5 shrink-0 ml-2 bg-slate-800/50">
                                    {(region.subRegions?.reduce((acc, sub) => acc + sub.sites.length, 0) || 0) + region.sites.length}
                                  </Badge>
                                </div>
                              </NavLink>
                              
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-3 text-slate-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 shrink-0"
                                >
                                  <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                  </div>
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            
                            {/* Region Content - Sub-regions and Sites */}
                            <CollapsibleContent className="ml-4 overflow-hidden">
                              <div className="space-y-1 animate-slide-in-down">
                                {/* Sub-regions */}
                                {region.subRegions?.map((subRegion, subIndex) => {
                                  const isSubRegionExpanded = expandedSubRegions.has(subRegion.id);
                                  
                                  return (
                                    <div key={subRegion.id}>
                                      <Collapsible open={isSubRegionExpanded} onOpenChange={() => toggleSubRegion(subRegion.id)}>
                                        {/* Sub-region Header */}
                                        <div className="flex items-stretch gap-1 ml-2">
                                          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/30 flex-1 min-w-0">
                                            <div className="p-1 rounded bg-slate-700/50 shrink-0">
                                              <MapPin className="w-3 h-3 text-slate-500" />
                                            </div>
                                            <span className="font-medium text-xs text-slate-300 truncate" title={subRegion.name}>
                                              {subRegion.name}
                                            </span>
                                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-500 px-1.5 py-0.5 shrink-0 ml-auto bg-slate-800/50">
                                              {subRegion.sites.length}
                                            </Badge>
                                          </div>
                                          
                                          <CollapsibleTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="p-2 text-slate-500 hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-800/50 shrink-0"
                                            >
                                              <div className={`transition-transform duration-200 ${isSubRegionExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                                <ChevronDown className="w-3 h-3" />
                                              </div>
                                            </Button>
                                          </CollapsibleTrigger>
                                        </div>
                                        
                                        {/* Sub-region Sites */}
                                        <CollapsibleContent className="ml-6 overflow-hidden">
                                          <div className="space-y-1 animate-slide-in-down">
                                            {subRegion.sites.map((site, siteIndex) => {
                                              const isSiteActive = currentPath.includes(`/site/${site.id}`);
                                              const efficiencyPercentage = Math.round((site.currentOutput / site.totalCapacity) * 100);
                                              
                                              return (
                                                <NavLink
                                                  key={site.id}
                                                  to={`/site/${site.id}`}
                                                  className={`flex items-start px-3 py-2.5 rounded-lg transition-all duration-200 w-full block animate-fade-in ${
                                                    isSiteActive
                                                      ? "bg-emerald-500/20 text-emerald-400"
                                                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                                  }`}
                                                  style={{ animationDelay: `${siteIndex * 50}ms` }}
                                                >
                                                  <div className="flex items-start space-x-3 w-full min-w-0">
                                                    {/* Status Indicator */}
                                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-2 transition-all duration-200 ${
                                                      site.status === 'online' ? 'bg-emerald-400 shadow-emerald-400/50 shadow-sm' :
                                                      site.status === 'maintenance' ? 'bg-yellow-400 shadow-yellow-400/50 shadow-sm' : 
                                                      'bg-red-400 shadow-red-400/50 shadow-sm'
                                                    }`} />
                                                    
                                                    {/* Site Information */}
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                      <div>
                                                        <h4 className="text-sm font-semibold text-white leading-tight truncate" title={site.name}>
                                                          {site.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 truncate leading-tight" title={site.location}>
                                                          {site.location}
                                                        </p>
                                                      </div>
                                                      
                                                      {/* Capacity and Output */}
                                                      <div className="flex items-center justify-between text-xs gap-2">
                                                        <span className="text-slate-300 font-medium">
                                                          {site.currentOutput}MW / {site.totalCapacity}MW
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${
                                                          site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                                                          site.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' : 
                                                          'bg-red-500/20 text-red-400'
                                                        }`}>
                                                          {efficiencyPercentage}%
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </NavLink>
                                              );
                                            })}
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  );
                                })}
                                
                                {/* Direct Sites (for backward compatibility) */}
                                {region.sites.map((site, index) => {
                                  // Skip sites that are already in sub-regions
                                  if (site.subRegion) return null;
                                  
                                  const isSiteActive = currentPath.includes(`/site/${site.id}`);
                                  const efficiencyPercentage = Math.round((site.currentOutput / site.totalCapacity) * 100);
                                  
                                  return (
                                    <NavLink
                                      key={site.id}
                                      to={`/site/${site.id}`}
                                      className={`flex items-start px-3 py-2.5 rounded-lg transition-all duration-200 w-full block animate-fade-in ${
                                        isSiteActive
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                      }`}
                                      style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                      <div className="flex items-start space-x-3 w-full min-w-0">
                                        {/* Status Indicator */}
                                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-2 transition-all duration-200 ${
                                          site.status === 'online' ? 'bg-emerald-400 shadow-emerald-400/50 shadow-sm' :
                                          site.status === 'maintenance' ? 'bg-yellow-400 shadow-yellow-400/50 shadow-sm' : 
                                          'bg-red-400 shadow-red-400/50 shadow-sm'
                                        }`} />
                                        
                                        {/* Site Information */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                          <div>
                                            <h4 className="text-sm font-semibold text-white leading-tight truncate" title={site.name}>
                                              {site.name}
                                            </h4>
                                            <p className="text-xs text-slate-400 truncate leading-tight" title={site.location}>
                                              {site.location}
                                            </p>
                                          </div>
                                          
                                          {/* Capacity and Output */}
                                          <div className="flex items-center justify-between text-xs gap-2">
                                            <span className="text-slate-300 font-medium">
                                              {site.currentOutput}MW / {site.totalCapacity}MW
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${
                                              site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                                              site.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' : 
                                              'bg-red-500/20 text-red-400'
                                            }`}>
                                              {efficiencyPercentage}%
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-900 shrink-0">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/60 rounded-lg border border-slate-600/50 hover:bg-slate-700/60 transition-all duration-200 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">System Administrator</p>
          </div>
          <div className="relative shrink-0">
            <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
