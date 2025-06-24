
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Zap, TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { mockRegions } from '@/services/mockDataService';
import { NavLink } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { month: 'Jan', production: 120, efficiency: 85 },
  { month: 'Feb', production: 135, efficiency: 87 },
  { month: 'Mar', production: 158, efficiency: 89 },
  { month: 'Apr', production: 162, efficiency: 91 },
  { month: 'May', production: 178, efficiency: 88 },
  { month: 'Jun', production: 195, efficiency: 92 },
];

const RegionOverview: React.FC = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const region = mockRegions.find(r => r.id === regionId);

  if (!region) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Region Not Found</h2>
          <p className="text-slate-600">The requested region could not be found.</p>
        </div>
      </div>
    );
  }

  const totalCapacity = region.sites.reduce((sum, site) => sum + site.totalCapacity, 0);
  const onlineSites = region.sites.filter(site => site.status === 'online').length;
  const maintenanceSites = region.sites.filter(site => site.status === 'maintenance').length;
  const offlineSites = region.sites.filter(site => site.status === 'offline').length;
  const overallEfficiency = 89.5; // Mock data
  const monthlyRevenue = 2450000; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-emerald-600" />
              {region.name} Region
            </h1>
            <p className="text-slate-600 mt-2">
              Managing {region.sites.length} energy sites with {totalCapacity}MW total capacity
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {onlineSites} Online
            </Badge>
            {maintenanceSites > 0 && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {maintenanceSites} Maintenance
              </Badge>
            )}
            {offlineSites > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {offlineSites} Offline
              </Badge>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Capacity</CardTitle>
              <Zap className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalCapacity}MW</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Across {region.sites.length} sites
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-blue-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">${(monthlyRevenue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.2% vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-amber-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Efficiency</CardTitle>
              <Activity className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{overallEfficiency}%</div>
              <Progress value={overallEfficiency} className="mt-2 h-2" />
              <p className="text-xs text-amber-600 mt-1">Regional average</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-red-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{maintenanceSites + offlineSites}</div>
              <p className="text-xs text-red-600 mt-1">Sites requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Trends */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Production Trends</CardTitle>
              <CardDescription>Monthly energy production for the region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Efficiency Chart */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Efficiency Metrics</CardTitle>
              <CardDescription>Regional efficiency performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="efficiency" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sites Overview */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Sites in {region.name}</CardTitle>
            <CardDescription>Overview of all energy sites in this region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {region.sites.map((site) => (
                <Card key={site.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-slate-900">{site.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${
                        site.status === 'online' ? 'bg-emerald-400' :
                        site.status === 'maintenance' ? 'bg-amber-400' : 
                        'bg-red-400'
                      }`} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Capacity:</span>
                        <span className="font-medium text-slate-900">{site.totalCapacity}MW</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Status:</span>
                        <Badge 
                          variant="outline" 
                          className={
                            site.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            site.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {site.status}
                        </Badge>
                      </div>
                      <div className="pt-2">
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <NavLink to={`/site/${site.id}`}>
                            View Details
                          </NavLink>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionOverview;
