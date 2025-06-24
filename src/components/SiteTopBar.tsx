
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
      case "online": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "maintenance": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "offline": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 px-8 py-6 shadow-xl">
      {/* Site Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{site?.name}</h1>
              <p className="text-emerald-400 text-sm font-medium">{site?.location}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(site?.status || '')} font-medium`}>
            {site?.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/5 backdrop-blur-sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/5 backdrop-blur-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex space-x-1 bg-slate-800/60 backdrop-blur-sm rounded-xl p-1.5 shadow-inner">
        {navItems.map((item, index) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === `/site/${siteId}`}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-md"
              }`
            }
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <item.icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="transition-all">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SiteTopBar;
