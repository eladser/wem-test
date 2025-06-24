
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Zap, Battery, TrendingUp, MapPin, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { NotificationCenter } from "@/components/common/NotificationCenter";

const Overview = () => {
  // Mock data for the overview dashboard
  const systemOverview = {
    totalSites: 12,
    totalCapacity: "156.8 MW",
    currentOutput: "89.2 MW", 
    efficiency: "92.4%",
    onlineSites: 11,
    maintenanceSites: 1
  };

  const energyData = [
    { time: "00:00", solar: 0, battery: 45, grid: 20 },
    { time: "04:00", solar: 5, battery: 40, grid: 18 },
    { time: "08:00", solar: 35, battery: 35, grid: 10 },
    { time: "12:00", solar: 85, battery: 30, grid: 5 },
    { time: "16:00", solar: 60, battery: 25, grid: 8 },
    { time: "20:00", solar: 15, battery: 35, grid: 15 },
    { time: "24:00", solar: 0, battery: 45, grid: 20 },
  ];

  const sitePerformance = [
    { name: "Site A", performance: 94, capacity: "25.4 MW" },
    { name: "Site B", performance: 87, capacity: "18.2 MW" },
    { name: "Site C", performance: 96, capacity: "31.8 MW" },
    { name: "Site D", performance: 91, capacity: "22.7 MW" },
    { name: "Site E", performance: 89, capacity: "19.3 MW" },
  ];

  const energyMix = [
    { name: "Solar", value: 68, color: "#10b981" },
    { name: "Battery", value: 22, color: "#3b82f6" },
    { name: "Grid", value: 10, color: "#f59e0b" },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Site B - Inverter #3 efficiency below threshold",
      time: "5 min ago",
      site: "Site B"
    },
    {
      id: 2,
      type: "success", 
      message: "Site A - Maintenance completed successfully",
      time: "1 hour ago",
      site: "Site A"
    },
    {
      id: 3,
      type: "info",
      message: "Scheduled maintenance for Site D tomorrow at 9 AM",
      time: "2 hours ago",
      site: "Site D"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Overview</h1>
          <p className="text-slate-400 mt-1">Monitor your entire renewable energy portfolio</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">
            {systemOverview.onlineSites}/{systemOverview.totalSites} Sites Online
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Sites</CardTitle>
            <MapPin className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemOverview.totalSites}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-green-400">{systemOverview.onlineSites} online</span> • 
              <span className="text-yellow-400 ml-1">{systemOverview.maintenanceSites} maintenance</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Capacity</CardTitle>
            <Zap className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemOverview.totalCapacity}</div>
            <p className="text-xs text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Output</CardTitle>
            <Battery className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemOverview.currentOutput}</div>
            <p className="text-xs text-slate-400 mt-1">
              57% of total capacity
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">System Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemOverview.efficiency}</div>
            <p className="text-xs text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2.1% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Generation Chart */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Energy Generation Overview</CardTitle>
            <CardDescription className="text-slate-400">
              24-hour energy production across all sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energyData}>
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
            <CardTitle className="text-white">Current Energy Mix</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time source distribution
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Performance */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Site Performance</CardTitle>
            <CardDescription className="text-slate-400">
              Current efficiency by site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sitePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="performance" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Notifications */}
        <NotificationCenter />
      </div>
    </div>
  );
};

export default Overview;
