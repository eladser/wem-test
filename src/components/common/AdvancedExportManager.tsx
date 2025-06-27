import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Image,
  Database,
  Calendar,
  Filter,
  Settings,
  Clock,
  Users,
  Globe,
  Mail,
  Share2,
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf' | 'png' | 'svg';
type DataType = 'overview' | 'analytics' | 'sites' | 'regions' | 'performance' | 'financial' | 'alerts';
type ExportScope = 'current' | 'filtered' | 'all' | 'custom';
type ScheduleFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

interface ExportOptions {
  format: ExportFormat;
  dataType: DataType;
  scope: ExportScope;
  dateRange: {
    start: string;
    end: string;
  };
  includeMetadata: boolean;
  includeCharts: boolean;
  includeRawData: boolean;
  compress: boolean;
  password?: string;
  customFields: string[];
  schedule: {
    enabled: boolean;
    frequency: ScheduleFrequency;
    time: string;
    recipients: string[];
  };
}

interface ExportManagerProps {
  data?: any;
  title?: string;
  defaultFormat?: ExportFormat;
  defaultDataType?: DataType;
  onExport?: (options: ExportOptions) => void;
  availableDataTypes?: DataType[];
  className?: string;
  trigger?: React.ReactNode;
}

// Default export options
const defaultExportOptions: ExportOptions = {
  format: 'csv',
  dataType: 'overview',
  scope: 'current',
  dateRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  },
  includeMetadata: true,
  includeCharts: false,
  includeRawData: true,
  compress: false,
  customFields: [],
  schedule: {
    enabled: false,
    frequency: 'none',
    time: '09:00',
    recipients: []
  }
};

// Format configurations
const formatConfigs = {
  csv: {
    name: 'CSV',
    description: 'Comma-separated values',
    icon: FileSpreadsheet,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    maxSize: '50MB',
    features: ['Raw data', 'Excel compatible', 'Lightweight']
  },
  xlsx: {
    name: 'Excel',
    description: 'Microsoft Excel format',
    icon: FileSpreadsheet,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    maxSize: '100MB',
    features: ['Formatted data', 'Multiple sheets', 'Charts supported']
  },
  json: {
    name: 'JSON',
    description: 'JavaScript Object Notation',
    icon: Database,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    maxSize: '200MB',
    features: ['Structured data', 'API compatible', 'Nested objects']
  },
  pdf: {
    name: 'PDF',
    description: 'Portable Document Format',
    icon: FileText,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    maxSize: '25MB',
    features: ['Print ready', 'Charts included', 'Formatted layout']
  },
  png: {
    name: 'PNG',
    description: 'Portable Network Graphics',
    icon: Image,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    maxSize: '10MB',
    features: ['High quality', 'Dashboard snapshots', 'Print ready']
  },
  svg: {
    name: 'SVG',
    description: 'Scalable Vector Graphics',
    icon: Image,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    maxSize: '5MB',
    features: ['Vector graphics', 'Scalable', 'Web compatible']
  }
};

// Data type configurations
const dataTypeConfigs = {
  overview: { name: 'Overview Dashboard', description: 'Main dashboard metrics and summaries' },
  analytics: { name: 'Analytics Data', description: 'Detailed performance analytics and trends' },
  sites: { name: 'Site Information', description: 'Individual site data and configurations' },
  regions: { name: 'Regional Data', description: 'Regional summaries and comparisons' },
  performance: { name: 'Performance Metrics', description: 'System performance and efficiency data' },
  financial: { name: 'Financial Reports', description: 'Revenue, costs, and financial analysis' },
  alerts: { name: 'Alerts & Notifications', description: 'System alerts and notification history' }
};

export const AdvancedExportManager: React.FC<ExportManagerProps> = ({
  data,
  title = 'Dashboard Data',
  defaultFormat = 'csv',
  defaultDataType = 'overview',
  onExport,
  availableDataTypes = ['overview', 'analytics', 'sites', 'regions'],
  className,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    ...defaultExportOptions,
    format: defaultFormat,
    dataType: defaultDataType
  });
  const [isExporting, setIsExporting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newRecipient, setNewRecipient] = useState('');

  // Update options
  const updateOptions = useCallback((updates: Partial<ExportOptions>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  }, []);

  // Add recipient for scheduled exports
  const addRecipient = useCallback(() => {
    if (newRecipient && newRecipient.includes('@')) {
      updateOptions({
        schedule: {
          ...options.schedule,
          recipients: [...options.schedule.recipients, newRecipient]
        }
      });
      setNewRecipient('');
    }
  }, [newRecipient, options.schedule, updateOptions]);

  // Remove recipient
  const removeRecipient = useCallback((email: string) => {
    updateOptions({
      schedule: {
        ...options.schedule,
        recipients: options.schedule.recipients.filter(r => r !== email)
      }
    });
  }, [options.schedule, updateOptions]);

  // Handle export
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onExport) {
        onExport(options);
      } else {
        // Default export logic
        const filename = `${title}-${options.dataType}-${new Date().toISOString().split('T')[0]}.${options.format}`;
        console.log('Exporting:', { filename, options, data });
      }

      toast.success(
        `Export completed successfully!`,
        {
          description: `${formatConfigs[options.format].name} file has been generated and downloaded.`
        }
      );
      
      setIsOpen(false);
      setCurrentStep(1);
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsExporting(false);
    }
  }, [options, onExport, title, data]);

  // Get estimated file size
  const estimatedSize = useMemo(() => {
    const baseSize = data ? JSON.stringify(data).length : 1000;
    const multiplier = options.format === 'pdf' ? 5 : options.format === 'xlsx' ? 3 : 1;
    const sizeKB = Math.ceil((baseSize * multiplier) / 1024);
    
    if (sizeKB < 1024) return `${sizeKB} KB`;
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  }, [data, options.format]);

  // Quick export dropdown
  const QuickExportDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="outline" className={cn("border-slate-600 text-slate-300", className)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700">
        <DropdownMenuLabel className="text-white">Quick Export</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        
        {Object.entries(formatConfigs).slice(0, 3).map(([format, config]) => (
          <DropdownMenuItem
            key={format}
            onClick={() => {
              const quickOptions = { ...defaultExportOptions, format: format as ExportFormat, dataType: defaultDataType };
              if (onExport) onExport(quickOptions);
              toast.success(`Exporting as ${config.name}...`);
            }}
            className="text-slate-300 hover:bg-slate-800 focus:bg-slate-800"
          >
            <config.icon className={`w-4 h-4 mr-2 ${config.color}`} />
            {config.name}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-slate-700" />
        
        <DropdownMenuItem
          onClick={() => setIsOpen(true)}
          className="text-slate-300 hover:bg-slate-800 focus:bg-slate-800"
        >
          <Settings className="w-4 h-4 mr-2 text-slate-400" />
          Advanced Options
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <QuickExportDropdown />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5" />
              Advanced Export Options
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure detailed export settings for {title}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 my-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step 
                    ? "bg-blue-500 text-white" 
                    : "bg-slate-700 text-slate-400"
                )}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2 transition-colors",
                    currentStep > step ? "bg-blue-500" : "bg-slate-700"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Step 1: Format & Data Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">1. Choose Format & Data</h3>
                  
                  {/* Format Selection */}
                  <div className="space-y-4">
                    <Label className="text-white">Export Format</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(formatConfigs).map(([format, config]) => (
                        <Card
                          key={format}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:scale-105",
                            options.format === format 
                              ? `${config.bgColor} ${config.borderColor} border-2` 
                              : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                          )}
                          onClick={() => updateOptions({ format: format as ExportFormat })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <config.icon className={`w-5 h-5 ${config.color}`} />
                              <h4 className="font-medium text-white">{config.name}</h4>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{config.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {config.features.slice(0, 2).map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Data Type Selection */}
                  <div className="space-y-4">
                    <Label className="text-white">Data Type</Label>
                    <Select value={options.dataType} onValueChange={(value) => updateOptions({ dataType: value as DataType })}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {availableDataTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                            <div>
                              <div className="font-medium">{dataTypeConfigs[type].name}</div>
                              <div className="text-xs text-slate-400">{dataTypeConfigs[type].description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scope Selection */}
                  <div className="space-y-4">
                    <Label className="text-white">Export Scope</Label>
                    <RadioGroup 
                      value={options.scope} 
                      onValueChange={(value) => updateOptions({ scope: value as ExportScope })}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="current" id="current" className="border-slate-600" />
                        <Label htmlFor="current" className="text-slate-300">Current view data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="filtered" id="filtered" className="border-slate-600" />
                        <Label htmlFor="filtered" className="text-slate-300">Filtered results only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" className="border-slate-600" />
                        <Label htmlFor="all" className="text-slate-300">All available data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" className="border-slate-600" />
                        <Label htmlFor="custom" className="text-slate-300">Custom date range</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Date Range (if custom scope) */}
                  {options.scope === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Start Date</Label>
                        <Input
                          type="date"
                          value={options.dateRange.start}
                          onChange={(e) => updateOptions({
                            dateRange: { ...options.dateRange, start: e.target.value }
                          })}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">End Date</Label>
                        <Input
                          type="date"
                          value={options.dateRange.end}
                          onChange={(e) => updateOptions({
                            dateRange: { ...options.dateRange, end: e.target.value }
                          })}
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Export Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white mb-4">2. Configure Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Content Options */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-base">Content Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="metadata"
                          checked={options.includeMetadata}
                          onCheckedChange={(checked) => updateOptions({ includeMetadata: checked as boolean })}
                          className="border-slate-600"
                        />
                        <Label htmlFor="metadata" className="text-slate-300">Include metadata</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="charts"
                          checked={options.includeCharts}
                          onCheckedChange={(checked) => updateOptions({ includeCharts: checked as boolean })}
                          className="border-slate-600"
                        />
                        <Label htmlFor="charts" className="text-slate-300">Include charts</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="rawdata"
                          checked={options.includeRawData}
                          onCheckedChange={(checked) => updateOptions({ includeRawData: checked as boolean })}
                          className="border-slate-600"
                        />
                        <Label htmlFor="rawdata" className="text-slate-300">Include raw data</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="compress"
                          checked={options.compress}
                          onCheckedChange={(checked) => updateOptions({ compress: checked as boolean })}
                          className="border-slate-600"
                        />
                        <Label htmlFor="compress" className="text-slate-300">Compress file</Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Options */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-base">Security Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Password Protection</Label>
                        <Input
                          type="password"
                          placeholder="Optional password"
                          value={options.password || ''}
                          onChange={(e) => updateOptions({ password: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <p className="text-xs text-slate-400">Leave empty for no password protection</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* File Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Export Summary</p>
                          <p className="text-sm text-slate-400">
                            {formatConfigs[options.format].name} • {dataTypeConfigs[options.dataType].name} • Estimated size: {estimatedSize}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {options.scope}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Schedule & Delivery */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white mb-4">3. Schedule & Delivery</h3>
                
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduled Exports
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Automatically generate and send exports on a schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="schedule"
                        checked={options.schedule.enabled}
                        onCheckedChange={(checked) => updateOptions({
                          schedule: { ...options.schedule, enabled: checked as boolean }
                        })}
                        className="border-slate-600"
                      />
                      <Label htmlFor="schedule" className="text-slate-300">Enable scheduled exports</Label>
                    </div>

                    {options.schedule.enabled && (
                      <div className="space-y-4 ml-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Frequency</Label>
                            <Select 
                              value={options.schedule.frequency} 
                              onValueChange={(value) => updateOptions({
                                schedule: { ...options.schedule, frequency: value as ScheduleFrequency }
                              })}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="daily" className="text-white">Daily</SelectItem>
                                <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                                <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white">Time</Label>
                            <Input
                              type="time"
                              value={options.schedule.time}
                              onChange={(e) => updateOptions({
                                schedule: { ...options.schedule, time: e.target.value }
                              })}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Email Recipients</Label>
                          <div className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              value={newRecipient}
                              onChange={(e) => setNewRecipient(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white flex-1"
                              onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                            />
                            <Button onClick={addRecipient} size="sm" variant="outline" className="border-slate-600">
                              Add
                            </Button>
                          </div>
                          
                          {options.schedule.recipients.length > 0 && (
                            <div className="space-y-2 mt-3">
                              {options.schedule.recipients.map((email, index) => (
                                <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg">
                                  <span className="text-slate-300 text-sm">{email}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeRecipient(email)}
                                    className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="border-slate-600 text-slate-300"
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};