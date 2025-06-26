import React, { useState, useCallback } from 'react';
import { Download, FileText, Image, Table, BarChart3, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useNotify } from '@/components/notifications/NotificationSystem';
import { useOperationPerformance } from '@/hooks/useAdvancedPerformance';

// Export types
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'png' | 'json';
export type ExportDataType = 'energy-data' | 'site-metrics' | 'analytics' | 'reports' | 'assets';

interface ExportOptions {
  format: ExportFormat;
  dataType: ExportDataType;
  dateRange?: { from: Date; to: Date };
  includeCharts?: boolean;
  includeMetadata?: boolean;
  customFields?: string[];
  filename?: string;
}

interface ExportData {
  headers: string[];
  rows: any[][];
  metadata?: Record<string, any>;
  charts?: HTMLElement[];
}

// Export utility functions
class ExportManager {
  private static formatFilename(basename: string, format: ExportFormat): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    return `${basename}-${timestamp}.${format}`;
  }

  static async exportToCSV(data: ExportData, filename: string): Promise<void> {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => 
        row.map(cell => {
          // Handle cells with commas, quotes, or line breaks
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, this.formatFilename(filename, 'csv'));
  }

  static async exportToExcel(data: ExportData, filename: string): Promise<void> {
    // Mock Excel export - in real app you'd use a library like SheetJS
    const csvContent = [
      data.headers.join('\t'),
      ...data.rows.map(row => row.join('\t'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    this.downloadBlob(blob, this.formatFilename(filename, 'xlsx'));
  }

  static async exportToPDF(data: ExportData, filename: string, options: { includeCharts?: boolean } = {}): Promise<void> {
    // Mock PDF export - in real app you'd use jsPDF or similar
    const content = [
      'Energy Management Report',
      '=========================',
      '',
      ...(data.metadata ? Object.entries(data.metadata).map(([k, v]) => `${k}: ${v}`) : []),
      '',
      data.headers.join(' | '),
      '-'.repeat(data.headers.join(' | ').length),
      ...data.rows.slice(0, 20).map(row => row.join(' | '))
    ].join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    this.downloadBlob(blob, this.formatFilename(filename, 'pdf'));
  }

  static async exportToPNG(element: HTMLElement, filename: string): Promise<void> {
    // Mock PNG export - in real app you'd use html2canvas
    const blob = new Blob(['Mock PNG data'], { type: 'image/png' });
    this.downloadBlob(blob, this.formatFilename(filename, 'png'));
  }

  static async exportToJSON(data: ExportData, filename: string): Promise<void> {
    const jsonData = {
      exportDate: new Date().toISOString(),
      headers: data.headers,
      data: data.rows,
      metadata: data.metadata
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, this.formatFilename(filename, 'json'));
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Mock data generator for demo
const generateMockData = (dataType: ExportDataType, dateRange?: { from: Date; to: Date }): ExportData => {
  const baseData: Record<ExportDataType, ExportData> = {
    'energy-data': {
      headers: ['Timestamp', 'Site', 'Generation (kWh)', 'Consumption (kWh)', 'Efficiency (%)', 'Status'],
      rows: Array.from({ length: 100 }, (_, i) => [
        new Date(Date.now() - i * 3600000).toISOString(),
        `Site ${Math.floor(Math.random() * 5) + 1}`,
        (Math.random() * 1000).toFixed(2),
        (Math.random() * 800).toFixed(2),
        (85 + Math.random() * 15).toFixed(1),
        Math.random() > 0.1 ? 'Online' : 'Maintenance'
      ]),
      metadata: {
        'Export Type': 'Energy Data',
        'Total Records': 100,
        'Date Range': dateRange ? `${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}` : 'All Time',
        'Generated': new Date().toISOString()
      }
    },
    'site-metrics': {
      headers: ['Site ID', 'Name', 'Location', 'Capacity (MW)', 'Current Output (MW)', 'Uptime (%)'],
      rows: Array.from({ length: 20 }, (_, i) => [
        `SITE${i + 1}`,
        `Energy Site ${i + 1}`,
        `Location ${i + 1}`,
        (Math.random() * 50 + 10).toFixed(1),
        (Math.random() * 40 + 5).toFixed(1),
        (95 + Math.random() * 5).toFixed(2)
      ]),
      metadata: { 'Export Type': 'Site Metrics', 'Total Sites': 20 }
    },
    'analytics': {
      headers: ['Metric', 'Value', 'Unit', 'Trend', 'Last Updated'],
      rows: [
        ['Total Generation', '1,234,567', 'kWh', '+5.2%', new Date().toISOString()],
        ['System Efficiency', '92.1', '%', '+1.1%', new Date().toISOString()],
        ['Active Sites', '18', 'sites', '0%', new Date().toISOString()],
        ['Average Uptime', '98.7', '%', '+0.3%', new Date().toISOString()]
      ],
      metadata: { 'Export Type': 'Analytics Summary' }
    },
    'reports': {
      headers: ['Report Type', 'Generated', 'Status', 'File Size', 'Downloads'],
      rows: [
        ['Monthly Summary', '2024-01-01', 'Ready', '2.1 MB', '45'],
        ['Performance Analysis', '2024-01-02', 'Processing', '-', '0'],
        ['Efficiency Report', '2024-01-03', 'Ready', '1.8 MB', '32']
      ],
      metadata: { 'Export Type': 'Reports List' }
    },
    'assets': {
      headers: ['Asset ID', 'Type', 'Model', 'Installation Date', 'Status', 'Last Maintenance'],
      rows: Array.from({ length: 50 }, (_, i) => [
        `AST${i + 1}`,
        ['Solar Panel', 'Wind Turbine', 'Battery', 'Inverter'][Math.floor(Math.random() * 4)],
        `Model-${Math.floor(Math.random() * 100)}`,
        new Date(2020 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toDateString(),
        ['Active', 'Maintenance', 'Inactive'][Math.floor(Math.random() * 3)],
        new Date(Date.now() - Math.random() * 90 * 24 * 3600000).toDateString()
      ]),
      metadata: { 'Export Type': 'Assets Inventory', 'Total Assets': 50 }
    }
  };

  return baseData[dataType];
};

// Export component
interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDataType?: ExportDataType;
  chartElements?: HTMLElement[];
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  defaultDataType = 'energy-data',
  chartElements = []
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    dataType: defaultDataType,
    includeCharts: false,
    includeMetadata: true,
    filename: 'energy-export'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const notify = useNotify();
  const { measure } = useOperationPerformance();

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setProgress(0);

    try {
      await measure('export-operation', async () => {
        // Generate data
        setProgress(20);
        const data = generateMockData(options.dataType, options.dateRange);
        
        // Add charts if requested
        if (options.includeCharts && chartElements.length > 0) {
          data.charts = chartElements;
        }

        setProgress(50);

        // Export based on format
        switch (options.format) {
          case 'csv':
            await ExportManager.exportToCSV(data, options.filename || 'export');
            break;
          case 'xlsx':
            await ExportManager.exportToExcel(data, options.filename || 'export');
            break;
          case 'pdf':
            await ExportManager.exportToPDF(data, options.filename || 'export', {
              includeCharts: options.includeCharts
            });
            break;
          case 'json':
            await ExportManager.exportToJSON(data, options.filename || 'export');
            break;
          case 'png':
            if (chartElements.length > 0) {
              await ExportManager.exportToPNG(chartElements[0], options.filename || 'chart');
            } else {
              throw new Error('No chart elements available for PNG export');
            }
            break;
          default:
            throw new Error(`Unsupported export format: ${options.format}`);
        }

        setProgress(100);
        notify.success('Export Complete', `Data exported as ${options.format.toUpperCase()}`);
      });
    } catch (error) {
      console.error('Export failed:', error);
      notify.error('Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
        onClose();
      }, 1000);
    }
  }, [options, chartElements, notify, measure, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Data Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Data Type</label>
            <Select
              value={options.dataType}
              onValueChange={(value: ExportDataType) => setOptions(prev => ({ ...prev, dataType: value }))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="energy-data">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Energy Data
                  </div>
                </SelectItem>
                <SelectItem value="site-metrics">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Site Metrics
                  </div>
                </SelectItem>
                <SelectItem value="analytics">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Analytics
                  </div>
                </SelectItem>
                <SelectItem value="reports">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reports
                  </div>
                </SelectItem>
                <SelectItem value="assets">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Assets
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Format</label>
            <Select
              value={options.format}
              onValueChange={(value: ExportFormat) => setOptions(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
                {chartElements.length > 0 && (
                  <SelectItem value="png">PNG Image</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Filename</label>
            <Input
              value={options.filename}
              onChange={(e) => setOptions(prev => ({ ...prev, filename: e.target.value }))}
              placeholder="Enter filename"
              className="bg-slate-800 border-slate-600"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={options.includeMetadata}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeMetadata: !!checked }))
                }
              />
              <label htmlFor="metadata" className="text-sm text-slate-300">
                Include metadata
              </label>
            </div>

            {chartElements.length > 0 && options.format !== 'png' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={options.includeCharts}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeCharts: !!checked }))
                  }
                />
                <label htmlFor="charts" className="text-sm text-slate-300">
                  Include charts
                </label>
              </div>
            )}
          </div>

          {/* Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Exporting...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Quick export button component
export const QuickExportButton: React.FC<{
  dataType: ExportDataType;
  format: ExportFormat;
  filename?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ dataType, format, filename, children, className }) => {
  const notify = useNotify();
  const { measure } = useOperationPerformance();

  const handleQuickExport = async () => {
    try {
      await measure(`quick-export-${format}`, async () => {
        const data = generateMockData(dataType);
        
        switch (format) {
          case 'csv':
            await ExportManager.exportToCSV(data, filename || dataType);
            break;
          case 'xlsx':
            await ExportManager.exportToExcel(data, filename || dataType);
            break;
          case 'json':
            await ExportManager.exportToJSON(data, filename || dataType);
            break;
          default:
            throw new Error(`Quick export not supported for ${format}`);
        }
        
        notify.success('Export Complete', `${dataType} exported as ${format.toUpperCase()}`);
      });
    } catch (error) {
      notify.error('Export Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <Button onClick={handleQuickExport} className={className}>
      {children}
    </Button>
  );
};

export default ExportManager;