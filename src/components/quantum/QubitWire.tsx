import React, { useState, useCallback } from 'react';
import { QubitWire as QubitWireType } from '../QuantumCircuitBuilder';

interface QubitWireProps {
  qubit: QubitWireType;
  onMove: (newY: number) => void;
}

export const QubitWire: React.FC<QubitWireProps> = ({ qubit, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    setIsDragging(true);
    const startY = e.clientY;
    const startQubitY = qubit.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newY = Math.max(50, Math.min(800, startQubitY + deltaY));
      onMove(newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [qubit.y, onMove]);

  return (
    <div
      className="absolute left-0 right-0 group"
      style={{ top: qubit.y - 1 }}
    >
      {/* Wire Line */}
      <div className="h-0.5 bg-quantum-wire ml-24 mr-8"></div>
      
      {/* Qubit Label */}
      <div
        className={`absolute left-8 top-1/2 -translate-y-1/2 w-12 h-8 rounded-lg bg-quantum-gate border border-quantum-wire flex items-center justify-center cursor-grab select-none font-mono text-sm font-medium ${
          isDragging ? 'cursor-grabbing bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'
        }`}
        onMouseDown={handleMouseDown}
      >
        q{qubit.index}
      </div>

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-primary opacity-50 pointer-events-none"></div>
      )}
    </div>
  );
};