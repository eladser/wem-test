
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Info, X, Clock } from "lucide-react";
import { theme } from "@/lib/theme";

interface Notification {
  id: string;
  type: "alert" | "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  site?: string;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "Battery Level Critical",
      message: "Site A battery level has dropped below 15%",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      site: "Site A"
    },
    {
      id: "2", 
      type: "warning",
      title: "Maintenance Required",
      message: "Solar panel cleaning scheduled for tomorrow",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      site: "Site B"
    },
    {
      id: "3",
      type: "success",
      title: "Peak Performance",
      message: "Site C achieved 98% efficiency today",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      site: "Site C"
    },
    {
      id: "4",
      type: "info",
      title: "Weather Update",
      message: "Sunny conditions expected for the next 3 days",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "info": return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "alert": return "bg-red-500/10 border-red-500/20";
      case "warning": return "bg-yellow-500/10 border-yellow-500/20";
      case "success": return "bg-green-500/10 border-green-500/20";
      case "info": return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <Card className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${theme.colors.text.primary} flex items-center gap-2`}>
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-emerald-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="text-slate-400 border-slate-600 hover:bg-slate-800"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className={`${theme.colors.text.muted}`}>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                notification.read 
                  ? "bg-slate-800/30 border-slate-700" 
                  : `${getTypeColor(notification.type)} border`
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium text-sm ${
                        notification.read ? theme.colors.text.muted : theme.colors.text.primary
                      }`}>
                        {notification.title}
                      </h4>
                      {notification.site && (
                        <Badge variant="outline" className="text-xs">
                          {notification.site}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${theme.colors.text.muted} mb-2`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
