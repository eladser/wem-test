
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
    `transition-all duration-200 ${
      isActive 
        ? "bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border-r-2 border-green-500" 
        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
    }`;

  return (
    <Sidebar className={`transition-all duration-300 ${isCollapsed ? "w-14" : "w-64"} border-r border-slate-800`}>
      <SidebarContent className="bg-slate-900">
        {/* Header */}
        <div className={`p-4 border-b border-slate-800 transition-all duration-300 ${isCollapsed ? "px-2" : ""}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h2 className="font-semibold text-white">Energy Hub</h2>
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
                    <Home className="w-4 h-4 transition-transform hover:scale-110" />
                    {!isCollapsed && <span className="animate-fade-in">Overview</span>}
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
                      className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-400 transition-transform hover:scale-110" />
                        {!isCollapsed && <span>{region.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className="transition-transform duration-200">
                          {expandedRegions.includes(region.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      )}
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
                                `${getNavClass(isActive)} pl-6 group hover:pl-8 transition-all duration-200`
                              }
                            >
                              <div className="flex items-center space-x-2 w-full">
                                <div className={`w-2 h-2 rounded-full transition-all ${
                                  site.status === 'online' ? 'bg-green-500 animate-pulse' :
                                  site.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{site.name}</div>
                                  <div className="text-xs text-slate-400 truncate">{site.location}</div>
                                </div>
                                <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {site.currentOutput}kW
                                </div>
                              </div>
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
                    <Settings className="w-4 h-4 transition-transform hover:rotate-90 duration-300" />
                    {!isCollapsed && <span className="animate-fade-in">Settings</span>}
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
