
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Filter, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [reportType, setReportType] = useState("energy");

  const reportData = [
    {
      id: "RPT-001",
      name: "Daily Energy Production",
      type: "Energy",
      date: "2024-06-24",
      site: "Site A - Main Campus",
      status: "completed",
      size: "2.3 MB",
      records: "1,440"
    },
    {
      id: "RPT-002",
      name: "Weekly Performance Summary",
      type: "Performance",
      date: "2024-06-23",
      site: "All Sites",
      status: "completed",
      size: "5.1 MB",
      records: "10,080"
    },
    {
      id: "RPT-003",
      name: "Asset Health Report",
      type: "Maintenance",
      date: "2024-06-22",
      site: "Site B - Warehouse",
      status: "processing",
      size: "1.8 MB",
      records: "720"
    },
    {
      id: "RPT-004",
      name: "Cost Analysis Report",
      type: "Financial",
      date: "2024-06-21",
      site: "Site C - Office Complex",
      status: "completed",
      size: "3.2 MB",
      records: "2,160"
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
    toast.success("Report generation started. You'll be notified when it's ready.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-slate-400 mt-1">Generate and download detailed energy reports</p>
        </div>
        <Button 
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Report Configuration */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Report Configuration</CardTitle>
          <CardDescription className="text-slate-400">
            Customize your report parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="text-sm font-medium text-slate-300">Site</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="site-a">Site A - Main Campus</SelectItem>
                  <SelectItem value="site-b">Site B - Warehouse</SelectItem>
                  <SelectItem value="site-c">Site C - Office Complex</SelectItem>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Reports Generated</p>
                <p className="text-2xl font-bold text-white">47</p>
                <p className="text-green-400 text-sm">+12% this month</p>
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
                <p className="text-slate-400 text-sm">Data Points</p>
                <p className="text-2xl font-bold text-white">2.4M</p>
                <p className="text-blue-400 text-sm">Collected this week</p>
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
                <p className="text-slate-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">156 GB</p>
                <p className="text-yellow-400 text-sm">78% of quota</p>
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
          <CardTitle className="text-white">Recent Reports</CardTitle>
          <CardDescription className="text-slate-400">
            Download or regenerate your recent reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Report Name</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Site</TableHead>
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
                  <TableCell className="text-slate-300">{report.site}</TableCell>
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

export default Reports;
