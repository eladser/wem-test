
import { NavLink, useParams } from "react-router-dom";
import { BarChart3, Zap, FileText, DollarSign, Users, Settings, Bell, Download, Grid3X3 } from "lucide-react";
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
      case "online": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/20";
      case "maintenance": return "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/20";
      case "offline": return "bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border-b border-slate-700/50 px-8 py-6 shadow-2xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-800/20 to-slate-900/40"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-blue-500"></div>
      
      <div className="relative z-10">
        {/* Site Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-2xl blur opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {site?.name}
                </h1>
                <p className="text-emerald-400 text-sm font-medium flex items-center space-x-1">
                  <span>{site?.location}</span>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(site?.status || '')} font-medium backdrop-blur-sm transform hover:scale-105 transition-all duration-300`}>
              {site?.status}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm" className="border-blue-500/40 text-blue-300 hover:bg-blue-500/20 bg-blue-500/5 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative">
          <div className="flex space-x-1 bg-slate-800/40 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-slate-700/50">
            {navItems.map((item, index) => (
              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === `/site/${siteId}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/30 transform scale-105"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-lg hover:scale-105"
                  }`
                }
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <item.icon className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="transition-all relative z-10">{item.title}</span>
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SiteTopBar;
