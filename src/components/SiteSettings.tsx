
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Database, Wifi, AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";

const SiteSettings = () => {
  const { siteId } = useParams();

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        <div className="animate-slide-in-left">
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="text-slate-400">Configure site parameters and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="h-5 w-5 text-emerald-400" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-slate-300">Site Name</Label>
                <Input
                  id="siteName"
                  defaultValue="Main Campus"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-300">Location</Label>
                <Input
                  id="location"
                  defaultValue="California, USA"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-slate-300">Total Capacity (kW)</Label>
                <Input
                  id="capacity"
                  type="number"
                  defaultValue="25.5"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Bell className="h-5 w-5 text-emerald-400" />
                <span>Alert Settings</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Performance Alerts</Label>
                  <p className="text-sm text-slate-400">Alert when efficiency drops below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Maintenance Reminders</Label>
                  <p className="text-sm text-slate-400">Scheduled maintenance notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Emergency Alerts</Label>
                  <p className="text-sm text-slate-400">Critical system failures</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Access control and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-400">Enhanced security for site access</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Access Logging</Label>
                  <p className="text-sm text-slate-400">Track all site access attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-slate-300">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  defaultValue="30"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card className="bg-slate-900/50 border-emerald-900/20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Database className="h-5 w-5 text-emerald-400" />
                <span>Data Settings</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Data collection and storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetention" className="text-slate-300">Data Retention (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  defaultValue="365"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Real-time Monitoring</Label>
                  <p className="text-sm text-slate-400">Continuous data collection</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-slate-300">Data Analytics</Label>
                  <p className="text-sm text-slate-400">Advanced performance insights</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 animate-slide-in-up">
          <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
            Save Changes
          </Button>
          <Button variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10">
            Reset to Defaults
          </Button>
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10 ml-auto">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Danger Zone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
