import { Home, MapPin, Users, Settings, BarChart3, Zap, Package, Search, ChevronDown, Bell, Activity, Gauge, Filter, X, TrendingUp, Monitor, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingWrapper, SidebarSkeleton } from "@/components/ui/skeleton";
import { mockRegions } from "@/services/mockDataService";

// Extract all sites from regions
const getAllSites = () => {
  return mockRegions.flatMap(region => 
    region.subRegions ? 
      region.subRegions.flatMap(subRegion => subRegion.sites || []) :
      region.sites || []
  );
};

// Site sub-navigation items
const siteSubNav = [
  { title: "Dashboard", path: "" },
  { title: "Assets", path: "/assets" },
  { title: "Analytics", path: "/analytics" },
  { title: "Team", path: "/team" },
  { title: "Reports", path: "/reports" },
  { title: "Settings", path: "/settings" },
  { title: "Finances", path: "/finances" },
];

// Secondary navigation items (moved below sites)
const secondaryNavItems = [
  { title: "Overview", url: "/", icon: Home },
  { title: "Global Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Advanced Analytics", url: "/advanced-analytics", icon: TrendingUp },
  { title: "Real-time Monitoring", url: "/monitoring", icon: Monitor },
  { title: "All Assets", url: "/assets", icon: Package },
  { title: "System Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set());
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
  // Use your existing mock data structure
  const sites = getAllSites();
  const isLoading = false;
  const error = null;

  // Enhanced filtering logic for sites
  const filteredSites = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    return sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchLower) ||
                          site.id.toLowerCase().includes(searchLower) ||
                          site.location.toLowerCase().includes(searchLower);
      const matchesStatus = !showOnlineOnly || site.status === 'online';
      return matchesSearch && matchesStatus;
    });
  }, [sites, searchTerm, showOnlineOnly]);

  const onlineSites = useMemo(() => 
    filteredSites.filter(site => site.status === 'online').length,
    [filteredSites]
  );

  const toggleSiteExpansion = useCallback((siteId: string) => {
    setExpandedSites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(siteId)) {
        newSet.delete(siteId);
      } else {
        newSet.add(siteId);
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
              {filteredSites.length} sites total
            </span>
            <span className="text-emerald-400">
              {onlineSites} online
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="bg-slate-900 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          
          {/* Sites Section - PRIMARY NAVIGATION */}
          <div className="flex-1 overflow-hidden flex flex-col p-3">
            <div className="text-slate-400 font-semibold mb-3 text-xs uppercase tracking-wider flex items-center px-3">
              <Building2 className="w-3 h-3 mr-2" />
              MY SITES
              {(searchTerm || showOnlineOnly) && (
                <Badge variant="secondary" className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1">
                  {filteredSites.length}
                </Badge>
              )}
            </div>
            
            {/* Sites List - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-smooth">
              <LoadingWrapper
                isLoading={isLoading}
                skeleton={<SidebarSkeleton />}
                error={error?.message}
              >
                {filteredSites.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-5 h-5 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">No sites found</p>
                    <p className="text-slate-500 text-xs mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="space-y-2 pb-4">
                    {filteredSites.map((site, index) => {
                      const isSiteActive = currentPath.includes(`/site/${site.id}`);
                      const isExpanded = expandedSites.has(site.id) || currentSiteId === site.id;
                      const efficiencyPercentage = Math.round(site.efficiency || 0);
                      
                      return (
                        <div key={site.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <Collapsible open={isExpanded} onOpenChange={() => toggleSiteExpansion(site.id)}>
                            <div className="space-y-1">
                              {/* Site Header */}
                              <div className="flex items-stretch gap-1">
                                <NavLink
                                  to={`/site/${site.id}`}
                                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 flex-1 min-w-0 ${
                                    isSiteActive
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                  }`}
                                >
                                  {/* Status Indicator */}
                                  <div className={`w-3 h-3 rounded-full shrink-0 transition-all duration-200 ${
                                    site.status === 'online' ? 'bg-emerald-400 shadow-emerald-400/50 shadow-sm' :
                                    site.status === 'maintenance' ? 'bg-yellow-400 shadow-yellow-400/50 shadow-sm' : 
                                    'bg-red-400 shadow-red-400/50 shadow-sm'
                                  }`} />
                                  
                                  <div className="flex items-center justify-between w-full min-w-0">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-sm text-white leading-tight truncate" title={site.name}>
                                        {site.name}
                                      </h4>
                                      <p className="text-xs text-slate-400 truncate leading-tight" title={site.location}>
                                        {site.location}
                                      </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                      <p className="text-xs font-medium text-slate-300">
                                        {site.currentOutput}kW
                                      </p>
                                      <p className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                        site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                                        site.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' : 
                                        'bg-red-500/20 text-red-400'
                                      }`}>
                                        {efficiencyPercentage}%
                                      </p>
                                    </div>
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
                              
                              {/* Site Sub-navigation */}
                              <CollapsibleContent className="ml-4 overflow-hidden">
                                <div className="space-y-1 animate-slide-in-down">
                                  {siteSubNav.map((subItem) => {
                                    const subPath = `/site/${site.id}${subItem.path}`;
                                    const isSubActive = currentPath === subPath;
                                    
                                    return (
                                      <NavLink
                                        key={subItem.title}
                                        to={subPath}
                                        className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                          isSubActive
                                            ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                                        }`}
                                      >
                                        <span className="truncate">{subItem.title}</span>
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
              </LoadingWrapper>
            </div>
          </div>

          {/* Secondary Navigation Section - BELOW SITES */}
          <div className="shrink-0 p-3 pt-0 border-t border-slate-700/50">
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
