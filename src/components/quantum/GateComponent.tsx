import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Gate } from '../QuantumCircuitBuilder';

interface GateComponentProps {
  gate: Gate;
  onMove: (gateId: string, position: { x: number; y: number }) => void;
  onDelete: (gateId: string) => void;
  isSelected: boolean;
  onClick: () => void;
}

export const GateComponent: React.FC<GateComponentProps> = ({
  gate,
  onMove,
  onDelete,
  isSelected,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startGateX = gate.position.x;
    const startGateY = gate.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // For horizontal movement along the wire
      const newX = Math.max(100, startGateX + deltaX);
      
      // Keep gate on the wire (minimal vertical movement)
      const newY = startGateY + Math.max(-5, Math.min(5, deltaY));
      
      onMove(gate.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [gate.id, gate.position, onMove]);

  const renderGateContent = () => {
    switch (gate.type) {
      case 'H':
        return (
          <div className="w-10 h-10 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-sm font-bold">
            H
          </div>
        );
      
      case 'X':
        return (
          <div className="w-10 h-10 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-sm font-bold">
            X
          </div>
        );

      case 'Y':
        return (
          <div className="w-10 h-10 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-sm font-bold">
            Y
          </div>
        );

        case 'Z':
        return (
          <div className="w-10 h-10 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-sm font-bold">
            Z
          </div>
        );

        case 'S':
        return (
          <div className="w-10 h-10 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-sm font-bold">
            S
          </div>
        );

        case 'T':
        return (
          <div className="w-10 h-10 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-sm font-bold">
            T
          </div>
        );
      case 'CNOT':
        return (
          <div className="flex flex-col items-center space-y-2">
            {/* Control dot */}
            <div className="w-3 h-3 rounded-full bg-foreground"></div>
            {/* Connection line - would need more complex logic for actual CNOT */}
            <div className="w-px h-8 bg-quantum-wire"></div>
            {/* Target circle with X */}
            <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
              <X className="w-3 h-3" />
            </div>
          </div>
        );
      
      case 'Measure':
        return (
          <div className="w-12 h-8 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center font-mono text-xs font-medium">
            M
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={`absolute cursor-grab select-none group ${
        isDragging ? 'cursor-grabbing z-20' : 'z-10'
      } ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-quantum-canvas' 
          : 'hover:ring-1 hover:ring-quantum-wire hover:ring-offset-1 hover:ring-offset-quantum-canvas'
      }`}
      style={{
        left: gate.position.x - 20,
        top: gate.position.y - 20,
        transform: 'translate(0, -50%)'
      }}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      {renderGateContent()}
      
      {/* Delete button - visible when selected */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(gate.id);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:bg-destructive/80 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute -inset-2 border border-primary border-dashed rounded-lg pointer-events-none opacity-50"></div>
      )}
    </div>
  );
};
