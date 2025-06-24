
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Battery, Zap, Building, Fuel, Grid3X3, Settings } from "lucide-react";

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
  from: string;
  to: string;
  power: number;
}

const InteractiveGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
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

  const energyFlows: EnergyFlow[] = [
    { from: 'solar-1', to: 'load-1', power: 50 },
    { from: 'solar-1', to: 'battery-1', power: 35 },
    { from: 'battery-1', to: 'load-1', power: 10 },
    { from: 'grid-1', to: 'load-1', power: 15 }
  ];

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

  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedComponent(componentId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedComponent || !gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const newX = e.clientX - gridRect.left - dragOffset.x;
    const newY = e.clientY - gridRect.top - dragOffset.y;

    setComponents(prev => prev.map(comp =>
      comp.id === draggedComponent
        ? { ...comp, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
        : comp
    ));
  };

  const handleMouseUp = () => {
    setDraggedComponent(null);
  };

  const renderEnergyFlow = (flow: EnergyFlow) => {
    const fromComponent = components.find(c => c.id === flow.from);
    const toComponent = components.find(c => c.id === flow.to);
    
    if (!fromComponent || !toComponent) return null;

    const fromX = fromComponent.position.x + 50;
    const fromY = fromComponent.position.y + 50;
    const toX = toComponent.position.x + 50;
    const toY = toComponent.position.y + 50;

    return (
      <g key={`${flow.from}-${flow.to}`}>
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
          cx={fromX + (toX - fromX) * 0.5}
          cy={fromY + (toY - fromY) * 0.5}
          r="8"
          fill="rgba(16, 185, 129, 0.8)"
          className="animate-ping"
        />
        <text
          x={fromX + (toX - fromX) * 0.5}
          y={fromY + (toY - fromY) * 0.5 - 15}
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

  return (
    <div className="h-full bg-slate-950 text-white overflow-hidden">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20 space-y-4">
        <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700/50 p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400 font-medium">System Active</span>
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

        <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700/50 p-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-white flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Grid Controls</span>
            </div>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                Add Component
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs border-slate-500/30 text-slate-400 hover:bg-slate-500/10">
                Reset Layout
              </Button>
            </div>
          </div>
        </Card>
      </div>

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
            </linearGradient>
          </defs>
          {energyFlows.map(renderEnergyFlow)}
        </svg>

        {/* Components */}
        {components.map((component) => {
          const Icon = getComponentIcon(component.type);
          const isProducing = component.power > 0;
          const isConsuming = component.power < 0;

          return (
            <div
              key={component.id}
              className={`absolute cursor-move transform transition-transform hover:scale-105 ${
                draggedComponent === component.id ? 'scale-110 z-20' : 'z-10'
              }`}
              style={{
                left: component.position.x,
                top: component.position.y,
                zIndex: draggedComponent === component.id ? 20 : 10
              }}
              onMouseDown={(e) => handleMouseDown(e, component.id)}
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
