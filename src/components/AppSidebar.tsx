import { Home, MapPin, Users, Settings, BarChart3, Zap, Package, Search, ChevronDown, Bell, Activity, Gauge, Filter, X, TrendingUp, Monitor, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingWrapper, SidebarSkeleton } from "@/components/ui/skeleton";
import { mockRegions } from "@/services/mockDataService";

// Secondary navigation items (system menu)
const secondaryNavItems = [
  { title: "Overview", url: "/", icon: Home },
  { title: "Global Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Advanced Analytics", url: "/advanced-analytics", icon: TrendingUp },
  { title: "Real-time Monitoring", url: "/monitoring", icon: Monitor },
  { title: "System Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedSubRegions, setExpandedSubRegions] = useState<Set<string>>(new Set());
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  const regions = mockRegions;
  const isLoading = false;
  const error = null;

  // Get all sites for stats
  const allSites = useMemo(() => {
    return regions.flatMap(region => 
      region.subRegions ? 
        region.subRegions.flatMap(subRegion => subRegion.sites || []) :
        region.sites || []
    );
  }, [regions]);

  // Enhanced filtering logic
  const filteredRegions = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    return regions.map(region => {
      // Filter sites in this region
      const filteredDirectSites = (region.sites || []).filter(site => {
        const matchesSearch = site.name.toLowerCase().includes(searchLower) ||
                            site.id.toLowerCase().includes(searchLower) ||
                            site.location.toLowerCase().includes(searchLower);
        const matchesStatus = !showOnlineOnly || site.status === 'online';
        return matchesSearch && matchesStatus;
      });

      // Filter sub-regions and their sites
      const filteredSubRegions = (region.subRegions || []).map(subRegion => {
        const filteredSites = (subRegion.sites || []).filter(site => {
          const matchesSearch = site.name.toLowerCase().includes(searchLower) ||
                              site.id.toLowerCase().includes(searchLower) ||
                              site.location.toLowerCase().includes(searchLower);
          const matchesStatus = !showOnlineOnly || site.status === 'online';
          return matchesSearch && matchesStatus;
        });

        return {
          ...subRegion,
          sites: filteredSites
        };
      }).filter(subRegion => 
        subRegion.sites.length > 0 || 
        subRegion.name.toLowerCase().includes(searchLower)
      );

      // Include region if it has matching sites or sub-regions, or matches search
      if (filteredDirectSites.length > 0 || 
          filteredSubRegions.length > 0 || 
          region.name.toLowerCase().includes(searchLower)) {
        return {
          ...region,
          sites: filteredDirectSites,
          subRegions: filteredSubRegions
        };
      }
      return null;
    }).filter(Boolean) as typeof regions;
  }, [regions, searchTerm, showOnlineOnly]);

  const onlineSites = useMemo(() => 
    allSites.filter(site => site.status === 'online').length,
    [allSites]
  );

  const totalFilteredSites = useMemo(() => {
    return filteredRegions.reduce((total, region) => {
      const directSites = region.sites?.length || 0;
      const subRegionSites = region.subRegions?.reduce((subTotal, subRegion) => 
        subTotal + (subRegion.sites?.length || 0), 0) || 0;
      return total + directSites + subRegionSites;
    }, 0);
  }, [filteredRegions]);

  const toggleRegionExpansion = useCallback((regionId: string) => {
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

  const toggleSubRegionExpansion = useCallback((subRegionId: string) => {
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

  // Check if current path is a site page
  const getCurrentSiteId = () => {
    const siteMatch = currentPath.match(/^\/site\/([^\/]+)/);
    return siteMatch ? siteMatch[1] : null;
  };

  const currentSiteId = getCurrentSiteId();

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
              placeholder="Search sites..." 
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
              {totalFilteredSites} sites total
            </span>
            <span className="text-emerald-400">
              {onlineSites} online
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* Sites Section - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-slate-400 font-semibold mb-3 text-xs uppercase tracking-wider flex items-center px-3">
            <Building2 className="w-3 h-3 mr-2" />
            MY SITES
            {(searchTerm || showOnlineOnly) && (
              <Badge variant="secondary" className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1">
                {totalFilteredSites}
              </Badge>
            )}
          </div>
          
          <div className="px-3">
            <LoadingWrapper
              isLoading={isLoading}
              skeleton={<SidebarSkeleton />}
              error={error?.message}
            >
              {filteredRegions.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No sites found</p>
                  <p className="text-slate-500 text-xs mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRegions.map((region, regionIndex) => {
                    const isRegionExpanded = expandedRegions.has(region.id);
                    const hasContent = (region.sites && region.sites.length > 0) || 
                                     (region.subRegions && region.subRegions.length > 0);
                    
                    return (
                      <div key={region.id} className="animate-fade-in" style={{ animationDelay: `${regionIndex * 50}ms` }}>
                        <Collapsible open={isRegionExpanded} onOpenChange={() => toggleRegionExpansion(region.id)}>
                          {/* Region Header */}
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="font-medium text-slate-200">{region.name}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRegionExpanded ? 'rotate-180' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="ml-4">
                            <div className="space-y-1 mt-1">
                              {/* Direct sites in region */}
                              {region.sites && region.sites.map(site => {
                                const isSiteActive = currentSiteId === site.id;
                                const efficiencyPercentage = Math.round(site.efficiency || 0);
                                
                                return (
                                  <NavLink
                                    key={site.id}
                                    to={`/site/${site.id}`}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                                      isSiteActive
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                                        site.status === 'online' ? 'bg-emerald-400' :
                                        site.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                                      }`} />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{site.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{site.location}</p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-xs text-slate-300">{site.currentOutput}kW</p>
                                      <p className="text-xs text-emerald-400">{efficiencyPercentage}%</p>
                                    </div>
                                  </NavLink>
                                );
                              })}
                              
                              {/* Sub-regions */}
                              {region.subRegions && region.subRegions.map(subRegion => {
                                const isSubRegionExpanded = expandedSubRegions.has(subRegion.id);
                                
                                return (
                                  <div key={subRegion.id} className="ml-2">
                                    <Collapsible open={isSubRegionExpanded} onOpenChange={() => toggleSubRegionExpansion(subRegion.id)}>
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="w-full flex items-center justify-between px-2 py-1.5 text-left hover:bg-slate-800/30 rounded text-sm"
                                        >
                                          <span className="text-slate-300">{subRegion.name}</span>
                                          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isSubRegionExpanded ? 'rotate-180' : ''}`} />
                                        </Button>
                                      </CollapsibleTrigger>
                                      
                                      <CollapsibleContent className="ml-4">
                                        <div className="space-y-1 mt-1">
                                          {subRegion.sites && subRegion.sites.map(site => {
                                            const isSiteActive = currentSiteId === site.id;
                                            const efficiencyPercentage = Math.round(site.efficiency || 0);
                                            
                                            return (
                                              <NavLink
                                                key={site.id}
                                                to={`/site/${site.id}`}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                                                  isSiteActive
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                                }`}
                                              >
                                                <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                                                    site.status === 'online' ? 'bg-emerald-400' :
                                                    site.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                                                  }`} />
                                                  <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium truncate">{site.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{site.location}</p>
                                                  </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                  <p className="text-xs text-slate-300">{site.currentOutput}kW</p>
                                                  <p className="text-xs text-emerald-400">{efficiencyPercentage}%</p>
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
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}
                </div>
              )}
            </LoadingWrapper>
          </div>
        </div>

        {/* Secondary Navigation Section - Fixed at bottom */}
        <div className="shrink-0 p-3 border-t border-slate-700/50 bg-slate-900">
          <div className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider px-3 flex items-center">
            <BarChart3 className="w-3 h-3 mr-2" />
            SYSTEM
          </div>
          <div className="space-y-1 px-3">
            {secondaryNavItems.map((item) => {
              const isActive = currentPath === item.url || (item.url !== "/" && currentPath.startsWith(item.url));
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full ${
                    isActive
                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className={`p-1.5 rounded-md transition-colors duration-200 shrink-0 ${
                    isActive ? 'bg-violet-500/20' : 'bg-slate-700/50'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm truncate">{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-violet-400 rounded-full shrink-0" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
