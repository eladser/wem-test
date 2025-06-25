
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, X, Settings, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  site?: string;
  region?: string;
}

export const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Temperature Alert',
      message: 'Panel temperature exceeding normal range at Solar Farm Alpha',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      read: false,
      site: 'Solar Farm Alpha',
      region: 'North America'
    },
    {
      id: '2',
      type: 'success',
      title: 'Maintenance Completed',
      message: 'Scheduled maintenance completed successfully at Wind Farm Beta',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      site: 'Wind Farm Beta',
      region: 'Europe'
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update',
      message: 'New energy monitoring features are now available',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: '4',
      type: 'error',
      title: 'Grid Connection Issue',
      message: 'Intermittent connectivity detected at Hydro Station Gamma',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: true,
      site: 'Hydro Station Gamma',
      region: 'Asia Pacific'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 bg-slate-900 border-slate-700 shadow-2xl" 
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-slate-400 hover:text-white h-6 px-2"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No notifications</p>
                <p className="text-slate-500 text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all hover:bg-slate-800/50 group ${
                      notification.read 
                        ? 'border-slate-800 bg-slate-900/30' 
                        : 'border-slate-700 bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-medium text-sm truncate ${
                            notification.read ? 'text-slate-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className={`text-xs mb-2 ${
                          notification.read ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{getTimeAgo(notification.timestamp)}</span>
                            {notification.site && (
                              <>
                                <span>•</span>
                                <span>{notification.site}</span>
                              </>
                            )}
                          </div>
                          
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-emerald-400 hover:text-emerald-300 h-5 px-2"
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="bg-slate-700" />
        <div className="p-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
