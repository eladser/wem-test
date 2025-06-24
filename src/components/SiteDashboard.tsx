import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Zap, Battery, TrendingUp, AlertCircle } from "lucide-react";
import { mockRegions, generatePowerData } from "@/services/mockDataService";
import { Metric } from "@/types/energy";
import SiteNavigation from "./SiteNavigation";
import SiteTopBar from "./SiteTopBar";

const SiteDashboard = () => {
  const { siteId } = useParams();

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

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={metric.title} className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 text-${metric.color}-400 transition-transform hover:scale-110`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="flex items-center text-xs">
                  <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === "up" ? "text-green-400" : "text-red-400"} transition-colors`} />
                  <span className={metric.trend === "up" ? "text-green-400" : "text-red-400"}>
                    {metric.change}
                  </span>
                  <span className="text-slate-400 ml-1">from yesterday</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-white">Power Generation</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time power output from {site.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={powerData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="solar" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      className="animate-fade-in"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="battery" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      className="animate-fade-in"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="grid" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      className="animate-fade-in"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-white">Energy Mix</CardTitle>
              <CardDescription className="text-slate-400">
                Current distribution for {site.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={energyMix}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      className="animate-scale-in"
                    >
                      {energyMix.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {energyMix.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between hover:bg-slate-800/30 p-2 rounded transition-colors animate-fade-in"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full transition-transform hover:scale-110" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-slate-300 text-sm">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-400 animate-pulse" />
              <span>Recent Alerts for {site.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-white font-medium">Battery optimization recommended</p>
                    <p className="text-slate-400 text-sm">{site.name} - Battery Pack #1</p>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-200 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-white font-medium">Peak performance achieved</p>
                    <p className="text-slate-400 text-sm">{site.name} - Solar Array #1</p>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">15 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteDashboard;
