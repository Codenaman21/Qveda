import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Code, FileText, Share } from 'lucide-react';

interface ExportSectionProps {
  circuitJSON: any;
  onExportCode: () => void;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ circuitJSON, onExportCode }) => {
  const generateQiskitCode = () => {
    const qubits = circuitJSON.qubits.length;
    return `from qiskit import QuantumCircuit, execute, Aer
from qiskit.visualization import plot_histogram

# Create quantum circuit with ${qubits} qubit${qubits !== 1 ? 's' : ''}
qc = QuantumCircuit(${qubits}, ${qubits})

# Add gates (based on your circuit design)
${circuitJSON.gates.map((gate: any) => {
  switch (gate.type) {
    case 'H':
      return `qc.h(${gate.qubitIndex})  # Hadamard gate on qubit ${gate.qubitIndex}`;
    case 'X':
      return `qc.x(${gate.qubitIndex})  # Pauli-X gate on qubit ${gate.qubitIndex}`;
    case 'Y':
      return `qc.y(${gate.qubitIndex})  # Pauli-Y gate on qubit ${gate.qubitIndex}`;
    case 'Z':
      return `qc.z(${gate.qubitIndex})  # Pauli-Z gate on qubit ${gate.qubitIndex}`;
    case 'S':
      return `qc.s(${gate.qubitIndex})  # S gate on qubit ${gate.qubitIndex}`;
    case 'T':
      return `qc.t(${gate.qubitIndex})  # T gate on qubit ${gate.qubitIndex}`;
    case 'CNOT':
      return `qc.cx(${gate.controlQubit}, ${gate.targetQubit})  # CNOT gate`;
    case 'Measure':
      return `qc.measure(${gate.qubitIndex}, ${gate.qubitIndex})  # Measure qubit ${gate.qubitIndex}`;
    default:
      return `# ${gate.type} gate`;
  }
}).join('\n')}

# Execute the circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts(qc)

# Display results
print(counts)
plot_histogram(counts)`;
  };

  const handleExportCode = () => {
    const code = generateQiskitCode();
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'quantum_circuit.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onExportCode();
  };

  const handleExportJSON = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(circuitJSON, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'quantum_circuit.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Export Options */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Your Quantum Circuit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExportCode}
              className="rounded-lg bg-primary hover:bg-primary-glow text-primary-foreground p-6 h-auto flex flex-col items-center space-y-2"
            >
              <Code className="w-8 h-8" />
              <div className="text-center">
                <div className="font-medium">Export to Qiskit</div>
                <div className="text-xs opacity-80">Python code ready to run</div>
              </div>
            </Button>

            <Button
              onClick={handleExportJSON}
              variant="outline"
              className="rounded-lg p-6 h-auto flex flex-col items-center space-y-2"
            >
              <FileText className="w-8 h-8" />
              <div className="text-center">
                <div className="font-medium">Export as JSON</div>
                <div className="text-xs opacity-80">Circuit data format</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Code Preview */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Qiskit Code Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
            <code>{generateQiskitCode()}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share className="w-5 h-5 mr-2" />
            Share & Collaborate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="rounded-lg">
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </Button>
              <Button variant="outline" className="rounded-lg">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="rounded-lg">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share your quantum circuit with collaborators or export detailed analysis reports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};