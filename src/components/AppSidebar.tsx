
import { useState } from "react";
import { BarChart3, Zap, FileText, Settings, LogOut, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { mockRegions } from "@/services/mockDataService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { siteId } = useParams();
  const [expandedRegions, setExpandedRegions] = useState<string[]>(['north-america']);

  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isSiteActive = (currentSiteId: string) => {
    return siteId === currentSiteId;
  };

  const getNavCls = (path: string) => {
    const baseClasses = "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200";
    return isActive(path) 
      ? `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg` 
      : `${baseClasses} text-slate-300 hover:text-white hover:bg-slate-800`;
  };

  const getSiteNavCls = (currentSiteId: string) => {
    const baseClasses = "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ml-4";
    return isSiteActive(currentSiteId)
      ? `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg`
      : `${baseClasses} text-slate-300 hover:text-white hover:bg-slate-700`;
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} bg-slate-900 border-r border-slate-800`}>
      <SidebarContent className="p-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-white">EnergyOS</h2>
                <p className="text-xs text-slate-400">Management Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider mb-4">
            {!collapsed && "Sites & Regions"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mockRegions.map((region) => (
                <SidebarMenuItem key={region.id}>
                  <Collapsible
                    open={expandedRegions.includes(region.id)}
                    onOpenChange={() => toggleRegion(region.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between text-slate-300 hover:text-white hover:bg-slate-800">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          {!collapsed && <span>{region.name}</span>}
                        </div>
                        {!collapsed && (
                          expandedRegions.includes(region.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    
                    {!collapsed && (
                      <CollapsibleContent className="space-y-1 mt-1">
                        {region.sites.map((site) => (
                          <NavLink
                            key={site.id}
                            to={`/site/${site.id}`}
                            className={getSiteNavCls(site.id)}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              site.status === 'online' ? 'bg-green-500' :
                              site.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="text-sm">{site.name}</span>
                          </NavLink>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider mb-4">
            {!collapsed && "Global"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls("/settings")}>
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pt-8">
          <SidebarMenuButton asChild>
            <button className="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors w-full">
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
