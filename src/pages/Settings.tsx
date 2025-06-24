
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { SettingsManager } from "@/components/settings/SettingsManager";
import { theme } from "@/lib/theme";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme.colors.text.primary}`}>Settings</h1>
          <p className={`${theme.colors.text.muted} mt-1`}>Manage your platform preferences and configurations</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-700">General</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">Security</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700">Integrations</TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-slate-700">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <SettingsForm />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <SettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
