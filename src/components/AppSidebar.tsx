
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Zap, Settings, Home, MapPin } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { mockRegions } from "@/services/mockDataService";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [expandedRegions, setExpandedRegions] = useState<string[]>(["north-america"]);
  
  const isCollapsed = state === "collapsed";
  const currentPath = location.pathname;

  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const getNavClass = (isActive: boolean) =>
    `transition-all duration-300 group relative overflow-hidden ${
      isActive 
        ? "bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-transparent text-emerald-300 border-r-2 border-emerald-400 shadow-lg shadow-emerald-500/10" 
        : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/30 hover:shadow-md"
    }`;

  return (
    <Sidebar className={`transition-all duration-500 ${isCollapsed ? "w-14" : "w-64"} border-r border-slate-800/50 relative`}>
      {/* Sidebar background with blur */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 via-slate-900/40 to-slate-950/60"></div>
      
      <SidebarContent className="relative z-10">
        {/* Header */}
        <div className={`p-4 border-b border-slate-800/50 transition-all duration-300 ${isCollapsed ? "px-2" : ""} relative`}>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-xl blur opacity-40 animate-pulse"></div>
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h2 className="font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Energy Hub</h2>
                <p className="text-xs text-slate-400">Management Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider px-4 py-2">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className={({ isActive }) => getNavClass(isActive)}
                  >
                    <Home className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    {!isCollapsed && <span className="animate-fade-in">Overview</span>}
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Regions & Sites */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider px-4 py-2">
            {!isCollapsed && "Regions & Sites"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockRegions.map((region, regionIndex) => (
                <div key={region.id} className="animate-fade-in" style={{ animationDelay: `${regionIndex * 0.1}s` }}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => !isCollapsed && toggleRegion(region.id)}
                      className="w-full justify-between text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/30 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-300" />
                        {!isCollapsed && <span>{region.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className="transition-transform duration-300">
                          {expandedRegions.includes(region.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      )}
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Sites under region */}
                  {!isCollapsed && expandedRegions.includes(region.id) && (
                    <div className="ml-6 space-y-1 animate-slide-in-right">
                      {region.sites.map((site, siteIndex) => (
                        <SidebarMenuItem key={site.id} className="animate-fade-in" style={{ animationDelay: `${siteIndex * 0.05}s` }}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={`/site/${site.id}`}
                              className={({ isActive }) => 
                                `${getNavClass(isActive)} pl-6 group hover:pl-8 transition-all duration-300 relative overflow-hidden`
                              }
                            >
                              <div className="flex items-center space-x-2 w-full relative z-10">
                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  site.status === 'online' ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' :
                                  site.status === 'maintenance' ? 'bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50' : 
                                  'bg-red-400 shadow-lg shadow-red-400/50'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{site.name}</div>
                                  <div className="text-xs text-slate-400 truncate">{site.location}</div>
                                </div>
                                <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-800/50 rounded px-1">
                                  {site.currentOutput}kW
                                </div>
                              </div>
                              {/* Animated background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => getNavClass(isActive)}
                  >
                    <Settings className="w-4 h-4 transition-all duration-500 group-hover:rotate-180" />
                    {!isCollapsed && <span className="animate-fade-in">Settings</span>}
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
