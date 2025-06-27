import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Clock,
  Zap,
  Users,
  Activity,
  Shield,
  Database,
  Wifi
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'critical';
type NotificationCategory = 'system' | 'security' | 'performance' | 'maintenance' | 'user' | 'alert';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  timestamp: Date;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  actionRequired?: boolean;
  relatedEntity?: {
    type: 'site' | 'region' | 'user' | 'system';
    id: string;
    name: string;
  };
}

interface NotificationCenterProps {
  className?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'System Performance Alert',
    message: 'Main Campus site experiencing reduced efficiency (78%). Recommend immediate inspection.',
    type: 'warning',
    category: 'performance',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    isArchived: false,
    priority: 'high',
    source: 'Automated Monitoring',
    actionRequired: true,
    relatedEntity: { type: 'site', id: 'site-1', name: 'Main Campus' }
  },
  {
    id: '2',
    title: 'New User Registration',
    message: 'Sarah Johnson has requested access to the North America region dashboard.',
    type: 'info',
    category: 'user',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isRead: false,
    isArchived: false,
    priority: 'medium',
    source: 'User Management',
    actionRequired: true,
    relatedEntity: { type: 'user', id: 'user-123', name: 'Sarah Johnson' }
  },
  {
    id: '3',
    title: 'Scheduled Maintenance Complete',
    message: 'Warehouse B maintenance completed successfully. System restored to full capacity.',
    type: 'success',
    category: 'maintenance',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    isArchived: false,
    priority: 'low',
    source: 'Maintenance Team',
    actionRequired: false,
    relatedEntity: { type: 'site', id: 'site-2', name: 'Warehouse B' }
  },
  {
    id: '4',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100. Account temporarily locked.',
    type: 'error',
    category: 'security',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
    isArchived: false,
    priority: 'critical',
    source: 'Security Monitor',
    actionRequired: true,
    relatedEntity: { type: 'system', id: 'security-1', name: 'Authentication System' }
  },
  {
    id: '5',
    title: 'Database Backup Complete',
    message: 'Daily database backup completed successfully. 2.4GB backed up to secure storage.',
    type: 'success',
    category: 'system',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isRead: true,
    isArchived: false,
    priority: 'low',
    source: 'Backup Service',
    actionRequired: false
  }
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | NotificationCategory>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate notification counts
  const notificationCounts = useMemo(() => {
    const unread = notifications.filter(n => !n.isRead && !n.isArchived).length;
    const critical = notifications.filter(n => n.priority === 'critical' && !n.isRead && !n.isArchived).length;
    const actionRequired = notifications.filter(n => n.actionRequired && !n.isRead && !n.isArchived).length;
    
    return { unread, critical, actionRequired };
  }, [notifications]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (notification.isArchived) return false;
      if (showOnlyUnread && notification.isRead) return false;
      if (filter !== 'all' && notification.category !== filter) return false;
      return true;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notifications, filter, showOnlyUnread]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('All notifications marked as read');
  }, []);

  // Archive notification
  const archiveNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isArchived: true }
          : notification
      )
    );
    toast.success('Notification archived');
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success('Notification deleted');
  }, []);

  // Get icon for notification type
  const getNotificationIcon = useCallback((type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  }, []);

  // Get category icon
  const getCategoryIcon = useCallback((category: NotificationCategory) => {
    switch (category) {
      case 'system':
        return <Database className="w-3 h-3" />;
      case 'security':
        return <Shield className="w-3 h-3" />;
      case 'performance':
        return <Activity className="w-3 h-3" />;
      case 'maintenance':
        return <Settings className="w-3 h-3" />;
      case 'user':
        return <Users className="w-3 h-3" />;
      case 'alert':
        return <Zap className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Handle navigation to related entity
    if (notification.relatedEntity) {
      console.log('Navigate to:', notification.relatedEntity);
      // In a real app, you'd navigate to the related entity
    }

    setIsOpen(false);
  }, [markAsRead]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200",
            className
          )}
        >
          <Bell className="w-4 h-4" />
          {notificationCounts.unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 flex items-center justify-center">
              {notificationCounts.unread > 99 ? '99+' : notificationCounts.unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-96 bg-slate-900 border-slate-700 p-0" align="end">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {notificationCounts.unread > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-xs text-slate-400 hover:text-white h-6"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-slate-400">{notificationCounts.critical} critical</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-slate-400">{notificationCounts.actionRequired} need action</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-slate-400">{notificationCounts.unread} unread</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'ghost'}
              onClick={() => setFilter('all')}
              className="text-xs h-6"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === 'alert' ? 'default' : 'ghost'}
              onClick={() => setFilter('alert')}
              className="text-xs h-6"
            >
              Alerts
            </Button>
            <Button
              size="sm"
              variant={filter === 'system' ? 'default' : 'ghost'}
              onClick={() => setFilter('system')}
              className="text-xs h-6"
            >
              System
            </Button>
            <Button
              size="sm"
              variant={filter === 'security' ? 'default' : 'ghost'}
              onClick={() => setFilter('security')}
              className="text-xs h-6"
            >
              Security
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              className="text-xs h-6 text-slate-400 hover:text-white"
            >
              {showOnlyUnread ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              {showOnlyUnread ? 'Show all' : 'Unread only'}
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-96">
          <div className="p-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      notification.isRead 
                        ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50" 
                        : "bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50",
                      notification.priority === 'critical' && !notification.isRead && "border-red-500/30 bg-red-500/10"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            notification.isRead ? "text-slate-300" : "text-white"
                          )}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={cn("text-xs px-1.5 py-0.5", getPriorityColor(notification.priority))}
                            >
                              {notification.priority}
                            </Badge>
                            {notification.actionRequired && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs px-1.5 py-0.5">
                                Action
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className={cn(
                          "text-xs mb-2 line-clamp-2",
                          notification.isRead ? "text-slate-400" : "text-slate-300"
                        )}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {getCategoryIcon(notification.category)}
                            <span>{notification.source}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                          
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons (shown on hover) */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                      >
                        <Archive className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700 bg-slate-800/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-slate-400 hover:text-white hover:bg-slate-700/50"
            onClick={() => {
              setIsOpen(false);
              console.log('Navigate to full notifications page');
            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};