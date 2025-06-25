
import { useParams } from "react-router-dom";
import { Zap, Battery, TrendingUp } from "lucide-react";
import { mockRegions, generatePowerData } from "@/services/mockDataService";
import { Metric } from "@/types/energy";
import SiteTopBar from "./SiteTopBar";
import { EnhancedSiteHeader } from "./site/EnhancedSiteHeader";
import { EnhancedMetricsGrid } from "./site/EnhancedMetricsGrid";
import { EnhancedPowerChart } from "./site/EnhancedPowerChart";
import { EnhancedEnergyMix } from "./site/EnhancedEnergyMix";
import { EnhancedAlertsCard } from "./site/EnhancedAlertsCard";
import { usePerformance } from "@/hooks/usePerformance";

const SiteDashboard = () => {
  const { siteId } = useParams();
  const { logRenderTime } = usePerformance('SiteDashboard');

  if (!siteId) return <div>Site not found</div>;

  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);

  if (!site) return <div>Site not found</div>;

  const powerData = generatePowerData();
  const energyMix = [
    { name: "Solar", value: 65, color: "#f59e0b" },
    { name: "Battery", value: 25, color: "#3b82f6" },
    { name: "Grid", value: 10, color: "#10b981" },
  ];

  const metrics: Metric[] = [
    {
      title: "Current Power Output",
      value: `${site.currentOutput} kW`,
      change: "+8.2%",
      trend: "up",
      icon: Zap,
      color: "emerald"
    },
    {
      title: "Battery Level",
      value: "78%",
      change: "-2.1%", 
      trend: "down",
      icon: Battery,
      color: "blue"
    },
    {
      title: "Energy Today",
      value: "145.2 kWh",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "cyan"
    },
    {
      title: "System Efficiency",
      value: `${site.efficiency}%`,
      change: "+0.3%",
      trend: "up",
      icon: TrendingUp,
      color: "green"
    }
  ];

  logRenderTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Enhanced Site Header */}
      <EnhancedSiteHeader site={site} />
      
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Key Metrics */}
        <div className="animate-fade-in">
          <EnhancedMetricsGrid metrics={metrics} />
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 animate-slide-in-left">
            <EnhancedPowerChart siteName={site.name} powerData={powerData} />
          </div>
          <div className="animate-slide-in-right">
            <EnhancedEnergyMix siteName={site.name} energyMix={energyMix} />
          </div>
        </div>

        {/* Enhanced Alerts Section */}
        <div className="animate-slide-in-up">
          <EnhancedAlertsCard siteName={site.name} />
        </div>
      </div>
    </div>
  );
};

export default SiteDashboard;
