
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { theme } from '@/lib/theme';

interface ExportJob {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'xlsx';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  estimatedCompletion?: Date;
  downloadUrl?: string;
}

export const ExportManager: React.FC = () => {
  const [jobs, setJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Q4 Energy Report',
      type: 'pdf',
      status: 'completed',
      progress: 100,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Site Performance Data',
      type: 'csv',
      status: 'processing',
      progress: 65,
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      estimatedCompletion: new Date(Date.now() + 1000 * 60 * 5)
    },
    {
      id: '3',
      name: 'Maintenance Schedule',
      type: 'xlsx',
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 2)
    }
  ]);

  const [isExporting, setIsExporting] = useState(false);

  const startExport = (type: 'pdf' | 'csv' | 'xlsx', name: string) => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name,
      type,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setJobs(prev => [newJob, ...prev]);
    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      setJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'processing' as const }
          : job
      ));

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { 
                  ...job, 
                  status: 'completed' as const, 
                  progress: 100,
                  downloadUrl: '#'
                }
              : job
          ));
          setIsExporting(false);
        } else {
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { ...job, progress }
              : job
          ));
        }
      }, 1000);
    }, 2000);
  };

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const exportOptions = [
    {
      type: 'pdf' as const,
      name: 'Performance Report',
      description: 'Comprehensive site performance analysis',
      icon: FileText
    },
    {
      type: 'csv' as const,
      name: 'Raw Data Export',
      description: 'All metrics in CSV format',
      icon: Download
    },
    {
      type: 'xlsx' as const,
      name: 'Executive Summary',
      description: 'Excel workbook with charts and analysis',
      icon: Settings
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Download className="w-5 h-5 text-emerald-400" />
            Quick Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportOptions.map((option, index) => (
              <div
                key={option.type}
                className={`p-4 rounded-lg border ${theme.colors.border.primary} bg-slate-800/30 hover:bg-slate-700/40 transition-all duration-200 cursor-pointer group`}
                onClick={() => startExport(option.type, option.name)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <option.icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <h3 className={`font-medium ${theme.colors.text.primary}`}>{option.name}</h3>
                </div>
                <p className={`text-sm ${theme.colors.text.muted}`}>{option.description}</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  {option.type.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
        <CardHeader>
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Calendar className="w-5 h-5 text-emerald-400" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className={`p-4 rounded-lg border ${theme.colors.border.primary} bg-slate-800/20 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h3 className={`font-medium ${theme.colors.text.primary}`}>{job.name}</h3>
                      <p className={`text-sm ${theme.colors.text.muted}`}>
                        Created {formatTimeAgo(job.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(job.status)} variant="outline">
                      {job.status}
                    </Badge>
                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30" variant="outline">
                      {job.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={theme.colors.text.muted}>Progress</span>
                      <span className={theme.colors.text.secondary}>{Math.round(job.progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {job.estimatedCompletion && job.status === 'processing' && (
                  <p className={`text-xs ${theme.colors.text.muted}`}>
                    Estimated completion: {job.estimatedCompletion.toLocaleTimeString()}
                  </p>
                )}

                {job.status === 'completed' && job.downloadUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    onClick={() => {
                      // In a real app, this would trigger a download
                      console.log(`Downloading ${job.name}`);
                    }}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className={`${theme.colors.text.muted}`}>No export history yet</p>
                <p className={`text-sm ${theme.colors.text.muted}`}>
                  Start your first export above
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
