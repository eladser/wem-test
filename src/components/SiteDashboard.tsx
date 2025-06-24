
import { useParams } from "react-router-dom";
import { Zap, Battery, TrendingUp } from "lucide-react";
import { mockRegions, generatePowerData } from "@/services/mockDataService";
import { Metric } from "@/types/energy";
import SiteTopBar from "./SiteTopBar";
import { MetricsGrid } from "./site/MetricsGrid";
import { PowerGenerationChart } from "./site/PowerGenerationChart";
import { EnergyMixChart } from "./site/EnergyMixChart";
import { RecentAlertsCard } from "./site/RecentAlertsCard";
import { usePerformance } from "@/hooks/usePerformance";

const SiteDashboard = () => {
  const { siteId } = useParams();
  const { logRenderTime } = usePerformance('SiteDashboard');

  if (!siteId) return <div>Site not found</div>;

  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);

  if (!site) return <div>Site not found</div>;

  const powerData = generatePowerData();
  const energyMix = [
    { name: "Solar", value: 65, color: "#10b981" },
    { name: "Battery", value: 25, color: "#3b82f6" },
    { name: "Grid", value: 10, color: "#f59e0b" },
  ];

  const metrics: Metric[] = [
    {
      title: "Current Power Output",
      value: `${site.currentOutput} kW`,
      change: "+8.2%",
      trend: "up",
      icon: Zap,
      color: "green"
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
      color: "emerald"
    },
    {
      title: "System Efficiency",
      value: `${site.efficiency}%`,
      change: "+0.3%",
      trend: "up",
      icon: TrendingUp,
      color: "cyan"
    }
  ];

  logRenderTime();

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <MetricsGrid metrics={metrics} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PowerGenerationChart siteName={site.name} powerData={powerData} />
          <EnergyMixChart siteName={site.name} energyMix={energyMix} />
        </div>

        {/* Recent Activities */}
        <RecentAlertsCard siteName={site.name} />
      </div>
    </div>
  );
};

export default SiteDashboard;
