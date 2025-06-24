import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Database, AlertTriangle, Zap, Thermometer } from "lucide-react";
import { useParams } from "react-router-dom";
import SiteTopBar from "./SiteTopBar";
import { theme } from "@/lib/theme";
import { toast } from "sonner";

const SiteSettings = () => {
  const { siteId } = useParams();

  const handleSave = () => {
    toast.success("Site settings saved successfully!");
    console.log('Site settings saved for:', siteId);
  };

  const handleReset = () => {
    toast.info("Settings reset to defaults");
    console.log('Settings reset for site:', siteId);
  };

  const handleDangerAction = () => {
    toast.error("Danger zone action triggered");
    console.log('Danger action for site:', siteId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SiteTopBar />
      
      <div className="p-6 space-y-6">
        <div className="animate-slide-in-left">
          <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Site Settings</h2>
          <p className={theme.colors.text.muted}>Configure site parameters and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} animate-fade-in`}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text.primary} flex items-center space-x-2`}>
                <Settings className={`h-5 w-5 ${theme.colors.text.accent}`} />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription className={theme.colors.text.muted}>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className={theme.colors.text.secondary}>Site Name</Label>
                <Input
                  id="siteName"
                  defaultValue="Main Campus"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className={theme.colors.text.secondary}>Location</Label>
                <Input
                  id="location"
                  defaultValue="California, USA"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className={theme.colors.text.secondary}>Total Capacity (kW)</Label>
                <Input
                  id="capacity"
                  type="number"
                  defaultValue="25.5"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className={theme.colors.text.secondary}>Timezone</Label>
                <select className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md">
                  <option value="UTC">UTC</option>
                  <option value="PST">Pacific Standard Time</option>
                  <option value="EST">Eastern Standard Time</option>
                  <option value="CST">Central Standard Time</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} animate-fade-in`} style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text.primary} flex items-center space-x-2`}>
                <Bell className={`h-5 w-5 ${theme.colors.text.accent}`} />
                <span>Alert Settings</span>
              </CardTitle>
              <CardDescription className={theme.colors.text.muted}>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Performance Alerts</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Alert when efficiency drops below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="efficiencyThreshold" className={theme.colors.text.secondary}>Efficiency Threshold (%)</Label>
                <Input
                  id="efficiencyThreshold"
                  type="number"
                  defaultValue="85"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Maintenance Reminders</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Scheduled maintenance notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Emergency Alerts</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Critical system failures</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Weather Alerts</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Severe weather notifications</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Performance Settings */}
          <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} animate-fade-in`} style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text.primary} flex items-center space-x-2`}>
                <Zap className={`h-5 w-5 ${theme.colors.text.accent}`} />
                <span>Performance Settings</span>
              </CardTitle>
              <CardDescription className={theme.colors.text.muted}>Optimize system performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxOutput" className={theme.colors.text.secondary}>Maximum Output (kW)</Label>
                <Input
                  id="maxOutput"
                  type="number"
                  defaultValue="30"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Auto Optimization</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Automatically optimize performance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackingMode" className={theme.colors.text.secondary}>Tracking Mode</Label>
                <select className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md">
                  <option value="auto">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Load Balancing</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Distribute load across systems</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} animate-fade-in`} style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text.primary} flex items-center space-x-2`}>
                <Shield className={`h-5 w-5 ${theme.colors.text.accent}`} />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription className={theme.colors.text.muted}>Access control and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Two-Factor Authentication</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Enhanced security for site access</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Access Logging</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Track all site access attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className={theme.colors.text.secondary}>Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  defaultValue="30"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiAccess" className={theme.colors.text.secondary}>API Access Level</Label>
                <select className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md">
                  <option value="read">Read Only</option>
                  <option value="write">Read/Write</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} animate-fade-in`} style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text.primary} flex items-center space-x-2`}>
                <Database className={`h-5 w-5 ${theme.colors.text.accent}`} />
                <span>Data Settings</span>
              </CardTitle>
              <CardDescription className={theme.colors.text.muted}>Data collection and storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetention" className={theme.colors.text.secondary}>Data Retention (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  defaultValue="365"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="samplingRate" className={theme.colors.text.secondary}>Sampling Rate (seconds)</Label>
                <select className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md">
                  <option value="1">1 second</option>
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Real-time Monitoring</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Continuous data collection</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Data Analytics</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Advanced performance insights</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Export to Cloud</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Backup data to cloud storage</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Environmental Settings */}
          <Card className={`${theme.colors.background.card} ${theme.colors.border.accent} animate-fade-in`} style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text.primary} flex items-center space-x-2`}>
                <Thermometer className={`h-5 w-5 ${theme.colors.text.accent}`} />
                <span>Environmental Settings</span>
              </CardTitle>
              <CardDescription className={theme.colors.text.muted}>Environmental monitoring and control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tempThreshold" className={theme.colors.text.secondary}>Temperature Threshold (°C)</Label>
                <Input
                  id="tempThreshold"
                  type="number"
                  defaultValue="45"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidityThreshold" className={theme.colors.text.secondary}>Humidity Threshold (%)</Label>
                <Input
                  id="humidityThreshold"
                  type="number"
                  defaultValue="80"
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Weather Integration</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Connect to weather services</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Auto Cooling</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Automatic cooling activation</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 animate-slide-in-up">
          <Button 
            onClick={handleSave}
            className={`${theme.gradients.primary} text-white`}
          >
            Save Changes
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className={`${theme.colors.border.accent} ${theme.colors.text.accent} hover:bg-emerald-600/10`}
          >
            Reset to Defaults
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDangerAction}
            className="border-red-600 text-red-400 hover:bg-red-600/10 ml-auto"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Danger Zone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
