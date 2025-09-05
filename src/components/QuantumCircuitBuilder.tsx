import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import { QuantumSidebar } from './quantum/QuantumSidebar';
import { QuantumCanvas } from './quantum/QuantumCanvas';
import { QuantumResults } from './quantum/QuantumResults';
import { useToast } from '@/hooks/use-toast';

export interface Gate {
  id: string;
  type: 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'Measure';
  position: { x: number; y: number };
  qubitIndex?: number;
  controlQubit?: number;
  targetQubit?: number;
}

export interface QubitWire {
  id: string;
  index: number;
  y: number;
  gates: Gate[];
}

export interface CircuitState {
  qubits: QubitWire[];
  gates: Gate[];
  selectedGate: string | null;
}

export const QuantumCircuitBuilder: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [circuitState, setCircuitState] = useState<CircuitState>({
    qubits: [],
    gates: [],
    selectedGate: null
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleAddQubit = useCallback((index: number) => {
    const existingQubit = circuitState.qubits.find(q => q.index === index);
    if (existingQubit) {
      toast({
        title: "Qubit already exists",
        description: `q${index} is already in the circuit`,
        variant: "destructive"
      });
      return;
    }

    const newQubit: QubitWire = {
      id: `qubit-${index}`,
      index,
      y: 100 + index * 80,
      gates: []
    };

    setCircuitState(prev => ({
      ...prev,
      qubits: [...prev.qubits, newQubit].sort((a, b) => a.index - b.index)
    }));

    toast({
      title: "Qubit added",
      description: `q${index} added to circuit`
    });
  }, [circuitState.qubits, toast]);

  const handleAddGate = useCallback((gate: Omit<Gate, 'id'>) => {
    const newGate: Gate = {
      ...gate,
      id: `gate-${Date.now()}-${Math.random()}`
    };

    setCircuitState(prev => ({
      ...prev,
      gates: [...prev.gates, newGate]
    }));
  }, []);

  const toBackendJSON = () => {
  return {
    qubits: circuitState.qubits.length,
    gates: circuitState.gates.map(g => {
      if (g.type === "CNOT") {
        return {
          name: "CNOT",
          controls: [g.controlQubit ?? 0],
          targets: [g.targetQubit ?? 1]
        };
      }
      if (g.type === "Measure") {
        return { name: "MEASURE", targets: [g.qubitIndex ?? 0] };
      }
      return { name: g.type, targets: [g.qubitIndex ?? 0] };
    }),
    shots: 1000
  };
};


  const handleRunSimulation = async () => {
    if (circuitState.qubits.length === 0) {
      toast({
        title: "No circuit to simulate",
        description: "Add at least one qubit to begin",
        variant: "destructive"
      });
      return;
    }

    setIsSimulating(true);

    try {

      console.log("Sending JSON to backend:", toBackendJSON());

      const response = await fetch("http://localhost:8000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toBackendJSON())
      });

      if (!response.ok) throw new Error("Simulation failed");
      const data = await response.json();

      setResults(data);
      setShowResults(true);

      toast({
        title: "Simulation complete",
        description: "Circuit simulation finished successfully"
      });
    } catch (error) {
      toast({
        title: "Simulation failed",
        description: "An error occurred during simulation",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };


  const generateCircuitJSON = () => {
    return {
      qubits: circuitState.qubits.map(q => ({
        index: q.index,
        position: q.y
      })),
      gates: circuitState.gates.map(g => ({
        type: g.type,
        position: g.position,
        qubitIndex: g.qubitIndex,
        controlQubit: g.controlQubit,
        targetQubit: g.targetQubit
      })),
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Toolbar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Quantum Circuit Builder</h1>
          <Button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="rounded-lg bg-primary hover:bg-primary-glow text-primary-foreground font-medium px-6"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <QuantumSidebar
          onAddQubit={handleAddQubit}
          onAddGate={handleAddGate}
          circuitState={circuitState}
          setCircuitState={setCircuitState}
        />

        {/* Canvas Area */}
        <main className="flex-1 bg-quantum-canvas">
          <QuantumCanvas
            ref={canvasRef}
            circuitState={circuitState}
            setCircuitState={setCircuitState}
          />
        </main>
      </div>

      {/* Results Section */}
      {showResults && results && (
        <QuantumResults
          circuitJSON={generateCircuitJSON()}
          results={results}   // NEW
          onExportCode={() => {
            const json = generateCircuitJSON();
            console.log('Circuit JSON:', json);
            toast({
              title: "Code exported",
              description: "Circuit data logged to console"
            });
          }}
        />
      )}
    </div>
  );
};