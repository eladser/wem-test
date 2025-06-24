
export interface GridComponent {
  id: string;
  type: 'solar' | 'battery' | 'generator' | 'grid' | 'load';
  name: string;
  power: number; // positive = producing, negative = consuming
  status: 'active' | 'standby' | 'offline';
  position: { x: number; y: number };
  efficiency?: number;
  capacity?: number;
}

export interface EnergyFlow {
  id: string;
  from: string;
  to: string;
  power: number;
  enabled: boolean;
}

export interface DraggablePanel {
  id: string;
  position: { x: number; y: number };
}
