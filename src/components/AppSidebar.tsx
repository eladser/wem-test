import { Home, MapPin, Users, Settings, BarChart3, Zap, Package, Search, ChevronDown, Bell, Activity, Gauge } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
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

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");

  const mainNavItems = [
    { title: "Overview", url: "/", icon: Home },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Assets", url: "/assets", icon: Package },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  // Filter regions and sites based on search term
  const filteredRegions = mockRegions.map(region => ({
    ...region,
    sites: region.sites.filter(site => 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(region => 
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.sites.length > 0
  );

  return (
    <Sidebar className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-screen">
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
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sites..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent className="bg-slate-900 flex-1 overflow-y-auto">
        <div className="p-3 space-y-6">
          {/* Navigation Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider px-3 flex items-center">
              <BarChart3 className="w-3 h-3 mr-2" />
              NAVIGATION
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {mainNavItems.map((item) => {
                  const isActive = currentPath === item.url || (item.url !== "/" && currentPath.startsWith(item.url));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 w-full ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                          }`}
                        >
                          <div className={`p-2 rounded-md transition-colors duration-200 ${
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
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider flex items-center px-3">
              <MapPin className="w-3 h-3 mr-2" />
              REGIONS & SITES
              {searchTerm && (
                <Badge variant="secondary" className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1">
                  {filteredRegions.reduce((acc, region) => acc + region.sites.length, 0)}
                </Badge>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {filteredRegions.length === 0 && searchTerm ? (
                <div className="px-3 py-6 text-center">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No sites found</p>
                  <p className="text-slate-500 text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                <SidebarMenu className="space-y-3">
                  {filteredRegions.map((region) => {
                    const isRegionActive = currentPath.includes(`/region/${region.id}`);
                    return (
                      <SidebarMenuItem key={region.id}>
                        <Collapsible defaultOpen={true}>
                          <div className="space-y-2">
                            {/* Region Header */}
                            <div className="flex items-center w-full gap-2">
                              <NavLink
                                to={`/region/${region.id}`}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 flex-1 ${
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
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 px-2 py-1 flex-shrink-0">
                                    {region.sites.length}
                                  </Badge>
                                </div>
                              </NavLink>
                              <CollapsibleTrigger asChild>
                                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800/50 flex-shrink-0">
                                  <ChevronDown className="w-4 h-4 data-[state=open]:rotate-180 transition-transform duration-200" />
                                </button>
                              </CollapsibleTrigger>
                            </div>
                            
                            {/* Sites List */}
                            <CollapsibleContent className="ml-4 space-y-2">
                              {region.sites.map((site) => {
                                const isSiteActive = currentPath.includes(`/site/${site.id}`);
                                return (
                                  <SidebarMenuItem key={site.id}>
                                    <SidebarMenuButton asChild>
                                      <NavLink
                                        to={`/site/${site.id}`}
                                        className={`flex items-start px-3 py-4 rounded-lg transition-all duration-200 w-full ${
                                          isSiteActive
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                        }`}
                                      >
                                        <div className="flex items-start space-x-3 w-full min-w-0">
                                          {/* Status Indicator */}
                                          <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                                            site.status === 'online' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' :
                                            site.status === 'maintenance' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/30' : 
                                            'bg-red-400 shadow-lg shadow-red-400/30'
                                          }`} />
                                          
                                          {/* Site Information */}
                                          <div className="flex-1 min-w-0 space-y-2">
                                            {/* Site Name and Location */}
                                            <div>
                                              <h4 className="text-sm font-medium text-white leading-tight break-words" title={site.name}>
                                                {site.name}
                                              </h4>
                                              <p className="text-xs text-slate-400 mt-0.5 break-words">
                                                {site.location}
                                              </p>
                                            </div>
                                            
                                            {/* Capacity and Output */}
                                            <div className="flex items-center justify-between text-xs">
                                              <div className="flex flex-col">
                                                <span className="text-white font-medium">
                                                  {site.totalCapacity}MW
                                                </span>
                                                <span className="text-slate-500">
                                                  capacity
                                                </span>
                                              </div>
                                              <div className="flex flex-col items-end">
                                                <div className="flex items-center space-x-1">
                                                  <Activity className="w-3 h-3 text-slate-500" />
                                                  <span className="text-white font-medium">{site.currentOutput}MW</span>
                                                </div>
                                                <span className="text-slate-500">output</span>
                                              </div>
                                            </div>
                                            
                                            {/* Status */}
                                            <div className="flex items-center justify-between">
                                              <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${
                                                site.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                                                site.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' : 
                                                'bg-red-500/20 text-red-400'
                                              }`}>
                                                {site.status}
                                              </span>
                                              <span className="text-xs text-slate-500">
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