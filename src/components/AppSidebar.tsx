import { Home, MapPin, Users, Settings, BarChart3, Zap, Package, Search, ChevronDown, Bell } from "lucide-react";
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

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

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
    <Sidebar className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-700/50 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500/90 to-cyan-500/90 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/20">
              <Zap className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg tracking-tight">WEM</h2>
            <p className="text-xs text-slate-400 font-medium">Wise Energy Management</p>
          </div>
        </div>
        
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sites..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 backdrop-blur-sm"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-transparent px-4 py-3">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-semibold mb-3 text-xs uppercase tracking-wider px-3 flex items-center">
            <BarChart3 className="w-3 h-3 mr-2" />
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/60 backdrop-blur-sm"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`p-2 rounded-lg transition-colors duration-300 ${
                            isActive ? 'bg-emerald-500/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                          }`}>
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                          </div>
                          <span className="font-medium text-sm">{item.title}</span>
                          {isActive && (
                            <div className="absolute right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Regions */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-slate-400 font-semibold mb-3 text-xs uppercase tracking-wider flex items-center px-3">
            <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
            Regions & Sites
            {searchTerm && (
              <Badge variant="secondary" className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {filteredRegions.reduce((acc, region) => acc + region.sites.length, 0)} found
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {filteredRegions.length === 0 && searchTerm ? (
              <div className="px-4 py-6 text-center">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No sites found</p>
                <p className="text-slate-500 text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <SidebarMenu className="space-y-2">
                {filteredRegions.map((region) => (
                  <SidebarMenuItem key={region.id}>
                    <Collapsible defaultOpen={true}>
                      <div className="flex items-center w-full">
                        <NavLink
                          to={`/region/${region.id}`}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 flex-1 min-w-0 group ${
                              isActive
                                ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10"
                                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                            }`
                          }
                        >
                          <div className="p-1.5 rounded-md bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                          </div>
                          <div className="flex items-center justify-between w-full min-w-0">
                            <span className="font-medium text-sm truncate">{region.name}</span>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 ml-2 flex-shrink-0">
                              {region.sites.length}
                            </Badge>
                          </div>
                        </NavLink>
                        <CollapsibleTrigger asChild>
                          <button className="p-2 ml-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50">
                            <ChevronDown className="w-4 h-4 data-[state=open]:rotate-180 transition-transform duration-200" />
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="ml-4 mt-1 space-y-1">
                        {region.sites.map((site) => (
                          <SidebarMenuItem key={site.id}>
                            <SidebarMenuButton asChild>
                              <NavLink
                                to={`/site/${site.id}`}
                                className={({ isActive }) =>
                                  `flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group w-full min-w-0 ${
                                    isActive
                                      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                  }`
                                }
                              >
                                <div className="flex items-center space-x-3 w-full min-w-0">
                                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                    site.status === 'online' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                                    site.status === 'maintenance' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 
                                    'bg-red-400 shadow-lg shadow-red-400/50'
                                  }`} />
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium truncate" title={site.name}>
                                        {site.name}
                                      </span>
                                      <Badge 
                                        variant="secondary" 
                                        className="text-xs ml-2 flex-shrink-0 bg-slate-700/50 text-slate-300 border-slate-600/50"
                                      >
                                        {site.totalCapacity}MW
                                      </Badge>
                                    </div>
                                    <div className="flex items-center mt-0.5">
                                      <span className={`text-xs font-medium capitalize ${
                                        site.status === 'online' ? 'text-emerald-400' :
                                        site.status === 'maintenance' ? 'text-yellow-400' : 
                                        'text-red-400'
                                      }`}>
                                        {site.status}
                                      </span>
                                      <span className="text-xs text-slate-500 mx-1">•</span>
                                      <span className="text-xs text-slate-400">
                                        {site.currentOutput}MW
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-xl border border-slate-600/50 hover:from-slate-700/60 hover:to-slate-600/60 transition-all duration-300 cursor-pointer backdrop-blur-sm group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400">System Administrator</p>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-white cursor-pointer transition-colors flex-shrink-0" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}