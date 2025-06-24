
import { Home, MapPin, Users, Settings, BarChart3, Zap, FileText, DollarSign, Shield, Bell, Search, ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const mainNavItems = [
    { title: "Overview", url: "/", icon: Home },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar className="bg-slate-900 border-r border-slate-700">
      <SidebarHeader className="p-4 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Energy Hub</h2>
            <p className="text-xs text-slate-400">Management Portal</p>
          </div>
        </div>
        
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sites..." 
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 px-3 py-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-medium mb-2 text-xs uppercase tracking-wider px-3">
            Main Navigation
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
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Regions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-medium mb-2 text-xs uppercase tracking-wider flex items-center px-3">
            <MapPin className="w-3 h-3 mr-2" />
            Regions & Sites
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mockRegions.map((region) => (
                <SidebarMenuItem key={region.id}>
                  <Collapsible defaultOpen={true}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between w-full">
                        <NavLink
                          to={`/region/${region.id}`}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1 ${
                              isActive
                                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                            }`
                          }
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium text-sm">{region.name}</span>
                          <span className="text-xs text-slate-400">({region.sites.length})</span>
                        </NavLink>
                        <ChevronDown className="w-4 h-4 text-slate-400 mr-2 data-[state=open]:rotate-180 transition-transform" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-1 space-y-1">
                      {region.sites.map((site) => (
                        <SidebarMenuItem key={site.id}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={`/site/${site.id}`}
                              className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
                                  isActive
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                                }`
                              }
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  site.status === 'online' ? 'bg-emerald-400' :
                                  site.status === 'maintenance' ? 'bg-amber-400' : 
                                  'bg-red-400'
                                }`} />
                                <span className="text-sm font-medium">{site.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-slate-400">{site.totalCapacity}MW</span>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <Bell className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
