import React, { useState, useEffect, useCallback } from 'react';
import { GridComponent, EnergyFlow, DraggablePanel } from './grid/types';
import { useGridDrag } from './grid/hooks/useGridDrag';
import EnergyFlowRenderer from './grid/EnergyFlowRenderer';
import GridComponentView from './grid/GridComponent';
import StatusPanel from './grid/StatusPanel';
import ControlsPanel from './grid/ControlsPanel';
import { GridAnalytics } from './grid/GridAnalytics';
import { Button } from '@/components/ui/button';
import { BarChart3, Grid, Maximize2, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { useGridConfiguration } from '../hooks/useGridConfiguration';
import { usePersistentState } from '../hooks/usePersistentState';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { toast } from 'sonner';

interface PersistentInteractiveGridProps {
  siteId?: number;
  pageName?: string;
}

const PersistentInteractiveGrid: React.FC<PersistentInteractiveGridProps> = ({ 
  siteId, 
  pageName = 'interactive-grid' 
}) => {
  const { preferences } = useUserPreferences();
  const {
    gridConfig,
    components,
    flows,
    loading,
    saving,
    error,
    saveGridConfiguration,
    updateComponent,
    addComponent,
    removeComponent,
    updateFlow,
    addFlow,
    removeFlow,
    toggleFlow,
    hasUnsavedChanges
  } = useGridConfiguration(siteId);

  // Persistent UI state
  const { value: viewMode, setValue: setViewMode } = usePersistentState(
    pageName,
    'viewMode',
    'grid' as 'grid' | 'analytics' | 'split'
  );

  const { value: selectedComponentId, setValue: setSelectedComponent } = usePersistentState(
    pageName,
    'selectedComponent',
    null as string | null
  );

  const { value: panelPositions, setValue: setPanelPositions } = usePersistentState(
    pageName,
    'panelPositions',
    [
      { id: 'status-panel', position: { x: 20, y: 20 } },
      { id: 'controls-panel', position: { x: 20, y: 200 } }
    ] as DraggablePanel[]
  );

  // Convert database configurations to frontend grid format
  const [frontendComponents, setFrontendComponents] = useState<GridComponent[]>([]);
  const [frontendFlows, setFrontendFlows] = useState<EnergyFlow[]>([]);

  useEffect(() => {
    if (components.length > 0) {
      const converted = components.map(comp => ({
        id: comp.componentId,
        type: comp.componentType as GridComponent['type'],
        name: comp.name,
        power: comp.power,
        status: comp.status as GridComponent['status'],
        position: { x: comp.x, y: comp.y },
        efficiency: comp.efficiency,
        capacity: comp.capacity
      }));
      setFrontendComponents(converted);
    }
  }, [components]);

  useEffect(() => {
    if (flows.length > 0) {
      const converted = flows.map(flow => ({
        id: flow.flowId,
        from: flow.fromComponentId,
        to: flow.toComponentId,
        power: flow.power,
        enabled: flow.enabled
      }));
      setFrontendFlows(converted);
    }
  }, [flows]);

  const {
    gridRef,
    draggedComponent,
    draggedPanel,
    handleComponentMouseDown,
    handlePanelMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useGridDrag(frontendComponents, setFrontendComponents, panelPositions, setPanelPositions);

  // Sync frontend changes back to database format
  const syncComponentsToDatabase = useCallback(() => {
    frontendComponents.forEach(comp => {
      updateComponent(comp.id, {
        componentId: comp.id,
        componentType: comp.type,
        name: comp.name,
        x: comp.position.x,
        y: comp.position.y,
        power: comp.power,
        status: comp.status,
        efficiency: comp.efficiency,
        capacity: comp.capacity
      });
    });
  }, [frontendComponents, updateComponent]);

  const syncFlowsToDatabase = useCallback(() => {
    frontendFlows.forEach(flow => {
      updateFlow(flow.id, {
        flowId: flow.id,
        fromComponentId: flow.from,
        toComponentId: flow.to,
        power: flow.power,
        enabled: flow.enabled
      });
    });
  }, [frontendFlows, updateFlow]);

  // Auto-sync changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      syncComponentsToDatabase();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [frontendComponents, syncComponentsToDatabase]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      syncFlowsToDatabase();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [frontendFlows, syncFlowsToDatabase]);

  const handleAddComponent = useCallback((type: GridComponent['type']) => {
    const newId = `${type}-${Date.now()}`;
    const newComponent: GridComponent = {
      id: newId,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      power: type === 'solar' || type === 'generator' ? 50 : -30,
      status: 'active',
      position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
      ...(type === 'solar' || type === 'generator' ? { efficiency: 90 } : {}),
      ...(type === 'battery' ? { capacity: 100 } : {})
    };
    
    setFrontendComponents(prev => [...prev, newComponent]);
    
    // Also add to database
    addComponent({
      componentId: newComponent.id,
      componentType: newComponent.type,
      name: newComponent.name,
      x: newComponent.position.x,
      y: newComponent.position.y,
      power: newComponent.power,
      status: newComponent.status,
      efficiency: newComponent.efficiency,
      capacity: newComponent.capacity,
      additionalSettings: '{}',
      siteId
    });
  }, [addComponent, siteId]);

  const handleRemoveComponent = useCallback((componentId: string) => {
    setFrontendComponents(prev => prev.filter(c => c.id !== componentId));
    setFrontendFlows(prev => prev.filter(f => f.from !== componentId && f.to !== componentId));
    setSelectedComponent(null);
    
    // Remove from database
    removeComponent(componentId);
  }, [removeComponent, setSelectedComponent]);

  const handleToggleEnergyFlow = useCallback((flowId: string) => {
    setFrontendFlows(prev => prev.map(flow =>
      flow.id === flowId ? { ...flow, enabled: !flow.enabled } : flow
    ));
    
    // Update in database
    const flow = frontendFlows.find(f => f.id === flowId);
    if (flow) {
      updateFlow(flowId, { enabled: !flow.enabled });
    }
  }, [frontendFlows, updateFlow]);

  const handleSaveConfiguration = async () => {
    try {
      syncComponentsToDatabase();
      syncFlowsToDatabase();
      await saveGridConfiguration();
      toast.success('Grid configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save grid configuration');
    }
  };

  const totalProduction = frontendComponents.filter(c => c.power > 0).reduce((sum, c) => sum + c.power, 0);
  const totalConsumption = Math.abs(frontendComponents.filter(c => c.power < 0).reduce((sum, c) => sum + c.power, 0));
  const netBalance = totalProduction - totalConsumption;

  const statusPanel = panelPositions.find(p => p.id === 'status-panel');
  const controlsPanel = panelPositions.find(p => p.id === 'controls-panel');

  if (loading) {
    return (
      <div className="h-full bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading grid configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 text-white overflow-hidden">
      {/* View Mode Controls */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="text-xs"
        >
          <Grid className="w-3 h-3 mr-1" />
          Grid
        </Button>
        <Button
          variant={viewMode === 'analytics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('analytics')}
          className="text-xs"
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Analytics
        </Button>
        <Button
          variant={viewMode === 'split' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('split')}
          className="text-xs"
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Split
        </Button>
        
        {/* Save Button */}
        <Button
          variant={hasUnsavedChanges ? 'default' : 'outline'}
          size="sm"
          onClick={handleSaveConfiguration}
          disabled={saving}
          className="text-xs"
        >
          {saving ? (
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Save className="w-3 h-3 mr-1" />
          )}
          {saving ? 'Saving...' : hasUnsavedChanges ? 'Save*' : 'Saved'}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-16 right-4 z-50 bg-red-900 text-red-100 px-3 py-2 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      <div className={`h-full flex ${viewMode === 'split' ? 'divide-x divide-slate-700' : ''}`}>
        {/* Grid View */}
        {(viewMode === 'grid' || viewMode === 'split') && (
          <div 
            ref={gridRef}
            className={`relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            } h-full`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => setSelectedComponent(null)}
          >
            {/* Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: 1 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Energy Flow Lines */}
            <EnergyFlowRenderer energyFlows={frontendFlows} components={frontendComponents} />

            {/* Status Panel */}
            {statusPanel && (
              <StatusPanel
                panel={statusPanel}
                netBalance={netBalance}
                totalProduction={totalProduction}
                totalConsumption={totalConsumption}
                onMouseDown={handlePanelMouseDown}
              />
            )}

            {/* Controls Panel */}
            {controlsPanel && (
              <ControlsPanel
                panel={controlsPanel}
                energyFlows={frontendFlows}
                onMouseDown={handlePanelMouseDown}
                onToggleEnergyFlow={handleToggleEnergyFlow}
                onAddComponent={handleAddComponent}
              />
            )}

            {/* Components */}
            {frontendComponents.map((component) => (
              <GridComponentView
                key={component.id}
                component={component}
                isSelected={selectedComponentId === component.id}
                isDragged={draggedComponent === component.id}
                onMouseDown={handleComponentMouseDown}
                onSelect={setSelectedComponent}
                onRemove={handleRemoveComponent}
              />
            ))}

            {/* Grid Title for split view */}
            {viewMode === 'split' && (
              <div className="absolute top-4 left-4 z-40">
                <h3 className="text-lg font-semibold text-white bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur-sm">
                  Interactive Grid {siteId && `- Site ${siteId}`}
                </h3>
              </div>
            )}
          </div>
        )}

        {/* Analytics View */}
        {(viewMode === 'analytics' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full overflow-auto bg-slate-900`}>
            <div className="p-6 h-full">
              <GridAnalytics 
                components={frontendComponents} 
                energyFlows={frontendFlows}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersistentInteractiveGrid;