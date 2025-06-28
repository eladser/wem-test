import { apiGateway } from './apiGateway';

// Real-time data types
export interface RealTimeMetrics {
  timestamp: Date;
  siteId: string;
  powerGeneration: number;
  powerConsumption: number;
  gridTie: number;
  batteryLevel: number;
  efficiency: number;
  carbonOffset: number;
  weatherConditions: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    solarIrradiance: number;
  };
  assetHealth: {
    inverterHealth: number;
    batteryHealth: number;
    solarPanelHealth: number;
  };
}

export interface RealTimeAlert {
  id: string;
  siteId: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'performance' | 'maintenance' | 'weather' | 'grid';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  actionRequired: boolean;
}

export interface EnergyPrediction {
  timestamp: Date;
  predictedGeneration: number;
  predictedConsumption: number;
  confidence: number;
  factors: {
    weather: number;
    historical: number;
    seasonal: number;
  };
}

export interface OptimizationSuggestion {
  id: string;
  siteId: string;
  type: 'efficiency' | 'cost' | 'maintenance' | 'capacity';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number; // in months
  estimatedImpact: {
    efficiency: number;
    costSavings: number;
    carbonReduction: number;
  };
}

export interface DataExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  dateRange: {
    start: Date;
    end: Date;
  };
  sites: string[];
  dataTypes: Array<'metrics' | 'alerts' | 'financial' | 'maintenance'>;
  includeCharts: boolean;
  compression: boolean;
  password?: string;
}

class RealTimeDataService {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // WebSocket connection for real-time data
  connectWebSocket(siteId?: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${process.env.VITE_WS_URL || 'ws://localhost:5000'}/ws/realtime${siteId ? `/${siteId}` : ''}`;
        this.wsConnection = new WebSocket(wsUrl);

        this.wsConnection.onopen = () => {
          console.log('Real-time WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve(this.wsConnection!);
        };

        this.wsConnection.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.wsConnection.onclose = () => {
          console.log('WebSocket connection closed');
          this.stopHeartbeat();
          this.attemptReconnect();
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.wsConnection?.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  // Subscribe to real-time metrics
  subscribeToMetrics(siteId: string, callback: (metrics: RealTimeMetrics) => void): () => void {
    if (!this.wsConnection) {
      this.connectWebSocket(siteId);
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'metrics' && data.siteId === siteId) {
          callback({
            ...data.payload,
            timestamp: new Date(data.payload.timestamp)
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.wsConnection?.addEventListener('message', handleMessage);

    // Return unsubscribe function
    return () => {
      this.wsConnection?.removeEventListener('message', handleMessage);
    };
  }

  // Subscribe to real-time alerts
  subscribeToAlerts(callback: (alert: RealTimeAlert) => void): () => void {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'alert') {
          callback({
            ...data.payload,
            timestamp: new Date(data.payload.timestamp)
          });
        }
      } catch (error) {
        console.error('Error parsing alert message:', error);
      }
    };

    this.wsConnection?.addEventListener('message', handleMessage);

    return () => {
      this.wsConnection?.removeEventListener('message', handleMessage);
    };
  }

  // Predictive analytics
  async getEnergyPredictions(siteId: string, hours: number = 24): Promise<EnergyPrediction[]> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: `/api/sites/${siteId}/predictions`,
        params: { hours }
      });
      
      return response.data.map((pred: any) => ({
        ...pred,
        timestamp: new Date(pred.timestamp)
      }));
    } catch (error) {
      console.error('Error fetching energy predictions:', error);
      // Return mock data for development
      return this.generateMockPredictions(siteId, hours);
    }
  }

  // Optimization suggestions
  async getOptimizationSuggestions(siteId: string): Promise<OptimizationSuggestion[]> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: `/api/sites/${siteId}/optimization-suggestions`
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching optimization suggestions:', error);
      return this.generateMockOptimizations(siteId);
    }
  }

  // Advanced data export
  async exportData(options: DataExportOptions): Promise<Blob> {
    try {
      const response = await apiGateway.request({
        method: 'POST',
        url: '/api/export/data',
        data: options,
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      // Fallback to client-side export for development
      return this.generateClientSideExport(options);
    }
  }

  // Batch processing for large datasets
  async processBatchData(siteIds: string[], startDate: Date, endDate: Date): Promise<{
    processed: number;
    failed: number;
    results: any[];
  }> {
    const results = [];
    let processed = 0;
    let failed = 0;

    for (const siteId of siteIds) {
      try {
        const metrics = await this.getHistoricalMetrics(siteId, startDate, endDate);
        results.push({ siteId, metrics });
        processed++;
      } catch (error) {
        console.error(`Failed to process data for site ${siteId}:`, error);
        failed++;
      }
    }

    return { processed, failed, results };
  }

  // Historical metrics with caching
  async getHistoricalMetrics(siteId: string, startDate: Date, endDate: Date): Promise<RealTimeMetrics[]> {
    const cacheKey = `metrics_${siteId}_${startDate.getTime()}_${endDate.getTime()}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: `/api/sites/${siteId}/metrics/historical`,
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      });

      const metrics = response.data.map((metric: any) => ({
        ...metric,
        timestamp: new Date(metric.timestamp)
      }));

      // Cache the results
      this.setCache(cacheKey, metrics, 5 * 60 * 1000); // Cache for 5 minutes
      
      return metrics;
    } catch (error) {
      console.error('Error fetching historical metrics:', error);
      return [];
    }
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      await apiGateway.request({
        method: 'POST',
        url: `/api/alerts/${alertId}/acknowledge`
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  // Generate mock data for development
  private generateMockPredictions(siteId: string, hours: number): EnergyPrediction[] {
    const predictions: EnergyPrediction[] = [];
    const now = new Date();

    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
      predictions.push({
        timestamp,
        predictedGeneration: Math.random() * 100 + 50,
        predictedConsumption: Math.random() * 80 + 30,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        factors: {
          weather: Math.random() * 0.4 + 0.6,
          historical: Math.random() * 0.3 + 0.7,
          seasonal: Math.random() * 0.2 + 0.8
        }
      });
    }

    return predictions;
  }

  private generateMockOptimizations(siteId: string): OptimizationSuggestion[] {
    return [
      {
        id: 'opt-1',
        siteId,
        type: 'efficiency',
        priority: 'high',
        title: 'Optimize Solar Panel Angle',
        description: 'Adjusting panel tilt by 5° could increase generation by 12%',
        potentialSavings: 15000,
        implementationCost: 3000,
        paybackPeriod: 3,
        estimatedImpact: {
          efficiency: 12,
          costSavings: 15000,
          carbonReduction: 2.5
        }
      },
      {
        id: 'opt-2',
        siteId,
        type: 'maintenance',
        priority: 'medium',
        title: 'Preventive Inverter Maintenance',
        description: 'Schedule maintenance to prevent efficiency degradation',
        potentialSavings: 8000,
        implementationCost: 1500,
        paybackPeriod: 2,
        estimatedImpact: {
          efficiency: 5,
          costSavings: 8000,
          carbonReduction: 1.2
        }
      }
    ];
  }

  private async generateClientSideExport(options: DataExportOptions): Promise<Blob> {
    // Simplified client-side export for development
    const data = {
      exportedAt: new Date().toISOString(),
      dateRange: options.dateRange,
      sites: options.sites,
      dataTypes: options.dataTypes,
      sampleData: 'This is a mock export for development purposes'
    };

    const jsonData = JSON.stringify(data, null, 2);
    return new Blob([jsonData], { type: 'application/json' });
  }

  // Simple cache implementation
  private cache = new Map<string, { data: any; expires: number }>();

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }

  // Cleanup method
  disconnect(): void {
    this.stopHeartbeat();
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    this.cache.clear();
  }
}

export const realTimeDataService = new RealTimeDataService();