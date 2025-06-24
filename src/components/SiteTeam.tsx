
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, Mail, Phone, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";

const SiteTeam = () => {
  const { siteId } = useParams();

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Site Manager",
      email: "sarah.johnson@energy.com",
      phone: "+1 (555) 123-4567",
      status: "online",
      permissions: ["admin", "maintenance", "reports"],
      lastActive: "Active now"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Lead Technician",
      email: "mike.chen@energy.com",
      phone: "+1 (555) 234-5678",
      status: "online",
      permissions: ["maintenance", "reports"],
      lastActive: "2 hours ago"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Operations Analyst",
      email: "emily.rodriguez@energy.com",
      phone: "+1 (555) 345-6789",
      status: "offline",
      permissions: ["reports", "analytics"],
      lastActive: "Yesterday"
    },
    {
      id: 4,
      name: "David Park",
      role: "Security Officer",
      email: "david.park@energy.com",
      phone: "+1 (555) 456-7890",
      status: "online",
      permissions: ["security", "access"],
      lastActive: "1 hour ago"
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'online' 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Site Manager": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Lead Technician": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Operations Analyst": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Security Officer": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Team Overview */}
        <div className="flex items-center justify-between">
          <div className="animate-slide-in-left">
            <h2 className="text-2xl font-bold text-white">Team Management</h2>
            <p className="text-slate-400">Manage site personnel and permissions</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white animate-fade-in">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Members</CardTitle>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
              <p className="text-xs text-emerald-400">Active team size</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Online Now</CardTitle>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {teamMembers.filter(m => m.status === 'online').length}
              </div>
              <p className="text-xs text-emerald-400">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Roles</CardTitle>
              <Shield className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4</div>
              <p className="text-xs text-blue-400">Different roles</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">< 5min</div>
              <p className="text-xs text-amber-400">Average response</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white">Team Members</CardTitle>
            <CardDescription className="text-slate-400">Manage team access and responsibilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <Card key={member.id} className="bg-slate-800/50 border-emerald-900/20 hover:bg-slate-700/50 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{member.name}</h4>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{member.lastActive}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs border-emerald-600 text-emerald-400">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:bg-slate-600/10">
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteTeam;
