// Mock scheduler service for development
export class SchedulerService {
  private automationRules: any[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      // Only attempt to load automation rules in production
      if (!import.meta.env.DEV) {
        await this.loadAutomationRules();
      } else {
        // In development, use mock data
        this.automationRules = this.getMockAutomationRules();
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('SchedulerService: Failed to initialize, using mock data:', error);
      this.automationRules = this.getMockAutomationRules();
      this.isInitialized = true;
    }
  }

  private getMockAutomationRules() {
    return [
      {
        id: '1',
        name: 'Peak Hours Optimization',
        type: 'schedule',
        enabled: true,
        schedule: '0 8-18 * * *', // 8 AM to 6 PM daily
        action: 'optimize_output',
        parameters: {
          targetEfficiency: 95,
          priority: 'high'
        }
      },
      {
        id: '2',
        name: 'Maintenance Window',
        type: 'schedule',
        enabled: true,
        schedule: '0 2 * * 0', // 2 AM every Sunday
        action: 'maintenance_mode',
        parameters: {
          duration: 3600, // 1 hour
          type: 'routine'
        }
      },
      {
        id: '3',
        name: 'Weather Response',
        type: 'trigger',
        enabled: true,
        trigger: 'weather_alert',
        action: 'safety_mode',
        parameters: {
          weatherTypes: ['storm', 'high_wind'],
          shutdownThreshold: 80
        }
      }
    ];
  }

  async getAutomationRules() {
    if (!this.isInitialized) {
      await this.initializeService();
    }
    return this.automationRules;
  }

  async loadAutomationRules() {
    // In development, just return mock data
    if (import.meta.env.DEV) {
      this.automationRules = this.getMockAutomationRules();
      return;
    }

    // In production, attempt to load from API
    try {
      const response = await fetch('/api/automation/rules');
      if (response.ok) {
        this.automationRules = await response.json();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to load automation rules from API, using mock data:', error);
      this.automationRules = this.getMockAutomationRules();
    }
  }

  async createRule(rule: any) {
    if (import.meta.env.DEV) {
      // Mock implementation
      const newRule = { ...rule, id: Date.now().toString() };
      this.automationRules.push(newRule);
      return newRule;
    }

    // Production implementation
    try {
      const response = await fetch('/api/automation/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to create rule via API, using mock:', error);
      const newRule = { ...rule, id: Date.now().toString() };
      this.automationRules.push(newRule);
      return newRule;
    }
  }

  async updateRule(id: string, updates: any) {
    if (import.meta.env.DEV) {
      // Mock implementation
      const index = this.automationRules.findIndex(rule => rule.id === id);
      if (index !== -1) {
        this.automationRules[index] = { ...this.automationRules[index], ...updates };
        return this.automationRules[index];
      }
      throw new Error('Rule not found');
    }

    // Production implementation
    try {
      const response = await fetch(`/api/automation/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to update rule via API, using mock:', error);
      const index = this.automationRules.findIndex(rule => rule.id === id);
      if (index !== -1) {
        this.automationRules[index] = { ...this.automationRules[index], ...updates };
        return this.automationRules[index];
      }
      throw new Error('Rule not found');
    }
  }

  async deleteRule(id: string) {
    if (import.meta.env.DEV) {
      // Mock implementation
      const index = this.automationRules.findIndex(rule => rule.id === id);
      if (index !== -1) {
        this.automationRules.splice(index, 1);
        return true;
      }
      throw new Error('Rule not found');
    }

    // Production implementation
    try {
      const response = await fetch(`/api/automation/rules/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to delete rule via API, using mock:', error);
      const index = this.automationRules.findIndex(rule => rule.id === id);
      if (index !== -1) {
        this.automationRules.splice(index, 1);
        return true;
      }
      throw new Error('Rule not found');
    }
  }
}

// Export singleton instance
export const schedulerService = new SchedulerService();