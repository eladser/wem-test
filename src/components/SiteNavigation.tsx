import { NavLink, useParams } from "react-router-dom";
import { BarChart3, Zap, FileText, DollarSign, Users, Settings, Grid3X3 } from "lucide-react";

const SiteNavigation = () => {
  const { siteId } = useParams();

  const navItems = [
    { title: "Dashboard", path: `/site/${siteId}`, icon: BarChart3 },
    { title: "Grid", path: `/site/${siteId}/grid`, icon: Grid3X3 },
    { title: "Assets", path: `/site/${siteId}/assets`, icon: Zap },
    { title: "Reports", path: `/site/${siteId}/reports`, icon: FileText },
    { title: "Finances", path: `/site/${siteId}/finances`, icon: DollarSign },
    { title: "Team", path: `/site/${siteId}/team`, icon: Users },
    { title: "Settings", path: `/site/${siteId}/settings`, icon: Settings },
  ];

  return (
    <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
      <div className="flex space-x-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === `/site/${siteId}`}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SiteNavigation;