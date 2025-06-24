
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { getMockPowerData, getMockMetrics, getMockEnergyMix, mockRegions } from "@/services/mockDataService";
import SiteNavigation from "./SiteNavigation";

const SiteDashboard = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!siteId) return <div>Site not found</div>;

  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);
  const powerData = getMockPowerData(siteId);
  const metrics = getMockMetrics(siteId);
  const energyMix = getMockEnergyMix();

  if (!site) return <div>Site not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{site.name}</h1>
          <p className="text-slate-400 mt-1">
            {site.location} - {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 ${
          site.status === 'online' ? 'bg-green-500/10 border-green-500/20' :
          site.status === 'maintenance' ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-red-500/10 border-red-500/20'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            site.status === 'online' ? 'bg-green-500' :
            site.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className={`font-medium capitalize ${
            site.status === 'online' ? 'text-green-400' :
            site.status === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {site.status}
          </span>
        </div>
      </div>

      <SiteNavigation siteId={siteId} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 text-${metric.color}-400`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-400" : "text-red-400"}>
                  {metric.change}
                </span>
                <span className="text-slate-400 ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Power Generation Chart */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Power Generation - {site.name}</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time power output from all sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={powerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="solar" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="battery" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="grid" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Mix */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Energy Mix</CardTitle>
            <CardDescription className="text-slate-400">
              Current energy source distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                >
                  {energyMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {energyMix.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteDashboard;
