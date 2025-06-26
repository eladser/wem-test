import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNotify } from '@/components/notifications/NotificationSystem';

// WebSocket connection states
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  id?: string;
}

// WebSocket configuration
interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
  onOpen?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  enableLogging?: boolean;
  suppressNotifications?: boolean; // New option to suppress notifications
}

// WebSocket manager class with enhanced fallback logic
class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempt = 0;
  private isReconnecting = false;
  private messageQueue: WebSocketMessage[] = [];
  private subscribers = new Set<(state: ConnectionState) => void>();
  private messageSubscribers = new Set<(message: WebSocketMessage) => void>();
  private urlIndex = 0;
  private fallbackUrls: string[] = [];
  private lastNotificationState: ConnectionState | null = null;
  private notificationCooldown: NodeJS.Timeout | null = null;
  private connectionStabilityTimeout: NodeJS.Timeout | null = null;
  private isConnectionStable = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      protocols: undefined,
      reconnect: true,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      heartbeatInterval: 30000,
      heartbeatMessage: JSON.stringify({ type: 'ping', timestamp: Date.now() }),
      onOpen: () => {},
      onMessage: () => {},
      onClose: () => {},
      onError: () => {},
      enableLogging: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
      suppressNotifications: false,
      ...config
    };

    // Setup fallback URLs
    this.setupFallbackUrls();
  }

  private setupFallbackUrls(): void {
    this.fallbackUrls = [
      this.config.url, // Primary URL from config
      import.meta.env.VITE_WS_URL_DIRECT || 'ws://localhost:5000/ws/energy-data', // Direct backend
      'ws://localhost:5173/ws/energy-data', // Through Vite proxy
      'ws://127.0.0.1:5000/ws/energy-data', // Localhost fallback
    ].filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates

    this.log('Fallback URLs configured:', this.fallbackUrls);
  }

  getCurrentUrl(): string {
    return this.fallbackUrls[this.urlIndex] || this.config.url;
  }

  private showNotification(state: ConnectionState, notify: any): void {
    // Skip notifications if suppressed or if it's the same state within cooldown period
    if (this.config.suppressNotifications || this.lastNotificationState === state) {
      return;
    }

    // Clear any existing cooldown
    if (this.notificationCooldown) {
      clearTimeout(this.notificationCooldown);
    }

    // Only show notifications for stable connections or significant state changes
    const shouldNotify = (
      state === 'connected' && this.isConnectionStable
    ) || (
      state === 'error' && this.reconnectAttempt >= 2
    ) || (
      state === 'disconnected' && this.lastNotificationState === 'connected' && this.isConnectionStable
    );

    if (shouldNotify) {
      switch (state) {
        case 'connected':
          notify.success('Connected', 'Real-time data connection established', { duration: 3000 });
          break;
        case 'error':
          notify.error('Connection Error', 'Unable to establish connection - using offline data', { duration: 5000 });
          break;
        case 'disconnected':
          if (this.lastNotificationState === 'connected') {
            notify.warning('Connection Lost', 'Attempting to reconnect...', { duration: 4000 });
          }
          break;
      }
      
      this.lastNotificationState = state;
      
      // Set cooldown to prevent spam (minimum 10 seconds between same notifications)
      this.notificationCooldown = setTimeout(() => {
        this.lastNotificationState = null;
      }, 10000);
    }
  }

  connect(notify?: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('WebSocket already connected');
      return;
    }

    const currentUrl = this.getCurrentUrl();
    
    try {
      this.log(`Connecting to ${currentUrl}... (attempt ${this.urlIndex + 1}/${this.fallbackUrls.length})`);
      this.notifyStateChange('connecting');
      
      this.ws = new WebSocket(currentUrl, this.config.protocols);
      this.setupEventListeners(notify);
    } catch (error) {
      this.log('Failed to create WebSocket connection:', error);
      this.handleConnectionError(notify);
    }
  }

  disconnect(): void {
    this.log('Disconnecting WebSocket...');
    
    // Clear reconnection
    this.isReconnecting = false;
    this.isConnectionStable = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.connectionStabilityTimeout) {
      clearTimeout(this.connectionStabilityTimeout);
      this.connectionStabilityTimeout = null;
    }
    
    // Clear heartbeat
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }

    // Clear notification cooldown
    if (this.notificationCooldown) {
      clearTimeout(this.notificationCooldown);
      this.notificationCooldown = null;
    }

    // Close connection
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.notifyStateChange('disconnected');
  }

  send(message: Omit<WebSocketMessage, 'timestamp'>): boolean {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(fullMessage));
        this.log('Message sent:', fullMessage);
        return true;
      } catch (error) {
        this.log('Failed to send message:', error);
        this.queueMessage(fullMessage);
        return false;
      }
    } else {
      this.log('WebSocket not connected, queueing message:', fullMessage);
      this.queueMessage(fullMessage);
      return false;
    }
  }

  private setupEventListeners(notify?: any): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      this.log(`WebSocket connected to ${this.getCurrentUrl()}`);
      this.reconnectAttempt = 0;
      this.urlIndex = 0; // Reset to primary URL on successful connection
      this.isReconnecting = false;
      
      // Mark connection as stable after 5 seconds of being connected
      this.connectionStabilityTimeout = setTimeout(() => {
        this.isConnectionStable = true;
        if (notify) {
          this.showNotification('connected', notify);
        }
      }, 5000);
      
      this.notifyStateChange('connected');
      this.startHeartbeat();
      this.sendQueuedMessages();
      this.config.onOpen(event);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.log('Message received:', message);
        
        // Handle heartbeat response
        if (message.type === 'pong') {
          this.log('Heartbeat pong received');
          return;
        }

        this.config.onMessage(message);
        this.notifyMessageReceived(message);
      } catch (error) {
        this.log('Failed to parse message:', error);
      }
    };

    this.ws.onclose = (event) => {
      this.log(`WebSocket closed: ${event.code} - ${event.reason} (URL: ${this.getCurrentUrl()})`);
      
      this.isConnectionStable = false;
      if (this.connectionStabilityTimeout) {
        clearTimeout(this.connectionStabilityTimeout);
        this.connectionStabilityTimeout = null;
      }
      
      if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
      }

      this.config.onClose(event);

      if (this.config.reconnect && !this.isReconnecting && event.code !== 1000) {
        this.handleReconnection(notify);
      } else {
        this.notifyStateChange('disconnected');
        if (notify && this.isConnectionStable) {
          this.showNotification('disconnected', notify);
        }
      }
    };

    this.ws.onerror = (event) => {
      this.log(`WebSocket error on ${this.getCurrentUrl()}:`, event);
      this.config.onError(event);
      this.handleConnectionError(notify);
    };
  }

  private handleConnectionError(notify?: any): void {
    this.notifyStateChange('error');
    
    if (notify) {
      this.showNotification('error', notify);
    }
    
    if (this.config.reconnect && !this.isReconnecting) {
      this.handleReconnection(notify);
    }
  }

  private handleReconnection(notify?: any): void {
    // Try next URL if available
    if (this.urlIndex < this.fallbackUrls.length - 1) {
      this.urlIndex++;
      this.log(`Trying next URL: ${this.getCurrentUrl()}`);
      setTimeout(() => this.connect(notify), 1000);
      return;
    }

    // If all URLs tried, use normal reconnection logic
    if (this.reconnectAttempt >= this.config.reconnectAttempts) {
      this.log('Max reconnection attempts reached');
      this.notifyStateChange('error');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempt++;
    this.urlIndex = 0; // Reset to first URL
    this.notifyStateChange('reconnecting');

    this.log(`Reconnecting in ${this.config.reconnectInterval}ms (attempt ${this.reconnectAttempt}/${this.config.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect(notify);
    }, this.config.reconnectInterval);
  }

  private startHeartbeat(): void {
    if (this.config.heartbeatInterval <= 0) return;

    this.heartbeatTimeout = setTimeout(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(this.config.heartbeatMessage);
          this.log('Heartbeat sent');
          this.startHeartbeat(); // Schedule next heartbeat
        } catch (error) {
          this.log('Failed to send heartbeat:', error);
        }
      }
    }, this.config.heartbeatInterval);
  }

  private queueMessage(message: WebSocketMessage): void {
    this.messageQueue.push(message);
    
    // Limit queue size
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift();
    }
  }

  private sendQueuedMessages(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(JSON.stringify(message));
          this.log('Queued message sent:', message);
        } catch (error) {
          this.log('Failed to send queued message:', error);
          // Put it back at the front of the queue
          this.messageQueue.unshift(message);
          break;
        }
      }
    }
  }

  private notifyStateChange(state: ConnectionState): void {
    this.subscribers.forEach(callback => callback(state));
  }

  private notifyMessageReceived(message: WebSocketMessage): void {
    this.messageSubscribers.forEach(callback => callback(message));
  }

  subscribeToState(callback: (state: ConnectionState) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  subscribeToMessages(callback: (message: WebSocketMessage) => void): () => void {
    this.messageSubscribers.add(callback);
    return () => this.messageSubscribers.delete(callback);
  }

  getConnectionState(): ConnectionState {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED: return this.isReconnecting ? 'reconnecting' : 'disconnected';
      default: return 'error';
    }
  }

  private log(...args: any[]): void {
    if (this.config.enableLogging) {
      console.log('[WebSocket]', ...args);
    }
  }
}

// React hook for WebSocket with enhanced fallback and smarter notifications
export const useWebSocket = (config: WebSocketConfig) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const managerRef = useRef<WebSocketManager | null>(null);
  const notify = useNotify();

  // Initialize WebSocket manager
  useEffect(() => {
    managerRef.current = new WebSocketManager(config);

    // Subscribe to state changes
    const unsubscribeState = managerRef.current.subscribeToState(setConnectionState);
    
    // Subscribe to messages
    const unsubscribeMessages = managerRef.current.subscribeToMessages(setLastMessage);

    // Auto-connect with notification context
    managerRef.current.connect(notify);

    return () => {
      unsubscribeState();
      unsubscribeMessages();
      managerRef.current?.disconnect();
    };
  }, [config.url]);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    return managerRef.current?.send(message) || false;
  }, []);

  const connect = useCallback(() => {
    managerRef.current?.connect(notify);
  }, [notify]);

  const disconnect = useCallback(() => {
    managerRef.current?.disconnect();
  }, []);

  return {
    connectionState,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    isReconnecting: connectionState === 'reconnecting',
    currentUrl: managerRef.current?.getCurrentUrl() || config.url
  };
};

// Enhanced Connection status indicator component
export const ConnectionStatus: React.FC<{
  connectionState: ConnectionState;
  className?: string;
  currentUrl?: string;
  showUrl?: boolean;
}> = ({ connectionState, className = '', currentUrl, showUrl = false }) => {
  const statusConfig = {
    connected: {
      color: 'bg-emerald-500',
      text: 'Connected',
      pulse: false,
      textColor: 'text-emerald-400'
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting...',
      pulse: true,
      textColor: 'text-yellow-400'
    },
    reconnecting: {
      color: 'bg-orange-500',
      text: 'Reconnecting...',
      pulse: true,
      textColor: 'text-orange-400'
    },
    disconnected: {
      color: 'bg-slate-500',
      text: 'Offline',
      pulse: false,
      textColor: 'text-slate-400'
    },
    error: {
      color: 'bg-red-500',
      text: 'Connection Error',
      pulse: false,
      textColor: 'text-red-400'
    }
  };

  const config = statusConfig[connectionState];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
      {showUrl && import.meta.env.VITE_DEBUG === 'true' && currentUrl && (
        <span className="text-xs text-slate-500 font-mono ml-2">
          {currentUrl.replace('ws://', '').replace('wss://', '')}
        </span>
      )}
    </div>
  );
};

// Real-time data hook for specific data types with enhanced fallback
export const useRealTimeData = <T,>(
  websocketConfig: WebSocketConfig,
  dataType: string,
  initialData?: T
) => {
  const [data, setData] = useState<T | undefined>(initialData);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const { connectionState, lastMessage, sendMessage, currentUrl } = useWebSocket({
    ...websocketConfig,
    onMessage: (message) => {
      if (message.type === dataType) {
        setData(message.data);
        setLastUpdated(message.timestamp);
      }
      websocketConfig.onMessage?.(message);
    }
  });

  const requestData = useCallback(() => {
    sendMessage({
      type: `request_${dataType}`,
      data: null
    });
  }, [sendMessage, dataType]);

  return {
    data,
    lastUpdated,
    connectionState,
    requestData,
    sendMessage,
    currentUrl
  };
};

export default WebSocketManager;