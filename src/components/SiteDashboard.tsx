
import { useParams } from "react-router-dom";
import { Zap, Battery, TrendingUp } from "lucide-react";
import { mockRegions, generatePowerData } from "@/services/mockDataService";
import { Metric } from "@/types/energy";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Enhanced Site Header - Now full width with better visual impact */}
      <EnhancedSiteHeader site={site} />
      
      {/* Main Content Area with New Layout */}
      <div className="relative z-10">
        {/* New Layout: Split into sidebar metrics and main content */}
        <div className="flex flex-col xl:flex-row gap-8 p-8 max-w-[1600px] mx-auto">
          
          {/* Left Sidebar - Metrics */}
          <div className="xl:w-80 space-y-6">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Live Metrics
              </h2>
              
              {/* Vertical Metrics Layout */}
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <div 
                    key={metric.title}
                    className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-500 group animate-fade-in hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-${metric.color}-500/10 rounded-xl group-hover:bg-${metric.color}-500/20 transition-colors duration-300`}>
                        <metric.icon className={`h-6 w-6 text-${metric.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full bg-${metric.color}-500/20 text-${metric.color}-400 border border-${metric.color}-500/30`}>
                        Live
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-medium text-slate-300 mb-2">
                      {metric.title}
                    </h3>
                    
                    <div className="text-3xl font-bold text-white mb-3">
                      {metric.value}
                    </div>
                    
                    <div className={`flex items-center gap-2 text-${metric.trend === 'up' ? 'emerald' : 'red'}-400`}>
                      <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium">{metric.change}</span>
                      <span className="text-xs text-slate-400 ml-1">vs yesterday</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-slate-800/50 rounded-full h-2 mt-4 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400 rounded-full transition-all duration-1000`}
                        style={{ 
                          width: `${Math.min(100, Math.max(0, 70 + (index * 10)))}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 space-y-8">
            
            {/* Top Charts Section - Better Proportioned */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Power Chart - Takes 3/5 of the width */}
              <div className="lg:col-span-3 animate-slide-in-left">
                <EnhancedPowerChart siteName={site.name} powerData={powerData} />
              </div>
              
              {/* Energy Mix - Takes 2/5 of the width */}
              <div className="lg:col-span-2 animate-slide-in-right">
                <EnhancedEnergyMix siteName={site.name} energyMix={energyMix} />
              </div>
            </div>

            {/* Bottom Section - Alerts with Better Spacing */}
            <div className="animate-slide-in-up">
              <EnhancedAlertsCard siteName={site.name} />
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-violet-400/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider">Monthly Target</p>
                    <p className="text-2xl font-bold text-white mt-1">87.2%</p>
                    <p className="text-emerald-400 text-xs mt-1">+12.3% vs last month</p>
                  </div>
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                    <TrendingUp className="w-6 h-6 text-violet-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-amber-400/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider">Carbon Saved</p>
                    <p className="text-2xl font-bold text-white mt-1">2.4T CO₂</p>
                    <p className="text-emerald-400 text-xs mt-1">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm uppercase tracking-wider">Cost Savings</p>
                    <p className="text-2xl font-bold text-white mt-1">$12,847</p>
                    <p className="text-emerald-400 text-xs mt-1">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <Battery className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDashboard;
