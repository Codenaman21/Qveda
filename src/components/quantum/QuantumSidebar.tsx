import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Minus } from 'lucide-react';
import { CircuitState, Gate } from '../QuantumCircuitBuilder';

interface QuantumSidebarProps {
  onAddQubit: (index: number) => void;
  onAddGate: (gate: Omit<Gate, 'id'>) => void;
  circuitState: CircuitState;
  setCircuitState: React.Dispatch<React.SetStateAction<CircuitState>>;
}

export const QuantumSidebar: React.FC<QuantumSidebarProps> = ({
  onAddQubit,
  onAddGate,
  circuitState,
  setCircuitState
}) => {
  const handleDragStart = (e: React.DragEvent, gateType: Gate['type']) => {
    e.dataTransfer.setData('gateType', gateType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleRemoveQubit = (index: number) => {
    setCircuitState(prev => ({
      ...prev,
      qubits: prev.qubits.filter(q => q.index !== index),
      gates: prev.gates.filter(g => 
        g.qubitIndex !== index && 
        g.controlQubit !== index && 
        g.targetQubit !== index
      )
    }));
  };

  const clearCircuit = () => {
    setCircuitState({
      qubits: [],
      gates: [],
      selectedGate: null
    });
  };

  return (
    <aside className="w-80 bg-quantum-sidebar border-r border-border flex flex-col">
      <div className="p-6 space-y-6">
        
        {/* Qubits Section */}
        <div>
          <h3 className="text-lg font-semibold text-quantum-sidebar-foreground mb-4">Qubits</h3>
          <div className="space-y-2">
            {/* Add Qubit Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddQubit(index)}
                  className="rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground"
                  disabled={circuitState.qubits.some(q => q.index === index)}
                >
                  q{index}
                </Button>
              ))}
            </div>
            
            {/* Active Qubits */}
            {circuitState.qubits.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-quantum-sidebar-foreground">Active Qubits:</p>
                {circuitState.qubits.map((qubit) => (
                  <div key={qubit.id} className="flex items-center justify-between bg-quantum-gate rounded-lg p-2">
                    <span className="text-sm font-medium text-foreground">q{qubit.index}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQubit(qubit.index)}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground rounded"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-quantum-wire" />

        {/* Gates Section */}
        <div>
          <h3 className="text-lg font-semibold text-quantum-sidebar-foreground mb-4">Gates</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Single Qubit Gates */}
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'H')}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-lg"
              >
                H
              </Button>
            </div>
            
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'X')}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-lg"
              >
                X
              </Button>
            </div>

            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'Y')}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-lg"
              >
                Y
              </Button>
            </div>
            
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'Z')}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-lg"
              >
                Z
              </Button>
            </div>

            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'S')}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-lg"
              >
                S
              </Button>
            </div>
            
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'T')}
              className="cursor-move"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-lg"
              >
                T
              </Button>
            </div>

            {/* Multi Qubit Gates */}
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'CNOT')}
              className="cursor-move col-span-2"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-sm"
              >
                CNOT
              </Button>
            </div>

            {/* Measurement */}
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'Measure')}
              className="cursor-move col-span-2"
            >
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground font-mono text-sm"
              >
                Measure
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 px-1">
            Drag gates onto qubit wires to build your circuit
          </p>
        </div>

        <Separator className="bg-quantum-wire" />

          {/* Tools Section */}
        <div>
          <h3 className="text-lg font-semibold text-quantum-sidebar-foreground mb-4">Tools</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCircuit}
              className="w-full rounded-lg bg-quantum-gate hover:bg-destructive hover:text-destructive-foreground border-quantum-wire text-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Circuit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Auto-arrange gates functionality
                console.log('Auto-arrange gates');
              }}
              className="w-full rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground"
            >
              <Plus className="w-4 h-4 mr-2 rotate-45" />
              Auto-Arrange
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Optimize circuit functionality
                console.log('Optimize circuit');
              }}
              className="w-full rounded-lg bg-quantum-gate hover:bg-primary hover:text-primary-foreground border-quantum-wire text-foreground"
            >
              ⚡ Optimize Circuit
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};