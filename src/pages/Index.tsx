
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Zap, BarChart3, MapPin, TrendingUp, AlertTriangle, Users, Settings, Grid3X3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: "Total Sites", value: "12", icon: MapPin, color: "emerald" },
    { label: "Active Regions", value: "3", icon: Grid3X3, color: "blue" },
    { label: "Total Capacity", value: "85.2 MW", icon: Zap, color: "purple" },
    { label: "System Efficiency", value: "94.2%", icon: TrendingUp, color: "green" }
  ];

  const quickActions = [
    { 
      title: "View All Sites", 
      description: "Monitor and manage all your energy sites",
      icon: MapPin, 
      action: () => navigate("/overview"),
      color: "emerald"
    },
    { 
      title: "Analytics Dashboard", 
      description: "Deep dive into performance metrics",
      icon: BarChart3, 
      action: () => navigate("/analytics"),
      color: "blue"
    },
    { 
      title: "System Reports", 
      description: "Generate and download reports",
      icon: BarChart3, 
      action: () => navigate("/reports"),
      color: "purple"
    },
    { 
      title: "Settings", 
      description: "Configure system preferences",
      icon: Settings, 
      action: () => navigate("/settings"),
      color: "amber"
    }
  ];

  return (
    <div className="min-h-screen space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to WEM Dashboard
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Your comprehensive energy management platform for monitoring, analyzing, and optimizing renewable energy systems across all your sites.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickStats.map((stat, index) => (
          <Card key={stat.label} className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 bg-slate-800/50">
                  Live
                </Badge>
              </div>
              
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                {stat.label}
              </h3>
              
              <div className="text-3xl font-bold text-white">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Card 
            key={action.title} 
            className="bg-slate-900/50 border-slate-700/50 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm hover:scale-105"
            onClick={action.action}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/20`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                </div>
                <div>
                  <CardTitle className="text-white">{action.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {action.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* System Status */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-400" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-medium text-white">All Systems Operational</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Online
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">24 Active Users</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-white">Real-time Monitoring</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Get Started */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Explore your energy sites, analyze performance data, and optimize your renewable energy operations with our comprehensive dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate("/overview")}
            >
              <MapPin className="w-5 h-5 mr-2" />
              View All Sites
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => navigate("/analytics")}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
