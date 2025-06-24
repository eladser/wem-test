
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Battery, Zap, Building, Fuel, Grid3X3, Settings, X } from "lucide-react";

interface GridComponent {
  id: string;
  type: 'solar' | 'battery' | 'generator' | 'grid' | 'load';
  name: string;
  power: number; // positive = producing, negative = consuming
  status: 'active' | 'standby' | 'offline';
  position: { x: number; y: number };
  efficiency?: number;
  capacity?: number;
}

interface EnergyFlow {
  id: string;
  from: string;
  to: string;
  power: number;
  enabled: boolean;
}

interface DraggablePanel {
  id: string;
  position: { x: number; y: number };
}

const InteractiveGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    { id: 'flow-2', from: 'solar-1', to: 'battery-1', power: 35, enabled: true },
    { id: 'flow-3', from: 'battery-1', to: 'load-1', power: 10, enabled: true },
    { id: 'flow-4', from: 'grid-1', to: 'load-1', power: 15, enabled: true }
  ]);

  const [panels, setPanels] = useState<DraggablePanel[]>([
    { id: 'status-panel', position: { x: 20, y: 20 } },
    { id: 'controls-panel', position: { x: 20, y: 200 } }
  ]);

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'solar': return Sun;
      case 'battery': return Battery;
      case 'generator': return Fuel;
      case 'grid': return Building;
      case 'load': return Zap;
      default: return Grid3X3;
    }
  };

  const getComponentColor = (type: string, power: number) => {
    if (power > 0) return 'from-emerald-500 to-green-600'; // Producing
    if (power < 0) return 'from-blue-500 to-cyan-600'; // Consuming
    return 'from-slate-500 to-slate-600'; // Standby
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'standby': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'offline': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleComponentMouseDown = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedComponent(componentId);
  };

  const handlePanelMouseDown = (e: React.MouseEvent, panelId: string) => {
    e.stopPropagation();
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedPanel(panelId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const newX = e.clientX - gridRect.left - dragOffset.x;
    const newY = e.clientY - gridRect.top - dragOffset.y;

    if (draggedComponent) {
      setComponents(prev => prev.map(comp =>
        comp.id === draggedComponent
          ? { ...comp, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : comp
      ));
    }

    if (draggedPanel) {
      setPanels(prev => prev.map(panel =>
        panel.id === draggedPanel
          ? { ...panel, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : panel
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedComponent(null);
    setDraggedPanel(null);
  };

  const toggleEnergyFlow = (flowId: string) => {
    setEnergyFlows(prev => prev.map(flow =>
      flow.id === flowId ? { ...flow, enabled: !flow.enabled } : flow
    ));
  };

  const renderEnergyFlow = (flow: EnergyFlow) => {
    if (!flow.enabled) return null;

    const fromComponent = components.find(c => c.id === flow.from);
    const toComponent = components.find(c => c.id === flow.to);
    
    if (!fromComponent || !toComponent) return null;

    const fromX = fromComponent.position.x + 48;
    const fromY = fromComponent.position.y + 48;
    const toX = toComponent.position.x + 48;
    const toY = toComponent.position.y + 48;

    const midX = fromX + (toX - fromX) * 0.5;
    const midY = fromY + (toY - fromY) * 0.5;

    return (
      <g key={flow.id}>
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="url(#energyGradient)"
          strokeWidth="3"
          className="animate-pulse"
        />
        <circle
          cx={midX}
          cy={midY}
          r="8"
          fill="rgba(16, 185, 129, 0.8)"
          className="animate-ping"
        />
        <text
          x={midX}
          y={midY - 15}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          className="font-medium"
        >
          {flow.power}kW
        </text>
      </g>
    );
  };

  const totalProduction = components.filter(c => c.power > 0).reduce((sum, c) => sum + c.power, 0);
  const totalConsumption = Math.abs(components.filter(c => c.power < 0).reduce((sum, c) => sum + c.power, 0));
  const netBalance = totalProduction - totalConsumption;

  const statusPanel = panels.find(p => p.id === 'status-panel');
  const controlsPanel = panels.find(p => p.id === 'controls-panel');

  return (
    <div className="h-full bg-slate-950 text-white overflow-hidden">
      {/* Grid Canvas */}
      <div
        ref={gridRef}
        className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: 1 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
            </pattern>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Energy Flow Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradiente>
          </defs>
          {energyFlows.map(renderEnergyFlow)}
        </svg>

        {/* Draggable Status Panel */}
        {statusPanel && (
          <div
            className="absolute z-20 cursor-move"
            style={{
              left: statusPanel.position.x,
              top: statusPanel.position.y
            }}
            onMouseDown={(e) => handlePanelMouseDown(e, 'status-panel')}
          >
            <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700/50 p-4 min-w-[200px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-400 font-medium">System Active</span>
                  </div>
                  <div className="w-2 h-2 bg-slate-600 rounded-full cursor-grab"></div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">Net Balance</div>
                  <div className={`text-xl font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {netBalance > 0 ? '+' : ''}{netBalance} kW
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">Production</div>
                    <div className="text-emerald-400 font-semibold">{totalProduction} kW</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Consumption</div>
                    <div className="text-blue-400 font-semibold">{totalConsumption} kW</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Draggable Controls Panel */}
        {controlsPanel && (
          <div
            className="absolute z-20 cursor-move"
            style={{
              left: controlsPanel.position.x,
              top: controlsPanel.position.y
            }}
            onMouseDown={(e) => handlePanelMouseDown(e, 'controls-panel')}
          >
            <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700/50 p-4 min-w-[200px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Grid Controls</span>
                  </div>
                  <div className="w-2 h-2 bg-slate-600 rounded-full cursor-grab"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 mb-2">Energy Flows</div>
                  {energyFlows.map(flow => (
                    <div key={flow.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{flow.from} → {flow.to}</span>
                      <button
                        onClick={() => toggleEnergyFlow(flow.id)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          flow.enabled ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          flow.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 mt-3">
                    Add Component
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Components */}
        {components.map((component) => {
          const Icon = getComponentIcon(component.type);
          const isProducing = component.power > 0;
          const isConsuming = component.power < 0;

          return (
            <div
              key={component.id}
              className={`absolute cursor-move transform transition-transform hover:scale-105 ${
                draggedComponent === component.id ? 'scale-110 z-30' : 'z-10'
              }`}
              style={{
                left: component.position.x,
                top: component.position.y
              }}
              onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
            >
              <Card className="w-24 h-24 bg-slate-800/80 backdrop-blur-sm border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300 shadow-xl hover:shadow-2xl">
                <div className="h-full flex flex-col items-center justify-center p-2 relative">
                  {/* Status Indicator */}
                  <div className="absolute -top-1 -right-1">
                    <div className={`w-3 h-3 rounded-full ${
                      component.status === 'active' ? 'bg-emerald-500' : 
                      component.status === 'standby' ? 'bg-amber-500' : 'bg-red-500'
                    } ${component.status === 'active' ? 'animate-pulse' : ''}`}></div>
                  </div>

                  {/* Icon with Power Animation */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 bg-gradient-to-br ${getComponentColor(component.type, component.power)} ${
                    isProducing ? 'animate-energy-flow' : isConsuming ? 'animate-pulse' : ''
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Component Name */}
                  <div className="text-xs text-white font-medium text-center leading-tight mb-1">
                    {component.name}
                  </div>

                  {/* Power Display */}
                  <div className={`text-xs font-bold ${
                    isProducing ? 'text-emerald-400' : isConsuming ? 'text-blue-400' : 'text-slate-400'
                  }`}>
                    {component.power > 0 ? '+' : ''}{component.power}kW
                  </div>
                </div>
              </Card>

              {/* Component Info Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <Badge className={`${getStatusColor(component.status)} text-xs whitespace-nowrap`}>
                  {component.status} • {component.efficiency ? `${component.efficiency}%` : ''}
                  {component.capacity ? ` • ${component.capacity}kWh` : ''}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveGrid;
