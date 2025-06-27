import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Clock, AlertTriangle, Download, Calendar, FileSpreadsheet, Printer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";
import { toast } from "sonner";
import { useState } from "react";

const SiteReports = () => {
  const { siteId } = useParams();
  const [downloadingReports, setDownloadingReports] = useState<Set<number>>(new Set());
  
  const reportMetrics = [
    { month: "Jan", efficiency: 92, uptime: 99.5, incidents: 1 },
    { month: "Feb", efficiency: 93, uptime: 99.7, incidents: 0 },
    { month: "Mar", efficiency: 94, uptime: 99.8, incidents: 2 },
    { month: "Apr", efficiency: 93.5, uptime: 99.6, incidents: 1 },
    { month: "May", efficiency: 94.5, uptime: 99.9, incidents: 0 },
    { month: "Jun", efficiency: 95, uptime: 99.95, incidents: 1 }
  ];

  const availableReports = [
    { 
      id: 1, 
      name: "Daily Performance Report", 
      description: "Detailed performance metrics for each day", 
      type: "Performance",
      format: "PDF",
      size: "2.3 MB",
      lastGenerated: "2024-06-27"
    },
    { 
      id: 2, 
      name: "Monthly Efficiency Analysis", 
      description: "Comprehensive analysis of monthly efficiency trends", 
      type: "Efficiency",
      format: "XLSX",
      size: "1.8 MB",
      lastGenerated: "2024-06-26"
    },
    { 
      id: 3, 
      name: "Incident Log", 
      description: "Log of all incidents and resolutions", 
      type: "Incidents",
      format: "CSV",
      size: "456 KB",
      lastGenerated: "2024-06-27"
    },
    { 
      id: 4, 
      name: "Maintenance Schedule", 
      description: "Upcoming maintenance tasks and schedules", 
      type: "Maintenance",
      format: "PDF",
      size: "1.2 MB",
      lastGenerated: "2024-06-25"
    },
    {
      id: 5,
      name: "Financial Performance Report",
      description: "Revenue, costs, and ROI analysis",
      type: "Financial",
      format: "XLSX",
      size: "3.1 MB",
      lastGenerated: "2024-06-27"
    },
    {
      id: 6,
      name: "Regulatory Compliance Report",
      description: "Environmental and safety compliance status",
      type: "Compliance",
      format: "PDF",
      size: "2.7 MB",
      lastGenerated: "2024-06-26"
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
            `${item.month},${item.efficiency},${item.uptime},${item.incidents}`
          ).join('\n');
          content = `Month,Efficiency,Uptime,Incidents\n${csvData}`;
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

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Header with Bulk Actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Site Reports</h1>
            <p className="text-slate-400 mt-1">Download and manage site performance reports</p>
          </div>
          
          <div className="flex gap-3">
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
          </div>
        </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {availableReports.map((report) => {
                const ReportIcon = getReportIcon(report.format);
                const isDownloading = downloadingReports.has(report.id);
                
                return (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-emerald-900/20 hover:bg-slate-700/50 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <ReportIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{report.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{report.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">{report.type}</Badge>
                          <span className="text-xs text-slate-500">{report.format}</span>
                          <span className="text-xs text-slate-500">{report.size}</span>
                          <span className="text-xs text-slate-500">Updated: {report.lastGenerated}</span>
                        </div>
                      </div>
                    </div>
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
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-emerald-900/20">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">Generate custom reports and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteReports;