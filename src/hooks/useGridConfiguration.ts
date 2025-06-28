import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import { GridConfiguration, GridComponentConfiguration, EnergyFlowConfiguration } from '../types/settings';

export const useGridConfiguration = (siteId?: number) => {
  const [gridConfig, setGridConfig] = useState<GridConfiguration | null>(null);
  const [components, setComponents] = useState<GridComponentConfiguration[]>([]);
  const [flows, setFlows] = useState<EnergyFlowConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGridConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await settingsService.getGridConfiguration(siteId);
      setGridConfig(config);
      setComponents(config.components);
      setFlows(config.flows);
    } catch (err: any) {
      setError(err.message || 'Failed to load grid configuration');
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  const saveGridConfiguration = useCallback(async () => {
    if (!gridConfig) return;
    
    try {
      setSaving(true);
      setError(null);
      const updatedConfig = {
        ...gridConfig,
        components,
        flows
      };
      const saved = await settingsService.saveGridConfiguration(updatedConfig);
      setGridConfig(saved);
      setComponents(saved.components);
      setFlows(saved.flows);
      return saved;
    } catch (err: any) {
      setError(err.message || 'Failed to save grid configuration');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [gridConfig, components, flows]);

  const updateComponent = useCallback((componentId: string, updates: Partial<GridComponentConfiguration>) => {
    setComponents(prev => prev.map(comp => 
      comp.componentId === componentId ? { ...comp, ...updates } : comp
    ));
  }, []);

  const addComponent = useCallback((component: Omit<GridComponentConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newComponent: GridComponentConfiguration = {
      ...component,
      id: Date.now(), // Temporary ID
      userId: '',
      siteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setComponents(prev => [...prev, newComponent]);
    return newComponent;
  }, [siteId]);

  const removeComponent = useCallback((componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.componentId !== componentId));
    // Also remove any flows connected to this component
    setFlows(prev => prev.filter(flow => 
      flow.fromComponentId !== componentId && flow.toComponentId !== componentId
    ));
  }, []);

  const updateFlow = useCallback((flowId: string, updates: Partial<EnergyFlowConfiguration>) => {
    setFlows(prev => prev.map(flow => 
      flow.flowId === flowId ? { ...flow, ...updates } : flow
    ));
  }, []);

  const addFlow = useCallback((flow: Omit<EnergyFlowConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newFlow: EnergyFlowConfiguration = {
      ...flow,
      id: Date.now(), // Temporary ID
      userId: '',
      siteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFlows(prev => [...prev, newFlow]);
    return newFlow;
  }, [siteId]);

  const removeFlow = useCallback((flowId: string) => {
    setFlows(prev => prev.filter(flow => flow.flowId !== flowId));
  }, []);

  const toggleFlow = useCallback((flowId: string) => {
    setFlows(prev => prev.map(flow => 
      flow.flowId === flowId ? { ...flow, enabled: !flow.enabled } : flow
    ));
  }, []);

  // Auto-save functionality
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  useEffect(() => {
    if (autoSaveEnabled && gridConfig && !loading && !saving) {
      const timeoutId = setTimeout(() => {
        saveGridConfiguration().catch(console.error);
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [components, flows, autoSaveEnabled, gridConfig, loading, saving, saveGridConfiguration]);

  useEffect(() => {
    loadGridConfiguration();
  }, [loadGridConfiguration]);

  const hasUnsavedChanges = useCallback(() => {
    if (!gridConfig) return false;
    return JSON.stringify(components) !== JSON.stringify(gridConfig.components) ||
           JSON.stringify(flows) !== JSON.stringify(gridConfig.flows);
  }, [gridConfig, components, flows]);

  return {
    gridConfig,
    components,
    flows,
    loading,
    saving,
    error,
    loadGridConfiguration,
    saveGridConfiguration,
    updateComponent,
    addComponent,
    removeComponent,
    updateFlow,
    addFlow,
    removeFlow,
    toggleFlow,
    autoSaveEnabled,
    setAutoSaveEnabled,
    hasUnsavedChanges: hasUnsavedChanges()
  };
};