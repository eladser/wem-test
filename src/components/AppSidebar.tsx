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
    <Sidebar className="bg-slate-900 border-r border-slate-700/50">
      <SidebarHeader className="p-4 border-b border-slate-700/50 bg-slate-900">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">WEM</h2>
            <p className="text-xs text-slate-400">Wise Energy Management</p>
          </div>
        </div>
        
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sites..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 px-3 py-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-medium mb-2 text-xs uppercase tracking-wider px-3 flex items-center">
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
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`p-1.5 rounded-md transition-colors duration-200 ${
                            isActive ? 'bg-emerald-500/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                          }`}>
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                          </div>
                          <span className="font-medium text-sm">{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* FIXED: Regions with better text contrast and readability */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-slate-400 font-medium mb-2 text-xs uppercase tracking-wider flex items-center px-3">
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
              <div className="px-3 py-4 text-center">
                <div className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No sites found</p>
                <p className="text-slate-500 text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <SidebarMenu className="space-y-1">
                {filteredRegions.map((region) => (
                  <SidebarMenuItem key={region.id}>
                    <Collapsible defaultOpen={true}>
                      <div className="flex items-center w-full">
                        <NavLink
                          to={`/region/${region.id}`}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1 min-w-0 ${
                              isActive
                                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                            }`
                          }
                        >
                          <div className="p-1 rounded-sm bg-slate-700/50">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                          </div>
                          <div className="flex items-center justify-between w-full min-w-0">
                            <span className="font-medium text-sm truncate">{region.name}</span>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 ml-2 flex-shrink-0">
                              {region.sites.length}
                            </Badge>
                          </div>
                        </NavLink>
                        <CollapsibleTrigger asChild>
                          <button className="p-1.5 ml-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800/50">
                            <ChevronDown className="w-4 h-4 data-[state=open]:rotate-180 transition-transform duration-200" />
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="ml-3 mt-1 space-y-1">
                        {region.sites.map((site) => (
                          <SidebarMenuItem key={site.id}>
                            <SidebarMenuButton asChild>
                              <NavLink
                                to={`/site/${site.id}`}
                                className={({ isActive }) =>
                                  `flex items-start px-3 py-2 rounded-lg transition-all duration-200 group w-full min-w-0 ${
                                    isActive
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                  }`
                                }
                              >
                                <div className="flex items-start space-x-2 w-full min-w-0">
                                  {/* FIXED: Better status indicator */}
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                                    site.status === 'online' ? 'bg-emerald-400' :
                                    site.status === 'maintenance' ? 'bg-yellow-400' : 
                                    'bg-red-400'
                                  }`} />
                                  
                                  {/* FIXED: Better text layout and contrast */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-sm font-medium text-white group-hover:text-white leading-tight" title={site.name}>
                                        {site.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className={`text-xs font-medium capitalize ${
                                        site.status === 'online' ? 'text-emerald-400' :
                                        site.status === 'maintenance' ? 'text-yellow-400' : 
                                        'text-red-400'
                                      }`}>
                                        {site.status}
                                      </span>
                                      <span className="text-xs text-slate-400 font-medium">
                                        {site.totalCapacity}MW
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                      Output: {site.currentOutput}MW
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

      <SidebarFooter className="p-4 border-t border-slate-700/50 bg-slate-900">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/60 rounded-lg border border-slate-600/50 hover:bg-slate-700/60 transition-all duration-200 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400">System Administrator</p>
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}