
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, BarChart3, Users, Calendar as CalendarIcon } from 'lucide-react';
import { theme } from '@/lib/theme';
import { LoadingButton } from '@/components/common/LoadingButton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  formats: string[];
}

const exportOptions: ExportOption[] = [
  {
    id: 'performance',
    label: 'Performance Report',
    description: 'Energy production, efficiency metrics, and KPIs',
    icon: <BarChart3 className="w-4 h-4" />,
    formats: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 'operations',
    label: 'Operations Log',
    description: 'System events, maintenance records, and alerts',
    icon: <FileText className="w-4 h-4" />,
    formats: ['PDF', 'CSV', 'JSON']
  },
  {
    id: 'team',
    label: 'Team Directory',
    description: 'Staff information and contact details',
    icon: <Users className="w-4 h-4" />,
    formats: ['PDF', 'Excel', 'CSV']
  }
];

export const ExportManager: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [isExporting, setIsExporting] = useState(false);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = async () => {
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one report type');
      return;
    }

    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optionLabels = selectedOptions
        .map(id => exportOptions.find(opt => opt.id === id)?.label)
        .join(', ');
      
      toast.success(`${optionLabels} exported successfully as ${format}`);
      console.log('Export completed:', {
        options: selectedOptions,
        format,
        dateRange,
        customStartDate: customStartDate?.toISOString(),
        customEndDate: customEndDate?.toISOString()
      });
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getAvailableFormats = () => {
    if (selectedOptions.length === 0) return [];
    
    const selectedOptionsData = selectedOptions.map(id => 
      exportOptions.find(opt => opt.id === id)
    ).filter(Boolean);
    
    // Get intersection of all formats
    return selectedOptionsData.reduce((acc, option) => {
      return acc.filter(format => option!.formats.includes(format));
    }, selectedOptionsData[0]!.formats);
  };

  const availableFormats = getAvailableFormats();

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-400" />
          <CardTitle className={theme.colors.text.primary}>Export Data</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Types */}
        <div>
          <h4 className={`text-sm font-medium ${theme.colors.text.secondary} mb-3`}>
            Select Report Types
          </h4>
          <div className="space-y-3">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${theme.colors.border.primary} ${
                  selectedOptions.includes(option.id) 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-slate-800/30'
                } transition-all duration-200`}
              >
                <Checkbox
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => handleOptionToggle(option.id)}
                  className="mt-0.5"
                />
                <div className="flex items-center gap-2 flex-1">
                  {option.icon}
                  <div>
                    <div className={`font-medium ${theme.colors.text.primary}`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${theme.colors.text.muted}`}>
                      {option.description}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {option.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <h4 className={`text-sm font-medium ${theme.colors.text.secondary} mb-3`}>
            Date Range
          </h4>
          <div className="flex gap-2 mb-3">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' },
              { value: 'custom', label: 'Custom' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={dateRange === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange(option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !customStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customStartDate ? format(customStartDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !customEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Format Selection */}
        <div>
          <h4 className={`text-sm font-medium ${theme.colors.text.secondary} mb-3`}>
            Export Format
          </h4>
          <Select
            value={format}
            onValueChange={setFormat}
            disabled={availableFormats.length === 0}
          >
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {availableFormats.map((fmt) => (
                <SelectItem key={fmt} value={fmt}>
                  {fmt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <div className="pt-4 border-t border-slate-700">
          <LoadingButton
            loading={isExporting}
            onClick={handleExport}
            disabled={selectedOptions.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Selected Reports
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
};
