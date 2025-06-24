
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Zap, Battery, Clock, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for charts
  const powerData = [
    { time: "00:00", solar: 0, battery: 85, grid: 12 },
    { time: "06:00", solar: 45, battery: 80, grid: 8 },
    { time: "12:00", solar: 95, battery: 75, grid: 0 },
    { time: "18:00", solar: 25, battery: 70, grid: 15 },
    { time: "24:00", solar: 0, battery: 65, grid: 20 },
  ];

  const energyMix = [
    { name: "Solar", value: 65, color: "#10b981" },
    { name: "Battery", value: 25, color: "#3b82f6" },
    { name: "Grid", value: 10, color: "#f59e0b" },
  ];

  const metrics = [
    {
      title: "Current Power Output",
      value: "12.5 kW",
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
      value: "94.8%",
      change: "+0.3%",
      trend: "up",
      icon: Clock,
      color: "cyan"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Energy Dashboard</h1>
          <p className="text-slate-400 mt-1">
            {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">All Systems Operational</span>
        </div>
      </div>

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
            <CardTitle className="text-white">Power Generation</CardTitle>
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

      {/* Recent Alerts */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <span>Recent Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Battery optimization recommended</p>
                  <p className="text-slate-400 text-sm">Site A - Inverter #3</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Peak performance achieved</p>
                  <p className="text-slate-400 text-sm">Site B - Solar Array #1</p>
                </div>
              </div>
              <span className="text-slate-400 text-sm">15 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
