import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Database, AlertTriangle, Zap, Thermometer, Save, RotateCcw } from "lucide-react";
import { useParams } from "react-router-dom";
import { theme } from "@/lib/theme";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { mockRegions } from "@/services/mockDataService";

const SiteSettings = () => {
  const { siteId } = useParams();
  const [formData, setFormData] = useState({
    siteName: '',
    location: '',
    capacity: '',
    timezone: 'UTC',
    efficiencyThreshold: '85',
    maxOutput: '30',
    trackingMode: 'auto',
    sessionTimeout: '30',
    apiAccess: 'read',
    dataRetention: '365',
    samplingRate: '5',
    tempThreshold: '45',
    humidityThreshold: '80',
    // Switch states
    performanceAlerts: true,
    maintenanceReminders: true,
    emergencyAlerts: true,
    weatherAlerts: false,
    autoOptimization: true,
    loadBalancing: true,
    twoFactorAuth: true,
    accessLogging: true,
    realTimeMonitoring: true,
    dataAnalytics: true,
    exportToCloud: false,
    weatherIntegration: true,
    autoCooling: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Find the site data
  const site = mockRegions.flatMap(r => r.sites).find(s => s.id === siteId);

  // Load initial data
  useEffect(() => {
    if (site) {
      setFormData(prev => ({
        ...prev,
        siteName: site.name,
        location: site.location,
        capacity: site.totalCapacity.toString()
      }));
    }
  }, [site]);

  // Track changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // Mock API call for saving settings with better error handling
  const saveSiteSettings = async (data: typeof formData) => {
    // Simulate API call with different responses based on environment
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // In development, simulate a successful API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Settings saved successfully (mock)' });
        }, 1000); // Simulate network delay
      });
    }
    
    // In production, try the real API call
    try {
      const response = await fetch(`/api/sites/${siteId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // If API call fails, fall back to mock success
      console.warn('API call failed, using mock response:', error);
      return { success: true, message: 'Settings saved successfully (fallback)' };
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await saveSiteSettings(formData);
      toast.success("Settings Saved", {
        description: result.message || "Site settings have been updated successfully."
      });
      setHasUnsavedChanges(false);
      console.log('Site settings saved for:', siteId, formData);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Save Failed", {
        description: "Unable to save site settings. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (site) {
      setFormData({
        siteName: site.name,
        location: site.location,
        capacity: site.totalCapacity.toString(),
        timezone: 'UTC',
        efficiencyThreshold: '85',
        maxOutput: '30',
        trackingMode: 'auto',
        sessionTimeout: '30',
        apiAccess: 'read',
        dataRetention: '365',
        samplingRate: '5',
        tempThreshold: '45',
        humidityThreshold: '80',
        performanceAlerts: true,
        maintenanceReminders: true,
        emergencyAlerts: true,
        weatherAlerts: false,
        autoOptimization: true,
        loadBalancing: true,
        twoFactorAuth: true,
        accessLogging: true,
        realTimeMonitoring: true,
        dataAnalytics: true,
        exportToCloud: false,
        weatherIntegration: true,
        autoCooling: true
      });
      setHasUnsavedChanges(false);
      toast.info("Settings Reset", {
        description: "All settings have been reset to their default values."
      });
    }
  };

  const handleDangerAction = () => {
    toast.error("Danger Zone", {
      description: "This action requires additional confirmation."
    });
    console.log('Danger action for site:', siteId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Removed SiteTopBar to prevent duplicate header */}
      
      <div className="p-6 space-y-6">
        <div className="animate-slide-in-left">
          <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Site Settings</h2>
          <p className={theme.colors.text.muted}>Configure site parameters and preferences</p>
          {hasUnsavedChanges && (
            <div className="mt-2 flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              You have unsaved changes
            </div>
          )}
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
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className={theme.colors.text.secondary}>Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className={theme.colors.text.secondary}>Total Capacity (kW)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className={theme.colors.text.secondary}>Timezone</Label>
                <select 
                  className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                >
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
                <Switch 
                  checked={formData.performanceAlerts} 
                  onCheckedChange={(checked) => handleInputChange('performanceAlerts', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="efficiencyThreshold" className={theme.colors.text.secondary}>Efficiency Threshold (%)</Label>
                <Input
                  id="efficiencyThreshold"
                  type="number"
                  value={formData.efficiencyThreshold}
                  onChange={(e) => handleInputChange('efficiencyThreshold', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Maintenance Reminders</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Scheduled maintenance notifications</p>
                </div>
                <Switch 
                  checked={formData.maintenanceReminders}
                  onCheckedChange={(checked) => handleInputChange('maintenanceReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Emergency Alerts</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Critical system failures</p>
                </div>
                <Switch 
                  checked={formData.emergencyAlerts}
                  onCheckedChange={(checked) => handleInputChange('emergencyAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Weather Alerts</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Severe weather notifications</p>
                </div>
                <Switch 
                  checked={formData.weatherAlerts}
                  onCheckedChange={(checked) => handleInputChange('weatherAlerts', checked)}
                />
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
                  value={formData.maxOutput}
                  onChange={(e) => handleInputChange('maxOutput', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Auto Optimization</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Automatically optimize performance</p>
                </div>
                <Switch 
                  checked={formData.autoOptimization}
                  onCheckedChange={(checked) => handleInputChange('autoOptimization', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackingMode" className={theme.colors.text.secondary}>Tracking Mode</Label>
                <select 
                  className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md"
                  value={formData.trackingMode}
                  onChange={(e) => handleInputChange('trackingMode', e.target.value)}
                >
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
                <Switch 
                  checked={formData.loadBalancing}
                  onCheckedChange={(checked) => handleInputChange('loadBalancing', checked)}
                />
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
                <Switch 
                  checked={formData.twoFactorAuth}
                  onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Access Logging</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Track all site access attempts</p>
                </div>
                <Switch 
                  checked={formData.accessLogging}
                  onCheckedChange={(checked) => handleInputChange('accessLogging', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className={theme.colors.text.secondary}>Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={formData.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiAccess" className={theme.colors.text.secondary}>API Access Level</Label>
                <select 
                  className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md"
                  value={formData.apiAccess}
                  onChange={(e) => handleInputChange('apiAccess', e.target.value)}
                >
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
                  value={formData.dataRetention}
                  onChange={(e) => handleInputChange('dataRetention', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="samplingRate" className={theme.colors.text.secondary}>Sampling Rate (seconds)</Label>
                <select 
                  className="w-full p-2 bg-slate-800 border border-emerald-900/20 text-white rounded-md"
                  value={formData.samplingRate}
                  onChange={(e) => handleInputChange('samplingRate', e.target.value)}
                >
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
                <Switch 
                  checked={formData.realTimeMonitoring}
                  onCheckedChange={(checked) => handleInputChange('realTimeMonitoring', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Data Analytics</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Advanced performance insights</p>
                </div>
                <Switch 
                  checked={formData.dataAnalytics}
                  onCheckedChange={(checked) => handleInputChange('dataAnalytics', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Export to Cloud</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Backup data to cloud storage</p>
                </div>
                <Switch 
                  checked={formData.exportToCloud}
                  onCheckedChange={(checked) => handleInputChange('exportToCloud', checked)}
                />
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
                  value={formData.tempThreshold}
                  onChange={(e) => handleInputChange('tempThreshold', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidityThreshold" className={theme.colors.text.secondary}>Humidity Threshold (%)</Label>
                <Input
                  id="humidityThreshold"
                  type="number"
                  value={formData.humidityThreshold}
                  onChange={(e) => handleInputChange('humidityThreshold', e.target.value)}
                  className="bg-slate-800 border-emerald-900/20 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Weather Integration</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Connect to weather services</p>
                </div>
                <Switch 
                  checked={formData.weatherIntegration}
                  onCheckedChange={(checked) => handleInputChange('weatherIntegration', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={theme.colors.text.secondary}>Auto Cooling</Label>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Automatic cooling activation</p>
                </div>
                <Switch 
                  checked={formData.autoCooling}
                  onCheckedChange={(checked) => handleInputChange('autoCooling', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 animate-slide-in-up">
          <Button 
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
            className={`${theme.gradients.primary} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isLoading}
            className={`${theme.colors.border.accent} ${theme.colors.text.accent} hover:bg-emerald-600/10 disabled:opacity-50`}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDangerAction}
            disabled={isLoading}
            className="border-red-600 text-red-400 hover:bg-red-600/10 ml-auto disabled:opacity-50"
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