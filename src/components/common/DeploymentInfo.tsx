
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Copy, Check } from 'lucide-react';
import { deploymentManager } from '@/utils/deployment';
import { config } from '@/config/environment';

export const DeploymentInfo: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const deploymentInfo = deploymentManager.getDeploymentInfo();

  const handleCopy = async () => {
    const info = JSON.stringify(deploymentInfo, null, 2);
    await navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Only show in development or if explicitly enabled
  if (config.app.environment === 'production' && !config.development.enableDebugLogs) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showInfo ? (
        <Card className="w-80 bg-slate-900/95 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Info className="w-4 h-4" />
                Deployment Info
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Version:</span>
              <Badge variant="outline" className="text-xs">
                {deploymentInfo.version}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Environment:</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  deploymentInfo.environment === 'production' 
                    ? 'border-red-500 text-red-400' 
                    : 'border-amber-500 text-amber-400'
                }`}
              >
                {deploymentInfo.environment}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Build:</span>
              <span className="text-xs text-white font-mono">
                {new Date(deploymentInfo.buildTime).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Commit:</span>
              <span className="text-xs text-white font-mono">
                {deploymentInfo.commitHash?.substring(0, 7) || 'unknown'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Features:</div>
              <div className="flex flex-wrap gap-1">
                {deploymentInfo.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-full text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Info
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInfo(true)}
          className="bg-slate-900/95 border-slate-700 text-slate-400 hover:text-white"
        >
          <Info className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
