import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Progress } from '../ui/progress';
import { 
  LineChart, Line, AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {
  Activity, Wifi, WifiOff, Thermometer, Zap, Battery, 
  Settings, AlertCircle, CheckCircle, Clock, Signal,
  Power, Gauge, Shield, Bell, BellOff, RefreshCw,
  MapPin, Eye, EyeOff, Smartphone, Laptop, Tv,
  Wind, Lightbulb, AirVent, Camera, Router
} from 'lucide-react';

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'controller' | 'meter' | 'camera' | 'hvac' | 'lighting';
  location: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastSeen: Date;
  batteryLevel?: number;
  signalStrength: number;
  currentValue: number;
  unit: string;
  threshold?: {
    min: number;
    max: number;
  };
  alerts: number;
  autoControl: boolean;
}

interface MonitoringData {
  timestamp: string;
  temperature: number;
  humidity: number;
  powerConsumption: number;
  voltage: number;
  frequency: number;
  co2Level: number;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'critical';
  device: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  autoResolved: boolean;
}

const RealtimeMonitoring: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [autoAlertsEnabled, setAutoAlertsEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock IoT devices data
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'temp-01',
      name: 'Main Hall Temperature',
      type: 'sensor',
      location: 'Building A - Floor 1',
      status: 'online',
      lastSeen: new Date(),
      batteryLevel: 85,
      signalStrength: 92,
      currentValue: 22.5,
      unit: '°C',
      threshold: { min: 18, max: 26 },
      alerts: 0,
      autoControl: true
    },
    {
      id: 'power-01',
      name: 'Main Power Meter',
      type: 'meter',
      location: 'Electrical Room',
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 98,
      currentValue: 445.2,
      unit: 'kW',
      threshold: { min: 0, max: 500 },
      alerts: 1,
      autoControl: false
    },
    {
      id: 'hvac-01',
      name: 'Central HVAC Unit',
      type: 'hvac',
      location: 'Rooftop',
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 88,
      currentValue: 75,
      unit: '%',
      alerts: 0,
      autoControl: true
    },
    {
      id: 'light-01',
      name: 'Smart Lighting Zone 1',
      type: 'lighting',
      location: 'Office Area',
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 95,
      currentValue: 60,
      unit: '%',
      alerts: 0,
      autoControl: true
    },
    {
      id: 'cam-01',
      name: 'Security Camera 1',
      type: 'camera',
      location: 'Main Entrance',
      status: 'offline',
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
      batteryLevel: 15,
      signalStrength: 45,
      currentValue: 0,
      unit: 'fps',
      alerts: 2,
      autoControl: false
    },
    {
      id: 'env-01',
      name: 'Air Quality Monitor',
      type: 'sensor',
      location: 'Conference Room',
      status: 'maintenance',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      batteryLevel: 92,
      signalStrength: 78,
      currentValue: 420,
      unit: 'ppm',
      threshold: { min: 0, max: 1000 },
      alerts: 1,
      autoControl: false
    }
  ]);

  // Mock real-time monitoring data
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([]);

  // Mock system alerts
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'alert-001',
      type: 'warning',
      device: 'Security Camera 1',
      message: 'Device offline for 15 minutes - Low battery detected',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
      autoResolved: false
    },
    {
      id: 'alert-002',
      type: 'critical',
      device: 'Main Power Meter',
      message: 'Power consumption exceeding normal threshold by 15%',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      acknowledged: false,
      autoResolved: false
    },
    {
      id: 'alert-003',
      type: 'info',
      device: 'Air Quality Monitor',
      message: 'Scheduled maintenance mode activated',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      acknowledged: true,
      autoResolved: false
    }
  ]);

  // Generate mock real-time data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data = [];
      
      for (let i = 19; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 30 * 1000);
        data.push({
          timestamp: timestamp.toISOString(),
          temperature: 22 + Math.sin(i * 0.1) * 2 + Math.random() * 0.5,
          humidity: 45 + Math.cos(i * 0.1) * 5 + Math.random() * 2,
          powerConsumption: 440 + Math.sin(i * 0.2) * 30 + Math.random() * 10,
          voltage: 230 + Math.random() * 2 - 1,
          frequency: 50 + Math.random() * 0.2 - 0.1,
          co2Level: 400 + Math.random() * 50
        });
      }
      
      setMonitoringData(data);
    };

    generateData();
    
    if (monitoringEnabled) {
      const interval = setInterval(() => {
        generateData();
        setLastUpdate(new Date());
      }, refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [monitoringEnabled, refreshInterval]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor': return Thermometer;
      case 'meter': return Gauge;
      case 'hvac': return AirVent;
      case 'lighting': return Lightbulb;
      case 'camera': return Camera;
      case 'controller': return Settings;
      default: return Router;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const toggleDeviceControl = (deviceId: string) => {
    setDevices(prev => prev.map(device =>
      device.id === deviceId ? { ...device, autoControl: !device.autoControl } : device
    ));
  };

  const getSignalStrengthIcon = (strength: number) => {
    if (strength >= 80) return <Signal className="h-4 w-4 text-green-600" />;
    if (strength >= 50) return <Signal className="h-4 w-4 text-yellow-600" />;
    return <Signal className="h-4 w-4 text-red-600" />;
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const totalAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            Real-time Monitoring
          </h1>
          <p className="text-gray-600 mt-1">
            Live IoT device monitoring and automated control system
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonitoringEnabled(!monitoringEnabled)}
          >
            {monitoringEnabled ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            {monitoringEnabled ? 'Monitoring' : 'Paused'}
          </Button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Devices</p>
                <p className="text-2xl font-bold text-green-600">{onlineDevices}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline Devices</p>
                <p className="text-2xl font-bold text-red-600">{offlineDevices}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <WifiOff className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{totalAlerts}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refresh Rate</p>
                <p className="text-2xl font-bold text-blue-600">{refreshInterval}s</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">Device Status</TabsTrigger>
          <TabsTrigger value="monitoring">Live Data</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>
                    Monitor and control all IoT devices in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {devices.map((device) => {
                    const DeviceIcon = getDeviceIcon(device.type);
                    const isSelected = selectedDevice === device.id;
                    
                    return (
                      <div
                        key={device.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDevice(isSelected ? null : device.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <DeviceIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{device.name}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {device.location}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {device.currentValue} {device.unit}
                              </p>
                              <p className="text-xs text-gray-500">
                                {device.lastSeen.toLocaleTimeString()}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-center gap-1">
                              <Badge className={getStatusColor(device.status)}>
                                {device.status}
                              </Badge>
                              {device.alerts > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {device.alerts} alerts
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-center gap-1">
                              {getSignalStrengthIcon(device.signalStrength)}
                              <span className="text-xs text-gray-500">{device.signalStrength}%</span>
                            </div>
                            
                            {device.batteryLevel && (
                              <div className="flex flex-col items-center gap-1">
                                <Battery className={`h-4 w-4 ${
                                  device.batteryLevel > 50 ? 'text-green-600' : 
                                  device.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                                }`} />
                                <span className="text-xs text-gray-500">{device.batteryLevel}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Auto Control</span>
                              <Switch
                                checked={device.autoControl}
                                onCheckedChange={() => toggleDeviceControl(device.id)}
                              />
                            </div>
                            
                            {device.threshold && (
                              <div className="space-y-2">
                                <span className="text-sm font-medium">Threshold Range</span>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>Min: {device.threshold.min} {device.unit}</span>
                                  <span>•</span>
                                  <span>Max: {device.threshold.max} {device.unit}</span>
                                </div>
                                <Progress 
                                  value={((device.currentValue - device.threshold.min) / 
                                          (device.threshold.max - device.threshold.min)) * 100} 
                                />
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                              <Button size="sm" variant="outline">
                                <Activity className="h-4 w-4 mr-2" />
                                View History
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Selected Device Details */}
            <div className="space-y-6">
              {selectedDevice ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Device Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {devices.find(d => d.id === selectedDevice)?.currentValue}
                        </div>
                        <div className="text-gray-600">
                          {devices.find(d => d.id === selectedDevice)?.unit}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Signal Strength</span>
                          <span className="text-sm font-medium">
                            {devices.find(d => d.id === selectedDevice)?.signalStrength}%
                          </span>
                        </div>
                        <Progress 
                          value={devices.find(d => d.id === selectedDevice)?.signalStrength || 0} 
                        />
                      </div>
                      
                      {devices.find(d => d.id === selectedDevice)?.batteryLevel && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Battery Level</span>
                            <span className="text-sm font-medium">
                              {devices.find(d => d.id === selectedDevice)?.batteryLevel}%
                            </span>
                          </div>
                          <Progress 
                            value={devices.find(d => d.id === selectedDevice)?.batteryLevel || 0} 
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <Router className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>Select a device to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Monitoring</CardTitle>
                <CardDescription>Live temperature and humidity readings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monitoringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Power Monitoring</CardTitle>
                <CardDescription>Real-time electrical parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monitoringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="powerConsumption" 
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Power (kW)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>System Alerts</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoAlertsEnabled(!autoAlertsEnabled)}
                  >
                    {autoAlertsEnabled ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
                    Auto Alerts {autoAlertsEnabled ? 'On' : 'Off'}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Monitor and manage system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">{alert.device}</span>
                        <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.type}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="outline">Acknowledged</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                    
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
              <CardDescription>
                Configure monitoring parameters and alert thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Real-time Monitoring</label>
                    <p className="text-xs text-gray-600">Enable continuous data collection</p>
                  </div>
                  <Switch
                    checked={monitoringEnabled}
                    onCheckedChange={setMonitoringEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Refresh Interval (seconds)</label>
                  <Slider
                    value={[refreshInterval]}
                    onValueChange={(value) => setRefreshInterval(value[0])}
                    max={60}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1s</span>
                    <span>{refreshInterval}s</span>
                    <span>60s</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Automatic Alerts</label>
                    <p className="text-xs text-gray-600">Send notifications for threshold violations</p>
                  </div>
                  <Switch
                    checked={autoAlertsEnabled}
                    onCheckedChange={setAutoAlertsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Data Retention</label>
                    <p className="text-xs text-gray-600">Keep historical data for 30 days</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealtimeMonitoring;