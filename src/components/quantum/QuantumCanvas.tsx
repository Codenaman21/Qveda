import React, { forwardRef, useCallback, useState } from 'react';
import { CircuitState } from '../QuantumCircuitBuilder';
import { QubitWire } from './QubitWire';
import { GateComponent } from './GateComponent';

interface QuantumCanvasProps {
  circuitState: CircuitState;
  setCircuitState: React.Dispatch<React.SetStateAction<CircuitState>>;
}

export const QuantumCanvas = forwardRef<HTMLDivElement, QuantumCanvasProps>(
  ({ circuitState, setCircuitState }, ref) => {
    const [draggedGate, setDraggedGate] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      const gateType = e.dataTransfer.getData('gateType') as any;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find the closest qubit wire
      const closestQubit = circuitState.qubits.reduce((closest, qubit) => {
        const distance = Math.abs(qubit.y - y);
        return distance < Math.abs(closest.y - y) ? qubit : closest;
      }, circuitState.qubits[0]);

      if (!closestQubit || Math.abs(closestQubit.y - y) > 40) {
        return; // Don't place gate if too far from any wire
      }

      const newGate = {
        type: gateType,
        position: { x: Math.max(100, x), y: closestQubit.y },
        qubitIndex: closestQubit.index,
      };

      setCircuitState(prev => ({
        ...prev,
        gates: [...prev.gates, { ...newGate, id: `gate-${Date.now()}` }]
      }));
    }, [circuitState.qubits, setCircuitState]);

    const handleGateMove = useCallback((gateId: string, newPosition: { x: number; y: number }) => {
      setCircuitState(prev => ({
        ...prev,
        gates: prev.gates.map(gate => 
          gate.id === gateId 
            ? { ...gate, position: newPosition }
            : gate
        )
      }));
    }, [setCircuitState]);

    const handleGateDelete = useCallback((gateId: string) => {
      setCircuitState(prev => ({
        ...prev,
        gates: prev.gates.filter(gate => gate.id !== gateId)
      }));
    }, [setCircuitState]);

    return (
      <div
        ref={ref}
        className="w-full h-full min-h-[600px] relative overflow-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Grid Background */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="hsl(var(--quantum-grid))"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Circuit Content */}
        <div className="relative z-10 p-8">
          {/* Empty State */}
          {circuitState.qubits.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-muted-foreground">
                <h3 className="text-xl font-semibold mb-2">Start Building Your Quantum Circuit</h3>
                <p className="text-sm">Add qubits from the sidebar to begin</p>
              </div>
            </div>
          )}

          {/* Qubit Wires */}
          {circuitState.qubits.map((qubit) => (
            <QubitWire
              key={qubit.id}
              qubit={qubit}
              onMove={(newY) => {
                setCircuitState(prev => ({
                  ...prev,
                  qubits: prev.qubits.map(q => 
                    q.id === qubit.id 
                      ? { ...q, y: newY }
                      : q
                  )
                }));
              }}
            />
          ))}

          {/* Gates */}
          {circuitState.gates.map((gate) => (
            <GateComponent
              key={gate.id}
              gate={gate}
              onMove={handleGateMove}
              onDelete={handleGateDelete}
              isSelected={circuitState.selectedGate === gate.id}
              onClick={() => {
                setCircuitState(prev => ({
                  ...prev,
                  selectedGate: prev.selectedGate === gate.id ? null : gate.id
                }));
              }}
            />
          ))}
        </div>

        {/* Timeline Indicator */}
        <div className="absolute top-4 left-8 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span>Timeline</span>
            <div className="w-8 h-px bg-muted-foreground"></div>
            <span>→</span>
          </div>
        </div>
      </div>
    );
  }
);