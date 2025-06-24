
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, Mail, Phone, Calendar, MoreVertical } from "lucide-react";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";

const SiteTeam = () => {
  const { siteId } = useParams();

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Site Manager",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg",
      status: "online",
      lastSeen: "Active now",
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Lead Technician",
      email: "mike.chen@company.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg",
      status: "offline",
      lastSeen: "2 hours ago",
      joinDate: "2023-03-20"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Safety Coordinator",
      email: "emma.davis@company.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg",
      status: "online",
      lastSeen: "Active now",
      joinDate: "2023-02-10"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Maintenance Engineer",
      email: "james.wilson@company.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg",
      status: "away",
      lastSeen: "30 minutes ago",
      joinDate: "2023-04-05"
    }
  ];

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
      case "online": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "away": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "offline": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{teamMembers.filter(m => m.status === 'online').length}</div>
              <p className="text-xs text-emerald-400">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Response Time</CardTitle>
              <Calendar className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">< 15min</div>
              <p className="text-xs text-emerald-400">Average response</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-emerald-900/20 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Actions</CardTitle>
              <UserPlus className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Add Member
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="bg-slate-900/50 border-emerald-900/20 animate-slide-in-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <span>Team Members</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Manage your site team and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={member.id} className="bg-slate-800/50 border-emerald-900/20 hover:bg-slate-700/50 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
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
                          <h3 className="font-semibold text-white">{member.name}</h3>
                          <p className="text-sm text-emerald-400">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadgeColor(member.status)}>
                          {member.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">Joined {member.joinDate}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-xs text-slate-400">Last seen: {member.lastSeen}</p>
                      </div>
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
