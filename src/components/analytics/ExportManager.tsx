import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileImage, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf' | 'png';
  timeRange: DateRange | undefined;
  includeCharts: boolean;
  includeSummary: boolean;
  includeRawData: boolean;
  selectedMetrics: string[];
}

interface ExportManagerProps {
  data: any[];
  title?: string;
  onExport?: (options: ExportOptions) => void;
}

const DEFAULT_METRICS = [
  'production',
  'consumption',
  'efficiency',
  'revenue',
  'costs',
  'uptime',
  'incidents'
];

export const ExportManager: React.FC<ExportManagerProps> = ({ 
  data, 
  title = "Analytics Data",
  onExport 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    timeRange: undefined,
    includeCharts: true,
    includeSummary: true,
    includeRawData: true,
    selectedMetrics: DEFAULT_METRICS
  });

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.error('No data available for export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate export based on format
      switch (exportOptions.format) {
        case 'csv':
          await exportToCSV();
          break;
        case 'xlsx':
          await exportToXLSX();
          break;
        case 'pdf':
          await exportToPDF();
          break;
        case 'png':
          await exportToPNG();
          break;
      }

      if (onExport) {
        onExport(exportOptions);
      }

      toast.success(`${title} exported successfully as ${exportOptions.format.toUpperCase()}`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    const headers = exportOptions.selectedMetrics.join(',');
    const rows = data.map(item => 
      exportOptions.selectedMetrics.map(metric => item[metric] || '').join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`);
  };

  const exportToXLSX = async () => {
    // Simulate XLSX export - in real implementation, use a library like xlsx
    const jsonData = data.map(item => {
      const filtered: any = {};
      exportOptions.selectedMetrics.forEach(metric => {
        filtered[metric] = item[metric];
      });
      return filtered;
    });
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    downloadFile(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.xlsx`);
  };

  const exportToPDF = async () => {
    // Simulate PDF export - in real implementation, use a library like jsPDF
    const pdfContent = `
      ${title} Report
      Generated: ${new Date().toLocaleString()}
      
      Summary:
      - Total Records: ${data.length}
      - Selected Metrics: ${exportOptions.selectedMetrics.join(', ')}
      - Time Range: ${exportOptions.timeRange ? 'Custom Range' : 'All Data'}
      
      Data:
      ${JSON.stringify(data, null, 2)}
    `;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    downloadFile(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
  };

  const exportToPNG = async () => {
    // Simulate chart screenshot - in real implementation, use html2canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple chart representation
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText(title, 50, 50);
      ctx.font = '16px Arial';
      ctx.fillText(`Exported: ${new Date().toLocaleString()}`, 50, 100);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        downloadFile(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-chart-${Date.now()}.png`);
      }
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleMetric = (metric: string) => {
    setExportOptions(prev => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.includes(metric)
        ? prev.selectedMetrics.filter(m => m !== metric)
        : [...prev.selectedMetrics, metric]
    }));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
      case 'xlsx':
        return FileSpreadsheet;
      case 'pdf':
        return FileText;
      case 'png':
        return FileImage;
      default:
        return Download;
    }
  };

  const FormatIcon = getFormatIcon(exportOptions.format);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Export {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label className="text-slate-300">Export Format</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value: 'csv' | 'xlsx' | 'pdf' | 'png') =>
                setExportOptions(prev => ({ ...prev, format: value }))
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="csv">CSV - Comma Separated Values</SelectItem>
                <SelectItem value="xlsx">XLSX - Excel Spreadsheet</SelectItem>
                <SelectItem value="pdf">PDF - Portable Document</SelectItem>
                <SelectItem value="png">PNG - Chart Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Range Selection */}
          <div className="space-y-2">
            <Label className="text-slate-300">Time Range (Optional)</Label>
            <DatePickerWithRange 
              date={exportOptions.timeRange}
              onDateChange={(range) => 
                setExportOptions(prev => ({ ...prev, timeRange: range }))
              }
            />
          </div>

          {/* Content Options */}
          <div className="space-y-3">
            <Label className="text-slate-300">Include in Export</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                  }
                />
                <Label htmlFor="charts" className="text-slate-400">Charts and Visualizations</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={exportOptions.includeSummary}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeSummary: !!checked }))
                  }
                />
                <Label htmlFor="summary" className="text-slate-400">Executive Summary</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rawdata"
                  checked={exportOptions.includeRawData}
                  onCheckedChange={(checked) =>
                    setExportOptions(prev => ({ ...prev, includeRawData: !!checked }))
                  }
                />
                <Label htmlFor="rawdata" className="text-slate-400">Raw Data</Label>
              </div>
            </div>
          </div>

          {/* Metrics Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300">Metrics to Include</Label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_METRICS.map(metric => (
                <div key={metric} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric}
                    checked={exportOptions.selectedMetrics.includes(metric)}
                    onCheckedChange={() => toggleMetric(metric)}
                  />
                  <Label 
                    htmlFor={metric} 
                    className="text-slate-400 capitalize"
                  >
                    {metric}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Preview */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Export Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">
              <div className="space-y-1">
                <div>Format: {exportOptions.format.toUpperCase()}</div>
                <div>Records: {data?.length || 0}</div>
                <div>Metrics: {exportOptions.selectedMetrics.length}</div>
                <div>
                  Size: ~{Math.round((data?.length || 0) * exportOptions.selectedMetrics.length * 10 / 1024)} KB
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isExporting || exportOptions.selectedMetrics.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isExporting ? (
              <>
                <Download className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FormatIcon className="w-4 h-4 mr-2" />
                Export as {exportOptions.format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportManager;
