
import React, { useState } from 'react';
import { GridComponent, EnergyFlow, DraggablePanel } from './grid/types';
import { useGridDrag } from './grid/hooks/useGridDrag';
import EnergyFlowRenderer from './grid/EnergyFlowRenderer';
import GridComponentView from './grid/GridComponent';
import StatusPanel from './grid/StatusPanel';
import ControlsPanel from './grid/ControlsPanel';
import { GridAnalytics } from './grid/GridAnalytics';
import { Button } from '@/components/ui/button';
import { BarChart3, Grid, Maximize2, Minimize2 } from 'lucide-react';

const InteractiveGrid = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'analytics' | 'split'>('grid');

  const [components, setComponents] = useState<GridComponent[]>([
    {
      id: 'solar-1',
      type: 'solar',
      name: 'Solar Array',
      power: 85,
      status: 'active',
      position: { x: 100, y: 150 },
      efficiency: 92
    },
    {
      id: 'battery-1',
      type: 'battery',
      name: 'Battery Bank',
      power: -25,
      status: 'active',
      position: { x: 400, y: 300 },
      capacity: 100
    },
    {
      id: 'generator-1',
      type: 'generator',
      name: 'Backup Generator',
      power: 0,
      status: 'standby',
      position: { x: 100, y: 450 },
      efficiency: 85
    },
    {
      id: 'grid-1',
      type: 'grid',
      name: 'Grid Connection',
      power: -15,
      status: 'active',
      position: { x: 700, y: 300 }
    },
    {
      id: 'load-1',
      type: 'load',
      name: 'Load Center',
      power: -95,
      status: 'active',
      position: { x: 400, y: 150 }
    }
  ]);

  const [energyFlows, setEnergyFlows] = useState<EnergyFlow[]>([
    { id: 'flow-1', from: 'solar-1', to: 'load-1', power: 50, enabled: true },
    { id: 'flow-2', from: 'solar-1', to: 'battery-1', power: -25, enabled: true },
    { id: 'flow-3', from: 'battery-1', to: 'load-1', power: 10, enabled: true },
    { id: 'flow-4', from: 'grid-1', to: 'load-1', power: -15, enabled: true }
  ]);

  const [panels, setPanels] = useState<DraggablePanel[]>([
    { id: 'status-panel', position: { x: 20, y: 20 } },
    { id: 'controls-panel', position: { x: 20, y: 200 } }
  ]);

  const {
    gridRef,
    draggedComponent,
    draggedPanel,
    handleComponentMouseDown,
    handlePanelMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useGridDrag(components, setComponents, panels, setPanels);

  const addComponent = (type: GridComponent['type']) => {
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
    setComponents(prev => [...prev, newComponent]);
  };

  const removeComponent = (componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    setEnergyFlows(prev => prev.filter(f => f.from !== componentId && f.to !== componentId));
    setSelectedComponent(null);
  };

  const toggleEnergyFlow = (flowId: string) => {
    setEnergyFlows(prev => prev.map(flow =>
      flow.id === flowId ? { ...flow, enabled: !flow.enabled } : flow
    ));
  };

  const totalProduction = components.filter(c => c.power > 0).reduce((sum, c) => sum + c.power, 0);
  const totalConsumption = Math.abs(components.filter(c => c.power < 0).reduce((sum, c) => sum + c.power, 0));
  const netBalance = totalProduction - totalConsumption;

  const statusPanel = panels.find(p => p.id === 'status-panel');
  const controlsPanel = panels.find(p => p.id === 'controls-panel');

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
      </div>

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
            <EnergyFlowRenderer energyFlows={energyFlows} components={components} />

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
                energyFlows={energyFlows}
                onMouseDown={handlePanelMouseDown}
                onToggleEnergyFlow={toggleEnergyFlow}
                onAddComponent={addComponent}
              />
            )}

            {/* Components */}
            {components.map((component) => (
              <GridComponentView
                key={component.id}
                component={component}
                isSelected={selectedComponent === component.id}
                isDragged={draggedComponent === component.id}
                onMouseDown={handleComponentMouseDown}
                onSelect={setSelectedComponent}
                onRemove={removeComponent}
              />
            ))}

            {/* Grid Title for split view */}
            {viewMode === 'split' && (
              <div className="absolute top-4 left-4 z-40">
                <h3 className="text-lg font-semibold text-white bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur-sm">
                  Interactive Grid
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
                components={components} 
                energyFlows={energyFlows}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveGrid;