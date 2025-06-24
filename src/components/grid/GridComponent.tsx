
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Battery, Zap, Building, Fuel, Grid3X3, X } from "lucide-react";
import { GridComponent as GridComponentType } from './types';

interface GridComponentProps {
  component: GridComponentType;
  isSelected: boolean;
  isDragged: boolean;
  onMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onSelect: (componentId: string) => void;
  onRemove: (componentId: string) => void;
}

const GridComponent = ({ 
  component, 
  isSelected, 
  isDragged, 
  onMouseDown, 
  onSelect, 
  onRemove 
}: GridComponentProps) => {
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
    if (power > 0) return 'from-emerald-500 to-green-600';
    if (power < 0) return 'from-blue-500 to-cyan-600';
    return 'from-slate-500 to-slate-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'standby': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'offline': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const Icon = getComponentIcon(component.type);
  const isProducing = component.power > 0;
  const isConsuming = component.power < 0;

  return (
    <div
      className={`absolute cursor-move transform transition-all duration-200 hover:scale-105 ${
        isDragged ? 'scale-110 z-30' : 'z-10'
      } ${isSelected ? 'ring-2 ring-emerald-500' : ''}`}
      style={{
        left: component.position.x,
        top: component.position.y
      }}
      onMouseDown={(e) => onMouseDown(e, component.id)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
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

      {/* Delete button for selected component */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(component.id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-40"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Component Info Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Badge className={`${getStatusColor(component.status)} text-xs whitespace-nowrap`}>
          {component.status} • {component.efficiency ? `${component.efficiency}%` : ''}
          {component.capacity ? ` • ${component.capacity}kWh` : ''}
        </Badge>
      </div>
    </div>
  );
};

export default GridComponent;
