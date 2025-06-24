
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Phone, Mail, MapPin, Plus, Filter } from 'lucide-react';
import { theme } from '@/lib/theme';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'operations' | 'maintenance' | 'management' | 'engineering';
  location: string;
  phone: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  assignedSites: string[];
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Operations Manager',
    department: 'operations',
    location: 'Berlin',
    phone: '+49 30 12345678',
    email: 'sarah.chen@energy.com',
    status: 'online',
    assignedSites: ['Berlin Solar Farm', 'Munich Wind Farm']
  },
  {
    id: '2',
    name: 'Marcus Schmidt',
    role: 'Lead Technician',
    department: 'maintenance',
    location: 'Munich',
    phone: '+49 89 87654321',
    email: 'marcus.schmidt@energy.com',
    status: 'away',
    assignedSites: ['Munich Wind Farm', 'Frankfurt Grid Station']
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Regional Director',
    department: 'management',
    location: 'Frankfurt',
    phone: '+49 69 11223344',
    email: 'elena.rodriguez@energy.com',
    status: 'online',
    assignedSites: ['All Sites']
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Systems Engineer',
    department: 'engineering',
    location: 'Hamburg',
    phone: '+49 40 55667788',
    email: 'james.wilson@energy.com',
    status: 'offline',
    assignedSites: ['Hamburg Solar Array']
  }
];

export const TeamManager: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [departmentFilter, setDepartmentFilter] = useState<'all' | TeamMember['department']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TeamMember['status']>('all');

  const filteredTeam = team.filter(member => {
    const deptMatch = departmentFilter === 'all' || member.department === departmentFilter;
    const statusMatch = statusFilter === 'all' || member.status === statusFilter;
    return deptMatch && statusMatch;
  });

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-400';
      case 'away': return 'bg-amber-400';
      case 'offline': return 'bg-slate-500';
    }
  };

  const getDepartmentColor = (department: TeamMember['department']) => {
    switch (department) {
      case 'operations': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'management': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'engineering': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const onlineCount = team.filter(m => m.status === 'online').length;
  const awayCount = team.filter(m => m.status === 'away').length;
  const offlineCount = team.filter(m => m.status === 'offline').length;

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <CardTitle className={theme.colors.text.primary}>Team Management</CardTitle>
            <div className="flex gap-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {onlineCount} Online
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                {awayCount} Away
              </Badge>
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                {offlineCount} Offline
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={departmentFilter} onValueChange={(value: any) => setDepartmentFilter(value)}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-28 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className={`p-4 rounded-lg border ${theme.colors.border.primary} ${theme.colors.background.cardHover} transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${getStatusColor(member.status)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${theme.colors.text.primary} truncate`}>
                      {member.name}
                    </h4>
                    <Badge className={getDepartmentColor(member.department)}>
                      {member.department}
                    </Badge>
                  </div>
                  <p className={`text-sm ${theme.colors.text.secondary} mb-2`}>
                    {member.role}
                  </p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className={`text-xs ${theme.colors.text.muted} mb-1`}>Assigned Sites:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.assignedSites.map((site, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0 bg-slate-800/50 border-slate-600"
                        >
                          {site}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
