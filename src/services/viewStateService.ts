import { apiClient } from './api';
import { ViewState } from '../types/settings';

class ViewStateService {
  async getViewState<T>(pageName: string, stateKey: string): Promise<T | null> {
    try {
      const response = await apiClient.get<T>(`/api/viewstate/${pageName}/${stateKey}/json`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async setViewState<T>(pageName: string, stateKey: string, value: T, expiresAt?: Date, isPersistent: boolean = true): Promise<void> {
    const params: any = { isPersistent };
    if (expiresAt) {
      params.expiresAt = expiresAt.toISOString();
    }
    
    await apiClient.post(`/api/viewstate/${pageName}/${stateKey}/json`, value, { params });
  }

  async deleteViewState(pageName: string, stateKey: string): Promise<void> {
    await apiClient.delete(`/api/viewstate/${pageName}/${stateKey}`);
  }

  async getAllPageStates(pageName: string): Promise<Record<string, any>> {
    const response = await apiClient.get<Record<string, any>>(`/api/viewstate/${pageName}`);
    return response.data;
  }

  async cleanupExpiredStates(): Promise<void> {
    await apiClient.post('/api/viewstate/cleanup-expired');
  }

  // Helper methods for common use cases
  async saveFilterState(pageName: string, filters: any): Promise<void> {
    await this.setViewState(pageName, 'filters', filters);
  }

  async getFilterState(pageName: string): Promise<any> {
    return await this.getViewState(pageName, 'filters');
  }

  async saveSortState(pageName: string, sort: any): Promise<void> {
    await this.setViewState(pageName, 'sort', sort);
  }

  async getSortState(pageName: string): Promise<any> {
    return await this.getViewState(pageName, 'sort');
  }

  async savePaginationState(pageName: string, pagination: any): Promise<void> {
    await this.setViewState(pageName, 'pagination', pagination);
  }

  async getPaginationState(pageName: string): Promise<any> {
    return await this.getViewState(pageName, 'pagination');
  }

  async saveColumnState(pageName: string, columns: any): Promise<void> {
    await this.setViewState(pageName, 'columns', columns);
  }

  async getColumnState(pageName: string): Promise<any> {
    return await this.getViewState(pageName, 'columns');
  }

  async saveExpandedState(pageName: string, expanded: any): Promise<void> {
    await this.setViewState(pageName, 'expanded', expanded);
  }

  async getExpandedState(pageName: string): Promise<any> {
    return await this.getViewState(pageName, 'expanded');
  }
}

export const viewStateService = new ViewStateService();