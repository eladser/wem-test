
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Sun, Battery, Fuel, Zap } from "lucide-react";
import { DraggablePanel, EnergyFlow, GridComponent } from './types';

interface ControlsPanelProps {
  panel: DraggablePanel;
  energyFlows: EnergyFlow[];
  onMouseDown: (e: React.MouseEvent, panelId: string) => void;
  onToggleEnergyFlow: (flowId: string) => void;
  onAddComponent: (type: GridComponent['type']) => void;
}

const ControlsPanel = ({ 
  panel, 
  energyFlows, 
  onMouseDown, 
  onToggleEnergyFlow, 
  onAddComponent 
}: ControlsPanelProps) => {
  return (
    <div
      className="absolute z-20 cursor-move"
      style={{
        left: panel.position.x,
        top: panel.position.y
      }}
      onMouseDown={(e) => onMouseDown(e, 'controls-panel')}
    >
      <Card className="bg-slate-900/90 backdrop-blur-sm border-slate-700/50 p-4 min-w-[220px]">
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
                  onClick={() => onToggleEnergyFlow(flow.id)}
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
            
            <div className="border-t border-slate-700 pt-2 mt-3">
              <div className="text-xs text-slate-400 mb-2">Add Components</div>
              <div className="grid grid-cols-2 gap-1">
                <Button size="sm" variant="outline" onClick={() => onAddComponent('solar')} className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Sun className="w-3 h-3 mr-1" />
                  Solar
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddComponent('battery')} className="text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <Battery className="w-3 h-3 mr-1" />
                  Battery
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddComponent('generator')} className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                  <Fuel className="w-3 h-3 mr-1" />
                  Generator
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddComponent('load')} className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Zap className="w-3 h-3 mr-1" />
                  Load
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ControlsPanel;
