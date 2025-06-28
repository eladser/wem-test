import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  useSites, 
  useSiteAssets, 
  useLatestPowerData, 
  useAlerts,
  useSiteOperations,
  useAlertOperations 
} from '@/hooks/useDatabaseData';

interface DatabaseExampleProps {
  selectedSiteId?: string;
}

export function DatabaseExample({ selectedSiteId }: DatabaseExampleProps) {
  // Fetch data using the database hooks
  const { data: sites, loading: sitesLoading, error: sitesError, refetch: refetchSites } = useSites();
  const { data: assets, loading: assetsLoading } = useSiteAssets(selectedSiteId || null);
  const { data: powerData, loading: powerLoading } = useLatestPowerData(selectedSiteId || null);
  const { data: alerts, loading: alertsLoading, refetch: refetchAlerts } = useAlerts(selectedSiteId);
  
  // Operations hooks
  const { updateSiteStatus, loading: updatingStatus } = useSiteOperations();
  const { acknowledgeAlert, loading: acknowledgingAlert } = useAlertOperations();

  const handleStatusChange = async (siteId: string, newStatus: 'Online' | 'Maintenance' | 'Offline') => {
    try {
      await updateSiteStatus(siteId, newStatus);
      await refetchSites(); // Refresh the sites list
    } catch (error) {
      console.error('Failed to update site status:', error);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      await refetchAlerts(); // Refresh the alerts list
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  if (sitesError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Database Connection Error</CardTitle>
          <CardDescription>
            Failed to connect to the database. Check your backend server and database connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Error: {sitesError.message}
          </div>
          <Button onClick={refetchSites} variant="outline">
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Database Integration Example
          </CardTitle>
          <CardDescription>
            This component demonstrates real-time data fetching from your database
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sites Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sites from Database</CardTitle>
          <CardDescription>
            {sitesLoading ? 'Loading sites...' : `${sites?.length || 0} sites found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sitesLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading sites from database...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sites?.map((site) => (
                <Card key={site.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <Badge variant={
                        site.status === 'Online' ? 'default' : 
                        site.status === 'Maintenance' ? 'secondary' : 'destructive'
                      }>
                        {site.status}
                      </Badge>
                    </div>
                    <CardDescription>{site.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Output:</span>
                        <span className="font-medium">{site.currentOutput.toFixed(1)} MW</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Efficiency:</span>
                        <span className="font-medium">{site.efficiency.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Capacity:</span>
                        <span className="font-medium">{site.totalCapacity.toFixed(1)} MW</span>
                      </div>
                      
                      {/* Status Change Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant={site.status === 'Online' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(site.id, 'Online')}
                          disabled={updatingStatus || site.status === 'Online'}
                        >
                          Online
                        </Button>
                        <Button
                          size="sm"
                          variant={site.status === 'Maintenance' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(site.id, 'Maintenance')}
                          disabled={updatingStatus || site.status === 'Maintenance'}
                        >
                          Maintenance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Site Details */}
      {selectedSiteId && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Site Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assetsLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading assets...
                </div>
              ) : (
                <div className="space-y-2">
                  {assets?.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.type}</div>
                      </div>
                      <Badge variant={asset.status === 'Online' ? 'default' : 'secondary'}>
                        {asset.status}
                      </Badge>
                    </div>
                  )) || <div className="text-muted-foreground">No assets found</div>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Power Data */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Power Data</CardTitle>
            </CardHeader>
            <CardContent>
              {powerLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading power data...
                </div>
              ) : powerData ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Solar:</span>
                    <span className="font-medium">{powerData.solar.toFixed(1)} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span className="font-medium">{powerData.battery.toFixed(1)} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grid:</span>
                    <span className="font-medium">{powerData.grid.toFixed(1)} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demand:</span>
                    <span className="font-medium">{powerData.demand.toFixed(1)} MW</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(powerData.time).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No power data available</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading alerts...
            </div>
          ) : (
            <div className="space-y-2">
              {alerts?.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === 'Critical' ? 'text-red-500' : 
                      alert.type === 'Warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.site} • {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    disabled={acknowledgingAlert}
                  >
                    {acknowledgingAlert ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )) || <div className="text-muted-foreground">No alerts found</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DatabaseExample;
