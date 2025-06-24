
import React from 'react';
import { Card } from "@/components/ui/card";
import { DraggablePanel } from './types';

interface StatusPanelProps {
  panel: DraggablePanel;
  netBalance: number;
  totalProduction: number;
  totalConsumption: number;
  onMouseDown: (e: React.MouseEvent, panelId: string) => void;
}

const StatusPanel = ({ 
  panel, 
  netBalance, 
  totalProduction, 
  totalConsumption, 
  onMouseDown 
}: StatusPanelProps) => {
  return (
    <div
      className="absolute z-20 cursor-move"
      style={{
        left: panel.position.x,
        top: panel.position.y
      }}
      onMouseDown={(e) => onMouseDown(e, 'status-panel')}
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
  );
};

export default StatusPanel;
