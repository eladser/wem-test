
import { Home, MapPin, Users, Settings, BarChart3, Zap, FileText, DollarSign, Shield, Bell, Search } from "lucide-react";
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
    <Sidebar className="border-r border-white/10 bg-gradient-to-b from-slate-900/40 via-slate-800/40 to-slate-900/40 backdrop-blur-2xl">
      <SidebarHeader className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
          </div>
          <div>
            <h2 className="font-bold text-white">Energy Hub</h2>
            <p className="text-xs text-white/60">Management Portal</p>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 backdrop-blur-xl focus:outline-none focus:border-violet-400/50 focus:bg-white/20 transition-all duration-300"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 font-semibold mb-3 text-xs uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-white/20 shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sites */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 font-semibold mb-3 text-xs uppercase tracking-wider flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Energy Sites
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mockRegions.flatMap(region => 
                region.sites.map((site) => (
                  <SidebarMenuItem key={site.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/site/${site.id}`}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 group ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-white border border-emerald-400/30"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            site.status === 'online' ? 'bg-emerald-400 animate-pulse' :
                            site.status === 'maintenance' ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                          <span className="text-sm font-medium">{site.name}</span>
                        </div>
                        <span className="text-xs text-white/40">{site.capacity}MW</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-xl border border-white/10 backdrop-blur-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-white/60">System Administrator</p>
          </div>
          <Bell className="w-4 h-4 text-white/60 hover:text-white cursor-pointer transition-colors duration-300" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
