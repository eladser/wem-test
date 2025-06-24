import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Clock, AlertTriangle, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";

const SiteReports = () => {
  const { siteId } = useParams();
  
  const reportMetrics = [
    { month: "Jan", efficiency: 92, uptime: 99.5, incidents: 1 },
    { month: "Feb", efficiency: 93, uptime: 99.7, incidents: 0 },
    { month: "Mar", efficiency: 94, uptime: 99.8, incidents: 2 },
    { month: "Apr", efficiency: 93.5, uptime: 99.6, incidents: 1 },
    { month: "May", efficiency: 94.5, uptime: 99.9, incidents: 0 },
    { month: "Jun", efficiency: 95, uptime: 99.95, incidents: 1 }
  ];

  const availableReports = [
    { id: 1, name: "Daily Performance Report", description: "Detailed performance metrics for each day", type: "Performance" },
    { id: 2, name: "Monthly Efficiency Analysis", description: "Comprehensive analysis of monthly efficiency trends", type: "Efficiency" },
    { id: 3, name: "Incident Log", description: "Log of all incidents and resolutions", type: "Incidents" },
    { id: 4, name: "Maintenance Schedule", description: "Upcoming maintenance tasks and schedules", type: "Maintenance" }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Report Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Reports Generated", value: "24", icon: FileText, color: "blue" },
            { title: "Efficiency Score", value: "94.2%", icon: TrendingUp, color: "emerald" },
            { title: "Uptime", value: "99.8%", icon: Clock, color: "green" },
            { title: "Incidents", value: "2", icon: AlertTriangle, color: "amber" }
          ].map((metric, index) => (
            <Card key={metric.title} className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 text-${metric.color}-400`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <p className={`text-xs text-${metric.color}-400`}>Last 30 days</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-white">Performance Trends</CardTitle>
              <CardDescription className="text-slate-400">Monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="Efficiency" />
                  <Line type="monotone" dataKey="uptime" stroke="#3b82f6" strokeWidth={3} name="Uptime" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-white">Efficiency Over Time</CardTitle>
              <CardDescription className="text-slate-400">Historical efficiency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} name="Efficiency" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Available Reports</CardTitle>
            <CardDescription className="text-slate-400">Downloadable reports for detailed analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-emerald-900/20 hover:bg-slate-700/50 transition-all duration-200">
                  <div>
                    <h4 className="font-semibold text-white">{report.name}</h4>
                    <p className="text-slate-400 text-sm">{report.description}</p>
                    <Badge variant="secondary" className="mt-2">{report.type}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteReports;
