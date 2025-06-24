
import { NavLink, useParams } from "react-router-dom";
import { BarChart3, Zap, FileText, DollarSign, Users, Settings, Bell, Download, Grid3X3, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockRegions } from "@/services/mockDataService";

const SiteTopBar = () => {
  const { siteId } = useParams();
  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);

  const navItems = [
    { title: "Dashboard", path: `/site/${siteId}`, icon: BarChart3 },
    { title: "Grid", path: `/site/${siteId}/grid`, icon: Grid3X3 },
    { title: "Assets", path: `/site/${siteId}/assets`, icon: Zap },
    { title: "Reports", path: `/site/${siteId}/reports`, icon: FileText },
    { title: "Finances", path: `/site/${siteId}/finances`, icon: DollarSign },
    { title: "Team", path: `/site/${siteId}/team`, icon: Users },
    { title: "Settings", path: `/site/${siteId}/settings`, icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/40 shadow-xl shadow-emerald-500/20";
      case "maintenance": return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-400/40 shadow-xl shadow-amber-500/20";
      case "offline": return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-400/40 shadow-xl shadow-red-500/20";
      default: return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-400/40";
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-3xl border-b border-white/10 px-8 py-6 shadow-2xl relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 via-cyan-500 to-emerald-500 animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute top-4 left-20 w-1 h-1 bg-violet-400/60 rounded-full animate-ping"></div>
      <div className="absolute top-8 right-32 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-4 left-40 w-1 h-1 bg-emerald-400/60 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10">
        {/* Enhanced Site Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                  {site?.name}
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-cyan-300 text-sm font-medium flex items-center space-x-2">
                    <span>{site?.location}</span>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-white/60">Capacity: {site?.capacity}MW</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={`${getStatusColor(site?.status || '')} font-semibold backdrop-blur-xl transform hover:scale-105 transition-all duration-300 px-4 py-2`}>
                <Activity className="w-3 h-3 mr-2" />
                {site?.status}
              </Badge>
              
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-2xl px-4 py-2 backdrop-blur-xl">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 font-semibold text-sm">98.5% Uptime</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-violet-400/40 text-violet-300 hover:bg-violet-500/20 bg-violet-500/10 backdrop-blur-xl shadow-xl hover:shadow-violet-500/20 transition-all duration-300 hover:scale-105">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </Button>
            
            <Button variant="outline" size="sm" className="border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20 bg-cyan-500/10 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="relative">
          <div className="flex space-x-2 bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-white/10">
            {navItems.map((item, index) => (
              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === `/site/${siteId}`}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-500 text-sm font-semibold relative overflow-hidden group ${
                    isActive
                      ? "bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 text-white shadow-2xl shadow-violet-500/30 transform scale-105"
                      : "text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:shadow-xl hover:scale-105"
                  }`
                }
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="transition-all relative z-10">{item.title}</span>
                
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Active indicator */}
                {item.path === `/site/${siteId}` && window.location.pathname === item.path && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full"></div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SiteTopBar;
