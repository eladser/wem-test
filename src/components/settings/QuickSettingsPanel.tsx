import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter 
} from '@/components/ui/sheet';
import {
  Settings,
  Monitor,
  Bell,
  Zap,
  Palette,
  Clock,
  Globe,
  Shield,
  Database,
  Wifi,
  Volume2,
  Eye,
  RotateCcw,
  Download,
  Upload,
  Save,
  X
} from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { toast } from 'sonner';

interface QuickSettingsProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SettingsState {
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
    criticalOnly: boolean;
  };
  display: {
    theme: string;
    animations: boolean;
    compactMode: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
    highContrast: boolean;
  };
  performance: {
    realtimeUpdates: boolean;
    backgroundSync: boolean;
    dataRetention: number;
    cacheEnabled: boolean;
    lowPowerMode: boolean;
  };
  privacy: {
    analyticsEnabled: boolean;
    crashReporting: boolean;
    usageStatistics: boolean;
    locationTracking: boolean;
  };
}

const defaultSettings: SettingsState = {
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    criticalOnly: false,
  },
  display: {
    theme: 'dark',
    animations: true,
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 30,
    highContrast: false,
  },
  performance: {
    realtimeUpdates: true,
    backgroundSync: true,
    dataRetention: 30,
    cacheEnabled: true,
    lowPowerMode: false,
  },
  privacy: {
    analyticsEnabled: true,
    crashReporting: true,
    usageStatistics: false,
    locationTracking: false,
  },
};

export const QuickSettingsPanel: React.FC<QuickSettingsProps> = ({
  trigger,
  open,
  onOpenChange
}) => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem('wem-quick-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      setHasChanges(true);
      return newSettings;
    });
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('wem-quick-settings', JSON.stringify(settings));
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wem-settings.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Settings exported successfully!');
    } catch (error) {
      toast.error('Failed to export settings');
    }
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...imported });
        setHasChanges(true);
        toast.success('Settings imported successfully!');
      } catch (error) {
        toast.error('Failed to import settings - invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between py-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-slate-700/50 rounded-lg">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1">
          <Label className="text-sm font-medium text-white">{title}</Label>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:w-[480px] bg-slate-900 border-slate-700 overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Settings
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            Quickly adjust your dashboard preferences and system settings.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Display Settings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Monitor className="w-4 h-4" />
                Display & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                icon={Palette}
                title="Theme"
                description="Choose your preferred color scheme"
              >
                <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <SelectTrigger className="w-24 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </SettingItem>

              <SettingItem
                icon={Eye}
                title="Animations"
                description="Enable smooth transitions and animations"
              >
                <Switch
                  checked={settings.display.animations}
                  onCheckedChange={(checked) => updateSetting('display.animations', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Monitor}
                title="Compact Mode"
                description="Reduce spacing for more content"
              >
                <Switch
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) => updateSetting('display.compactMode', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Clock}
                title="Auto Refresh"
                description="Automatically update data"
              >
                <Switch
                  checked={settings.display.autoRefresh}
                  onCheckedChange={(checked) => updateSetting('display.autoRefresh', checked)}
                />
              </SettingItem>

              {settings.display.autoRefresh && (
                <div className="pl-9">
                  <Label className="text-xs text-slate-400 block mb-2">
                    Refresh Interval: {settings.display.refreshInterval}s
                  </Label>
                  <Slider
                    value={[settings.display.refreshInterval]}
                    onValueChange={([value]) => updateSetting('display.refreshInterval', value)}
                    min={10}
                    max={300}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Bell className="w-4 h-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                icon={Bell}
                title="Enable Notifications"
                description="Receive system alerts and updates"
              >
                <Switch
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => updateSetting('notifications.enabled', checked)}
                />
              </SettingItem>

              {settings.notifications.enabled && (
                <>
                  <SettingItem
                    icon={Volume2}
                    title="Sound Alerts"
                    description="Play sound for notifications"
                  >
                    <Switch
                      checked={settings.notifications.sound}
                      onCheckedChange={(checked) => updateSetting('notifications.sound', checked)}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={Monitor}
                    title="Desktop Notifications"
                    description="Show browser notifications"
                  >
                    <Switch
                      checked={settings.notifications.desktop}
                      onCheckedChange={(checked) => updateSetting('notifications.desktop', checked)}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={Shield}
                    title="Critical Only"
                    description="Only show high-priority alerts"
                  >
                    <Switch
                      checked={settings.notifications.criticalOnly}
                      onCheckedChange={(checked) => updateSetting('notifications.criticalOnly', checked)}
                    />
                  </SettingItem>
                </>
              )}
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Zap className="w-4 h-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                icon={Wifi}
                title="Real-time Updates"
                description="Live data synchronization"
              >
                <Switch
                  checked={settings.performance.realtimeUpdates}
                  onCheckedChange={(checked) => updateSetting('performance.realtimeUpdates', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Database}
                title="Background Sync"
                description="Sync data in the background"
              >
                <Switch
                  checked={settings.performance.backgroundSync}
                  onCheckedChange={(checked) => updateSetting('performance.backgroundSync', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Database}
                title="Cache Enabled"
                description="Cache data for faster loading"
              >
                <Switch
                  checked={settings.performance.cacheEnabled}
                  onCheckedChange={(checked) => updateSetting('performance.cacheEnabled', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Clock}
                title="Low Power Mode"
                description="Reduce background activity"
              >
                <Switch
                  checked={settings.performance.lowPowerMode}
                  onCheckedChange={(checked) => updateSetting('performance.lowPowerMode', checked)}
                />
              </SettingItem>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Shield className="w-4 h-4" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem
                icon={Database}
                title="Analytics"
                description="Help improve the dashboard"
              >
                <Switch
                  checked={settings.privacy.analyticsEnabled}
                  onCheckedChange={(checked) => updateSetting('privacy.analyticsEnabled', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Shield}
                title="Crash Reporting"
                description="Send crash reports for debugging"
              >
                <Switch
                  checked={settings.privacy.crashReporting}
                  onCheckedChange={(checked) => updateSetting('privacy.crashReporting', checked)}
                />
              </SettingItem>

              <SettingItem
                icon={Globe}
                title="Usage Statistics"
                description="Anonymous usage data collection"
              >
                <Switch
                  checked={settings.privacy.usageStatistics}
                  onCheckedChange={(checked) => updateSetting('privacy.usageStatistics', checked)}
                />
              </SettingItem>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Settings className="w-4 h-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={exportSettings}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 relative overflow-hidden"
                  asChild
                >
                  <label>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </Button>
                
                <Button
                  onClick={resetSettings}
                  variant="outline"
                  size="sm"
                  className="border-orange-600 text-orange-400 hover:bg-orange-900/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex items-center gap-3 w-full">
            {hasChanges && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-500">
                Unsaved Changes
              </Badge>
            )}
            <Button
              onClick={saveSettings}
              disabled={!hasChanges}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};