
import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { securityConfig } from '@/config/security';
import { config } from '@/config/environment';

interface SecurityStatus {
  csp: boolean;
  rateLimiting: boolean;
  headers: boolean;
  https: boolean;
}

const SecurityMonitor = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    csp: false,
    rateLimiting: false,
    headers: false,
    https: false
  });

  useEffect(() => {
    const checkSecurityStatus = () => {
      setSecurityStatus({
        csp: securityConfig.csp.enabled,
        rateLimiting: securityConfig.rateLimiting.enabled,
        headers: Object.keys(securityConfig.headers).length > 0,
        https: window.location.protocol === 'https:' || config.app.environment === 'development'
      });
    };

    checkSecurityStatus();
  }, []);

  const getOverallStatus = (): 'secure' | 'warning' | 'vulnerable' => {
    const enabledFeatures = Object.values(securityStatus).filter(Boolean).length;
    const totalFeatures = Object.keys(securityStatus).length;
    
    if (enabledFeatures === totalFeatures) return 'secure';
    if (enabledFeatures >= totalFeatures - 1) return 'warning';
    return 'vulnerable';
  };

  const overallStatus = getOverallStatus();

  const statusConfig = {
    secure: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Secure'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Warning'
    },
    vulnerable: {
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Vulnerable'
    }
  };

  const StatusIcon = statusConfig[overallStatus].icon;

  if (config.app.environment !== 'development' && overallStatus === 'secure') {
    return null; // Don't show if everything is secure in production
  }

  return (
    <Card className={`${statusConfig[overallStatus].bgColor} ${statusConfig[overallStatus].borderColor} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Shield className="w-4 h-4" />
          <span>Security Status</span>
          <Badge 
            variant="outline" 
            className={`${statusConfig[overallStatus].color} border-current`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig[overallStatus].label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${securityStatus.csp ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>CSP Headers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${securityStatus.rateLimiting ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Rate Limiting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${securityStatus.headers ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Security Headers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${securityStatus.https ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>HTTPS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;
