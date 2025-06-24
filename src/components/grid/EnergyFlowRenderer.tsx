
import React from 'react';
import { EnergyFlow, GridComponent } from './types';

interface EnergyFlowRendererProps {
  energyFlows: EnergyFlow[];
  components: GridComponent[];
}

const EnergyFlowRenderer = ({ energyFlows, components }: EnergyFlowRendererProps) => {
  const renderEnergyFlow = (flow: EnergyFlow) => {
    if (!flow.enabled) return null;

    const fromComponent = components.find(c => c.id === flow.from);
    const toComponent = components.find(c => c.id === flow.to);
    
    if (!fromComponent || !toComponent) return null;

    // Check if this is a negative flow (consuming)
    const isConsuming = flow.power < 0;
    const actualPower = Math.abs(flow.power);
    
    // Swap start and end points for negative flows
    const startComponent = isConsuming ? toComponent : fromComponent;
    const endComponent = isConsuming ? fromComponent : toComponent;
    
    const startX = startComponent.position.x + 48;
    const startY = startComponent.position.y + 48;
    const endX = endComponent.position.x + 48;
    const endY = endComponent.position.y + 48;

    // Calculate path
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction vector
    const dirX = dx / length;
    const dirY = dy / length;
    
    // Calculate positions for multiple flowing circles
    const circles = [];
    for (let i = 0; i < 3; i++) {
      const offset = (i * 0.3) % 1;
      const circleX = startX + dx * offset;
      const circleY = startY + dy * offset;
      circles.push({ x: circleX, y: circleY, delay: i * 0.3 });
    }

    // Calculate arrow position at the end
    const arrowSize = 8;
    const arrowPoints = [
      [endX - arrowSize * dirX - arrowSize * dirY * 0.5, endY - arrowSize * dirY + arrowSize * dirX * 0.5],
      [endX, endY],
      [endX - arrowSize * dirX + arrowSize * dirY * 0.5, endY - arrowSize * dirY - arrowSize * dirX * 0.5]
    ];

    const midX = startX + dx * 0.5;
    const midY = startY + dy * 0.5;

    return (
      <g key={flow.id}>
        {/* Main line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="url(#energyGradient)"
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Flowing circles */}
        {circles.map((circle, index) => (
          <circle
            key={index}
            r="6"
            fill="#10b981"
            opacity="0.9"
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              begin={`${circle.delay}s`}
              path={`M ${startX},${startY} L ${endX},${endY}`}
            />
          </circle>
        ))}
        
        {/* Power label */}
        <rect
          x={midX - 20}
          y={midY - 20}
          width="40"
          height="16"
          fill="rgba(0, 0, 0, 0.7)"
          rx="8"
        />
        <text
          x={midX}
          y={midY - 8}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          className="font-medium"
        >
          {actualPower}kW
        </text>
        
        {/* Direction arrow */}
        <polygon
          points={arrowPoints.map(p => p.join(',')).join(' ')}
          fill="#10b981"
          opacity="0.9"
        />
      </g>
    );
  };

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
      <defs>
        <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06d6a0" />
        </linearGradient>
      </defs>
      {energyFlows.map(renderEnergyFlow)}
    </svg>
  );
};

export default EnergyFlowRenderer;
