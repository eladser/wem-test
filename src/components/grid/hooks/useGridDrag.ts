
import { useState, useRef } from 'react';
import { GridComponent, DraggablePanel } from '../types';

export const useGridDrag = (
  components: GridComponent[],
  setComponents: React.Dispatch<React.SetStateAction<GridComponent[]>>,
  panels: DraggablePanel[],
  setPanels: React.Dispatch<React.SetStateAction<DraggablePanel[]>>
) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  return {
    gridRef,
    draggedComponent,
    draggedPanel,
    handleComponentMouseDown,
    handlePanelMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
