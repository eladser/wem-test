
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SiteMonitoringFiltersProps {
  statusFilter: 'all' | 'online' | 'maintenance' | 'offline';
  sortBy: 'name' | 'output' | 'efficiency';
  onStatusFilterChange: (value: 'all' | 'online' | 'maintenance' | 'offline') => void;
  onSortByChange: (value: 'name' | 'output' | 'efficiency') => void;
}

export const SiteMonitoringFilters: React.FC<SiteMonitoringFiltersProps> = ({
  statusFilter,
  sortBy,
  onStatusFilterChange,
  onSortByChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          <SelectItem value="all">All Sites</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="output">Output</SelectItem>
          <SelectItem value="efficiency">Efficiency</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
