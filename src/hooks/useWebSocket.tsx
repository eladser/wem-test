import { useEffect, useRef, useState, useCallback } from 'react';
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
}

// WebSocket manager class
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
      enableLogging: process.env.NODE_ENV === 'development',
      ...config
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('WebSocket already connected');
      return;
    }

    try {
      this.log(`Connecting to ${this.config.url}...`);
      this.notifyStateChange('connecting');
      
      this.ws = new WebSocket(this.config.url, this.config.protocols);
      this.setupEventListeners();
    } catch (error) {
      this.log('Failed to create WebSocket connection:', error);
      this.handleConnectionError();
    }
  }

  disconnect(): void {
    this.log('Disconnecting WebSocket...');
    
    // Clear reconnection
    this.isReconnecting = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Clear heartbeat
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
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

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      this.log('WebSocket connected');
      this.reconnectAttempt = 0;
      this.isReconnecting = false;
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
      this.log(`WebSocket closed: ${event.code} - ${event.reason}`);
      
      if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
      }

      this.config.onClose(event);

      if (this.config.reconnect && !this.isReconnecting && event.code !== 1000) {
        this.handleReconnection();
      } else {
        this.notifyStateChange('disconnected');
      }
    };

    this.ws.onerror = (event) => {
      this.log('WebSocket error:', event);
      this.config.onError(event);
      this.handleConnectionError();
    };
  }

  private handleConnectionError(): void {
    this.notifyStateChange('error');
    
    if (this.config.reconnect && !this.isReconnecting) {
      this.handleReconnection();
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempt >= this.config.reconnectAttempts) {
      this.log('Max reconnection attempts reached');
      this.notifyStateChange('error');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempt++;
    this.notifyStateChange('reconnecting');

    this.log(`Reconnecting in ${this.config.reconnectInterval}ms (attempt ${this.reconnectAttempt}/${this.config.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
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

// React hook for WebSocket
export const useWebSocket = (config: WebSocketConfig) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const managerRef = useRef<WebSocketManager | null>(null);
  const notify = useNotify();

  // Initialize WebSocket manager
  useEffect(() => {
    managerRef.current = new WebSocketManager({
      ...config,
      onError: (event) => {
        notify.error('Connection Error', 'WebSocket connection failed');
        config.onError?.(event);
      },
      onClose: (event) => {
        if (event.code !== 1000) {
          notify.warning('Connection Lost', 'Attempting to reconnect...');
        }
        config.onClose?.(event);
      }
    });

    // Subscribe to state changes
    const unsubscribeState = managerRef.current.subscribeToState(setConnectionState);
    
    // Subscribe to messages
    const unsubscribeMessages = managerRef.current.subscribeToMessages(setLastMessage);

    // Auto-connect
    managerRef.current.connect();

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
    managerRef.current?.connect();
  }, []);

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
    isReconnecting: connectionState === 'reconnecting'
  };
};

// Connection status indicator component
export const ConnectionStatus: React.FC<{
  connectionState: ConnectionState;
  className?: string;
}> = ({ connectionState, className = '' }) => {
  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
      pulse: false
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting...',
      pulse: true
    },
    reconnecting: {
      color: 'bg-orange-500',
      text: 'Reconnecting...',
      pulse: true
    },
    disconnected: {
      color: 'bg-gray-500',
      text: 'Disconnected',
      pulse: false
    },
    error: {
      color: 'bg-red-500',
      text: 'Connection Error',
      pulse: false
    }
  };

  const config = statusConfig[connectionState];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className="text-sm text-slate-400">{config.text}</span>
    </div>
  );
};

// Real-time data hook for specific data types
export const useRealTimeData = <T>(
  websocketConfig: WebSocketConfig,
  dataType: string,
  initialData?: T
) => {
  const [data, setData] = useState<T | undefined>(initialData);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const { connectionState, lastMessage, sendMessage } = useWebSocket({
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
    sendMessage
  };
};

export default WebSocketManager;