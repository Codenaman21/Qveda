# quantum_core/parser_utils.py
"""
QuantumParser
- Parses QASM strings into Qiskit QuantumCircuit objects.
- Extracts circuit metadata (number of qubits, classical bits, gates).
- Provides a simple API for backend/frontend display.
"""

from qiskit import QuantumCircuit
from collections import OrderedDict

class QuantumParser:
    def __init__(self, qasm_code: str):
        """
        Initialize parser with a QASM string.
        """
        self.qasm_code = qasm_code
        self.circuit = None
        self.metadata = {}

    def parse(self) -> QuantumCircuit:
        """
        Parse the QASM code into a QuantumCircuit.
        """
        try:
            self.circuit = QuantumCircuit.from_qasm_str(self.qasm_code)
        except Exception as e:
            raise ValueError(f"Failed to parse QASM: {e}")

        # Compute metadata
        gate_count = OrderedDict()
        for gate, count in self.circuit.count_ops().items():
            gate_count[gate] = count

        self.metadata = {
            "num_qubits": self.circuit.num_qubits,
            "num_clbits": self.circuit.num_clbits,
            "gate_count": gate_count,
            "depth": self.circuit.depth(),
            "width": self.circuit.width()
        }

        return self.circuit

    def get_metadata(self) -> dict:
        """
        Return metadata of the parsed circuit.
        """
        if self.circuit is None:
            raise RuntimeError("Circuit not parsed yet. Call parse() first.")
        return self.metadata
