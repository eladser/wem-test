
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Energy Consumption',
    message: 'Site Alpha is consuming 15% more energy than expected',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    action: {
      label: 'View Details',
      onClick: () => console.log('Navigate to Site Alpha')
    }
  },
  {
    id: '2',
    type: 'success',
    title: 'Maintenance Complete',
    message: 'Scheduled maintenance on Grid B has been completed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false
  },
  {
    id: '3',
    type: 'error',
    title: 'Connection Lost',
    message: 'Unable to connect to monitoring system for Site Charlie',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
    action: {
      label: 'Retry Connection',
      onClick: () => console.log('Retry connection')
    }
  },
  {
    id: '4',
    type: 'info',
    title: 'System Update',
    message: 'New analytics features are now available in your dashboard',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true
  }
];

export const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getNotificationBorder = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30';
      case 'warning':
        return 'border-amber-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'info':
        return 'border-blue-500/30';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-notification-panel]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" data-notification-panel>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 z-[100]">
          <Card className="bg-slate-900 border-slate-700 shadow-2xl">
            <CardHeader className="pb-3 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead} 
                      className="text-slate-300 hover:text-white h-8"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsOpen(false)} 
                    className="text-slate-300 hover:text-white h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-slate-700 last:border-b-0 transition-all duration-200 hover:bg-slate-800/50",
                        !notification.read && "bg-slate-800/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={cn(
                              "font-medium text-sm",
                              !notification.read ? "text-white" : "text-slate-300"
                            )}>
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100 text-slate-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            <div className="flex gap-2">
                              {notification.action && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs px-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                                  onClick={notification.action.onClick}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs px-2 text-slate-400 hover:text-white"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
