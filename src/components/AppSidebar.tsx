
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
    <Sidebar className="border-r border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-3xl shadow-2xl">
      <SidebarHeader className="p-6 border-b border-white/10 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-bold text-white bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">Energy Hub</h2>
            <p className="text-xs text-white/60 font-medium">Management Portal</p>
          </div>
        </div>
        
        {/* Enhanced Search bar */}
        <div className="mt-4 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="Search sites, analytics..." 
            className="w-full bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 backdrop-blur-2xl focus:outline-none focus:border-violet-400/50 focus:bg-gradient-to-r focus:from-violet-500/20 focus:to-cyan-500/20 focus:shadow-xl focus:shadow-violet-500/20 transition-all duration-500 hover:border-white/30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 font-semibold mb-4 text-xs uppercase tracking-wider flex items-center">
            <div className="w-6 h-px bg-gradient-to-r from-violet-500 to-cyan-500 mr-3 animate-pulse"></div>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-cyan-500/30 text-white border border-white/30 shadow-2xl shadow-violet-500/20 transform scale-105"
                            : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:border-white/20 border border-transparent hover:shadow-xl hover:scale-105 hover:shadow-violet-500/10"
                        }`
                      }
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <item.icon className="w-5 h-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative z-10" />
                      <span className="font-medium relative z-10">{item.title}</span>
                      
                      {/* Enhanced hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      {/* Glowing particles */}
                      <div className="absolute top-2 right-2 w-1 h-1 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Energy Sites */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 font-semibold mb-4 text-xs uppercase tracking-wider flex items-center">
            <div className="w-6 h-px bg-gradient-to-r from-emerald-500 to-green-500 mr-3 animate-pulse"></div>
            <MapPin className="w-4 h-4 mr-2" />
            Energy Sites
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mockRegions.flatMap(region => 
                region.sites.map((site, index) => (
                  <SidebarMenuItem key={site.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/site/${site.id}`}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-500 group relative overflow-hidden ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-white border border-emerald-400/40 shadow-xl shadow-emerald-500/20 transform scale-105"
                              : "text-white/60 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-green-500/10 hover:border-emerald-400/20 border border-transparent hover:scale-105"
                          }`
                        }
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center space-x-3 relative z-10">
                          <div className={`w-2 h-2 rounded-full ${
                            site.status === 'online' ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' :
                            site.status === 'maintenance' ? 'bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50' : 
                            'bg-red-400 animate-pulse shadow-lg shadow-red-400/50'
                          }`} />
                          <span className="text-sm font-medium">{site.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 relative z-10">
                          <span className="text-xs text-white/40 font-mono">{site.totalCapacity}MW</span>
                          <div className="w-1 h-1 bg-cyan-400/60 rounded-full animate-ping"></div>
                        </div>
                        
                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-cyan-500/5 backdrop-blur-2xl">
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl border border-white/20 backdrop-blur-3xl shadow-2xl hover:scale-105 transition-all duration-500 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-white/60 font-medium">System Administrator</p>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors duration-300 group-hover:animate-bounce" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
