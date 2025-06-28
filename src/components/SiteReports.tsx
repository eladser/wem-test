import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Clock, AlertTriangle, Download, Calendar, FileSpreadsheet, Printer, Eye, Share2, Settings2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const SiteReports = () => {
  const { siteId } = useParams();
  const [downloadingReports, setDownloadingReports] = useState<Set<number>>(new Set());
  
  const reportMetrics = [
    { month: "Jan", efficiency: 92, uptime: 99.5, incidents: 1, energyGenerated: 2840, revenue: 3420 },
    { month: "Feb", efficiency: 93, uptime: 99.7, incidents: 0, energyGenerated: 2650, revenue: 3180 },
    { month: "Mar", efficiency: 94, uptime: 99.8, incidents: 2, energyGenerated: 2980, revenue: 3576 },
    { month: "Apr", efficiency: 93.5, uptime: 99.6, incidents: 1, energyGenerated: 2890, revenue: 3468 },
    { month: "May", efficiency: 94.5, uptime: 99.9, incidents: 0, energyGenerated: 3120, revenue: 3744 },
    { month: "Jun", efficiency: 95, uptime: 99.95, incidents: 1, energyGenerated: 3250, revenue: 3900 }
  ];

  const reportTypeDistribution = [
    { name: "Performance", value: 35, color: "#10b981" },
    { name: "Financial", value: 25, color: "#3b82f6" },
    { name: "Maintenance", value: 20, color: "#f59e0b" },
    { name: "Compliance", value: 20, color: "#8b5cf6" }
  ];

  const availableReports = [
    { 
      id: 1, 
      name: "Daily Performance Report", 
      description: "Detailed performance metrics for each day", 
      type: "Performance",
      format: "PDF",
      size: "2.3 MB",
      lastGenerated: "2024-06-27",
      category: "operational",
      priority: "high"
    },
    { 
      id: 2, 
      name: "Monthly Efficiency Analysis", 
      description: "Comprehensive analysis of monthly efficiency trends", 
      type: "Efficiency",
      format: "XLSX",
      size: "1.8 MB",
      lastGenerated: "2024-06-26",
      category: "analytical",
      priority: "medium"
    },
    { 
      id: 3, 
      name: "Incident Log", 
      description: "Log of all incidents and resolutions", 
      type: "Incidents",
      format: "CSV",
      size: "456 KB",
      lastGenerated: "2024-06-27",
      category: "maintenance",
      priority: "high"
    },
    { 
      id: 4, 
      name: "Maintenance Schedule", 
      description: "Upcoming maintenance tasks and schedules", 
      type: "Maintenance",
      format: "PDF",
      size: "1.2 MB",
      lastGenerated: "2024-06-25",
      category: "maintenance",
      priority: "medium"
    },
    {
      id: 5,
      name: "Financial Performance Report",
      description: "Revenue, costs, and ROI analysis",
      type: "Financial",
      format: "XLSX",
      size: "3.1 MB",
      lastGenerated: "2024-06-27",
      category: "financial",
      priority: "high"
    },
    {
      id: 6,
      name: "Regulatory Compliance Report",
      description: "Environmental and safety compliance status",
      type: "Compliance",
      format: "PDF",
      size: "2.7 MB",
      lastGenerated: "2024-06-26",
      category: "compliance",
      priority: "medium"
    },
    {
      id: 7,
      name: "Energy Production Summary",
      description: "Monthly energy production and forecasting",
      type: "Production",
      format: "PDF",
      size: "1.9 MB",
      lastGenerated: "2024-06-27",
      category: "operational",
      priority: "high"
    },
    {
      id: 8,
      name: "Asset Health Report",
      description: "Equipment status and health monitoring",
      type: "Assets",
      format: "XLSX",
      size: "2.4 MB",
      lastGenerated: "2024-06-26",
      category: "maintenance",
      priority: "medium"
    }
  ];

  const handleDownload = async (report: typeof availableReports[0]) => {
    setDownloadingReports(prev => new Set([...prev, report.id]));
    
    try {
      // Simulate report generation/download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock file content based on report type
      let content = "";
      let mimeType = "";
      let filename = "";
      
      switch (report.format) {
        case "PDF":
          content = `Site ${siteId} - ${report.name}\n\nGenerated: ${new Date().toLocaleString()}\n\nReport Content:\n${report.description}\n\nThis is a mock PDF content for ${report.name}.`;
          mimeType = "application/pdf";
          filename = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${siteId}.pdf`;
          break;
          
        case "XLSX":
          // Mock Excel content as CSV for demonstration
          const csvData = reportMetrics.map(item => 
            `${item.month},${item.efficiency},${item.uptime},${item.incidents},${item.energyGenerated},${item.revenue}`
          ).join('\n');
          content = `Month,Efficiency,Uptime,Incidents,EnergyGenerated,Revenue\n${csvData}`;
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          filename = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${siteId}.xlsx`;
          break;
          
        case "CSV":
          content = `Date,Type,Description,Status,Resolution\n2024-06-01,Warning,Low wind speed detected,Resolved,Weather monitoring\n2024-06-15,Alert,Maintenance required,Scheduled,Routine check`;
          mimeType = "text/csv";
          filename = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${siteId}.csv`;
          break;
      }
      
      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${report.name} downloaded successfully!`);
    } catch (error) {
      toast.error(`Failed to download ${report.name}`);
      console.error('Download error:', error);
    } finally {
      setDownloadingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(report.id);
        return newSet;
      });
    }
  };

  const handleBulkDownload = async () => {
    toast.info("Preparing bulk download...");
    
    try {
      // Simulate bulk download preparation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a simple text file with all report summaries
      const bulkContent = `Site ${siteId} - Bulk Reports Download\n\nGenerated: ${new Date().toLocaleString()}\n\nAvailable Reports:\n\n${availableReports.map(report => 
        `${report.name}\n- Type: ${report.type}\n- Format: ${report.format}\n- Size: ${report.size}\n- Last Generated: ${report.lastGenerated}\n- Description: ${report.description}\n`
      ).join('\n')}`;
      
      const blob = new Blob([bulkContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-${siteId}-bulk-reports-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Bulk reports summary downloaded!");
    } catch (error) {
      toast.error("Failed to download bulk reports");
    }
  };

  const getReportIcon = (format: string) => {
    switch (format) {
      case "PDF":
        return FileText;
      case "XLSX":
        return FileSpreadsheet;
      case "CSV":
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Site Reports & Analytics</h1>
          <p className="text-slate-400">Download, schedule, and manage comprehensive site reports</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={handleBulkDownload}
            variant="outline" 
            className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Bulk Download
          </Button>
          
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
            onClick={() => toast.info("Report scheduling feature coming soon!")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Reports
          </Button>
          
          <Button 
            variant="outline" 
            className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
            onClick={() => toast.info("Report sharing coming soon!")}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Enhanced Report Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { title: "Reports Generated", value: "24", icon: FileText, color: "blue", change: "+3 this week" },
          { title: "Efficiency Score", value: "94.2%", icon: TrendingUp, color: "emerald", change: "+0.3% vs last month" },
          { title: "Uptime", value: "99.8%", icon: Clock, color: "green", change: "+0.1% vs target" },
          { title: "Incidents", value: "2", icon: AlertTriangle, color: "amber", change: "-1 vs last month" },
          { title: "Revenue", value: "$3,900", icon: TrendingUp, color: "purple", change: "+4.2% this month" },
          { title: "Data Points", value: "45.2K", icon: Eye, color: "cyan", change: "Real-time" }
        ].map((metric, index) => (
          <Card key={metric.title} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 text-${metric.color}-400`} />
                <span className="text-xs text-slate-500">Live</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <p className="text-xs text-slate-400">{metric.title}</p>
              <p className={`text-xs text-${metric.color}-400 mt-1`}>{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="text-white">Performance & Revenue Trends</CardTitle>
            <CardDescription className="text-slate-400">Monthly performance and financial overview</CardDescription>
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
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="Efficiency %" />
                <Line type="monotone" dataKey="uptime" stroke="#3b82f6" strokeWidth={3} name="Uptime %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Energy Production</CardTitle>
            <CardDescription className="text-slate-400">Monthly energy generation (kWh)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Bar dataKey="energyGenerated" fill="#f59e0b" name="Energy Generated (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="text-white">Report Categories</CardTitle>
            <CardDescription className="text-slate-400">Distribution of report types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportTypeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #8b5cf6',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Available Reports */}
      <Card className="bg-slate-900/50 border-slate-700/50 animate-slide-in-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Available Reports</CardTitle>
              <CardDescription className="text-slate-400">Downloadable reports for detailed analysis</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-slate-600 text-slate-300 hover:text-white"
              onClick={() => toast.info("Report filtering coming soon!")}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {availableReports.map((report) => {
              const ReportIcon = getReportIcon(report.format);
              const isDownloading = downloadingReports.has(report.id);
              
              return (
                <div key={report.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 hover:scale-[1.02]">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <ReportIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{report.name}</h4>
                        <Badge className={getPriorityColor(report.priority)} variant="outline">
                          {report.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-2 line-clamp-2">{report.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-slate-700/50">{report.type}</Badge>
                        <span className="text-xs text-slate-500">{report.format}</span>
                        <span className="text-xs text-slate-500">{report.size}</span>
                        <span className="text-xs text-slate-500">Updated: {report.lastGenerated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-slate-400 hover:text-white p-2"
                      onClick={() => toast.info("Report preview coming soon!")}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(report)}
                      disabled={isDownloading}
                      className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 min-w-[100px]"
                    >
                      {isDownloading ? (
                        <>
                          <Download className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">Generate custom reports and manage settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-400 hover:bg-blue-600/10 h-auto p-4 flex flex-col items-start"
              onClick={() => toast.info("Custom report builder coming soon!")}
            >
              <FileText className="w-6 h-6 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Generate Custom Report</div>
                <div className="text-xs text-slate-400 mt-1">Create reports with specific date ranges and metrics</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-purple-600 text-purple-400 hover:bg-purple-600/10 h-auto p-4 flex flex-col items-start"
              onClick={() => toast.info("Report automation coming soon!")}
            >
              <Calendar className="w-6 h-6 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Schedule Automated Reports</div>
                <div className="text-xs text-slate-400 mt-1">Set up daily, weekly, or monthly automated reports</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-amber-600 text-amber-400 hover:bg-amber-600/10 h-auto p-4 flex flex-col items-start"
              onClick={() => toast.info("Print functionality coming soon!")}
            >
              <Printer className="w-6 h-6 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Print Reports</div>
                <div className="text-xs text-slate-400 mt-1">Print or save reports in print-friendly format</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 h-auto p-4 flex flex-col items-start"
              onClick={() => toast.info("Analytics dashboard coming soon!")}
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <div className="text-left">
                <div className="font-semibold">Advanced Analytics</div>
                <div className="text-xs text-slate-400 mt-1">Explore detailed analytics and insights</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteReports;
