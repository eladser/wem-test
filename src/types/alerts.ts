
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type AlertCategory = 'performance' | 'maintenance' | 'safety' | 'environmental';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  site: string;
  category: AlertCategory;
  icon?: React.ComponentType<any>;
  metadata?: Record<string, any>;
}

export interface AlertFilters {
  search?: string;
  severity?: AlertSeverity | 'all';
  status?: AlertStatus | 'all';
  category?: AlertCategory | 'all';
}

export interface AlertActions {
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}
