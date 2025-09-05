# quantum_core/workflow.py
"""
QuantumWorkflow
- High-level wrapper to create quantum circuits from structured descriptions.
- Supports constructing circuits programmatically or from JSON-like dicts.
- Provides validation and utilities for export.
"""

from typing import List, Dict, Any, Optional
from qiskit import QuantumCircuit
import json


SUPPORTED_GATES = {
    "H", "X", "Y", "Z", "S", "T",
    "RX", "RY", "RZ",
    "CX", "CNOT", "CCX",  # Toffoli (CCX) reserved for future
    "MEASURE",
}


class QuantumWorkflow:
    def __init__(self, num_qubits: int, meta: Optional[Dict[str, Any]] = None):
        if num_qubits <= 0:
            raise ValueError("num_qubits must be >= 1")
        self.num_qubits = num_qubits
        # store gates as list of dicts (preserve order)
        self.gates: List[Dict[str, Any]] = []
        self.meta = meta or {}

    def add_gate(self, name: str,
                 targets: Optional[List[int]] = None,
                 controls: Optional[List[int]] = None,
                 params: Optional[Dict[str, Any]] = None):
        """
        Add a gate description to the workflow. This does not mutate Qiskit objects.
        - name: str, gate name (case-insensitive)
        - targets: list of target qubit indices (e.g. [0] or [0,1] for CX)
        - controls: list of control qubit indices (if applicable)
        - params: gate params (e.g. {'theta': 3.1415})
        """
        name = name.upper()
        if name not in SUPPORTED_GATES:
            raise ValueError(f"Unsupported gate: {name}")
        targets = targets or []
        controls = controls or []
        params = params or {}
        # Basic validation of indices
        for q in (targets + controls):
            if q < 0 or q >= self.num_qubits:
                raise IndexError(f"Qubit index {q} out of range for {self.num_qubits} qubits")
        self.gates.append({
            "name": name,
            "targets": targets,
            "controls": controls,
            "params": params
        })

    def from_dict(self, data: Dict[str, Any]):
        """Load workflow from a JSON-like dict { 'qubits': int, 'gates': [...] }"""
        q = data.get("qubits")
        if q is None:
            raise ValueError("Missing 'qubits' key")
        if q != self.num_qubits:
            raise ValueError("Mismatched qubit count")
        gates = data.get("gates", [])
        for g in gates:
            self.add_gate(
                name=g.get("name"),
                targets=g.get("targets", []),
                controls=g.get("controls", []),
                params=g.get("params", {}),
            )
        # load meta if present
        self.meta.update(data.get("meta", {}))

    def to_qiskit(self) -> QuantumCircuit:
        """
        Convert stored gates to an actual Qiskit QuantumCircuit.
        If measurement not present, this function does NOT automatically add measurements
        (caller decides).
        """
        qc = QuantumCircuit(self.num_qubits, self.num_qubits)
        for g in self.gates:
            name = g["name"]
            targets = g["targets"]
            controls = g["controls"]
            params = g["params"]

            if name == "H":
                for t in targets: qc.h(t)
            elif name == "X":
                for t in targets: qc.x(t)
            elif name == "Y":
                for t in targets: qc.y(t)
            elif name == "Z":
                for t in targets: qc.z(t)
            elif name == "S":
                for t in targets: qc.s(t)
            elif name == "T":
                for t in targets: qc.t(t)
            elif name == "RX":
                theta = float(params.get("theta", 0.0))
                for t in targets: qc.rx(theta, t)
            elif name == "RY":
                theta = float(params.get("theta", 0.0))
                for t in targets: qc.ry(theta, t)
            elif name == "RZ":
                theta = float(params.get("theta", 0.0))
                for t in targets: qc.rz(theta, t)
            elif name in ("CX", "CNOT"):
                # allow many pairs (controls / targets lists zipped)
                if controls and targets and len(controls) == len(targets):
                    for ctrl, tgt in zip(controls, targets): qc.cx(ctrl, tgt)
                elif len(targets) == 2 and not controls:
                    # allow ["targets": [ctrl, tgt]] pattern
                    qc.cx(targets[0], targets[1])
                else:
                    raise ValueError("CNOT requires control(s) and target(s) or two-element targets")
            elif name == "CCX":
                if len(controls) >= 2 and len(targets) >= 1:
                    qc.ccx(controls[0], controls[1], targets[0])
                else:
                    raise ValueError("CCX requires two controls and one target")
            elif name == "MEASURE":
                # measure each target into corresponding classical bit index
                for i, t in enumerate(targets):
                    qc.measure(t, t)
            else:
                raise ValueError(f"Unhandled gate: {name}")
        return qc

    def to_dict(self) -> Dict[str, Any]:
        return {
            "qubits": self.num_qubits,
            "gates": self.gates,
            "meta": self.meta,
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2)

    @classmethod
    def from_json(cls, json_str: str):
        data = json.loads(json_str)
        wf = cls(num_qubits=data["qubits"], meta=data.get("meta"))
        wf.from_dict(data)
        return wf

    def __repr__(self):
        return f"<QuantumWorkflow qubits={self.num_qubits} gates={len(self.gates)}>"
