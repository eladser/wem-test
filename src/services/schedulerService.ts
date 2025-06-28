import { apiGateway } from './apiGateway';

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  type: 'maintenance' | 'report' | 'optimization' | 'backup' | 'alert_check' | 'data_sync';
  schedule: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    cronExpression?: string;
    timezone: string;
    nextRun: Date;
    lastRun?: Date;
  };
  config: {
    siteIds?: string[];
    parameters?: Record<string, any>;
    notifications: {
      onSuccess: boolean;
      onFailure: boolean;
      recipients: string[];
    };
  };
  status: 'active' | 'paused' | 'failed' | 'completed';
  priority: 'high' | 'medium' | 'low';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  result?: any;
  error?: string;
  metrics: {
    duration?: number;
    processedItems?: number;
    successCount?: number;
    failureCount?: number;
  };
}

export interface MaintenanceWindow {
  id: string;
  name: string;
  description: string;
  siteId: string;
  startTime: Date;
  endTime: Date;
  maintenanceType: 'preventive' | 'corrective' | 'upgrade' | 'inspection';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  tasks: {
    id: string;
    title: string;
    description: string;
    estimatedDuration: number;
    completed: boolean;
    notes?: string;
  }[];
  requirements: {
    tools: string[];
    personnel: number;
    specialSkills: string[];
    safetyProtocols: string[];
  };
  costEstimate?: {
    labor: number;
    materials: number;
    downtime: number;
    total: number;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type: 'threshold' | 'time' | 'event' | 'condition';
    conditions: Array<{
      field: string;
      operator: '>' | '<' | '=' | '!=' | '>=' | '<=';
      value: any;
      unit?: string;
    }>;
  };
  actions: Array<{
    type: 'alert' | 'email' | 'api_call' | 'maintenance_schedule' | 'report_generate';
    config: Record<string, any>;
  }>;
  siteIds: string[];
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'emergency' | 'optimization' | 'compliance';
  steps: Array<{
    id: string;
    name: string;
    description: string;
    type: 'manual' | 'automated' | 'approval';
    estimatedDuration: number;
    dependencies: string[];
    assignee?: string;
    config?: Record<string, any>;
  }>;
  approvalRequired: boolean;
  estimatedTotalDuration: number;
  usageCount: number;
}

class SchedulerService {
  private runningTasks = new Map<string, TaskExecution>();
  private automationRules = new Map<string, AutomationRule>();
  private taskQueue: ScheduledTask[] = [];
  private processInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startTaskProcessor();
    this.loadAutomationRules();
  }

  // Task Management
  async createTask(task: Omit<ScheduledTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduledTask> {
    try {
      const response = await apiGateway.request({
        method: 'POST',
        url: '/api/scheduler/tasks',
        data: task
      });

      const newTask = {
        ...response.data,
        schedule: {
          ...response.data.schedule,
          nextRun: new Date(response.data.schedule.nextRun),
          lastRun: response.data.schedule.lastRun ? new Date(response.data.schedule.lastRun) : undefined
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };

      this.scheduleTask(newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating scheduled task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<ScheduledTask>): Promise<ScheduledTask> {
    try {
      const response = await apiGateway.request({
        method: 'PUT',
        url: `/api/scheduler/tasks/${taskId}`,
        data: updates
      });

      return {
        ...response.data,
        schedule: {
          ...response.data.schedule,
          nextRun: new Date(response.data.schedule.nextRun),
          lastRun: response.data.schedule.lastRun ? new Date(response.data.schedule.lastRun) : undefined
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error updating scheduled task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await apiGateway.request({
        method: 'DELETE',
        url: `/api/scheduler/tasks/${taskId}`
      });

      this.taskQueue = this.taskQueue.filter(task => task.id !== taskId);
    } catch (error) {
      console.error('Error deleting scheduled task:', error);
      throw error;
    }
  }

  async getTask(taskId: string): Promise<ScheduledTask | null> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: `/api/scheduler/tasks/${taskId}`
      });

      return {
        ...response.data,
        schedule: {
          ...response.data.schedule,
          nextRun: new Date(response.data.schedule.nextRun),
          lastRun: response.data.schedule.lastRun ? new Date(response.data.schedule.lastRun) : undefined
        },
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
    } catch (error) {
      console.error('Error fetching scheduled task:', error);
      return null;
    }
  }

  async getTasks(filters?: {
    status?: ScheduledTask['status'];
    type?: ScheduledTask['type'];
    siteIds?: string[];
  }): Promise<ScheduledTask[]> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: '/api/scheduler/tasks',
        params: filters
      });

      return response.data.map((task: any) => ({
        ...task,
        schedule: {
          ...task.schedule,
          nextRun: new Date(task.schedule.nextRun),
          lastRun: task.schedule.lastRun ? new Date(task.schedule.lastRun) : undefined
        },
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching scheduled tasks:', error);
      return [];
    }
  }

  // Task Execution
  async executeTask(taskId: string, force = false): Promise<TaskExecution> {
    const task = await this.getTask(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (this.runningTasks.has(taskId) && !force) {
      throw new Error(`Task ${taskId} is already running`);
    }

    const execution: TaskExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      startTime: new Date(),
      status: 'running',
      metrics: {}
    };

    this.runningTasks.set(taskId, execution);

    try {
      const result = await this.performTaskExecution(task);
      
      execution.endTime = new Date();
      execution.status = 'completed';
      execution.result = result;
      execution.metrics.duration = execution.endTime.getTime() - execution.startTime.getTime();

      // Update next run time
      await this.updateTaskSchedule(task);

      // Send success notification if configured
      if (task.config.notifications.onSuccess) {
        await this.sendTaskNotification(task, execution, 'success');
      }

    } catch (error) {
      execution.endTime = new Date();
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.metrics.duration = execution.endTime.getTime() - execution.startTime.getTime();

      // Send failure notification if configured
      if (task.config.notifications.onFailure) {
        await this.sendTaskNotification(task, execution, 'failure');
      }

      throw error;
    } finally {
      this.runningTasks.delete(taskId);
    }

    return execution;
  }

  // Maintenance Window Management
  async createMaintenanceWindow(window: Omit<MaintenanceWindow, 'id'>): Promise<MaintenanceWindow> {
    try {
      const response = await apiGateway.request({
        method: 'POST',
        url: '/api/scheduler/maintenance-windows',
        data: window
      });

      return {
        ...response.data,
        startTime: new Date(response.data.startTime),
        endTime: new Date(response.data.endTime)
      };
    } catch (error) {
      console.error('Error creating maintenance window:', error);
      throw error;
    }
  }

  async getMaintenanceWindows(siteId?: string): Promise<MaintenanceWindow[]> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: '/api/scheduler/maintenance-windows',
        params: siteId ? { siteId } : undefined
      });

      return response.data.map((window: any) => ({
        ...window,
        startTime: new Date(window.startTime),
        endTime: new Date(window.endTime)
      }));
    } catch (error) {
      console.error('Error fetching maintenance windows:', error);
      return [];
    }
  }

  async updateMaintenanceWindow(windowId: string, updates: Partial<MaintenanceWindow>): Promise<MaintenanceWindow> {
    try {
      const response = await apiGateway.request({
        method: 'PUT',
        url: `/api/scheduler/maintenance-windows/${windowId}`,
        data: updates
      });

      return {
        ...response.data,
        startTime: new Date(response.data.startTime),
        endTime: new Date(response.data.endTime)
      };
    } catch (error) {
      console.error('Error updating maintenance window:', error);
      throw error;
    }
  }

  // Automation Rules
  async createAutomationRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'triggerCount'>): Promise<AutomationRule> {
    try {
      const response = await apiGateway.request({
        method: 'POST',
        url: '/api/scheduler/automation-rules',
        data: rule
      });

      const newRule = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        lastTriggered: response.data.lastTriggered ? new Date(response.data.lastTriggered) : undefined
      };

      this.automationRules.set(newRule.id, newRule);
      return newRule;
    } catch (error) {
      console.error('Error creating automation rule:', error);
      throw error;
    }
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: '/api/scheduler/automation-rules'
      });

      return response.data.map((rule: any) => ({
        ...rule,
        createdAt: new Date(rule.createdAt),
        lastTriggered: rule.lastTriggered ? new Date(rule.lastTriggered) : undefined
      }));
    } catch (error) {
      console.error('Error fetching automation rules:', error);
      return [];
    }
  }

  // Workflow Templates
  async createWorkflowTemplate(template: Omit<WorkflowTemplate, 'id' | 'usageCount'>): Promise<WorkflowTemplate> {
    try {
      const response = await apiGateway.request({
        method: 'POST',
        url: '/api/scheduler/workflow-templates',
        data: template
      });

      return response.data;
    } catch (error) {
      console.error('Error creating workflow template:', error);
      throw error;
    }
  }

  async getWorkflowTemplates(category?: WorkflowTemplate['category']): Promise<WorkflowTemplate[]> {
    try {
      const response = await apiGateway.request({
        method: 'GET',
        url: '/api/scheduler/workflow-templates',
        params: category ? { category } : undefined
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching workflow templates:', error);
      return [];
    }
  }

  async executeWorkflow(templateId: string, siteId: string, parameters?: Record<string, any>): Promise<string> {
    try {
      const response = await apiGateway.request({
        method: 'POST',
        url: `/api/scheduler/workflow-templates/${templateId}/execute`,
        data: { siteId, parameters }
      });

      return response.data.workflowId;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  // Private methods
  private startTaskProcessor(): void {
    this.processInterval = setInterval(() => {
      this.processTaskQueue();
    }, 60000); // Check every minute
  }

  private async processTaskQueue(): Promise<void> {
    const now = new Date();
    const tasksToRun = this.taskQueue.filter(task => 
      task.status === 'active' && 
      task.schedule.nextRun <= now &&
      !this.runningTasks.has(task.id)
    );

    for (const task of tasksToRun) {
      try {
        await this.executeTask(task.id);
      } catch (error) {
        console.error(`Error executing scheduled task ${task.id}:`, error);
      }
    }
  }

  private async performTaskExecution(task: ScheduledTask): Promise<any> {
    switch (task.type) {
      case 'maintenance':
        return this.executeMaintenanceTask(task);
      case 'report':
        return this.executeReportTask(task);
      case 'optimization':
        return this.executeOptimizationTask(task);
      case 'backup':
        return this.executeBackupTask(task);
      case 'alert_check':
        return this.executeAlertCheckTask(task);
      case 'data_sync':
        return this.executeDataSyncTask(task);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async executeMaintenanceTask(task: ScheduledTask): Promise<any> {
    // Implement maintenance task logic
    return { status: 'completed', message: 'Maintenance task executed successfully' };
  }

  private async executeReportTask(task: ScheduledTask): Promise<any> {
    // Implement report generation logic
    return { status: 'completed', reportId: `report_${Date.now()}` };
  }

  private async executeOptimizationTask(task: ScheduledTask): Promise<any> {
    // Implement optimization task logic
    return { status: 'completed', optimizations: [] };
  }

  private async executeBackupTask(task: ScheduledTask): Promise<any> {
    // Implement backup task logic
    return { status: 'completed', backupId: `backup_${Date.now()}` };
  }

  private async executeAlertCheckTask(task: ScheduledTask): Promise<any> {
    // Implement alert checking logic
    return { status: 'completed', alertsChecked: 0 };
  }

  private async executeDataSyncTask(task: ScheduledTask): Promise<any> {
    // Implement data synchronization logic
    return { status: 'completed', syncedRecords: 0 };
  }

  private async updateTaskSchedule(task: ScheduledTask): Promise<void> {
    const nextRun = this.calculateNextRun(task.schedule);
    task.schedule.lastRun = new Date();
    task.schedule.nextRun = nextRun;
    task.updatedAt = new Date();

    await this.updateTask(task.id, task);
  }

  private calculateNextRun(schedule: ScheduledTask['schedule']): Date {
    const now = new Date();
    
    switch (schedule.pattern) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        return nextMonth;
      case 'quarterly':
        const nextQuarter = new Date(now);
        nextQuarter.setMonth(now.getMonth() + 3);
        return nextQuarter;
      case 'yearly':
        const nextYear = new Date(now);
        nextYear.setFullYear(now.getFullYear() + 1);
        return nextYear;
      case 'custom':
        // Would need a cron parser for this
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to daily
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  private async sendTaskNotification(task: ScheduledTask, execution: TaskExecution, type: 'success' | 'failure'): Promise<void> {
    try {
      await apiGateway.request({
        method: 'POST',
        url: '/api/notifications/task-notification',
        data: {
          taskId: task.id,
          taskName: task.name,
          executionId: execution.id,
          type,
          recipients: task.config.notifications.recipients,
          details: {
            duration: execution.metrics.duration,
            result: execution.result,
            error: execution.error
          }
        }
      });
    } catch (error) {
      console.error('Error sending task notification:', error);
    }
  }

  private scheduleTask(task: ScheduledTask): void {
    this.taskQueue.push(task);
  }

  private async loadAutomationRules(): Promise<void> {
    try {
      const rules = await this.getAutomationRules();
      rules.forEach(rule => {
        this.automationRules.set(rule.id, rule);
      });
    } catch (error) {
      console.error('Error loading automation rules:', error);
    }
  }

  // Cleanup method
  destroy(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
    this.runningTasks.clear();
    this.automationRules.clear();
    this.taskQueue = [];
  }
}

export const schedulerService = new SchedulerService();