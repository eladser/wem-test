import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  timestamp: number;
  priority?: number; // Higher number = higher priority
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification provider
interface NotificationProviderProps {
  children: React.ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
  defaultDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  position = 'top-right',
  maxNotifications = 5,
  defaultDuration = 5000
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? defaultDuration,
      priority: notification.priority ?? 0
    };

    setNotifications(prev => {
      // Sort by priority (higher first) then by timestamp (newer first)
      const updated = [...prev, newNotification]
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return (b.priority || 0) - (a.priority || 0);
          }
          return b.timestamp - a.timestamp;
        })
        .slice(0, maxNotifications);
      
      return updated;
    });

    // Auto-remove if not persistent
    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration ?? defaultDuration);
    }

    return id;
  }, [defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates }
          : notification
      )
    );
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      updateNotification
    }}>
      {children}
      <NotificationContainer position={position} />
    </NotificationContext.Provider>
  );
};

// Notification hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Convenience hooks for different notification types
export const useNotify = () => {
  const { addNotification } = useNotifications();

  return {
    success: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'success', title, message, ...options }),
    
    error: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'error', title, message, persistent: true, ...options }),
    
    warning: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'info', title, message, ...options }),
  };
};

// Notification container component
const NotificationContainer: React.FC<{ position: NotificationPosition }> = ({ position }) => {
  const { notifications } = useNotifications();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const animationClasses = position.includes('top') 
    ? 'animate-slide-in-down' 
    : 'animate-slide-in-up';

  if (notifications.length === 0) return null;

  return (
    <div className={cn(
      'fixed z-50 flex flex-col space-y-2 max-w-sm w-full',
      positionClasses[position]
    )}>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          className={cn(animationClasses, `animation-delay-${index * 100}`)}
        />
      ))}
    </div>
  );
};

// Individual notification component
const NotificationItem: React.FC<{
  notification: Notification;
  className?: string;
}> = ({ notification, className }) => {
  const { removeNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colorClasses = {
    success: 'bg-green-900/90 border-green-500/50 text-green-100',
    error: 'bg-red-900/90 border-red-500/50 text-red-100',
    warning: 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100',
    info: 'bg-blue-900/90 border-blue-500/50 text-blue-100'
  };

  const iconColorClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const Icon = icons[notification.type];

  // Progress bar animation
  useEffect(() => {
    if (notification.persistent || notification.duration === 0) return;

    const duration = notification.duration || 5000;
    const interval = 50;
    const steps = duration / interval;
    const progressStep = 100 / steps;

    let currentProgress = 100;
    const progressInterval = setInterval(() => {
      currentProgress -= progressStep;
      setProgress(Math.max(0, currentProgress));
      
      if (currentProgress <= 0) {
        clearInterval(progressInterval);
      }
    }, interval);

    return () => clearInterval(progressInterval);
  }, [notification.duration, notification.persistent]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      handleClose();
    }
  };

  return (
    <div
      className={cn(
        'backdrop-blur-xl border rounded-lg p-4 shadow-lg transition-all duration-300',
        colorClasses[notification.type],
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColorClasses[notification.type])} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              {notification.message && (
                <p className="text-sm opacity-90 mt-1">{notification.message}</p>
              )}
            </div>
            
            <button
              onClick={handleClose}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {notification.action && (
            <button
              onClick={handleAction}
              className="text-sm font-medium underline hover:no-underline mt-2"
            >
              {notification.action.label}
            </button>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      {!notification.persistent && notification.duration !== 0 && (
        <div className="mt-3 w-full bg-black/20 rounded-full h-1">
          <div
            className={cn(
              'h-1 rounded-full transition-all duration-50 ease-linear',
              {
                'bg-green-400': notification.type === 'success',
                'bg-red-400': notification.type === 'error',
                'bg-yellow-400': notification.type === 'warning',
                'bg-blue-400': notification.type === 'info'
              }
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Notification bell icon with count
export const NotificationBell: React.FC<{
  className?: string;
  showCount?: boolean;
  onClick?: () => void;
}> = ({ className, showCount = true, onClick }) => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.length;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-lg hover:bg-slate-800 transition-colors',
        className
      )}
    >
      <Bell className="h-5 w-5" />
      {showCount && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

// Notification history component
export const NotificationHistory: React.FC<{
  className?: string;
  maxItems?: number;
}> = ({ className, maxItems = 10 }) => {
  const { notifications, clearAll } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className={cn('p-4 text-center text-slate-400', className)}>
        No notifications
      </div>
    );
  }

  const getStatusColor = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-green-400';
      case 'error': return 'bg-red-400';
      case 'warning': return 'bg-yellow-400';
      case 'info': return 'bg-blue-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Notifications</h3>
        <button
          onClick={clearAll}
          className="text-sm text-slate-400 hover:text-slate-300"
        >
          Clear all
        </button>
      </div>
      
      {notifications.slice(0, maxItems).map((notification) => (
        <div
          key={notification.id}
          className="p-3 bg-slate-800 rounded-lg border border-slate-700"
        >
          <div className="flex items-start space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
              getStatusColor(notification.type)
            )} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              {notification.message && (
                <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
              )}
              <p className="text-xs text-slate-500 mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider;