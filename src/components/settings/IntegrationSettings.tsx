
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Settings } from "lucide-react";
import { toast } from "sonner";
import { theme } from "@/lib/theme";

interface Integration {
  id: string;
  name: string;
  description: string;
  configured: boolean;
  apiKey?: string;
}

export const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "weather",
      name: "Weather API",
      description: "OpenWeatherMap integration",
      configured: false
    },
    {
      id: "grid",
      name: "Grid Data",
      description: "Utility grid integration",
      configured: true
    }
  ]);

  const [configuring, setConfiguring] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfigure = async (integrationId: string) => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, configured: true, apiKey }
            : integration
        )
      );
      
      toast.success("Integration configured successfully!");
      setConfiguring(null);
      setApiKey("");
      console.log(`Configured ${integrationId} with API key:`, apiKey);
    } catch (error) {
      toast.error("Failed to configure integration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
          <Database className="w-5 h-5" />
          Data Integrations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className={`flex items-center justify-between p-4 border ${theme.colors.border.primary} rounded-lg`}>
            <div>
              <h4 className={`${theme.colors.text.primary} font-medium`}>{integration.name}</h4>
              <p className={`text-sm ${theme.colors.text.muted}`}>{integration.description}</p>
              {integration.configured && (
                <p className={`text-xs ${theme.colors.text.accent} mt-1`}>✓ Configured</p>
              )}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`border-slate-600 ${theme.colors.text.secondary}`}
                  onClick={() => setConfiguring(integration.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {integration.configured ? "Reconfigure" : "Configure"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className={theme.colors.text.primary}>
                    Configure {integration.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className={theme.colors.text.secondary}>API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <Button 
                    onClick={() => handleConfigure(integration.id)}
                    disabled={isLoading}
                    className={`${theme.gradients.primary} text-white w-full`}
                  >
                    {isLoading ? "Configuring..." : "Save Configuration"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
