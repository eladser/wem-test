
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { mockRegions } from "@/services/mockDataService";
import SiteNavigation from "./SiteNavigation";

const SiteReports = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [dateRange, setDateRange] = useState("7d");
  const [reportType, setReportType] = useState("energy");

  if (!siteId) return <div>Site not found</div>;

  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);

  if (!site) return <div>Site not found</div>;

  const reportData = [
    {
      id: `RPT-${siteId}-001`,
      name: "Daily Energy Production",
      type: "Energy",
      date: "2024-06-24",
      status: "completed",
      size: "2.3 MB",
      records: "1,440"
    },
    {
      id: `RPT-${siteId}-002`,
      name: "Weekly Performance Summary",
      type: "Performance",
      date: "2024-06-23",
      status: "completed",
      size: "5.1 MB",
      records: "10,080"
    },
    {
      id: `RPT-${siteId}-003`,
      name: "Asset Health Report",
      type: "Maintenance",
      date: "2024-06-22",
      status: "processing",
      size: "1.8 MB",
      records: "720"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "processing": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const handleDownload = (reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
  };

  const handleGenerateReport = () => {
    toast.success(`Report generation started for ${site.name}. You'll be notified when it's ready.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports - {site.name}</h1>
          <p className="text-slate-400 mt-1">Generate and download reports for {site.location}</p>
        </div>
        <Button 
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <SiteNavigation siteId={siteId} />

      {/* Report Configuration */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Report Configuration</CardTitle>
          <CardDescription className="text-slate-400">
            Customize report parameters for {site.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="energy">Energy Production</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="1d">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Format</label>
              <Select defaultValue="excel">
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Capacity</p>
                <p className="text-2xl font-bold text-white">{site.totalCapacity} kW</p>
                <p className="text-green-400 text-sm">Installed capacity</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Current Output</p>
                <p className="text-2xl font-bold text-white">{site.currentOutput} kW</p>
                <p className="text-blue-400 text-sm">Real-time generation</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Efficiency</p>
                <p className="text-2xl font-bold text-white">{site.efficiency}%</p>
                <p className="text-yellow-400 text-sm">System performance</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Reports for {site.name}</CardTitle>
          <CardDescription className="text-slate-400">
            Download or regenerate your site-specific reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Report Name</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Size</TableHead>
                <TableHead className="text-slate-300">Records</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((report) => (
                <TableRow key={report.id} className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell className="text-white font-medium">{report.name}</TableCell>
                  <TableCell className="text-slate-300">{report.type}</TableCell>
                  <TableCell className="text-slate-300">{report.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{report.size}</TableCell>
                  <TableCell className="text-slate-300">{report.records}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(report.name)}
                      disabled={report.status !== "completed"}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteReports;
