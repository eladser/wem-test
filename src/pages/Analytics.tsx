
import React from 'react';
import { TrendingUp, Zap, DollarSign, Activity, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { KPICard } from '@/components/analytics/KPICard';
import { AnalyticsToolbar } from '@/components/analytics/AnalyticsToolbar';
import { ChartCard } from '@/components/analytics/ChartCard';

const energyData = [
  { name: 'Jan', production: 850, consumption: 720, revenue: 125000 },
  { name: 'Feb', production: 920, consumption: 780, revenue: 135000 },
  { name: 'Mar', production: 1100, consumption: 890, revenue: 162000 },
  { name: 'Apr', production: 1250, consumption: 980, revenue: 184000 },
  { name: 'May', production: 1350, consumption: 1050, revenue: 198000 },
  { name: 'Jun', production: 1420, consumption: 1120, revenue: 208000 },
];

const regionData = [
  { name: 'North America', value: 45, color: '#10b981' },
  { name: 'Europe', value: 30, color: '#3b82f6' },
  { name: 'Asia Pacific', value: 25, color: '#f59e0b' },
];

const Analytics: React.FC = () => {
  const totalProduction = energyData.reduce((sum, item) => sum + item.production, 0);
  const totalRevenue = energyData.reduce((sum, item) => sum + item.revenue, 0);
  const avgEfficiency = 87.5;
  const totalSites = 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AnalyticsToolbar />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Production"
            value={`${totalProduction.toLocaleString()} MWh`}
            change="+12.5% from last quarter"
            icon={Zap}
            color="text-emerald-400"
            trend="up"
          />
          <KPICard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
            change="+8.3% from last quarter"
            icon={DollarSign}
            color="text-blue-400"
            trend="up"
          />
          <KPICard
            title="Avg Efficiency"
            value={`${avgEfficiency}%`}
            change="Above industry standard"
            icon={Activity}
            color="text-amber-400"
            trend="up"
          />
          <KPICard
            title="Active Sites"
            value={totalSites.toString()}
            change="Across 3 regions"
            icon={MapPin}
            color="text-purple-400"
            trend="up"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Energy Production Trends"
            description="Monthly production and consumption patterns"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Regional Distribution"
            description="Energy production by region"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-sm text-slate-300">{region.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Revenue Chart */}
        <ChartCard
          title="Revenue Analysis"
          description="Monthly revenue performance"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
