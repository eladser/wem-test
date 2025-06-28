import { apiClient } from './api';
import { UserPreferences, DashboardLayout, WidgetConfiguration, GridConfiguration, GridComponentConfiguration, EnergyFlowConfiguration } from '../types/settings';

class SettingsService {
  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    const response = await apiClient.get<UserPreferences>('/api/userpreferences');
    return response.data;
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await apiClient.put<UserPreferences>('/api/userpreferences', preferences);
    return response.data;
  }

  async resetUserPreferences(): Promise<UserPreferences> {
    const response = await apiClient.post<UserPreferences>('/api/userpreferences/reset');
    return response.data;
  }

  // Dashboard Layouts
  async getUserLayouts(): Promise<DashboardLayout[]> {
    const response = await apiClient.get<DashboardLayout[]>('/api/dashboardlayout');
    return response.data;
  }

  async getPageLayouts(pageName: string): Promise<DashboardLayout[]> {
    const response = await apiClient.get<DashboardLayout[]>(`/api/dashboardlayout/page/${pageName}`);
    return response.data;
  }

  async getDefaultLayout(pageName: string): Promise<DashboardLayout | null> {
    try {
      const response = await apiClient.get<DashboardLayout>(`/api/dashboardlayout/page/${pageName}/default`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createLayout(layout: Omit<DashboardLayout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<DashboardLayout> {
    const response = await apiClient.post<DashboardLayout>('/api/dashboardlayout', layout);
    return response.data;
  }

  async updateLayout(id: number, layout: Partial<DashboardLayout>): Promise<DashboardLayout> {
    const response = await apiClient.put<DashboardLayout>(`/api/dashboardlayout/${id}`, layout);
    return response.data;
  }

  async deleteLayout(id: number): Promise<void> {
    await apiClient.delete(`/api/dashboardlayout/${id}`);
  }

  async setLayoutAsDefault(id: number): Promise<void> {
    await apiClient.post(`/api/dashboardlayout/${id}/set-default`);
  }

  // Widget Configurations
  async getPageWidgets(pageName: string): Promise<WidgetConfiguration[]> {
    const response = await apiClient.get<WidgetConfiguration[]>(`/api/widgetconfiguration/page/${pageName}`);
    return response.data;
  }

  async getLayoutWidgets(layoutId: number): Promise<WidgetConfiguration[]> {
    const response = await apiClient.get<WidgetConfiguration[]>(`/api/widgetconfiguration/layout/${layoutId}`);
    return response.data;
  }

  async getWidget(widgetId: string): Promise<WidgetConfiguration | null> {
    try {
      const response = await apiClient.get<WidgetConfiguration>(`/api/widgetconfiguration/widget/${widgetId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createWidget(widget: Omit<WidgetConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<WidgetConfiguration> {
    const response = await apiClient.post<WidgetConfiguration>('/api/widgetconfiguration', widget);
    return response.data;
  }

  async updateWidget(id: number, widget: Partial<WidgetConfiguration>): Promise<WidgetConfiguration> {
    const response = await apiClient.put<WidgetConfiguration>(`/api/widgetconfiguration/${id}`, widget);
    return response.data;
  }

  async deleteWidget(widgetId: string): Promise<void> {
    await apiClient.delete(`/api/widgetconfiguration/widget/${widgetId}`);
  }

  async bulkUpdateWidgets(widgets: WidgetConfiguration[]): Promise<WidgetConfiguration[]> {
    const response = await apiClient.put<WidgetConfiguration[]>('/api/widgetconfiguration/bulk', widgets);
    return response.data;
  }

  // Grid Configuration
  async getGridConfiguration(siteId?: number): Promise<GridConfiguration> {
    const params = siteId ? { siteId } : {};
    const response = await apiClient.get<GridConfiguration>('/api/gridconfiguration', { params });
    return response.data;
  }

  async saveGridConfiguration(gridConfig: GridConfiguration): Promise<GridConfiguration> {
    const response = await apiClient.post<GridConfiguration>('/api/gridconfiguration/save', gridConfig);
    return response.data;
  }

  async getGridComponents(siteId?: number): Promise<GridComponentConfiguration[]> {
    const params = siteId ? { siteId } : {};
    const response = await apiClient.get<GridComponentConfiguration[]>('/api/gridconfiguration/components', { params });
    return response.data;
  }

  async createGridComponent(component: Omit<GridComponentConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<GridComponentConfiguration> {
    const response = await apiClient.post<GridComponentConfiguration>('/api/gridconfiguration/components', component);
    return response.data;
  }

  async updateGridComponent(id: number, component: Partial<GridComponentConfiguration>): Promise<GridComponentConfiguration> {
    const response = await apiClient.put<GridComponentConfiguration>(`/api/gridconfiguration/components/${id}`, component);
    return response.data;
  }

  async deleteGridComponent(componentId: string): Promise<void> {
    await apiClient.delete(`/api/gridconfiguration/components/component/${componentId}`);
  }

  async bulkUpdateGridComponents(components: GridComponentConfiguration[]): Promise<GridComponentConfiguration[]> {
    const response = await apiClient.put<GridComponentConfiguration[]>('/api/gridconfiguration/components/bulk', components);
    return response.data;
  }

  async getEnergyFlows(siteId?: number): Promise<EnergyFlowConfiguration[]> {
    const params = siteId ? { siteId } : {};
    const response = await apiClient.get<EnergyFlowConfiguration[]>('/api/gridconfiguration/flows', { params });
    return response.data;
  }

  async createEnergyFlow(flow: Omit<EnergyFlowConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<EnergyFlowConfiguration> {
    const response = await apiClient.post<EnergyFlowConfiguration>('/api/gridconfiguration/flows', flow);
    return response.data;
  }

  async updateEnergyFlow(id: number, flow: Partial<EnergyFlowConfiguration>): Promise<EnergyFlowConfiguration> {
    const response = await apiClient.put<EnergyFlowConfiguration>(`/api/gridconfiguration/flows/${id}`, flow);
    return response.data;
  }

  async deleteEnergyFlow(flowId: string): Promise<void> {
    await apiClient.delete(`/api/gridconfiguration/flows/flow/${flowId}`);
  }

  async bulkUpdateEnergyFlows(flows: EnergyFlowConfiguration[]): Promise<EnergyFlowConfiguration[]> {
    const response = await apiClient.put<EnergyFlowConfiguration[]>('/api/gridconfiguration/flows/bulk', flows);
    return response.data;
  }
}

export const settingsService = new SettingsService();