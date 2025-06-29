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
  suppressNotifications?: boolean;
}

// Global WebSocket manager registry to prevent multiple instances
const globalWebSocketRegistry = new Map<string, WebSocketManager>();

// WebSocket manager class with enhanced singleton pattern
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
  private isDestroyed = false;
  private connectionId: string;

  constructor(config: WebSocketConfig) {
    this.connectionId = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.config = {
      protocols: undefined,
      reconnect: true,
      reconnectAttempts: 3,
      reconnectInterval: 5000,
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

    this.setupFallbackUrls();
    this.log(`WebSocket Manager created with ID: ${this.connectionId}`);
  }

  private setupFallbackUrls(): void {
    this.fallbackUrls = [
      this.config.url,
      import.meta.env.VITE_WS_URL_DIRECT || 'ws://localhost:5000/ws/energy-data',
    ].filter((url, index, arr) => arr.indexOf(url) === index);

    this.log('Fallback URLs configured:', this.fallbackUrls);
  }

  getCurrentUrl(): string {
    return this.fallbackUrls[this.urlIndex] || this.config.url;
  }

  private showNotification(state: ConnectionState, notify: any): void {
    if (this.config.suppressNotifications || this.lastNotificationState === state || this.isDestroyed) {
      return;
    }

    if (this.notificationCooldown) {
      clearTimeout(this.notificationCooldown);
    }

    const shouldNotify = (
      state === 'connected' && this.isConnectionStable
    ) || (
      state === 'error' && this.reconnectAttempt >= 2
    );

    if (shouldNotify) {
      switch (state) {
        case 'connected':
          notify.success('Connected', 'Real-time data connection established', { duration: 3000 });
          break;
        case 'error':
          notify.error('Connection Error', 'Unable to establish connection - using offline data', { duration: 5000 });
          break;
      }
      
      this.lastNotificationState = state;
      this.notificationCooldown = setTimeout(() => {
        this.lastNotificationState = null;
      }, 10000);
    }
  }

  connect(notify?: any): void {
    if (this.isDestroyed) {
      this.log('Cannot connect - WebSocket manager is destroyed');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('WebSocket already connected');
      return;
    }

    // Close existing connection if any
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      this.log('Closing existing connection before creating new one');
      this.ws.close(1000, 'Reconnecting');
    }

    const currentUrl = this.getCurrentUrl();
    
    try {
      this.log(`[${this.connectionId}] Connecting to ${currentUrl}...`);
      this.notifyStateChange('connecting');
      
      this.ws = new WebSocket(currentUrl, this.config.protocols);
      this.setupEventListeners(notify);
    } catch (error) {
      this.log('Failed to create WebSocket connection:', error);
      this.handleConnectionError(notify);
    }
  }

  disconnect(): void {
    this.log(`[${this.connectionId}] Disconnecting WebSocket...`);
    
    this.isDestroyed = true;
    this.isReconnecting = false;
    this.isConnectionStable = false;
    
    // Clear all timeouts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.connectionStabilityTimeout) {
      clearTimeout(this.connectionStabilityTimeout);
      this.connectionStabilityTimeout = null;
    }
    
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }

    if (this.notificationCooldown) {
      clearTimeout(this.notificationCooldown);
      this.notificationCooldown = null;
    }

    // Close connection
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    // Clear subscribers
    this.subscribers.clear();
    this.messageSubscribers.clear();
    
    this.notifyStateChange('disconnected');
  }

  send(message: Omit<WebSocketMessage, 'timestamp'>): boolean {
    if (this.isDestroyed) {
      return false;
    }

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
    if (!this.ws || this.isDestroyed) return;

    this.ws.onopen = (event) => {
      if (this.isDestroyed) return;
      
      this.log(`[${this.connectionId}] WebSocket connected to ${this.getCurrentUrl()}`);
      this.reconnectAttempt = 0;
      this.urlIndex = 0;
      this.isReconnecting = false;
      
      // Mark connection as stable after 3 seconds
      this.connectionStabilityTimeout = setTimeout(() => {
        if (!this.isDestroyed) {
          this.isConnectionStable = true;
          if (notify) {
            this.showNotification('connected', notify);
          }
        }
      }, 3000);
      
      this.notifyStateChange('connected');
      this.startHeartbeat();
      this.sendQueuedMessages();
      
      // FIXED: Safely call onOpen callback
      try {
        if (this.config.onOpen && typeof this.config.onOpen === 'function') {
          this.config.onOpen(event);
        }
      } catch (error) {
        this.log('Error in onOpen callback:', error);
      }
    };

    this.ws.onmessage = (event) => {
      if (this.isDestroyed) return;
      
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.log('Message received:', message);
        
        if (message.type === 'pong') {
          this.log('Heartbeat pong received');
          return;
        }

        // FIXED: Safely call onMessage callback
        try {
          if (this.config.onMessage && typeof this.config.onMessage === 'function') {
            this.config.onMessage(message);
          }
        } catch (error) {
          this.log('Error in onMessage callback:', error);
        }
        
        this.notifyMessageReceived(message);
      } catch (error) {
        this.log('Failed to parse message:', error);
      }
    };

    this.ws.onclose = (event) => {
      if (this.isDestroyed) {
        this.log(`[${this.connectionId}] WebSocket closed (manager destroyed): ${event.code} - ${event.reason}`);
        return;
      }
      
      this.log(`[${this.connectionId}] WebSocket closed: ${event.code} - ${event.reason}`);
      
      this.isConnectionStable = false;
      if (this.connectionStabilityTimeout) {
        clearTimeout(this.connectionStabilityTimeout);
        this.connectionStabilityTimeout = null;
      }
      
      if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
      }

      // FIXED: Safely call onClose callback
      try {
        if (this.config.onClose && typeof this.config.onClose === 'function') {
          this.config.onClose(event);
        }
      } catch (error) {
        this.log('Error in onClose callback:', error);
      }

      // Only reconnect if it wasn't a manual disconnect and we should reconnect
      if (this.config.reconnect && !this.isReconnecting && event.code !== 1000) {
        this.handleReconnection(notify);
      } else {
        this.notifyStateChange('disconnected');
      }
    };

    this.ws.onerror = (event) => {
      if (this.isDestroyed) return;
      
      this.log(`[${this.connectionId}] WebSocket error:`, event);
      
      // FIXED: Safely call onError callback
      try {
        if (this.config.onError && typeof this.config.onError === 'function') {
          this.config.onError(event);
        }
      } catch (error) {
        this.log('Error in onError callback:', error);
      }
      
      this.handleConnectionError(notify);
    };
  }

  private handleConnectionError(notify?: any): void {
    if (this.isDestroyed) return;
    
    this.notifyStateChange('error');
    
    if (notify) {
      this.showNotification('error', notify);
    }
    
    if (this.config.reconnect && !this.isReconnecting) {
      this.handleReconnection(notify);
    }
  }

  private handleReconnection(notify?: any): void {
    if (this.isDestroyed) return;
    
    if (this.reconnectAttempt >= this.config.reconnectAttempts) {
      this.log('Max reconnection attempts reached');
      this.notifyStateChange('error');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempt++;
    this.notifyStateChange('reconnecting');

    this.log(`[${this.connectionId}] Reconnecting in ${this.config.reconnectInterval}ms (attempt ${this.reconnectAttempt}/${this.config.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isDestroyed) {
        this.connect(notify);
      }
    }, this.config.reconnectInterval);
  }

  private startHeartbeat(): void {
    if (this.config.heartbeatInterval <= 0 || this.isDestroyed) return;

    this.heartbeatTimeout = setTimeout(() => {
      if (this.ws?.readyState === WebSocket.OPEN && !this.isDestroyed) {
        try {
          this.ws.send(this.config.heartbeatMessage);
          this.log('Heartbeat sent');
          this.startHeartbeat();
        } catch (error) {
          this.log('Failed to send heartbeat:', error);
        }
      }
    }, this.config.heartbeatInterval);
  }

  private queueMessage(message: WebSocketMessage): void {
    if (this.isDestroyed) return;
    
    this.messageQueue.push(message);
    if (this.messageQueue.length > 50) {
      this.messageQueue.shift();
    }
  }

  private sendQueuedMessages(): void {
    if (this.isDestroyed) return;
    
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(JSON.stringify(message));
          this.log('Queued message sent:', message);
        } catch (error) {
          this.log('Failed to send queued message:', error);
          this.messageQueue.unshift(message);
          break;
        }
      }
    }
  }

  private notifyStateChange(state: ConnectionState): void {
    if (this.isDestroyed) return;
    this.subscribers.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        this.log('Error in state change callback:', error);
      }
    });
  }

  private notifyMessageReceived(message: WebSocketMessage): void {
    if (this.isDestroyed) return;
    this.messageSubscribers.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        this.log('Error in message callback:', error);
      }
    });
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
    if (this.isDestroyed || !this.ws) return 'disconnected';
    
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
      console.log(`[WebSocket-${this.connectionId.slice(-8)}]`, ...args);
    }
  }
}

// Enhanced React hook with singleton pattern
export const useWebSocket = (config: WebSocketConfig) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const managerRef = useRef<WebSocketManager | null>(null);
  const notify = useNotify();
  
  // Stable config reference to prevent unnecessary re-connections
  const stableConfig = useRef({
    url: config.url,
    reconnectAttempts: config.reconnectAttempts || 3,
    reconnectInterval: config.reconnectInterval || 5000,
    suppressNotifications: config.suppressNotifications || false,
    enableLogging: config.enableLogging || false
  });

  // Initialize WebSocket manager with singleton pattern
  useEffect(() => {
    const configKey = stableConfig.current.url;
    
    // Check if manager already exists for this URL
    let manager = globalWebSocketRegistry.get(configKey);
    
    if (!manager) {
      // Create new manager only if one doesn't exist
      manager = new WebSocketManager({
        ...stableConfig.current,
        onMessage: (message) => {
          setLastMessage(message);
          if (config.onMessage && typeof config.onMessage === 'function') {
            try {
              config.onMessage(message);
            } catch (error) {
              console.error('Error in onMessage callback:', error);
            }
          }
        },
        onOpen: config.onOpen,
        onClose: config.onClose,
        onError: config.onError,
      });
      
      globalWebSocketRegistry.set(configKey, manager);
      console.log(`Created new WebSocket manager for ${configKey}`);
    } else {
      console.log(`Reusing existing WebSocket manager for ${configKey}`);
    }
    
    managerRef.current = manager;

    // Subscribe to state changes
    const unsubscribeState = manager.subscribeToState(setConnectionState);
    const unsubscribeMessages = manager.subscribeToMessages(setLastMessage);

    // Connect if not already connected
    if (manager.getConnectionState() === 'disconnected') {
      manager.connect(notify);
    }

    return () => {
      unsubscribeState();
      unsubscribeMessages();
      // Don't disconnect on unmount to allow reuse
      console.log(`Component unmounted, keeping WebSocket connection alive for ${configKey}`);
    };
  }, [config.url]); // Only depend on URL

  // Cleanup on app termination
  useEffect(() => {
    const handleBeforeUnload = () => {
      globalWebSocketRegistry.forEach((manager) => {
        manager.disconnect();
      });
      globalWebSocketRegistry.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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

// Connection status indicator component
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

// Real-time data hook
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
      if (websocketConfig.onMessage && typeof websocketConfig.onMessage === 'function') {
        try {
          websocketConfig.onMessage(message);
        } catch (error) {
          console.error('Error in websocketConfig.onMessage:', error);
        }
      }
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