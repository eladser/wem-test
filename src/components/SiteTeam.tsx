import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  MoreVertical, 
  Search,
  Filter,
  MapPin,
  Shield,
  Clock,
  Activity,
  MessageSquare,
  Bell,
  Settings,
  User,
  Award,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Send
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const SiteTeam = () => {
  const { siteId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("team");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Site Manager",
      department: "Operations",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg",
      status: "online",
      lastSeen: "Active now",
      joinDate: "2023-01-15",
      location: "On-site",
      permissions: ["admin", "reports", "assets", "team"],
      certifications: ["Safety Level 3", "Equipment Specialist"],
      completedTasks: 247,
      performance: 98,
      shift: "Day Shift"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Lead Technician",
      department: "Maintenance",
      email: "mike.chen@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg",
      status: "offline",
      lastSeen: "2 hours ago",
      joinDate: "2023-03-20",
      location: "Field Office",
      permissions: ["maintenance", "assets", "reports"],
      certifications: ["Electrical Safety", "HVAC Certified"],
      completedTasks: 189,
      performance: 95,
      shift: "Night Shift"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Safety Coordinator",
      department: "Safety",
      email: "emma.davis@company.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg",
      status: "online",
      lastSeen: "Active now",
      joinDate: "2023-02-10",
      location: "On-site",
      permissions: ["safety", "reports", "compliance"],
      certifications: ["OSHA 30", "First Aid/CPR", "Hazmat"],
      completedTasks: 156,
      performance: 97,
      shift: "Day Shift"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Maintenance Engineer",
      department: "Engineering",
      email: "james.wilson@company.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg",
      status: "away",
      lastSeen: "30 minutes ago",
      joinDate: "2023-04-05",
      location: "Remote",
      permissions: ["engineering", "assets", "maintenance"],
      certifications: ["PE License", "Renewable Energy"],
      completedTasks: 203,
      performance: 96,
      shift: "Flexible"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      role: "Data Analyst",
      department: "Analytics",
      email: "lisa.rodriguez@company.com",
      phone: "+1 (555) 567-8901",
      avatar: "/placeholder.svg",
      status: "online",
      lastSeen: "Active now",
      joinDate: "2023-05-12",
      location: "Remote",
      permissions: ["analytics", "reports", "data"],
      certifications: ["Data Science", "Power BI"],
      completedTasks: 134,
      performance: 94,
      shift: "Day Shift"
    },
    {
      id: 6,
      name: "Tom Anderson",
      role: "Security Officer",
      department: "Security",
      email: "tom.anderson@company.com",
      phone: "+1 (555) 678-9012",
      avatar: "/placeholder.svg",
      status: "away",
      lastSeen: "1 hour ago",
      joinDate: "2023-01-30",
      location: "On-site",
      permissions: ["security", "access"],
      certifications: ["Security Guard", "Emergency Response"],
      completedTasks: 278,
      performance: 99,
      shift: "Night Shift"
    }
  ];

  const recentActivities = [
    { id: 1, user: "Sarah Johnson", action: "Completed safety inspection", time: "2 hours ago", type: "safety" },
    { id: 2, user: "Mike Chen", action: "Fixed inverter issue", time: "4 hours ago", type: "maintenance" },
    { id: 3, user: "Emma Davis", action: "Updated compliance report", time: "6 hours ago", type: "compliance" },
    { id: 4, user: "James Wilson", action: "Reviewed system performance", time: "1 day ago", type: "engineering" },
    { id: 5, user: "Lisa Rodriguez", action: "Generated monthly analytics", time: "1 day ago", type: "analytics" }
  ];

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || member.role.toLowerCase().includes(roleFilter.toLowerCase());
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const teamStats = useMemo(() => ({
    total: teamMembers.length,
    online: teamMembers.filter(m => m.status === 'online').length,
    away: teamMembers.filter(m => m.status === 'away').length,
    offline: teamMembers.filter(m => m.status === 'offline').length,
    avgPerformance: Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length),
    totalTasks: teamMembers.reduce((acc, m) => acc + m.completedTasks, 0)
  }), [teamMembers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500";
      case "away": return "bg-amber-500";
      case "offline": return "bg-slate-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "away": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "offline": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return "text-emerald-400";
    if (performance >= 90) return "text-blue-400";
    if (performance >= 85) return "text-amber-400";
    return "text-red-400";
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('manager')) return Shield;
    if (role.toLowerCase().includes('technician')) return Settings;
    if (role.toLowerCase().includes('engineer')) return Award;
    if (role.toLowerCase().includes('analyst')) return Activity;
    return User;
  };

  const handleAddMember = () => {
    toast.success("Member invitation sent!");
    setShowAddMember(false);
  };

  const handleSendMessage = (member) => {
    toast.success(`Message sent to ${member.name}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-slate-400">Manage your site team, permissions, and collaboration</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:text-white"
            onClick={() => toast.info("Team analytics coming soon!")}
          >
            <Activity className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Team Member</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Invite a new member to join your site team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                    <Input id="firstName" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                    <Input id="lastName" className="bg-slate-800 border-slate-600 text-white" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input id="email" type="email" className="bg-slate-800 border-slate-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="role" className="text-slate-300">Role</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-slate-300">Welcome Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Optional welcome message..."
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <Button onClick={handleAddMember} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Members", value: teamStats.total, icon: Users, color: "blue" },
          { title: "Online Now", value: teamStats.online, icon: Activity, color: "emerald" },
          { title: "Away", value: teamStats.away, icon: Clock, color: "amber" },
          { title: "Offline", value: teamStats.offline, icon: User, color: "slate" },
          { title: "Avg Performance", value: `${teamStats.avgPerformance}%`, icon: Award, color: "purple" },
          { title: "Total Tasks", value: teamStats.totalTasks, icon: CheckCircle, color: "cyan" }
        ].map((stat, index) => (
          <Card key={stat.title} className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                <span className="text-xs text-slate-500">Live</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs text-slate-400">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <TabsTrigger value="team" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Shield className="w-4 h-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Award className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Team Members</CardTitle>
                  <CardDescription className="text-slate-400">
                    {filteredMembers.length} of {teamMembers.length} members shown
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[140px] bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px] bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMembers.map((member, index) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <Card key={member.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="bg-emerald-600 text-white">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${getStatusColor(member.status)}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-sm">{member.name}</h3>
                              <div className="flex items-center gap-1">
                                <RoleIcon className="w-3 h-3 text-emerald-400" />
                                <p className="text-xs text-emerald-400">{member.role}</p>
                              </div>
                              <p className="text-xs text-slate-500">{member.department}</p>
                            </div>
                          </div>
                          <Badge className={getStatusBadgeColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Performance</span>
                            <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                              {member.performance}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Tasks</span>
                            <span className="text-white font-medium">{member.completedTasks}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Location</span>
                            <span className="text-slate-300">{member.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Shift</span>
                            <span className="text-slate-300">{member.shift}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-xs border-slate-600 text-slate-300 hover:text-white"
                            onClick={() => handleSendMessage(member)}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-xs border-slate-600 text-slate-300 hover:text-white"
                            onClick={() => setSelectedMember(member)}
                          >
                            <User className="w-3 h-3 mr-1" />
                            Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">Latest team actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium text-emerald-400">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Permission Matrix</CardTitle>
              <CardDescription className="text-slate-400">Manage team member access and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-300">Member</th>
                      <th className="text-center p-3 text-slate-300">Admin</th>
                      <th className="text-center p-3 text-slate-300">Reports</th>
                      <th className="text-center p-3 text-slate-300">Assets</th>
                      <th className="text-center p-3 text-slate-300">Team</th>
                      <th className="text-center p-3 text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.slice(0, 4).map((member, index) => (
                      <tr key={member.id} className="border-b border-slate-700/50 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-emerald-600 text-white text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-slate-400">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          {member.permissions.includes('admin') ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <div className="w-4 h-4 bg-slate-600 rounded-full mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          {member.permissions.includes('reports') ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <div className="w-4 h-4 bg-slate-600 rounded-full mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          {member.permissions.includes('assets') ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <div className="w-4 h-4 bg-slate-600 rounded-full mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          {member.permissions.includes('team') ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <div className="w-4 h-4 bg-slate-600 rounded-full mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          <Button size="sm" variant="outline" className="text-xs border-slate-600 text-slate-300">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
                <CardDescription className="text-slate-400">Team member performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.slice(0, 5).map((member, index) => (
                    <div key={member.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{member.name}</span>
                        <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${member.performance}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Task Completion</CardTitle>
                <CardDescription className="text-slate-400">Tasks completed by team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers
                    .sort((a, b) => b.completedTasks - a.completedTasks)
                    .slice(0, 5)
                    .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : index === 1 ? 'bg-slate-400/20 text-slate-400' : index === 2 ? 'bg-amber-600/20 text-amber-400' : 'bg-slate-600/20 text-slate-500'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{member.completedTasks}</p>
                        <p className="text-xs text-slate-400">tasks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteTeam;
