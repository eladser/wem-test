
import { NavLink } from "react-router-dom";
import { BarChart3, Zap, FileText } from "lucide-react";

interface SiteNavigationProps {
  siteId: string;
}

const SiteNavigation = ({ siteId }: SiteNavigationProps) => {
  const navItems = [
    { title: "Dashboard", path: `/site/${siteId}`, icon: BarChart3 },
    { title: "Assets", path: `/site/${siteId}/assets`, icon: Zap },
    { title: "Reports", path: `/site/${siteId}/reports`, icon: FileText },
  ];

  return (
    <nav className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 backdrop-blur-sm">
      {navItems.map((item, index) => (
        <NavLink
          key={item.title}
          to={item.path}
          end={item.path === `/site/${siteId}`}
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium transform hover:scale-105 animate-fade-in ${
              isActive
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-700 hover:shadow-md"
            }`
          }
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <item.icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="transition-all">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default SiteNavigation;
