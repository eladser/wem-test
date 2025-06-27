import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, AlertCircle, Settings, Filter, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  siteId?: string;
  siteName?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'performance' | 'maintenance' | 'security' | 'financial';
  actionUrl?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  autoMarkRead: boolean;
  categories: {
    [key: string]: boolean;
  };
  priorities: {
    [key: string]: boolean;
  };
}

const NOTIFICATION_TYPES = {
  success: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  error: { icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
  info: { icon: Info, color: 'text-blue-400', bgColor: 'bg-blue-500/20' }
};

const PRIORITY_COLORS = {
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400'
};

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Site Performance Alert',
      message: 'Wind turbine efficiency below optimal threshold at Site CA-001',
      timestamp: new Date().toISOString(),
      read: false,
      siteId: 'site-ca-001',
      siteName: 'California Site 001',
      priority: 'high',
      category: 'performance',
      actionUrl: '/site/site-ca-001'
    },
    {
      id: '2',
      type: 'info',
      title: 'Maintenance Scheduled',
      message: 'Routine maintenance scheduled for tomorrow at Site TX-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      siteId: 'site-tx-002',
      siteName: 'Texas Site 002',
      priority: 'medium',
      category: 'maintenance'
    },
    {
      id: '3',
      type: 'success',
      title: 'Energy Target Achieved',
      message: 'Monthly energy production target exceeded by 15%',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: true,
      priority: 'medium',
      category: 'performance'
    },
    {
      id: '4',
      type: 'error',
      title: 'System Alert',
      message: 'Communication lost with monitoring station at Site FL-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      read: false,
      siteId: 'site-fl-003',
      siteName: 'Florida Site 003',
      priority: 'critical',
      category: 'system'
    },
    {
      id: '5',
      type: 'info',
      title: 'Revenue Report Ready',
      message: 'Monthly financial report is ready for download',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      read: true,
      priority: 'low',
      category: 'financial'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: false,
    autoMarkRead: true,
    categories: {
      system: true,
      performance: true,
      maintenance: true,
      security: true,
      financial: false
    },
    priorities: {
      low: false,
      medium: true,
      high: true,
      critical: true
    }
  });

  const [filter, setFilter] = useState<{
    type: string;
    priority: string;
    category: string;
    read: string;
  }>({
    type: 'all',
    priority: 'all',
    category: 'all',
    read: 'all'
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate new notifications
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const types: (keyof typeof NOTIFICATION_TYPES)[] = ['success', 'warning', 'error', 'info'];
        const priorities: Notification['priority'][] = ['low', 'medium', 'high', 'critical'];
        const categories: Notification['category'][] = ['system', 'performance', 'maintenance', 'security', 'financial'];
        
        const messages = [
          'Wind speed optimization completed',
          'Scheduled maintenance reminder',
          'Energy production milestone reached',
          'Weather alert: Strong winds expected',
          'Security scan completed successfully'
        ];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)],
          title: 'Real-time Alert',
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date().toISOString(),
          read: false,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          category: categories[Math.floor(Math.random() * categories.length)]
        };

        setNotifications(prev => [newNotification, ...prev]);
        
        if (settings.soundEnabled) {
          // Play notification sound (would implement actual sound in production)
          console.log('🔔 Notification sound');
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [settings.soundEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filter.type === 'all' || notification.type === filter.type;
    const matchesPriority = filter.priority === 'all' || notification.priority === filter.priority;
    const matchesCategory = filter.category === 'all' || notification.category === filter.category;
    const matchesRead = filter.read === 'all' || 
      (filter.read === 'read' && notification.read) ||
      (filter.read === 'unread' && !notification.read);
    
    return matchesType && matchesPriority && matchesCategory && matchesRead;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: keyof typeof NOTIFICATION_TYPES) => {
    return NOTIFICATION_TYPES[type].icon;
  };

  const updateSettings = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated');
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative border-slate-600 text-slate-300 hover:bg-slate-800">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0 bg-slate-900 border-slate-700" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500/20 text-red-400">
                      {unreadCount} new
                    </Badge>
                  )}
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Notification Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Email Notifications</Label>
                            <Switch
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked) => updateSettings('emailNotifications', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Push Notifications</Label>
                            <Switch
                              checked={settings.pushNotifications}
                              onCheckedChange={(checked) => updateSettings('pushNotifications', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Sound Enabled</Label>
                            <Switch
                              checked={settings.soundEnabled}
                              onCheckedChange={(checked) => updateSettings('soundEnabled', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Auto Mark as Read</Label>
                            <Switch
                              checked={settings.autoMarkRead}
                              onCheckedChange={(checked) => updateSettings('autoMarkRead', checked)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-slate-300">Categories</Label>
                          {Object.entries(settings.categories).map(([category, enabled]) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-sm text-slate-400 capitalize">{category}</span>
                              <Switch
                                checked={enabled}
                                onCheckedChange={(checked) => 
                                  updateSettings('categories', { ...settings.categories, [category]: checked })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-slate-800 border-slate-700">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-slate-400">Type</Label>
                          <Select value={filter.type} onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="h-8 bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                              <SelectItem value="info">Info</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-slate-400">Priority</Label>
                          <Select value={filter.priority} onValueChange={(value) => setFilter(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger className="h-8 bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="all">All Priorities</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-slate-400">Status</Label>
                          <Select value={filter.read} onValueChange={(value) => setFilter(prev => ({ ...prev, read: value }))}>
                            <SelectTrigger className="h-8 bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="unread">Unread</SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllAsRead}
                          className="w-full justify-start text-slate-300 hover:bg-slate-700"
                        >
                          Mark All as Read
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearAllNotifications}
                          className="w-full justify-start text-red-400 hover:bg-red-500/10"
                        >
                          Clear All
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const typeConfig = NOTIFICATION_TYPES[notification.type];
                      
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-slate-800/30' : ''
                          }`}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-full ${typeConfig.bgColor} flex-shrink-0 mt-0.5`}>
                              <IconComponent className={`w-3 h-3 ${typeConfig.color}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className={`text-xs mt-1 ${!notification.read ? 'text-slate-300' : 'text-slate-400'}`}>
                                    {notification.message}
                                  </p>
                                  {notification.siteName && (
                                    <p className="text-xs text-slate-500 mt-1">
                                      {notification.siteName}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className={PRIORITY_COLORS[notification.priority]} variant="secondary">
                                      {notification.priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {notification.category}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-xs text-slate-500">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationCenter;